"""
Intent detection module for RAG pipeline.
Detects user intent from queries to enable intent-based gating.
"""
import re
from typing import List, Dict, Set
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Intent keywords mapping
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "integration": [
        "integrate", "integration", "api", "connect", "connection", "webhook",
        "shopify", "woocommerce", "stripe", "paypal", "payment gateway",
        "whatsapp", "telegram", "slack", "zapier", "ifttt", "automation"
    ],
    "billing": [
        "billing", "invoice", "payment", "subscription", "plan", "pricing",
        "cost", "price", "charge", "fee", "refund", "cancel", "renew"
    ],
    "account": [
        "account", "profile", "settings", "preferences", "user", "login",
        "signup", "register", "authentication", "auth"
    ],
    "password_reset": [
        "password", "reset", "forgot", "change password", "update password",
        "password reset link", "expire", "expiry"
    ],
    "pricing": [
        "pricing", "price", "plan", "cost", "subscription", "tier", "starter",
        "pro", "enterprise", "monthly", "yearly", "billing"
    ],
    "general": []  # Catch-all for general queries
}


def detect_intents(query: str) -> List[str]:
    """
    Detect intents from a user query.
    
    Args:
        query: User's question
        
    Returns:
        List of detected intent labels (e.g., ["integration", "billing"])
    """
    query_lower = query.lower()
    detected = []
    
    for intent, keywords in INTENT_KEYWORDS.items():
        if intent == "general":
            continue  # Skip general, it's a catch-all
        
        # Check if any keyword matches
        for keyword in keywords:
            # Use word boundary matching for better accuracy
            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
            if re.search(pattern, query_lower):
                detected.append(intent)
                break  # Only add intent once
    
    # If no specific intent detected, return general
    if not detected:
        detected = ["general"]
    
    logger.info(f"Detected intents for query '{query[:50]}...': {detected}")
    return detected


def get_intent_keywords(intents: List[str]) -> Set[str]:
    """
    Get all keywords for a list of intents.
    
    Args:
        intents: List of intent labels
        
    Returns:
        Set of keywords for those intents
    """
    keywords = set()
    for intent in intents:
        if intent in INTENT_KEYWORDS:
            keywords.update(INTENT_KEYWORDS[intent])
    return keywords


def check_direct_match(
    query: str,
    retrieved_chunks: List[str],
    intent_keywords: Set[str] = None
) -> bool:
    """
    Check if at least one retrieved chunk contains direct matches for query intent.
    
    Args:
        query: User's question
        retrieved_chunks: List of retrieved chunk texts
        intent_keywords: Optional set of intent keywords to check
        
    Returns:
        True if at least one chunk has direct match, False otherwise
    """
    if not retrieved_chunks:
        return False
    
    query_lower = query.lower()
    query_words = set(re.findall(r'\b\w+\b', query_lower))
    
    # Get intent keywords if not provided
    if intent_keywords is None:
        intents = detect_intents(query)
        intent_keywords = get_intent_keywords(intents)
    
    # Check each chunk for direct matches
    for chunk in retrieved_chunks:
        chunk_lower = chunk.lower()
        
        # Check 1: Intent keywords must be present in chunk
        if intent_keywords:
            intent_found = any(
                re.search(r'\b' + re.escape(kw.lower()) + r'\b', chunk_lower)
                for kw in intent_keywords
            )
            if not intent_found:
                continue  # Skip this chunk if no intent keywords
        
        # Check 2: At least 2-3 important query words should be in chunk
        # (excluding common stop words)
        stop_words = {"the", "a", "an", "is", "are", "was", "were", "be", "been",
                     "to", "of", "and", "or", "but", "in", "on", "at", "for",
                     "with", "how", "what", "when", "where", "why", "do", "does"}
        important_words = query_words - stop_words
        
        if len(important_words) >= 2:
            # Need at least 2 important words to match
            matches = sum(1 for word in important_words if word in chunk_lower)
            if matches >= 2:
                logger.info(f"Direct match found: {matches} important words matched in chunk")
                return True
        elif len(important_words) == 1:
            # Single important word - require exact phrase match
            for word in important_words:
                if re.search(r'\b' + re.escape(word) + r'\b', chunk_lower):
                    logger.info(f"Direct match found: single important word '{word}' matched")
                    return True
    
    logger.warning("No direct match found in retrieved chunks")
    return False


