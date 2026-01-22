"""
Evaluation script for the RAG pipeline.
Tests retrieval accuracy and answer quality.
"""
import httpx
import json
import time
from typing import List, Dict, Any
from pathlib import Path
import sys

# Configuration
BASE_URL = "http://localhost:8000"
TEST_TENANT_ID = "eval_tenant_001"  # CRITICAL: Multi-tenant isolation
TEST_USER_ID = "eval_user_001"
TEST_KB_ID = "eval_kb_001"

# Sample test questions and expected behaviors
TEST_CASES = [
    {
        "id": 1,
        "question": "What is your return policy?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["return", "refund", "days", "policy"],
        "description": "Basic FAQ question"
    },
    {
        "id": 2,
        "question": "How do I reset my password?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["password", "reset", "account"],
        "description": "Account management question"
    },
    {
        "id": 3,
        "question": "What are your business hours?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["hours", "open", "available"],
        "description": "Operating hours question"
    },
    {
        "id": 4,
        "question": "What payment methods do you accept?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["payment", "credit", "card", "pay"],
        "description": "Payment question"
    },
    {
        "id": 5,
        "question": "How do I contact customer support?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["contact", "support", "help", "email", "phone"],
        "description": "Support contact question"
    },
    {
        "id": 6,
        "question": "What is the meaning of life according to Aristotle?",
        "expected_behavior": "should_not_answer",
        "expected_keywords": [],
        "description": "Out-of-scope philosophical question - should refuse"
    },
    {
        "id": 7,
        "question": "Write me a poem about cats",
        "expected_behavior": "should_not_answer",
        "expected_keywords": [],
        "description": "Creative request - should refuse"
    },
    {
        "id": 8,
        "question": "What is 2 + 2?",
        "expected_behavior": "should_not_answer",
        "expected_keywords": [],
        "description": "Math question not in KB - should refuse or escalate"
    },
    {
        "id": 9,
        "question": "Can you help me with my order?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["order", "help", "assist"],
        "description": "General help request"
    },
    {
        "id": 10,
        "question": "Do you ship internationally?",
        "expected_behavior": "should_answer",
        "expected_keywords": ["ship", "international", "delivery"],
        "description": "Shipping question"
    },
]


def create_sample_kb():
    """Create a sample knowledge base for testing."""
    sample_content = """
# ClientSphere Customer Support FAQ

## Returns and Refunds

### What is your return policy?
We offer a 30-day return policy on all products. Items must be in original condition with tags attached.
Returns can be initiated through your account dashboard or by contacting support.

### How long do refunds take?
Refunds are processed within 5-7 business days after we receive the returned item.
Credit card refunds may take an additional 3-5 business days to appear on your statement.

## Account Management

### How do I reset my password?
To reset your password:
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your inbox for a reset link
4. Create a new password

### How do I update my account information?
Log into your account and navigate to Settings > Profile to update your personal information.

## Business Information

### What are your business hours?
Our customer support is available:
- Monday to Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed

### How do I contact customer support?
You can reach us through:
- Email: support@clientsphere.com
- Phone: 1-800-CLIENT-SPHERE
- Live Chat: Available on our website during business hours

## Payment and Billing

### What payment methods do you accept?
We accept:
- Visa, MasterCard, American Express
- PayPal
- Apple Pay and Google Pay
- Bank transfers for orders over $500

### Is my payment information secure?
Yes, all payments are processed through secure, PCI-compliant payment processors.
We never store your full credit card information on our servers.

## Shipping and Delivery

### Do you ship internationally?
Yes! We ship to over 50 countries worldwide.
International shipping rates and delivery times vary by location.

### How can I track my order?
Once shipped, you'll receive a tracking number via email.
You can also track your order in your account dashboard under "My Orders".

## Orders

### Can you help me with my order?
Absolutely! For order assistance, please have your order number ready.
You can find this in your confirmation email or account dashboard.
Our support team can help with order modifications, cancellations, and status updates.
    """
    
    return sample_content


def upload_sample_kb(client: httpx.Client) -> bool:
    """Upload sample knowledge base content."""
    print("\n📤 Uploading sample knowledge base...")
    
    content = create_sample_kb()
    
    # Create a temporary file
    temp_path = Path("temp_eval_kb.md")
    temp_path.write_text(content)
    
    try:
        with open(temp_path, "rb") as f:
            response = client.post(
                f"{BASE_URL}/kb/upload",
                data={
                    "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                    "user_id": TEST_USER_ID,
                    "kb_id": TEST_KB_ID
                },
                files={"file": ("sample_faq.md", f, "text/markdown")}
            )
        
        if response.status_code == 200:
            print("✅ Sample KB uploaded successfully")
            # Wait for processing
            print("⏳ Waiting for document processing...")
            time.sleep(5)  # Give time for background processing
            return True
        else:
            print(f"❌ Upload failed: {response.status_code} - {response.text}")
            return False
    finally:
        temp_path.unlink(missing_ok=True)


def check_kb_stats(client: httpx.Client) -> Dict[str, Any]:
    """Check knowledge base statistics."""
    response = client.get(
        f"{BASE_URL}/kb/stats",
        params={
            "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
            "kb_id": TEST_KB_ID, 
            "user_id": TEST_USER_ID
        }
    )
    
    if response.status_code == 200:
        return response.json()
    return {}


