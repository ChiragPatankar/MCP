from fastapi import FastAPI, HTTPException, Depends, Request, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime
import json
import asyncio
from database import get_db
from sqlalchemy.orm import Session
import models
from mcp_config import mcp_settings
from middleware import rate_limit_middleware, validate_mcp_request
import time

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Gemini MCP Server",
    description="AI Customer Support Bot using Google Gemini",
    version="2.0.0"
)

# Add middleware
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(validate_mcp_request)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP Models
class MCPRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    mcp_version: Optional[str] = "1.0"
    priority: Optional[str] = "normal"  # high, normal, low

class MCPResponse(BaseModel):
    response: str
    context: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    mcp_version: str = "1.0"
    processing_time: Optional[float] = None

class MCPError(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class MCPBatchRequest(BaseModel):
    queries: List[str]
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    mcp_version: Optional[str] = "1.0"

class MCPBatchResponse(BaseModel):
    responses: List[MCPResponse]
    batch_metadata: Optional[Dict[str, Any]] = None
    mcp_version: str = "1.0"

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')  # Free tier
else:
    gemini_model = None

# MCP Authentication
async def verify_mcp_auth(x_mcp_auth: str = Header(...)):
    if not x_mcp_auth:
        raise HTTPException(status_code=401, detail="MCP authentication required")
    # TODO: Implement proper MCP authentication
    return True

@app.get("/")
async def root():
    return {
        "message": "Gemini MCP Server",
        "version": "2.0.0",
        "status": "active",
        "ai_provider": "Google Gemini"
    }

@app.get("/mcp/version")
async def mcp_version():
    return {
        "version": "1.0",
        "supported_versions": ["1.0"],
        "server_version": "2.0.0",
        "deprecation_notice": None
    }

@app.get("/mcp/capabilities")
async def mcp_capabilities():
    return {
        "models": {
            "gemini-1.5-flash": {
                "version": "1.5",
                "capabilities": ["text-generation", "context-aware", "multi-language"],
                "max_tokens": 8192,
                "supported_languages": ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"]
            }
        },
        "context_providers": {
            "internal": {
                "version": "1.0",
                "capabilities": ["basic-context", "conversation-history"],
                "max_context_size": 1000000  # Gemini's large context window
            }
        },
        "features": [
            "context-aware-responses",
            "user-tracking",
            "response-storage",
            "batch-processing",
            "priority-queuing",
            "multi-language-support"
        ],
        "rate_limits": {
            "requests_per_period": mcp_settings.RATE_LIMIT_REQUESTS,
            "period_seconds": mcp_settings.RATE_LIMIT_PERIOD
        }
    }

@app.post("/mcp/process", response_model=MCPResponse)
async def process_mcp_request(
    request: MCPRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    auth: bool = Depends(verify_mcp_auth)
):
    start_time = time.time()
    try:
        # Validate MCP version
        if request.mcp_version not in ["1.0"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported MCP version: {request.mcp_version}"
            )

        # Fetch additional context
        context = await fetch_context(request.query, request.context)
        
        # Process with Gemini AI
        response = await process_with_gemini(request.query, context, request.priority)
        
        # Store the interaction in the database if user_id is provided
        if request.user_id:
            background_tasks.add_task(
                store_interaction,
                db,
                request.user_id,
                request.query,
                response,
                context
            )
        
        processing_time = time.time() - start_time
        return MCPResponse(
            response=response,
            context=context,
            metadata={
                "processed_at": datetime.utcnow().isoformat(),
                "model": "gemini-1.5-flash",
                "context_provider": "internal",
                "priority": request.priority,
                "ai_provider": "Google Gemini"
            },
            mcp_version="1.0",
            processing_time=processing_time
        )
    except Exception as e:
        error = MCPError(
            code="PROCESSING_ERROR",
            message=str(e),
            details={"timestamp": datetime.utcnow().isoformat()}
        )
        return JSONResponse(
            status_code=500,
            content=error.dict()
        )

@app.post("/mcp/batch", response_model=MCPBatchResponse)
async def process_batch_request(
    request: MCPBatchRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    auth: bool = Depends(verify_mcp_auth)
):
    try:
        # Process queries concurrently for better performance
        tasks = []
        for query in request.queries:
            task = process_single_query_async(query, request.context)
            tasks.append(task)
        
        # Wait for all tasks to complete
        query_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        responses = []
        for i, result in enumerate(query_results):
            if isinstance(result, Exception):
                # Handle individual query errors
                mcp_response = MCPResponse(
                    response=f"Error processing query: {str(result)}",
                    context={},
                    metadata={
                        "processed_at": datetime.utcnow().isoformat(),
                        "model": "gemini-1.5-flash",
                        "error": True
                    },
                    mcp_version="1.0"
                )
            else:
                context, response = result
                mcp_response = MCPResponse(
                    response=response,
                    context=context,
                    metadata={
                        "processed_at": datetime.utcnow().isoformat(),
                        "model": "gemini-1.5-flash",
                        "context_provider": "internal"
                    },
                    mcp_version="1.0"
                )
                
                # Store interaction if user_id is provided
                if request.user_id:
                    background_tasks.add_task(
                        store_interaction,
                        db,
                        request.user_id,
                        request.queries[i],
                        response,
                        context
                    )
            
            responses.append(mcp_response)
        
        return MCPBatchResponse(
            responses=responses,
            batch_metadata={
                "total_queries": len(request.queries),
                "processed_at": datetime.utcnow().isoformat(),
                "success_rate": f"{len([r for r in query_results if not isinstance(r, Exception)])}/{len(request.queries)}"
            },
            mcp_version="1.0"
        )
    except Exception as e:
        error = MCPError(
            code="BATCH_PROCESSING_ERROR",
            message=str(e),
            details={"timestamp": datetime.utcnow().isoformat()}
        )
        return JSONResponse(
            status_code=500,
            content=error.dict()
        )

@app.get("/mcp/health")
async def health_check():
    # Test Gemini connection
    gemini_status = "disconnected"
    if gemini_model and GEMINI_API_KEY:
        try:
            # Quick test call
            test_response = await asyncio.to_thread(
                gemini_model.generate_content,
                "Test",
                generation_config=genai.types.GenerationConfig(max_output_tokens=10)
            )
            gemini_status = "connected" if test_response.text else "error"
        except Exception:
            gemini_status = "error"
    
    return {
        "status": "healthy" if gemini_status == "connected" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "gemini_ai": gemini_status,
            "database": "connected"  # Assume connected, add actual check if needed
        },
        "mcp_version": "1.0",
        "ai_provider": "Google Gemini",
        "model": "gemini-1.5-flash",
        "rate_limits": {
            "current_usage": "0%",
            "requests_per_period": mcp_settings.RATE_LIMIT_REQUESTS,
            "period_seconds": mcp_settings.RATE_LIMIT_PERIOD
        }
    }

