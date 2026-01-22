"""
Retrieval pipeline with confidence scoring and filtering.
"""
from typing import List, Dict, Any, Optional, Tuple
import logging
import re

from app.config import settings
from app.rag.embeddings import get_embedding_service
from app.rag.vectorstore import get_vector_store
from app.rag.intent import detect_intents, check_direct_match, get_intent_keywords
from app.models.schemas import RetrievalResult

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RetrievalService:
    """
    Handles document retrieval with confidence scoring.
    Implements threshold-based filtering for quality control.
    """
    
    def __init__(
        self,
        top_k: int = settings.TOP_K,
        similarity_threshold: float = settings.SIMILARITY_THRESHOLD
    ):
        """
        Initialize the retrieval service.
        
        Args:
            top_k: Number of results to retrieve
            similarity_threshold: Minimum similarity score to consider relevant
        """
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold
        self.embedding_service = get_embedding_service()
        self.vector_store = get_vector_store()
    
    def retrieve(
        self,
        query: str,
        tenant_id: str,  # CRITICAL: Multi-tenant isolation
        kb_id: str,
        user_id: str,
        top_k: Optional[int] = None
    ) -> Tuple[List[RetrievalResult], float, bool]:
        """
        Retrieve relevant documents for a query.
        
        Args:
            query: User's question
            tenant_id: Tenant ID for multi-tenant isolation (CRITICAL)
            kb_id: Knowledge base ID to search
            user_id: User ID for filtering
            top_k: Optional override for number of results
            
        Returns:
            Tuple of (results, average_confidence, has_relevant_results)
        """
        k = top_k or self.top_k
        
        # Generate query embedding
        logger.info(f"Generating embedding for query: {query[:50]}...")
        query_embedding = self.embedding_service.embed_query(query)
        
        # Search vector store with filters - MUST include tenant_id for isolation
        filter_dict = {
            "tenant_id": tenant_id,  # CRITICAL: Multi-tenant isolation
            "kb_id": kb_id,
            "user_id": user_id
        }
        
        logger.info(f"Searching vector store with filters: {filter_dict}")
        raw_results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=k,
            filter_dict=filter_dict
        )
        
        if not raw_results:
            logger.warning(f"No results found for query in kb_id={kb_id}")
            return [], 0.0, False
        
        # Convert to RetrievalResult objects
        results = []
        for r in raw_results:
            results.append(RetrievalResult(
                chunk_id=r['id'],
                content=r['content'],
                metadata=r['metadata'],
                similarity_score=r['similarity_score']
            ))
        
        # HEAVY CONFIDENCE MODE: Use maximum similarity score from top results
        # This ensures confidence reflects the best match found, not dragged down by weaker results
        if results:
            # Get top 3 results and use the maximum similarity score
            # This gives maximum confidence if there's at least one strong match
            top_results = results[:3]
            max_score = max(r.similarity_score for r in top_results)
            
            # If max score is good (>=0.4), use it directly
            # Otherwise, use weighted average of top 3 to avoid over-inflating weak matches
            if max_score >= 0.4:
                avg_confidence = max_score
            else:
                # For weaker matches, use weighted average of top 3
                scores = [r.similarity_score for r in top_results]
                weights = [1.0, 0.7, 0.5][:len(scores)]  # Aggressive weighting
                weighted_sum = sum(s * w for s, w in zip(scores, weights))
                total_weight = sum(weights[:len(scores)])
                avg_confidence = weighted_sum / total_weight if total_weight > 0 else max_score
        else:
            avg_confidence = 0.0
        
        # Filter results above threshold
        filtered_results = [
            r for r in results 
            if r.similarity_score >= self.similarity_threshold
        ]
        
        # If no results pass threshold but we have results, use top results anyway
        # This prevents over-filtering when threshold is too strict
        if not filtered_results and results:
            logger.warning(f"No results passed threshold {self.similarity_threshold}, using top {min(3, len(results))} results anyway")
            filtered_results = results[:min(3, len(results))]
            # Recalculate confidence with the fallback results
            if filtered_results:
                scores = [r.similarity_score for r in filtered_results]
                avg_confidence = sum(scores) / len(scores) if scores else 0.0
        
        # DIRECT MATCH GATE: Check if at least one chunk directly matches query intent
        # For integration/API questions, this gate is stricter
        has_direct_match = False
        if filtered_results:
            chunk_texts = [r.content for r in filtered_results]
            intents = detect_intents(query)
            intent_keywords = get_intent_keywords(intents)
            
            # For integration/API questions, require direct match
            if "integration" in intents or "api" in query.lower():
                has_direct_match = check_direct_match(query, chunk_texts, intent_keywords)
                logger.info(f"Direct match check (strict for integration): {has_direct_match} (intents: {intents})")
            else:
                # For other questions, be more lenient - just check if important words match
                query_words = set(re.findall(r'\b\w+\b', query.lower()))
                stop_words = {"the", "a", "an", "is", "are", "was", "were", "be", "been",
                             "to", "of", "and", "or", "but", "in", "on", "at", "for",
                             "with", "how", "what", "when", "where", "why", "do", "does"}
                important_words = query_words - stop_words
                
                # Check if at least one important word appears in chunks
                for chunk in chunk_texts:
                    chunk_lower = chunk.lower()
                    matches = sum(1 for word in important_words if word in chunk_lower)
                    if matches >= 1 and len(important_words) > 0:  # At least one important word
                        has_direct_match = True
                        break
                
                logger.info(f"Direct match check (lenient): {has_direct_match} (intents: {intents})")
        
        # Only consider relevant if we have filtered results AND (direct match OR high confidence)
        # High confidence (>0.40) can bypass direct match requirement for non-integration questions
        has_relevant = len(filtered_results) > 0 and (has_direct_match or avg_confidence > 0.40)
        
        logger.info(
            f"Retrieved {len(results)} results, "
            f"{len(filtered_results)} above threshold ({self.similarity_threshold}), "
            f"avg confidence: {avg_confidence:.3f}, "
            f"direct match: {has_direct_match}"
        )
        
        return filtered_results, avg_confidence, has_relevant
    
    def get_context_for_llm(
        self,
        results: List[RetrievalResult],
        max_tokens: int = settings.MAX_CONTEXT_TOKENS
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Format retrieved results into context for the LLM.
        
        Args:
            results: List of retrieval results
            max_tokens: Maximum tokens for context
            
        Returns:
            Tuple of (formatted_context, citation_info)
        """
        if not results:
            return "", []
        
        context_parts = []
        citations = []
        current_tokens = 0
        
        # Estimate tokens (rough approximation: 1 token ≈ 4 chars)
        for i, result in enumerate(results):
            chunk_text = result.content
            estimated_tokens = len(chunk_text) // 4
            
            if current_tokens + estimated_tokens > max_tokens:
                logger.info(f"Truncating context at {i} chunks due to token limit")
                break
            
            # Format chunk with source info
            source_info = f"[Source {i+1}: {result.metadata.get('file_name', 'Unknown')}]"
            if result.metadata.get('page_number'):
                source_info += f" (Page {result.metadata['page_number']})"
            
            context_parts.append(f"{source_info}\n{chunk_text}")
            
            # Build citation info
            citations.append({
                "index": i + 1,
                "file_name": result.metadata.get('file_name', 'Unknown'),
                "chunk_id": result.chunk_id,
                "page_number": result.metadata.get('page_number'),
                "similarity_score": result.similarity_score,
                "excerpt": chunk_text[:200] + "..." if len(chunk_text) > 200 else chunk_text
            })
            
            current_tokens += estimated_tokens
        
        formatted_context = "\n\n---\n\n".join(context_parts)
        
        return formatted_context, citations


# Global retrieval service instance
_retrieval_service: Optional[RetrievalService] = None


def get_retrieval_service() -> RetrievalService:
    """Get the global retrieval service instance."""
    global _retrieval_service
    if _retrieval_service is None:
        _retrieval_service = RetrievalService()
    return _retrieval_service

