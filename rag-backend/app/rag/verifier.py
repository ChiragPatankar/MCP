"""
Verifier module for RAG pipeline.
Implements Draft → Verify → Final flow to minimize hallucination.
"""
import json
import re
from typing import Dict, Any, List, Optional
import logging

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Verifier prompt template
VERIFIER_PROMPT = """You are a strict fact-checker for a customer support chatbot. Your job is to verify that every factual claim in a draft answer is supported by the provided context.

## Your Task:
1. Review the DRAFT ANSWER below
2. Check each factual claim against the PROVIDED CONTEXT
3. Identify any claims that are NOT supported by the context
4. Return a JSON response with your verification results

## CRITICAL RULES:
- If ANY claim is not explicitly supported by the context → FAIL
- If the answer adds information not in context → FAIL
- If citations are missing or incorrect → FAIL
- Only PASS if ALL claims are verifiable in the context

## Response Format (JSON):
{{
  "pass": true/false,
  "issues": ["list of issues found"],
  "unsupported_claims": ["list of unsupported claims"],
  "final_answer": "corrected answer if needed (optional)"
}}

## Example FAIL Response:
{{
  "pass": false,
  "issues": ["Claim about '30 days' not found in context", "Missing citation for pricing information"],
  "unsupported_claims": ["Refund window is 30 days", "Starter plan costs ₹999"],
  "final_answer": null
}}

## Example PASS Response:
{{
  "pass": true,
  "issues": [],
  "unsupported_claims": [],
  "final_answer": null
}}

---

## PROVIDED CONTEXT:
{context}

---

## DRAFT ANSWER TO VERIFY:
{draft_answer}

---

Now verify the draft answer and return ONLY valid JSON (no markdown, no code blocks, just raw JSON):"""


class VerifierService:
    """
    Verifies that draft answers are supported by retrieved context.
    Implements strict factual validation to prevent hallucination.
    """
    
    def __init__(self, provider: Optional[Any] = None):
        """
        Initialize the verifier service.
        
        Args:
            provider: Optional LLM provider (uses same as answer service if not provided)
        """
        self._provider = provider
    
    @property
    def provider(self):
        """Get or create the LLM provider for verification."""
        if self._provider is None:
            from app.rag.answer import GeminiProvider, OpenAIProvider
            if settings.LLM_PROVIDER == "gemini":
                self._provider = GeminiProvider()
            elif settings.LLM_PROVIDER == "openai":
                self._provider = OpenAIProvider()
            else:
                raise ValueError(f"Unknown LLM provider: {settings.LLM_PROVIDER}")
        return self._provider
    
    def verify_answer(
        self,
        draft_answer: str,
        context: str,
        citations_info: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Verify that a draft answer is supported by the context.
        
        Args:
            draft_answer: The draft answer to verify
            context: The retrieved context from knowledge base
            citations_info: List of citation information
            
        Returns:
            Dictionary with verification results:
            {
                "pass": bool,
                "issues": List[str],
                "unsupported_claims": List[str],
                "final_answer": Optional[str]
            }
        """
        if not context or not draft_answer:
            logger.warning("Empty context or draft answer provided to verifier")
            return {
                "pass": False,
                "issues": ["Empty context or draft answer"],
                "unsupported_claims": [],
                "final_answer": None
            }
        
        # Format verifier prompt
        verifier_prompt = VERIFIER_PROMPT.format(
            context=context,
            draft_answer=draft_answer
        )
        
        try:
            logger.info("Running verifier on draft answer...")
            # Use a more deterministic temperature for verification
            try:
                raw_response = self.provider.generate(
                    system_prompt="You are a strict fact-checker. Return ONLY valid JSON.",
                    user_prompt=verifier_prompt
                )
            except Exception as e:
                logger.error(f"Error calling LLM in verifier: {e}", exc_info=True)
                # On LLM error, fail conservatively
                return {
                    "pass": False,
                    "issues": [f"Verifier LLM error: {str(e)}"],
                    "unsupported_claims": [],
                    "final_answer": None
                }
            
            # Parse JSON response
            try:
                verification_result = self._parse_verifier_response(raw_response)
            except Exception as e:
                logger.error(f"Error parsing verifier response: {e}", exc_info=True)
                logger.error(f"Raw response was: {raw_response[:500]}")
                # On parse error, fail conservatively
                return {
                    "pass": False,
                    "issues": [f"Verifier parse error: {str(e)}"],
                    "unsupported_claims": [],
                    "final_answer": None
                }
            
            if verification_result["pass"]:
                logger.info("✅ Verifier PASSED - All claims supported by context")
            else:
                logger.warning(
                    f"❌ Verifier FAILED - Issues: {verification_result.get('issues', [])}"
                )
            
            return verification_result
            
        except Exception as e:
            logger.error(f"Unexpected error in verifier: {e}", exc_info=True)
            # On error, fail conservatively
            return {
                "pass": False,
                "issues": [f"Verifier error: {str(e)}"],
                "unsupported_claims": [],
                "final_answer": None
            }
    
    def _parse_verifier_response(self, raw_response: str) -> Dict[str, Any]:
        """
        Parse the verifier's JSON response.
        
        Args:
            raw_response: Raw response from LLM
            
        Returns:
            Parsed verification result
        """
        # Try to extract JSON from response
        # Remove markdown code blocks if present
        cleaned = raw_response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # Try to find JSON object in the response
        # Look for { ... } pattern
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', cleaned, re.DOTALL)
        if json_match:
            cleaned = json_match.group(0)
        
        try:
            result = json.loads(cleaned)
            
            # Validate structure
            if not isinstance(result, dict):
                raise ValueError("Response is not a dictionary")
            
            # Ensure required fields
            return {
                "pass": result.get("pass", False),
                "issues": result.get("issues", []),
                "unsupported_claims": result.get("unsupported_claims", []),
                "final_answer": result.get("final_answer")
            }
            
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to parse verifier JSON: {e}")
            logger.error(f"Raw response (first 500 chars): {raw_response[:500]}")
            logger.error(f"Cleaned response (first 500 chars): {cleaned[:500]}")
            
            # Fallback: try to infer pass/fail from text
            response_lower = raw_response.lower()
            # Check for explicit pass indicators
            if ("pass" in response_lower and ("true" in response_lower or "yes" in response_lower)) or \
               ("all claims" in response_lower and "supported" in response_lower):
                logger.warning("Using fallback: inferred PASS from text")
                return {
                    "pass": True,
                    "issues": [],
                    "unsupported_claims": [],
                    "final_answer": None
                }
            elif ("pass" in response_lower and ("false" in response_lower or "no" in response_lower)) or \
                 ("not supported" in response_lower or "unsupported" in response_lower):
                logger.warning("Using fallback: inferred FAIL from text")
                return {
                    "pass": False,
                    "issues": ["Failed to parse verifier response - inferred fail from text"],
                    "unsupported_claims": [],
                    "final_answer": None
                }
            else:
                # Default to fail for safety
                logger.warning("Using fallback: defaulting to FAIL (could not infer from text)")
                return {
                    "pass": False,
                    "issues": [f"Failed to parse verifier response: {str(e)}"],
                    "unsupported_claims": [],
                    "final_answer": None
                }


# Global verifier instance
_verifier_service: Optional[VerifierService] = None


def get_verifier_service() -> VerifierService:
    """Get the global verifier service instance."""
    global _verifier_service
    if _verifier_service is None:
        _verifier_service = VerifierService()
    return _verifier_service

