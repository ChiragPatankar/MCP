"""
Pricing table for LLM providers.
Used to calculate estimated costs from token usage.
"""
from typing import Dict, Optional

# Pricing per 1M tokens (as of 2024, update as needed)
PRICING_TABLE: Dict[str, Dict[str, float]] = {
    "gemini": {
        "gemini-pro": {"input": 0.50, "output": 1.50},  # $0.50/$1.50 per 1M tokens
        "gemini-1.5-pro": {"input": 1.25, "output": 5.00},
        "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
        "gemini-1.0-pro": {"input": 0.50, "output": 1.50},
        "default": {"input": 0.50, "output": 1.50}
    },
    "openai": {
        "gpt-4": {"input": 30.00, "output": 60.00},
        "gpt-4-turbo": {"input": 10.00, "output": 30.00},
        "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
        "default": {"input": 0.50, "output": 1.50}
    }
}


def calculate_cost(
    provider: str,
    model: str,
    prompt_tokens: int,
    completion_tokens: int
) -> float:
    """
    Calculate estimated cost in USD based on token usage.
    
    Args:
        provider: "gemini" or "openai"
        model: Model name (e.g., "gemini-pro", "gpt-3.5-turbo")
        prompt_tokens: Number of input tokens
        completion_tokens: Number of output tokens
        
    Returns:
        Estimated cost in USD
    """
    provider_pricing = PRICING_TABLE.get(provider.lower(), {})
    model_pricing = provider_pricing.get(model.lower(), provider_pricing.get("default", {"input": 0.50, "output": 1.50}))
    
    # Calculate cost: (tokens / 1M) * price_per_1M
    input_cost = (prompt_tokens / 1_000_000) * model_pricing["input"]
    output_cost = (completion_tokens / 1_000_000) * model_pricing["output"]
    
    return input_cost + output_cost


def get_model_pricing(provider: str, model: str) -> Dict[str, float]:
    """Get pricing for a specific model."""
    provider_pricing = PRICING_TABLE.get(provider.lower(), {})
    return provider_pricing.get(model.lower(), provider_pricing.get("default", {"input": 0.50, "output": 1.50}))

