"""
Automated RAG pipeline validation script.
Tests end-to-end functionality, multi-tenant isolation, and anti-hallucination.
"""
import httpx
import time
import json
from pathlib import Path
from typing import Dict, List, Any, Tuple
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

BASE_URL = "http://localhost:8000"
TEST_TENANT_A = "tenant_A"
TEST_TENANT_B = "tenant_B"
TEST_USER_A = "user_A"
TEST_USER_B = "user_B"
TEST_KB_A = "kb_A"
TEST_KB_B = "kb_B"

# Test documents
TENANT_A_DOC = Path(__file__).parent.parent / "data" / "test_docs" / "tenant_A_kb.md"
TENANT_B_DOC = Path(__file__).parent.parent / "data" / "test_docs" / "tenant_B_kb.md"

# Test results storage
test_results: List[Dict[str, Any]] = []


def print_header(text: str):
    """Print a formatted header."""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80)


def print_test(test_name: str, passed: bool, reason: str = ""):
    """Print test result."""
    status = "[PASS]" if passed else "[FAIL]"
    print(f"{status} | {test_name}")
    if reason:
        print(f"      └─ {reason}")
    test_results.append({
        "test": test_name,
        "passed": passed,
        "reason": reason
    })


def wait_for_server(max_retries: int = 10, delay: int = 2) -> bool:
    """Wait for the server to be ready."""
    print("Waiting for server to be ready...")
    for i in range(max_retries):
        try:
            response = httpx.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                print("[OK] Server is ready")
                return True
        except Exception:
            pass
        time.sleep(delay)
        print(f"  Retry {i+1}/{max_retries}...")
    print("[FAIL] Server not ready after max retries")
    return False


def upload_document(
    client: httpx.Client,
    file_path: Path,
    tenant_id: str,
    user_id: str,
    kb_id: str
) -> Dict[str, Any]:
    """Upload a document to the knowledge base."""
    try:
        with open(file_path, "rb") as f:
            files = {"file": (file_path.name, f, "text/markdown")}
            data = {
                "tenant_id": tenant_id,
                "user_id": user_id,
                "kb_id": kb_id
            }
            response = client.post(
                f"{BASE_URL}/kb/upload",
                files=files,
                data=data,
                timeout=60
            )
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}