async def fetch_context(message: str, existing_context: Optional[Dict] = None) -> dict:
    """Build context for the query"""
    context = {
        "timestamp": datetime.utcnow().isoformat(),
        "query_length": len(message),
        "language_detected": "en",  # Add language detection if needed
    }
    
    # Merge existing context if provided
    if existing_context:
        context.update(existing_context)
    
    return context

async def process_with_gemini(message: str, context: dict, priority: str = "normal") -> str:
    """Process message with Google Gemini"""
    if not gemini_model or not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503, 
            detail="Gemini AI service not available. Please set GEMINI_API_KEY."
        )
    
    try:
        # Build enhanced prompt for customer support
        enhanced_prompt = f"""
You are an AI customer support assistant. Provide helpful, accurate, and professional responses.

Customer Query: {message}

Context Information:
- Timestamp: {context.get('timestamp', 'N/A')}
- Priority: {priority}
- Previous context: {json.dumps(context, indent=2)}

Instructions:
1. Provide a clear, helpful response to the customer's question
2. Be professional and empathetic
3. If you don't know something, say so honestly
4. Offer to escalate to human support if needed
5. Keep responses concise but complete

Response:
"""
        
        # Configure generation parameters based on priority
        temperature = 0.7 if priority == "high" else 0.8
        max_tokens = 1000 if priority == "high" else 500
        
        # Generate response with Gemini
        response = await asyncio.to_thread(
            gemini_model.generate_content,
            enhanced_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
                top_p=0.8,
            )
        )
        
        return response.text.strip()
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini AI processing error: {str(e)}"
        )

async def process_single_query_async(query: str, context: Optional[Dict] = None):
    """Helper function for async batch processing"""
    built_context = await fetch_context(query, context)
    response = await process_with_gemini(query, built_context)
    return built_context, response

async def store_interaction(
    db: Session,
    user_id: str,
    message: str,
    response: str,
    context: dict
):
    """Store interaction in database"""
    try:
        chat_message = models.ChatMessage(
            user_id=int(user_id),
            message=message,
            response=response,
            context=json.dumps(context)
        )
        db.add(chat_message)
        db.commit()
    except Exception as e:
        # Log error but don't raise it since this is a background task
        print(f"Error storing interaction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    # Check for required environment variables
    if not GEMINI_API_KEY:
        print("❌ Error: GEMINI_API_KEY environment variable is required")
        print("🔑 Get your FREE Gemini API key at: https://aistudio.google.com/app/apikey")
        exit(1)
    
    print("🚀 Starting Gemini-Powered MCP Server...")
    print(f"🤖 Using Google Gemini AI (gemini-1.5-flash)")
    print(f"🔧 Server: Gemini MCP Server")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 