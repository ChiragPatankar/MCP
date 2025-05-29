import time
from typing import Dict
from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from mcp_config import mcp_settings

# Simple in-memory rate limiting (use Redis in production)
request_counts: Dict[str, Dict[str, int]] = {}

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    client_ip = request.client.host if request.client else "unknown"
    current_time = int(time.time())
    window_start = current_time // mcp_settings.RATE_LIMIT_PERIOD * mcp_settings.RATE_LIMIT_PERIOD
    
    # Initialize client data if not exists
    if client_ip not in request_counts:
        request_counts[client_ip] = {}
    
    # Clean old windows
    for window in list(request_counts[client_ip].keys()):
        if window < window_start:
            del request_counts[client_ip][window]
    
    # Check current window
    if window_start not in request_counts[client_ip]:
        request_counts[client_ip][window_start] = 0
    
    # Check rate limit
    if request_counts[client_ip][window_start] >= mcp_settings.RATE_LIMIT_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={
                "code": "RATE_LIMIT_EXCEEDED",
                "message": f"Rate limit exceeded. Max {mcp_settings.RATE_LIMIT_REQUESTS} requests per {mcp_settings.RATE_LIMIT_PERIOD} seconds.",
                "details": {
                    "retry_after": mcp_settings.RATE_LIMIT_PERIOD - (current_time % mcp_settings.RATE_LIMIT_PERIOD)
                }
            }
        )
    
    # Increment counter
    request_counts[client_ip][window_start] += 1
    
    response = await call_next(request)
    return response

async def validate_mcp_request(request: Request, call_next):
    """Validate MCP request format"""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        if mcp_settings.DEBUG:
            print(f"Request validation error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "code": "INTERNAL_ERROR",
                "message": "Internal server error",
                "details": {"timestamp": time.time()}
            }
        ) 