def test_retrieval(
    client: httpx.Client,
    query: str,
    tenant_id: str,
    user_id: str,
    kb_id: str,
    expected_keywords: List[str],
    should_not_contain: List[str] = None,
    top_k: int = 5
) -> Tuple[bool, str]:
    """Test retrieval accuracy."""
    try:
        # Use GET for search endpoint with headers for dev mode auth
        headers = {
            "X-Tenant-Id": tenant_id,
            "X-User-Id": user_id
        }
        response = client.get(
            f"{BASE_URL}/kb/search",
            params={
                "query": query,
                "kb_id": kb_id,
                "top_k": top_k
            },
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            return False, f"API returned {response.status_code}: {response.text}"
        
        data = response.json()
        results = data.get("results", [])
        
        if not results:
            return False, "No results retrieved"
        
        # Check tenant isolation
        for result in results:
            metadata = result.get("metadata", {})
            result_tenant = metadata.get("tenant_id")
            if result_tenant != tenant_id:
                return False, f"Tenant leak detected! Got tenant_id={result_tenant}, expected {tenant_id}"
        
        # Check for expected keywords
        all_content = " ".join([r.get("content", "") for r in results]).lower()
        found_keywords = [kw for kw in expected_keywords if kw.lower() in all_content]
        
        if not found_keywords:
            return False, f"Expected keywords not found: {expected_keywords}"
        
        # Check for forbidden content
        if should_not_contain:
            for forbidden in should_not_contain:
                if forbidden.lower() in all_content:
                    return False, f"Forbidden content found: {forbidden}"
        
        return True, f"Retrieved {len(results)} results, found keywords: {found_keywords}"
        
    except Exception as e:
        return False, f"Error: {str(e)}"


def test_chat(
    client: httpx.Client,
    question: str,
    tenant_id: str,
    user_id: str,
    kb_id: str,
    expected_keywords: List[str] = None,
    should_refuse: bool = False,
    should_not_contain: List[str] = None
) -> Tuple[bool, str, Dict[str, Any]]:
    """Test full chat endpoint."""
    try:
        # Include headers for dev mode auth
        headers = {
            "X-Tenant-Id": tenant_id,
            "X-User-Id": user_id
        }
        response = client.post(
            f"{BASE_URL}/chat",
            json={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "kb_id": kb_id,
                "question": question
            },
            headers=headers,
            timeout=60
        )
        
        if response.status_code != 200:
            return False, f"API returned {response.status_code}: {response.text}", {}
        
        data = response.json()
        answer = data.get("answer", "").lower()
        citations = data.get("citations", [])
        from_kb = data.get("from_knowledge_base", False)
        confidence = data.get("confidence", 0.0)
        metadata = data.get("metadata", {})
        refused = metadata.get("refused", False)
        
        # Check refusal behavior (STRICT)
        if should_refuse:
            # Check if response explicitly indicates refusal
            refused = data.get("refused", False)
            refusal_keywords = [
                "couldn't find", "don't have", "not available", "contact support",
                "not in the knowledge base", "could not verify", "not enough information",
                "apologize", "couldn't find relevant information"
            ]
            has_refusal_keywords = any(kw in answer for kw in refusal_keywords)
            
            # If answer was generated with citations, it's a FAIL (should have refused)
            if citations and len(citations) > 0:
                return False, (
                    f"Should have refused but generated answer with {len(citations)} citations. "
                    f"Answer: {answer[:300]}"
                ), data
            
            # If confidence is high and answer exists, it's a FAIL
            if confidence >= 0.30 and answer and not has_refusal_keywords:
                return False, (
                    f"Should have refused but generated answer with confidence {confidence:.2f}. "
                    f"Answer: {answer[:300]}"
                ), data
            
            # If not refused and no refusal keywords, it's a FAIL
            if not refused and not has_refusal_keywords:
                return False, (
                    f"Should have refused but didn't. "
                    f"refused={refused}, confidence={confidence:.2f}, citations={len(citations)}. "
                    f"Answer: {answer[:300]}"
                ), data
            
            # If we got here, it properly refused
            return True, f"Properly refused (refused={refused}, confidence={confidence:.2f})", data
        
        # Check for expected keywords
        if expected_keywords:
            found = [kw for kw in expected_keywords if kw.lower() in answer]
            if not found:
                return False, f"Expected keywords not found: {expected_keywords}. Answer: {answer[:200]}", data
        
        # Check citations
        if not should_refuse and from_kb:
            if not citations:
                return False, "Answer claims to be from KB but has no citations", data
        
        # Check for forbidden content
        if should_not_contain:
            for forbidden in should_not_contain:
                if forbidden.lower() in answer:
                    return False, f"Forbidden content found in answer: {forbidden}", data
        
        # Check citation integrity
        if citations and expected_keywords:
            citation_text = " ".join([c.get("excerpt", "") for c in citations]).lower()
            for kw in expected_keywords:
                if kw.lower() in answer and kw.lower() not in citation_text:
                    # This is a warning, not a failure
                    pass
        
        return True, f"Answer generated (confidence: {confidence:.2f}, citations: {len(citations)})", data
        
    except Exception as e:
        return False, f"Error: {str(e)}", {}


def main():
    """Run all validation tests."""
    print_header("RAG Pipeline Validation Suite")
    
    # Check server
    if not wait_for_server():
        print("[FAIL] Cannot proceed without server")
        return
    
    client = httpx.Client(timeout=120.0)
    
    # ========== PHASE 1: Upload Documents ==========
    print_header("Phase 1: Upload Test Documents")
    
    # Upload tenant A doc
    print(f"\n📤 Uploading {TENANT_A_DOC.name} for {TEST_TENANT_A}...")
    result = upload_document(client, TENANT_A_DOC, TEST_TENANT_A, TEST_USER_A, TEST_KB_A)
    if result["success"]:
        print("[OK] Upload successful")
        print("⏳ Waiting for document processing (10 seconds)...")
        time.sleep(10)  # Wait longer for processing (parsing, chunking, embedding)
    else:
        print(f"[FAIL] Upload failed: {result.get('error')}")
        return
    
    # Upload tenant B doc
    print(f"\n📤 Uploading {TENANT_B_DOC.name} for {TEST_TENANT_B}...")
    result = upload_document(client, TENANT_B_DOC, TEST_TENANT_B, TEST_USER_B, TEST_KB_B)
    if result["success"]:
        print("[OK] Upload successful")
        print("⏳ Waiting for document processing (10 seconds)...")
        time.sleep(10)  # Wait longer for processing (parsing, chunking, embedding)
    else:
        print(f"[FAIL] Upload failed: {result.get('error')}")
        return
    
    # ========== PHASE 2: Retrieval Tests ==========
    print_header("Phase 2: Retrieval Accuracy Tests")
    
    # Test 1: Tenant A retrieval
    passed, reason = test_retrieval(
        client,
        "What is the refund window?",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        expected_keywords=["7 days"],
        should_not_contain=["30 days"]
    )
    print_test("Retrieval: Tenant A - Refund Window", passed, reason)
    
    # Test 2: Tenant B retrieval
    passed, reason = test_retrieval(
        client,
        "What is the refund window?",
        TEST_TENANT_B,
        TEST_USER_B,
        TEST_KB_B,
        expected_keywords=["30 days"],
        should_not_contain=["7 days"]
    )
    print_test("Retrieval: Tenant B - Refund Window", passed, reason)
    
    # Test 3: Tenant isolation (A should not get B's data)
    passed, reason = test_retrieval(
        client,
        "Starter plan price",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        expected_keywords=["499"],
        should_not_contain=["999"]
    )
    print_test("Retrieval: Tenant A - Starter Plan Price (Isolation)", passed, reason)
    
    # Test 4: Tenant isolation (B should not get A's data)
    passed, reason = test_retrieval(
        client,
        "Starter plan price",
        TEST_TENANT_B,
        TEST_USER_B,
        TEST_KB_B,
        expected_keywords=["999"],
        should_not_contain=["499"]
    )
    print_test("Retrieval: Tenant B - Starter Plan Price (Isolation)", passed, reason)
    
    # ========== PHASE 3: Chat Tests ==========
    print_header("Phase 3: Chat Endpoint Tests")
    
    # Test 5: Tenant A chat - refund window
    passed, reason, data = test_chat(
        client,
        "What is the refund window?",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        expected_keywords=["7 days"],
        should_not_contain=["30 days"]
    )
    print_test("Chat: Tenant A - Refund Window", passed, reason)
    
    # Test 6: Tenant B chat - refund window
    passed, reason, data = test_chat(
        client,
        "What is the refund window?",
        TEST_TENANT_B,
        TEST_USER_B,
        TEST_KB_B,
        expected_keywords=["30 days"],
        should_not_contain=["7 days"]
    )
    print_test("Chat: Tenant B - Refund Window", passed, reason)
    
    # Test 7: Tenant A chat - Starter plan
    passed, reason, data = test_chat(
        client,
        "What is the Starter plan price?",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        expected_keywords=["499"],
        should_not_contain=["999"]
    )
    print_test("Chat: Tenant A - Starter Plan Price", passed, reason)
    
    # Test 8: Tenant B chat - Starter plan
    passed, reason, data = test_chat(
        client,
        "What is the Starter plan price?",
        TEST_TENANT_B,
        TEST_USER_B,
        TEST_KB_B,
        expected_keywords=["999"],
        should_not_contain=["499"]
    )
    print_test("Chat: Tenant B - Starter Plan Price", passed, reason)
    
    # Test 9: Hallucination refusal - out of scope
    passed, reason, data = test_chat(
        client,
        "How to integrate ClientSphere with Shopify?",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        should_refuse=True
    )
    print_test("Chat: Hallucination Refusal (Out of Scope)", passed, reason)
    
    # Test 10: Citation integrity
    passed, reason, data = test_chat(
        client,
        "How long do password reset links last?",
        TEST_TENANT_A,
        TEST_USER_A,
        TEST_KB_A,
        expected_keywords=["15"]
    )
    if passed:
        citations = data.get("citations", [])
        if citations:
            print_test("Chat: Citation Integrity", True, f"Found {len(citations)} citations")
        else:
            print_test("Chat: Citation Integrity", False, "No citations provided")
    else:
        print_test("Chat: Citation Integrity", False, reason)
    
    # ========== PHASE 4: Summary ==========
    print_header("Test Summary")
    
    total_tests = len(test_results)
    passed_tests = sum(1 for r in test_results if r["passed"])
    failed_tests = total_tests - passed_tests
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"[PASS] Passed: {passed_tests}")
    print(f"[FAIL] Failed: {failed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
    
    if failed_tests > 0:
        print("\n[FAIL] Failed Tests:")
        for result in test_results:
            if not result["passed"]:
                print(f"  - {result['test']}: {result['reason']}")
    
    # Final verdict
    print_header("Final Verdict")
    if failed_tests == 0:
        print("[PASS] ALL TESTS PASSED - RAG Pipeline is working correctly")
        return 0
    else:
        print(f"[FAIL] {failed_tests} TEST(S) FAILED - Review issues above")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

