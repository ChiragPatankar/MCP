"""
Rate limiting middleware using slowapi.
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize limiter with default limits (can be overridden per endpoint)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000/hour"] if settings.RATE_LIMIT_ENABLED else []
)


def get_tenant_rate_limit_key(request: Request) -> str:
    """
    Get rate limit key based on tenant_id from headers (dev) or IP (prod).
    
    Note: This is a sync function called by slowapi, so we can't await async functions.
    In dev mode, we extract tenant_id from X-Tenant-Id header.
    In prod mode, we fall back to IP address (rate limiting happens before auth).
    """
    # Try to get tenant_id from headers (works in dev mode)
    tenant_id = request.headers.get("X-Tenant-Id")
    if tenant_id:
        return f"tenant:{tenant_id}"
    
    # Fallback to IP address (for prod mode or if no header)
    return get_remote_address(request)


# Export limiter and key function
__all__ = ["limiter", "get_tenant_rate_limit_key", "RateLimitExceeded", "_rate_limit_exceeded_handler"]