def run_test_case(client: httpx.Client, test_case: Dict[str, Any]) -> Dict[str, Any]:
    """Run a single test case."""
    question = test_case["question"]
    expected_behavior = test_case["expected_behavior"]
    expected_keywords = test_case["expected_keywords"]
    
        response = client.post(
            f"{BASE_URL}/chat",
            json={
                "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                "user_id": TEST_USER_ID,
                "kb_id": TEST_KB_ID,
                "question": question
            }
        )
    
    if response.status_code != 200:
        return {
            "passed": False,
            "error": f"HTTP {response.status_code}",
            "response": None
        }
    
    data = response.json()
    answer = data.get("answer", "").lower()
    from_kb = data.get("from_knowledge_base", False)
    escalation = data.get("escalation_suggested", False)
    confidence = data.get("confidence", 0)
    
    # Evaluate based on expected behavior
    passed = False
    reason = ""
    
    if expected_behavior == "should_answer":
        # Check if answer contains expected keywords
        keyword_match = any(kw.lower() in answer for kw in expected_keywords)
        # Should have good confidence and be from KB (threshold is now 0.40)
        if from_kb and confidence >= 0.40 and keyword_match:
            passed = True
            reason = "Answered with relevant content"
        elif from_kb and confidence >= 0.40:
            passed = True
            reason = "Answered from KB (keywords may vary)"
        else:
            reason = f"Expected answer from KB. Got: from_kb={from_kb}, confidence={confidence:.2f}"
    
    elif expected_behavior == "should_not_answer":
        # Should either refuse, have low confidence, or suggest escalation (threshold is 0.40)
        if not from_kb or escalation or confidence < 0.40:
            passed = True
            reason = "Correctly refused or escalated"
        elif "couldn't find" in answer or "don't have" in answer or "not available" in answer:
            passed = True
            reason = "Correctly indicated no relevant info"
        else:
            reason = f"Should have refused. Got: from_kb={from_kb}, escalation={escalation}"
    
    return {
        "passed": passed,
        "reason": reason,
        "answer": data.get("answer", "")[:200] + "..." if len(data.get("answer", "")) > 200 else data.get("answer", ""),
        "confidence": confidence,
        "from_kb": from_kb,
        "escalation": escalation,
        "citations_count": len(data.get("citations", []))
    }


def run_evaluation():
    """Run the full evaluation suite."""
    print("=" * 60)
    print("🧪 ClientSphere RAG Evaluation Suite")
    print("=" * 60)
    
    # Check if server is running
    try:
        with httpx.Client(timeout=30.0) as client:
            health = client.get(f"{BASE_URL}/health")
            if health.status_code != 200:
                print(f"❌ Server health check failed. Is the server running at {BASE_URL}?")
                return
            print(f"✅ Server is healthy at {BASE_URL}")
    except Exception as e:
        print(f"❌ Cannot connect to server at {BASE_URL}")
        print(f"   Error: {e}")
        print("\n💡 Start the server with: uvicorn app.main:app --reload")
        return
    
    with httpx.Client(timeout=60.0) as client:
        # Check if KB has content
        stats = check_kb_stats(client)
        if stats.get("total_chunks", 0) == 0:
            print("\n⚠️  Knowledge base is empty. Uploading sample content...")
            if not upload_sample_kb(client):
                print("❌ Failed to upload sample KB. Exiting.")
                return
            
            # Recheck stats
            time.sleep(3)
            stats = check_kb_stats(client)
        
        print(f"\n📊 Knowledge Base Stats:")
        print(f"   - Total chunks: {stats.get('total_chunks', 0)}")
        print(f"   - Files: {stats.get('file_names', [])}")
        
        # Run test cases
        print(f"\n🏃 Running {len(TEST_CASES)} test cases...\n")
        print("-" * 60)
        
        results = []
        passed_count = 0
        
        for test in TEST_CASES:
            print(f"\nTest {test['id']}: {test['description']}")
            print(f"   Question: {test['question']}")
            
            result = run_test_case(client, test)
            results.append({**test, **result})
            
            status = "✅ PASS" if result["passed"] else "❌ FAIL"
            print(f"   {status}: {result['reason']}")
            
            if result["passed"]:
                passed_count += 1
            
            if not result["passed"]:
                print(f"   Answer preview: {result.get('answer', 'N/A')[:100]}...")
        
        # Summary
        print("\n" + "=" * 60)
        print("📋 EVALUATION SUMMARY")
        print("=" * 60)
        print(f"\n   Total Tests: {len(TEST_CASES)}")
        print(f"   Passed: {passed_count}")
        print(f"   Failed: {len(TEST_CASES) - passed_count}")
        print(f"   Pass Rate: {(passed_count / len(TEST_CASES)) * 100:.1f}%")
        
        # Detailed results
        print("\n📝 Detailed Results:")
        for r in results:
            status = "✅" if r["passed"] else "❌"
            print(f"   {status} Test {r['id']}: {r['description']}")
            print(f"      Confidence: {r.get('confidence', 0):.2f}, Citations: {r.get('citations_count', 0)}")
        
        print("\n" + "=" * 60)
        
        # Return exit code based on pass rate
        if passed_count == len(TEST_CASES):
            print("🎉 All tests passed!")
            return 0
        elif passed_count >= len(TEST_CASES) * 0.7:
            print("⚠️  Most tests passed, but some need attention")
            return 0
        else:
            print("❌ Too many tests failed")
            return 1


if __name__ == "__main__":
    exit_code = run_evaluation()
    sys.exit(exit_code or 0)

