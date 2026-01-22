"""
Quick test script for RAG backend.
Run this after starting the server to validate everything works.
"""
import httpx
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:8000"
TEST_TENANT_ID = "test_tenant_001"  # CRITICAL: Multi-tenant isolation
TEST_USER_ID = "test_user_001"
TEST_KB_ID = "test_kb_001"


def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def test_health():
    """Test 1: Health check"""
    print_section("1. Health Check")
    try:
        response = httpx.get(f"{BASE_URL}/health", timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server is healthy!")
            print(f"   Status: {data.get('status')}")
            print(f"   Vector DB: {'✅ Connected' if data.get('vector_db_connected') else '❌ Not connected'}")
            print(f"   LLM: {'✅ Configured' if data.get('llm_configured') else '❌ Not configured'}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        print("   Make sure the server is running: uvicorn app.main:app --reload --port 8000")
        return False


def test_upload_sample():
    """Test 2: Upload a sample document"""
    print_section("2. Upload Sample Document")
    
    # Create a sample FAQ document
    sample_content = """# ClientSphere FAQ

## Account Management

### How do I reset my password?
To reset your password:
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for the reset link
5. Click the link and create a new password

### How do I update my profile?
Log into your account and go to Settings > Profile. You can update your name, email, and other information there.

## Support

### What are your business hours?
Our support team is available:
- Monday to Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed

### How can I contact support?
You can reach us via:
- Email: support@clientsphere.com
- Phone: 1-800-CLIENT-SPHERE
- Live Chat: Available on our website

## Returns

### What is your return policy?
We offer a 30-day return policy. Items must be in original condition with tags attached.
Returns can be processed through your account dashboard.

### How long do refunds take?
Refunds are processed within 5-7 business days after we receive the returned item.
"""
    
    # Save to temp file
    temp_file = Path("temp_test_faq.md")
    temp_file.write_text(sample_content)
    
    try:
        with open(temp_file, "rb") as f:
            response = httpx.post(
                f"{BASE_URL}/kb/upload",
                data={
                    "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                    "user_id": TEST_USER_ID,
                    "kb_id": TEST_KB_ID
                },
                files={"file": ("test_faq.md", f, "text/markdown")},
                timeout=30.0
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Document uploaded successfully!")
            print(f"   Document ID: {data.get('document_id')}")
            print(f"   File: {data.get('file_name')}")
            print(f"   Status: {data.get('status')}")
            print(f"\n   ⏳ Waiting 5 seconds for background processing...")
            time.sleep(5)
            return True
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return False
    finally:
        temp_file.unlink(missing_ok=True)


def test_kb_stats():
    """Test 3: Check KB statistics"""
    print_section("3. Knowledge Base Statistics")
    try:
        response = httpx.get(
            f"{BASE_URL}/kb/stats",
            params={
                "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                "kb_id": TEST_KB_ID, 
                "user_id": TEST_USER_ID
            },
            timeout=10.0
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ KB Stats retrieved!")
            print(f"   Total Documents: {data.get('total_documents', 0)}")
            print(f"   Total Chunks: {data.get('total_chunks', 0)}")
            print(f"   Files: {', '.join(data.get('file_names', []))}")
            
            if data.get('total_chunks', 0) == 0:
                print("\n   ⚠️  No chunks found. Document may still be processing.")
                print("   Wait a few more seconds and try again.")
                return False
            return True
        else:
            print(f"❌ Stats failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Stats error: {e}")
        return False


def test_search():
    """Test 4: Test retrieval (search without LLM)"""
    print_section("4. Test Retrieval (Search)")
    
    query = "How do I reset my password?"
    print(f"   Query: '{query}'")
    
    try:
        response = httpx.post(
            f"{BASE_URL}/kb/search",
            params={
                "query": query,
                "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                "kb_id": TEST_KB_ID,
                "user_id": TEST_USER_ID,
                "top_k": 3
            },
            timeout=15.0
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            print(f"\n✅ Retrieved {len(results)} results")
            print(f"   Average Confidence: {data.get('confidence', 0):.3f}")
            print(f"   Has Relevant Results: {data.get('has_relevant_results', False)}")
            
            if results:
                print(f"\n   Top Result:")
                top = results[0]
                print(f"      Score: {top.get('similarity_score', 0):.3f}")
                print(f"      Source: {top.get('metadata', {}).get('file_name', 'Unknown')}")
                print(f"      Preview: {top.get('content', '')[:150]}...")
                return True
            else:
                print("\n   ⚠️  No results retrieved. Check if document was processed.")
                return False
        else:
            print(f"❌ Search failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Search error: {e}")
        return False


def test_chat():
    """Test 5: Full RAG chat"""
    print_section("5. Full RAG Chat")
    
    question = "How do I reset my password?"
    print(f"   Question: '{question}'")
    
    try:
        response = httpx.post(
            f"{BASE_URL}/chat",
            json={
                "tenant_id": TEST_TENANT_ID,  # CRITICAL: Multi-tenant isolation
                "user_id": TEST_USER_ID,
                "kb_id": TEST_KB_ID,
                "question": question
            },
            timeout=30.0
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Chat response received!")
            print(f"   Success: {data.get('success')}")
            print(f"   Confidence: {data.get('confidence', 0):.3f}")
            print(f"   From KB: {data.get('from_knowledge_base')}")
            print(f"   Escalation Suggested: {data.get('escalation_suggested')}")
            print(f"   Citations: {len(data.get('citations', []))}")
            
            print(f"\n   Answer:")
            answer = data.get('answer', '')
            # Print first 300 chars
            print(f"   {answer[:300]}{'...' if len(answer) > 300 else ''}")
            
            citations = data.get('citations', [])
            if citations:
                print(f"\n   Citations:")
                for i, cit in enumerate(citations[:3], 1):
                    print(f"      [{i}] {cit.get('file_name')} (score: {cit.get('relevance_score', 0):.3f})")
            
            return True
        else:
            print(f"❌ Chat failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return False


def main():
    print("\n" + "=" * 60)
    print("  ClientSphere RAG Backend - Quick Test Suite")
    print("=" * 60)
    print(f"\nTesting against: {BASE_URL}")
    print(f"Test Tenant ID: {TEST_TENANT_ID}")
    print(f"Test User ID: {TEST_USER_ID}")
    print(f"Test KB ID: {TEST_KB_ID}")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    time.sleep(1)
    
    if results[0][1]:  # If health check passed
        results.append(("Upload Document", test_upload_sample()))
        time.sleep(2)
        results.append(("KB Statistics", test_kb_stats()))
        time.sleep(1)
        results.append(("Retrieval Search", test_search()))
        time.sleep(1)
        results.append(("Full Chat", test_chat()))
    
    # Summary
    print_section("Test Summary")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status}: {name}")
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your RAG backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")


if __name__ == "__main__":
    main()

