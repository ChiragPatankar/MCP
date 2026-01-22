"""
Authentication and authorization middleware.
Extracts tenant_id from JWT token in production mode.
"""
from fastapi import Request, HTTPException, Depends
from typing import Optional, Dict, Any
import logging
from jose import JWTError, jwt

from app.config import settings

logger = logging.getLogger(__name__)


async def verify_tenant_access(
    request: Request,
    tenant_id: str,
    user_id: str
) -> bool:
    """
    Verify that the user has access to the specified tenant.
    
    TODO: Implement actual authentication logic:
    1. Extract JWT token from Authorization header
    2. Verify token signature
    3. Extract user_id and tenant_id from token
    4. Verify user belongs to tenant
    5. Check permissions
    
    Args:
        request: FastAPI request object
        tenant_id: Tenant ID from request
        user_id: User ID from request
        
    Returns:
        True if access is granted, False otherwise
    """
    # TODO: Implement actual authentication
    # For now, this is a placeholder that always returns True
    # In production, you MUST implement proper auth
    
    # Example implementation:
    # token = request.headers.get("Authorization", "").replace("Bearer ", "")
    # if not token:
    #     return False
    # 
    # decoded = verify_jwt_token(token)
    # if decoded["user_id"] != user_id or decoded["tenant_id"] != tenant_id:
    #     return False
    # 
    # return True
    
    logger.warning("⚠️  Authentication middleware not implemented - using placeholder")
    return True


def get_tenant_from_token(request: Request) -> Optional[str]:
    """
    Extract tenant_id from authentication token.
    
    In production mode, extracts tenant_id from JWT token.
    In dev mode, returns None (allows request tenant_id).
    
    Args:
        request: FastAPI request object
        
    Returns:
        Tenant ID if found in token, None otherwise
    """
    if settings.ENV == "dev":
        # Dev mode: allow request tenant_id
        return None
    
    # Production mode: extract from JWT
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        logger.warning("Missing or invalid Authorization header")
        return None
    
    token = auth_header.replace("Bearer ", "").strip()
    if not token:
        return None
    
    try:
        # TODO: Replace with your actual JWT secret key
        # For now, this is a placeholder that expects a specific token format
        # In production, you should:
        # 1. Get JWT_SECRET from environment
        # 2. Verify token signature
        # 3. Extract tenant_id from token payload
        
        # Example implementation (replace with your actual JWT verification):
        # JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
        # decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # return decoded.get("tenant_id")
        
        # Placeholder: Try to decode without verification (for testing)
        # In production, you MUST verify the signature
        try:
            decoded = jwt.decode(token, options={"verify_signature": False})
            tenant_id = decoded.get("tenant_id")
            if tenant_id:
                logger.info(f"Extracted tenant_id from token: {tenant_id}")
                return tenant_id
        except jwt.DecodeError:
            logger.warning("Failed to decode JWT token")
            return None
        
    except Exception as e:
        logger.error(f"Error extracting tenant from token: {e}")
        return None
    
    return None


async def get_auth_context(request: Request) -> Dict[str, Any]:
    """
    Get authentication context from request.
    
    DEV mode:
    - Allows X-Tenant-Id and X-User-Id headers
    - Falls back to defaults if missing
    
    PROD mode:
    - Requires Authorization: Bearer <JWT>
    - Verifies JWT using JWT_SECRET
    - Extracts tenant_id and user_id from token claims
    - NEVER accepts tenant_id from request body/query params
    
    Args:
        request: FastAPI request object
        
    Returns:
        Dictionary with user_id and tenant_id
        
    Raises:
        HTTPException: If authentication fails (production mode only)
    """
    if settings.ENV == "dev":
        # Dev mode: allow headers, fallback to defaults
        tenant_id = request.headers.get("X-Tenant-Id", "dev_tenant")
        user_id = request.headers.get("X-User-Id", "dev_user")
        return {
            "user_id": user_id,
            "tenant_id": tenant_id
        }
    
    # Production mode: require JWT token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Provide valid Bearer token in Authorization header."
        )
    
    token = auth_header.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid token format."
        )
    
    # Verify JWT token
    if not settings.JWT_SECRET:
        logger.error("JWT_SECRET not configured in production mode")
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: JWT_SECRET not set"
        )
    
    try:
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        
        user_id = decoded.get("user_id") or decoded.get("sub")
        tenant_id = decoded.get("tenant_id")
        
        if not user_id or not tenant_id:
            raise HTTPException(
                status_code=401,
                detail="Token missing required claims (user_id, tenant_id)."
            )
        
        logger.info(f"Authenticated user: {user_id}, tenant: {tenant_id}")
        return {
            "user_id": user_id,
            "tenant_id": tenant_id,
            "email": decoded.get("email"),
            "role": decoded.get("role")
        }
        
    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )
    except Exception as e:
        logger.error(f"Auth error: {e}", exc_info=True)
        raise HTTPException(
            status_code=401,
            detail="Authentication failed."
        )


# FastAPI dependency for easy use in endpoints
async def require_auth(request: Request) -> Dict[str, Any]:
    """
    FastAPI dependency for requiring authentication.
    Alias for get_auth_context for backward compatibility.
    """
    return await get_auth_context(request)

