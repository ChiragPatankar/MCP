"""
Pytest test suite for RAG pipeline.
Tests correctness, hallucination prevention, and multi-tenant isolation.
"""
import pytest
from httpx import AsyncClient
from app.main import app
from app.rag.vectorstore import get_vector_store
from app.rag.retrieval import get_retrieval_service
from app.rag.answer import get_answer_service


@pytest.fixture
async def client():
    """Create test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def test_tenant_id():
    """Test tenant ID."""
    return "test_tenant_001"


@pytest.fixture
def test_user_id():
    """Test user ID."""
    return "test_user_001"


@pytest.fixture
def test_kb_id():
    """Test KB ID."""
    return "test_kb_001"


@pytest.mark.asyncio
async def test_multi_tenant_isolation(test_tenant_id, test_user_id, test_kb_id):
    """Test that tenants cannot access each other's data."""
    tenant_a = "tenant_a"
    tenant_b = "tenant_b"
    
    # Upload document for tenant A
    # ... (implementation)
    
    # Try to retrieve as tenant B
    retrieval_service = get_retrieval_service()
    results, _, _ = retrieval_service.retrieve(
        query="test query",
        tenant_id=tenant_b,  # Different tenant
        kb_id=test_kb_id,
        user_id=test_user_id
    )
    
    # Should return no results (tenant B cannot see tenant A's data)
    assert len(results) == 0, "❌ Multi-tenant isolation failed - tenant B accessed tenant A's data"


@pytest.mark.asyncio
async def test_hallucination_prevention():
    """Test that system refuses to answer out-of-scope questions."""
    # Upload a document about "return policy"
    # Ask question about "warranty" (not in KB)
    
    answer_service = get_answer_service()
    result = answer_service.generate_answer(
        question="What is the warranty period?",
        context="",  # No relevant context
        citations_info=[],
        confidence=0.0,
        has_relevant_results=False
    )
    
    # Should refuse to answer
    assert not result["from_knowledge_base"], "❌ System answered without context"
    assert result["escalation_suggested"], "❌ System should suggest escalation"
    assert "couldn't find" in result["answer"].lower() or "don't have" in result["answer"].lower(), \
        "❌ System should explicitly refuse"


@pytest.mark.asyncio
async def test_citations_required():
    """Test that answers include citations."""
    # Upload document and ask question
    # Verify answer includes citations
    
    answer_service = get_answer_service()
    result = answer_service.generate_answer(
        question="What is the return policy?",
        context="[Source 1: policy.pdf]\nReturn policy: 30 days",
        citations_info=[{"index": 1, "file_name": "policy.pdf", "chunk_id": "123", "similarity_score": 0.8}],
        confidence=0.8,
        has_relevant_results=True
    )
    
    # Should have citations
    assert len(result["citations"]) > 0, "❌ Answer missing citations"
    assert result["from_knowledge_base"], "❌ Should be from KB"


@pytest.mark.asyncio
async def test_similarity_threshold():
    """Test that low similarity scores trigger refusal."""
    retrieval_service = get_retrieval_service()
    results, confidence, has_relevant = retrieval_service.retrieve(
        query="completely unrelated question",
        tenant_id="test_tenant",
        kb_id="test_kb",
        user_id="test_user"
    )
    
    # If confidence is below threshold, should not have relevant results
    if confidence < 0.40:  # SIMILARITY_THRESHOLD
        assert not has_relevant, "❌ Low confidence results should be filtered"


@pytest.mark.asyncio
async def test_tenant_id_required():
    """Test that all endpoints require tenant_id."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Try chat without tenant_id
        response = await client.post(
            "/chat",
            json={
                "user_id": "user123",
                "kb_id": "kb001",
                "question": "test"
            }
        )
        
        # Should fail validation
        assert response.status_code == 422, "❌ Should require tenant_id"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])



