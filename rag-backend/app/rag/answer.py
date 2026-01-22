"""
Answer generation using LLM with RAG context.
Supports Gemini and OpenAI as providers.
"""
import google.generativeai as genai
from openai import OpenAI
from typing import Optional, Dict, Any, List
import logging
import os
import re

from app.config import settings
from app.rag.prompts import (
    format_rag_prompt,
    format_draft_prompt,
    get_no_context_response,
    get_low_confidence_response
)
from app.rag.verifier import get_verifier_service
from app.rag.intent import detect_intents
from app.models.schemas import Citation
from abc import ABC, abstractmethod

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Base class for LLM providers."""
    
    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate response from prompts."""
        raise NotImplementedError
    
    @abstractmethod
    def generate_with_usage(self, system_prompt: str, user_prompt: str) -> tuple[str, dict]:
        """
        Generate response and return usage information.
        
        Returns:
            (response_text, usage_info)
            usage_info: dict with keys: prompt_tokens, completion_tokens, total_tokens, model_used
        """
        raise NotImplementedError


class GeminiProvider(LLMProvider):
    """Google Gemini LLM provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        # Default to gemini-1.5-flash if not specified
        self.model = model or settings.GEMINI_MODEL or "gemini-1.5-flash"
        
        if not self.api_key:
            raise ValueError("Gemini API key not configured. Set GEMINI_API_KEY environment variable.")
        
        genai.configure(api_key=self.api_key)
        
        # Don't initialize client here - do it lazily in generate() to handle errors better
        self._client = None
        logger.info(f"Gemini provider initialized (will use model: {self.model})")
    
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate response using Gemini."""
        text, _ = self.generate_with_usage(system_prompt, user_prompt)
        return text
    
    def generate_with_usage(self, system_prompt: str, user_prompt: str) -> tuple[str, dict]:
        """Generate response using Gemini and return usage info."""
        # Combine system and user prompts for Gemini
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        # Estimate prompt tokens (rough: 1 token ≈ 4 chars)
        prompt_tokens = len(full_prompt) // 4
        
        # Try to list available models first, then use the first available one
        # If that fails, try common model names
        models_to_try = []
        
        # First, try to get available models
        try:
            available_models = genai.list_models()
            model_names = [m.name for m in available_models if 'generateContent' in m.supported_generation_methods]
            if model_names:
                # Extract just the model name (remove 'models/' prefix if present)
                clean_names = [name.split('/')[-1] if '/' in name else name for name in model_names]
                models_to_try.extend(clean_names[:3])  # Use first 3 available models
                logger.info(f"Found {len(model_names)} available models, will try: {clean_names[:3]}")
        except Exception as e:
            logger.warning(f"Could not list available models: {e}, using fallback list")
        
        # Fallback to common model names if listing failed
        if not models_to_try:
            models_to_try = ["gemini-pro", "gemini-1.0-pro", "models/gemini-pro"]
        
        # Add configured model if different
        if self.model and self.model not in models_to_try:
            models_to_try.insert(0, self.model)
        
        # Remove duplicates while preserving order
        seen = set()
        models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]
        
        last_error = None
        for model_name in models_to_try:
            try:
                logger.info(f"Attempting to generate with model: {model_name}")
                # Create a new client for this model
                client = genai.GenerativeModel(model_name)
                response = client.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=settings.TEMPERATURE,
                        max_output_tokens=1024,
                    )
                )
                
                # Extract response text
                response_text = response.text
                
                # Try to get usage info from response
                usage_info = {
                    "prompt_tokens": prompt_tokens,
                    "completion_tokens": len(response_text) // 4,  # Estimate
                    "total_tokens": prompt_tokens + (len(response_text) // 4),
                    "model_used": model_name.split('/')[-1] if '/' in model_name else model_name
                }
                
                # Try to get actual usage from response if available
                if hasattr(response, 'usage_metadata'):
                    usage_metadata = response.usage_metadata
                    if hasattr(usage_metadata, 'prompt_token_count'):
                        usage_info["prompt_tokens"] = usage_metadata.prompt_token_count
                    if hasattr(usage_metadata, 'candidates_token_count'):
                        usage_info["completion_tokens"] = usage_metadata.candidates_token_count
                    if hasattr(usage_metadata, 'total_token_count'):
                        usage_info["total_tokens"] = usage_metadata.total_token_count
                
                if model_name != self.model:
                    logger.info(f"✅ Successfully used model: {model_name}")
                
                return response_text, usage_info
            except Exception as e:
                error_str = str(e).lower()
                last_error = e
                if "not found" in error_str or "not supported" in error_str or "404" in error_str:
                    logger.warning(f"Model {model_name} failed: {e}")
                    continue  # Try next model
                else:
                    # Different error (not model not found), re-raise
                    logger.error(f"Gemini generation error with {model_name}: {e}")
                    raise
        
        # All models failed - return a helpful error message
        error_msg = f"All Gemini model attempts failed. Last error: {last_error}. Please check your GEMINI_API_KEY and ensure it has access to Gemini models."
        logger.error(error_msg)
        raise Exception(error_msg)


class OpenAIProvider(LLMProvider):
    """OpenAI LLM provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = settings.OPENAI_MODEL):
        self.api_key = api_key or settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        self.model = model
        
        if not self.api_key:
            raise ValueError("OpenAI API key not configured. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
        logger.info(f"OpenAI provider initialized with model: {model}")
    
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """Generate response using OpenAI."""
        text, _ = self.generate_with_usage(system_prompt, user_prompt)
        return text
    
    def generate_with_usage(self, system_prompt: str, user_prompt: str) -> tuple[str, dict]:
        """Generate response using OpenAI and return usage info."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=settings.TEMPERATURE,
                max_tokens=1024
            )
            
            response_text = response.choices[0].message.content
            
            # Extract usage info from OpenAI response
            usage_info = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
                "model_used": self.model
            }
            
            return response_text, usage_info
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise


class AnswerService:
    """
    Generates answers using RAG context and LLM.
    Handles confidence scoring and citation extraction.
    """
    
    # Confidence thresholds
    HIGH_CONFIDENCE_THRESHOLD = 0.5
    LOW_CONFIDENCE_THRESHOLD = 0.20  # Lowered to match similarity threshold
    STRICT_CONFIDENCE_THRESHOLD = 0.30  # Strict threshold for answer generation (lowered from 0.45 to allow good retrieval results)
    
    def __init__(self, provider: str = settings.LLM_PROVIDER):
        """
        Initialize the answer service.
        
        Args:
            provider: LLM provider to use ("gemini" or "openai")
        """
        self.provider_name = provider
        self._provider: Optional[LLMProvider] = None
    
    @property
    def provider(self) -> LLMProvider:
        """Lazy load the LLM provider."""
        if self._provider is None:
            if self.provider_name == "gemini":
                self._provider = GeminiProvider()
            elif self.provider_name == "openai":
                self._provider = OpenAIProvider()
            else:
                raise ValueError(f"Unknown LLM provider: {self.provider_name}")
        return self._provider
    
    def generate_answer(
        self,
        question: str,
        context: str,
        citations_info: List[Dict[str, Any]],
        confidence: float,
        has_relevant_results: bool,
        use_verifier: bool = None  # None = use config default
    ) -> Dict[str, Any]:
        """
        Generate an answer based on retrieved context with mandatory verifier.
        
        Args:
            question: User's question
            context: Retrieved context from knowledge base
            citations_info: List of citation information
            confidence: Average confidence score from retrieval
            has_relevant_results: Whether any results passed the threshold
            use_verifier: Whether to use verifier mode (None = use config default)
            
        Returns:
            Dictionary with answer, citations, confidence, and metadata
        """
        # Determine if verifier should be used (mandatory by default)
        if use_verifier is None:
            use_verifier = settings.REQUIRE_VERIFIER
        
        # GATE 1: No relevant results found - REFUSE
        if not has_relevant_results or not context:
            logger.info("No relevant context found, returning no-context response")
            return {
                "answer": get_no_context_response(),
                "citations": [],
                "confidence": 0.0,
                "from_knowledge_base": False,
                "escalation_suggested": True,
                "refused": True
            }
        
        # GATE 2: Strict confidence threshold - REFUSE if below strict threshold
        if confidence < self.STRICT_CONFIDENCE_THRESHOLD:
            logger.warning(
                f"Confidence ({confidence:.3f}) below strict threshold ({self.STRICT_CONFIDENCE_THRESHOLD}), "
                f"REFUSING to answer to prevent hallucination"
            )
            return {
                "answer": get_no_context_response(),
                "citations": [],
                "confidence": confidence,
                "from_knowledge_base": False,
                "escalation_suggested": True,
                "refused": True,
                "refusal_reason": f"Confidence {confidence:.3f} below strict threshold {self.STRICT_CONFIDENCE_THRESHOLD}"
            }
        
        # GATE 3: Intent-based gating for specific intents (integration, API, etc.)
        intents = detect_intents(question)
        if "integration" in intents or "api" in question.lower():
            # For integration/API questions, require strong relevance
            if confidence < 0.50:  # Even stricter for integration questions
                logger.warning(
                    f"Integration/API question with low confidence ({confidence:.3f}), "
                    f"REFUSING to prevent hallucination"
                )
                return {
                    "answer": get_no_context_response(),
                    "citations": [],
                    "confidence": confidence,
                    "from_knowledge_base": False,
                    "escalation_suggested": True,
                    "refused": True,
                    "refusal_reason": "Integration/API questions require higher confidence"
                }
        
        # Case 3: Passed all gates - generate answer with MANDATORY verifier
        logger.info(f"Confidence ({confidence:.3f}) passed all gates, generating answer with verifier={use_verifier}")
        
        try:
            # VERIFIER MODE IS MANDATORY: Draft → Verify → Final
            # Step 1: Generate draft answer with usage tracking
            draft_system, draft_user = format_draft_prompt(context, question)
            draft_answer, usage_info = self.provider.generate_with_usage(draft_system, draft_user)
            logger.info("Generated draft answer, running verifier...")
            
            # Step 2: Verify draft answer (MANDATORY)
            verifier = get_verifier_service()
            verification = verifier.verify_answer(
                draft_answer=draft_answer,
                context=context,
                citations_info=citations_info
            )
            
            # Step 3: Handle verification result
            if verification["pass"]:
                logger.info("✅ Verifier PASSED - Using draft answer")
                citations = self._extract_citations(draft_answer, citations_info)
                return {
                    "answer": draft_answer,
                    "citations": citations,
                    "confidence": confidence,
                    "from_knowledge_base": True,
                    "escalation_suggested": confidence < self.HIGH_CONFIDENCE_THRESHOLD,
                    "verifier_passed": True,
                    "refused": False,
                    "usage": usage_info  # Include usage info for tracking
                }
            else:
                # Verifier failed - REFUSE to answer
                issues = verification.get('issues', [])
                unsupported = verification.get('unsupported_claims', [])
                logger.warning(
                    f"❌ Verifier FAILED - Issues: {issues}, "
                    f"Unsupported claims: {unsupported}"
                )
                refusal_message = (
                    get_no_context_response() + 
                    "\n\n**Note:** The system could not verify the accuracy of the information needed to answer your question. "
                    "This helps prevent providing incorrect information."
                )
                return {
                    "answer": refusal_message,
                    "citations": [],
                    "confidence": 0.0,
                    "from_knowledge_base": False,
                    "escalation_suggested": True,
                    "verifier_passed": False,
                    "verifier_issues": issues,
                    "unsupported_claims": unsupported,
                    "refused": True,
                    "refusal_reason": "Verifier failed: claims not supported by context",
                    "usage": usage_info  # Still track usage even if refused
                }
                
        except ValueError as e:
            # Configuration errors (e.g., missing API key)
            error_msg = str(e)
            logger.error(f"Configuration error in answer generation: {error_msg}")
            if "API key" in error_msg.lower():
                raise ValueError(f"LLM API key not configured: {error_msg}")
            raise
        except Exception as e:
            logger.error(f"Error generating answer: {e}", exc_info=True)
            # Re-raise to be handled by the endpoint
            raise
    
    def _extract_citations(
        self,
        answer: str,
        citations_info: List[Dict[str, Any]]
    ) -> List[Citation]:
        """
        Extract and format citations from the answer.
        
        Args:
            answer: Generated answer with [Source X] references
            citations_info: Available citation information
            
        Returns:
            List of Citation objects
        """
        citations = []
        
        # Find all [Source X] references in the answer
        source_pattern = r'\[Source\s*(\d+)\]'
        matches = re.findall(source_pattern, answer)
        referenced_indices = set(int(m) for m in matches)
        
        # Build citation objects for referenced sources
        for info in citations_info:
            if info.get("index") in referenced_indices:
                citations.append(Citation(
                    file_name=info.get("file_name", "Unknown"),
                    chunk_id=info.get("chunk_id", ""),
                    page_number=info.get("page_number"),
                    relevance_score=info.get("similarity_score", 0.0),
                    excerpt=info.get("excerpt", "")
                ))
        
        # If no specific citations found but we have context, include top sources
        if not citations and citations_info:
            for info in citations_info[:3]:  # Top 3 sources
                citations.append(Citation(
                    file_name=info.get("file_name", "Unknown"),
                    chunk_id=info.get("chunk_id", ""),
                    page_number=info.get("page_number"),
                    relevance_score=info.get("similarity_score", 0.0),
                    excerpt=info.get("excerpt", "")
                ))
        
        return citations


# Global answer service instance
_answer_service: Optional[AnswerService] = None


def get_answer_service() -> AnswerService:
    """Get the global answer service instance."""
    global _answer_service
    if _answer_service is None:
        _answer_service = AnswerService()
    return _answer_service

