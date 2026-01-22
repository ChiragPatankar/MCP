"""
FastAPI application for ClientSphere RAG Backend.
Provides endpoints for knowledge base management and chat.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import uuid
from datetime import datetime
from typing import Optional
import logging

from app.config import settings
from app.middleware.auth import get_auth_context, require_auth
from app.middleware.rate_limit import (
    limiter,
    get_tenant_rate_limit_key,
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
from app.models.schemas import (
    UploadResponse,
    ChatRequest,
    ChatResponse,
    KnowledgeBaseStats,
    HealthResponse,
    DocumentStatus,
    Citation,
)
from app.models.billing_schemas import (
    UsageResponse,
    PlanLimitsResponse,
    CostReportResponse,
    SetPlanRequest
)
from app.rag.ingest import parser
from app.rag.chunking import chunker
from app.rag.embeddings import get_embedding_service
from app.rag.vectorstore import get_vector_store
from app.rag.retrieval import get_retrieval_service
from app.rag.answer import get_answer_service
from app.db.database import get_db, init_db
from app.billing.quota import check_quota, ensure_tenant_exists
from app.billing.usage_tracker import track_usage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="RAG-based customer support chatbot API",
    version="1.0.0",
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup."""
    init_db()
    logger.info("Database initialized")

# Configure CORS - SECURITY: Restrict in production
if settings.ALLOWED_ORIGINS == "*":
    allowed_origins = ["*"]
else:
    # Split by comma and strip whitespace
    allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

# Default to allowing localhost if no origins specified
if not allowed_origins or allowed_origins == ["*"]:
    allowed_origins = ["*"]  # Allow all in dev mode

logger.info(f"CORS configured with origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],  # Include OPTIONS for preflight
    allow_headers=["Content-Type", "Authorization", "X-Tenant-Id", "X-User-Id"],  # Include auth headers
)

# Configure rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors with detailed logging."""
    body = await request.body()
    logger.error(f"Request validation error: {exc.errors()}")
    logger.error(f"Request body (raw): {body}")
    logger.error(f"Request headers: {dict(request.headers)}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body.decode('utf-8', errors='ignore')}
    )

# Add exception handler for validation errors
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors with detailed logging."""
    logger.error(f"Request validation error: {exc.errors()}")
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(await request.body())}
    )


# ============== Health & Status Endpoints ==============

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with basic info."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        vector_db_connected=True,
        llm_configured=bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        vector_store = get_vector_store()
        stats = vector_store.get_stats()
        
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            vector_db_connected=True,
            llm_configured=bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            version="1.0.0",
            vector_db_connected=False,
            llm_configured=False
        )


@app.get("/health/live")
async def liveness():
    """Kubernetes liveness probe - always returns alive."""
    return {"status": "alive"}


@app.get("/health/ready")
async def readiness():
    """Kubernetes readiness probe - checks dependencies."""
    checks = {
        "vector_db": False,
        "llm_configured": bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
    }
    
    # Check vector DB connection
    try:
        vector_store = get_vector_store()
        vector_store.get_stats()
        checks["vector_db"] = True
    except Exception as e:
        logger.warning(f"Vector DB check failed: {e}")
        checks["vector_db"] = False
    
    # All checks must pass
    if all(checks.values()):
        return {"status": "ready", "checks": checks}
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail={"status": "not_ready", "checks": checks})


# ============== Knowledge Base Endpoints ==============

@app.post("/kb/upload", response_model=UploadResponse)
@limiter.limit("20/hour", key_func=get_tenant_rate_limit_key)
async def upload_document(
    background_tasks: BackgroundTasks,
    request: Request,
    file: UploadFile = File(...),
    tenant_id: Optional[str] = Form(None),  # Optional in dev, ignored in prod
    user_id: Optional[str] = Form(None),  # Optional in dev, ignored in prod
    kb_id: str = Form(...)
):
    """
    Upload a document to the knowledge base.
    
    - Saves file to disk
    - Parses and chunks the document
    - Generates embeddings
    - Stores in vector database
    """
    # SECURITY: Extract tenant_id from auth token in production
    if settings.ENV == "prod":
        auth_context = await require_auth(request)
        tenant_id = auth_context.get("tenant_id")
        if not tenant_id:
            raise HTTPException(
                status_code=403,
                detail="tenant_id must come from authentication token in production mode"
            )
    elif not tenant_id:
        raise HTTPException(
            status_code=400,
            detail="tenant_id is required"
        )
    
    # Validate file type
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in parser.SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Supported: {parser.SUPPORTED_EXTENSIONS}"
        )
    
    # Validate file size (SECURITY)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to start
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size > max_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Generate document ID
    doc_id = f"{tenant_id}_{kb_id}_{uuid.uuid4().hex[:8]}"
    
    # Save file to uploads directory
    upload_path = settings.UPLOADS_DIR / f"{doc_id}_{file.filename}"
    try:
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved file: {upload_path}")
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file")
    
    # Process document in background
    background_tasks.add_task(
        process_document,
        upload_path,
        tenant_id,  # CRITICAL: Multi-tenant isolation
        user_id,
        kb_id,
        file.filename,
        doc_id
    )
    
    return UploadResponse(
        success=True,
        message="Document upload started. Processing in background.",
        document_id=doc_id,
        file_name=file.filename,
        chunks_created=0,
        status=DocumentStatus.PROCESSING
    )


async def process_document(
    file_path: Path,
    tenant_id: str,  # CRITICAL: Multi-tenant isolation
    user_id: str,
    kb_id: str,
    original_filename: str,
    document_id: str
):
    """
    Background task to process an uploaded document.
    """
    try:
        logger.info(f"Processing document: {original_filename}")
        
        # Parse document
        parsed_doc = parser.parse(file_path)
        logger.info(f"Parsed document: {len(parsed_doc.text)} characters")
        
        # Chunk document
        chunks = chunker.chunk_text(
            parsed_doc.text,
            page_numbers=parsed_doc.page_map
        )
        logger.info(f"Created {len(chunks)} chunks")
        
        if not chunks:
            logger.warning(f"No chunks created from {original_filename}")
            return
        
        # Create metadata for each chunk
        metadatas = []
        chunk_ids = []
        chunk_texts = []
        
        for chunk in chunks:
            metadata = chunker.create_chunk_metadata(
                chunk=chunk,
                tenant_id=tenant_id,  # CRITICAL: Multi-tenant isolation
                kb_id=kb_id,
                user_id=user_id,
                file_name=original_filename,
                file_type=parsed_doc.file_type,
                total_chunks=len(chunks),
                document_id=document_id
            )
            metadatas.append(metadata)
            chunk_ids.append(metadata["chunk_id"])
            chunk_texts.append(chunk.content)
        
        # Generate embeddings
        embedding_service = get_embedding_service()
        embeddings = embedding_service.embed_texts(chunk_texts)
        logger.info(f"Generated {len(embeddings)} embeddings")
        
        # Store in vector database
        vector_store = get_vector_store()
        vector_store.add_documents(
            documents=chunk_texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=chunk_ids
        )
        
        logger.info(f"Successfully processed {original_filename}: {len(chunks)} chunks stored")
        
    except Exception as e:
        logger.error(f"Error processing document {original_filename}: {e}")
        raise


@app.get("/kb/stats", response_model=KnowledgeBaseStats)
async def get_kb_stats(
    request: Request,
    tenant_id: Optional[str] = None,  # Optional in dev, ignored in prod
    kb_id: Optional[str] = None,
    user_id: Optional[str] = None  # Optional in dev, ignored in prod
):
    """Get statistics for a knowledge base."""
    # SECURITY: Get tenant_id and user_id from auth context
    auth_context = await get_auth_context(request)
    tenant_id_from_auth = auth_context.get("tenant_id")
    user_id_from_auth = auth_context.get("user_id")
    
    if settings.ENV == "prod":
        if not tenant_id_from_auth or not user_id_from_auth:
            raise HTTPException(
                status_code=403,
                detail="tenant_id and user_id must come from authentication token in production mode"
            )
        tenant_id = tenant_id_from_auth
        user_id = user_id_from_auth
    else:
        tenant_id = tenant_id or tenant_id_from_auth
        user_id = user_id or user_id_from_auth
        if not tenant_id or not kb_id or not user_id:
            raise HTTPException(
                status_code=400,
                detail="tenant_id, kb_id, and user_id are required"
            )
    
    try:
        vector_store = get_vector_store()
        stats = vector_store.get_stats(tenant_id=tenant_id, kb_id=kb_id, user_id=user_id)
        
        return KnowledgeBaseStats(
            tenant_id=tenant_id,  # CRITICAL: Multi-tenant isolation
            kb_id=kb_id,
            user_id=user_id,
            total_documents=len(stats.get("file_names", [])),
            total_chunks=stats.get("total_chunks", 0),
            file_names=stats.get("file_names", []),
            last_updated=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Error getting KB stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/kb/document")
async def delete_document(
    request: Request,
    tenant_id: Optional[str] = None,  # Optional in dev, ignored in prod
    kb_id: Optional[str] = None,
    user_id: Optional[str] = None,  # Optional in dev, ignored in prod
    file_name: Optional[str] = None
):
    """Delete a document from the knowledge base."""
    # SECURITY: Get tenant_id and user_id from auth context
    auth_context = await get_auth_context(request)
    tenant_id_from_auth = auth_context.get("tenant_id")
    user_id_from_auth = auth_context.get("user_id")
    
    if settings.ENV == "prod":
        if not tenant_id_from_auth or not user_id_from_auth:
            raise HTTPException(
                status_code=403,
                detail="tenant_id and user_id must come from authentication token in production mode"
            )
        tenant_id = tenant_id_from_auth
        user_id = user_id_from_auth
    else:
        tenant_id = tenant_id or tenant_id_from_auth
        user_id = user_id or user_id_from_auth
        if not tenant_id or not kb_id or not user_id or not file_name:
            raise HTTPException(
                status_code=400,
                detail="tenant_id, kb_id, user_id, and file_name are required (provide via headers or query params)"
            )
    
    try:
        vector_store = get_vector_store()
        deleted = vector_store.delete_by_filter({
            "tenant_id": tenant_id,  # CRITICAL: Multi-tenant isolation
            "kb_id": kb_id,
            "user_id": user_id,
            "file_name": file_name
        })
        
        return {
            "success": True,
            "message": f"Deleted {deleted} chunks",
            "file_name": file_name
        }
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/kb/clear")
async def clear_kb(
    request: Request,
    tenant_id: Optional[str] = None,  # Optional in dev, ignored in prod
    kb_id: Optional[str] = None,
    user_id: Optional[str] = None  # Optional in dev, ignored in prod
):
    """Clear all documents from a knowledge base."""
    # SECURITY: Get tenant_id and user_id from auth context
    auth_context = await get_auth_context(request)
    tenant_id_from_auth = auth_context.get("tenant_id")
    user_id_from_auth = auth_context.get("user_id")
    
    if settings.ENV == "prod":
        if not tenant_id_from_auth or not user_id_from_auth:
            raise HTTPException(
                status_code=403,
                detail="tenant_id and user_id must come from authentication token in production mode"
            )
        tenant_id = tenant_id_from_auth
        user_id = user_id_from_auth
    else:
        tenant_id = tenant_id or tenant_id_from_auth
        user_id = user_id or user_id_from_auth
        if not tenant_id or not kb_id or not user_id:
            raise HTTPException(
                status_code=400,
                detail="tenant_id, kb_id, and user_id are required"
            )
    try:
        vector_store = get_vector_store()
        deleted = vector_store.delete_by_filter({
            "tenant_id": tenant_id,  # CRITICAL: Multi-tenant isolation
            "kb_id": kb_id,
            "user_id": user_id
        })
        
        return {
            "success": True,
            "message": f"Cleared knowledge base. Deleted {deleted} chunks.",
            "kb_id": kb_id
        }
    except Exception as e:
        logger.error(f"Error clearing KB: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Chat Endpoints ==============

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute", key_func=get_tenant_rate_limit_key)
async def chat(chat_request: ChatRequest, request: Request):
    """
    Process a chat message using RAG.
    
    - Retrieves relevant context from knowledge base
    - Generates answer using LLM
    - Returns answer with citations
    """
    conversation_id = "unknown"
    try:
        logger.info(f"=== CHAT REQUEST RECEIVED ===")
        logger.info(f"Request body: tenant_id={chat_request.tenant_id}, user_id={chat_request.user_id}, kb_id={chat_request.kb_id}, question_length={len(chat_request.question)}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        # SECURITY: Get tenant_id and user_id from auth context
        # In PROD: MUST come from JWT token (never from request body)
        try:
            auth_context = await get_auth_context(request)
        except Exception as e:
            logger.error(f"Error getting auth context: {e}", exc_info=True)
            raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")
        
        tenant_id_from_auth = auth_context.get("tenant_id")
        user_id_from_auth = auth_context.get("user_id")
        
        if settings.ENV == "prod":
            if not tenant_id_from_auth or not user_id_from_auth:
                raise HTTPException(
                    status_code=403,
                    detail="tenant_id and user_id must come from authentication token in production mode"
                )
            # Override request values with auth context (security enforcement)
            chat_request.tenant_id = tenant_id_from_auth
            chat_request.user_id = user_id_from_auth
        else:
            # DEV mode: use from request if provided, otherwise from auth context
            if not chat_request.tenant_id:
                chat_request.tenant_id = tenant_id_from_auth
            if not chat_request.user_id:
                chat_request.user_id = user_id_from_auth
            if not chat_request.tenant_id or not chat_request.user_id:
                raise HTTPException(
                    status_code=400,
                    detail="tenant_id and user_id are required (provide via X-Tenant-Id/X-User-Id headers or request body)"
                )
        
        # Log without PII in production
        if settings.ENV == "prod":
            logger.info(f"Chat request: tenant={chat_request.tenant_id}, user={chat_request.user_id}, kb={chat_request.kb_id}, q_length={len(chat_request.question)}")
        else:
            logger.info(f"Chat request: tenant={chat_request.tenant_id}, user={chat_request.user_id}, kb={chat_request.kb_id}, q={chat_request.question[:50]}...")
        
        # Generate conversation ID if not provided
        conversation_id = chat_request.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
        
        # Get database session
        try:
            db = next(get_db())
        except Exception as e:
            logger.error(f"Database connection error: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        try:
            # Ensure tenant exists in billing DB
            ensure_tenant_exists(db, chat_request.tenant_id)
            
            # Check quota BEFORE making LLM call
            has_quota, quota_error = check_quota(db, chat_request.tenant_id)
            if not has_quota:
                logger.warning(f"Quota exceeded for tenant {chat_request.tenant_id}")
                raise HTTPException(
                    status_code=402,
                    detail=quota_error or "AI quota exceeded. Upgrade your plan."
                )
            
            # Retrieve relevant context
            retrieval_service = get_retrieval_service()
            results, confidence, has_relevant = retrieval_service.retrieve(
                query=chat_request.question,
                tenant_id=chat_request.tenant_id,  # CRITICAL: Multi-tenant isolation
                kb_id=chat_request.kb_id,
                user_id=chat_request.user_id
            )
            
            logger.info(f"Retrieval results: {len(results)} results, confidence={confidence:.3f}, has_relevant={has_relevant}")
            
            # Format context for LLM
            context, citations_info = retrieval_service.get_context_for_llm(results)
            
            logger.info(f"Formatted context length: {len(context)} chars, citations: {len(citations_info)}")
            
            # Generate answer
            answer_service = get_answer_service()
            answer_result = answer_service.generate_answer(
                question=chat_request.question,
                context=context,
                citations_info=citations_info,
                confidence=confidence,
                has_relevant_results=has_relevant
            )
            
            # Track usage if LLM was called (usage info present)
            usage_info = answer_result.get("usage")
            if usage_info:
                try:
                    track_usage(
                        db=db,
                        tenant_id=chat_request.tenant_id,
                        user_id=chat_request.user_id,
                        kb_id=chat_request.kb_id,
                        provider=settings.LLM_PROVIDER,
                        model=usage_info.get("model_used", settings.GEMINI_MODEL if settings.LLM_PROVIDER == "gemini" else settings.OPENAI_MODEL),
                        prompt_tokens=usage_info.get("prompt_tokens", 0),
                        completion_tokens=usage_info.get("completion_tokens", 0)
                    )
                except Exception as e:
                    logger.error(f"Failed to track usage: {e}", exc_info=True)
                    # Don't fail the request if usage tracking fails
            
            # Build metadata with refusal info
            metadata = {
                "chunks_retrieved": len(results),
                "kb_id": chat_request.kb_id
            }
            if "refused" in answer_result:
                metadata["refused"] = answer_result["refused"]
            if "refusal_reason" in answer_result:
                metadata["refusal_reason"] = answer_result["refusal_reason"]
            if "verifier_passed" in answer_result:
                metadata["verifier_passed"] = answer_result["verifier_passed"]
            
            return ChatResponse(
                success=True,
                answer=answer_result["answer"],
                citations=answer_result["citations"],
                confidence=answer_result["confidence"],
                from_knowledge_base=answer_result["from_knowledge_base"],
                escalation_suggested=answer_result["escalation_suggested"],
                conversation_id=conversation_id,
                refused=answer_result.get("refused", False),
                metadata=metadata
            )
            
        except ValueError as e:
            # API key or configuration error
            error_msg = str(e)
            logger.error(f"Configuration error: {error_msg}")
            if "API key" in error_msg.lower():
                return ChatResponse(
                    success=False,
                    answer="⚠️ LLM API key not configured. Please set GEMINI_API_KEY in your .env file. Retrieval is working, but answer generation requires an API key.",
                    citations=[],
                    confidence=0.0,
                    from_knowledge_base=False,
                    escalation_suggested=True,
                    conversation_id=conversation_id,
                    metadata={"error": error_msg, "error_type": "configuration"}
                )
            else:
                return ChatResponse(
                    success=False,
                    answer=f"Configuration error: {error_msg}",
                    citations=[],
                    confidence=0.0,
                    from_knowledge_base=False,
                    escalation_suggested=True,
                    conversation_id=conversation_id,
                    metadata={"error": error_msg}
                )
        except HTTPException:
            # Re-raise HTTP exceptions (they have proper status codes)
            raise
        except Exception as e:
            logger.error(f"Chat error: {e}", exc_info=True)
            logger.error(f"Error type: {type(e).__name__}", exc_info=True)
            return ChatResponse(
                success=False,
                answer=f"I encountered an error processing your request: {str(e)}. Please check the server logs for details.",
                citations=[],
                confidence=0.0,
                from_knowledge_base=False,
                escalation_suggested=True,
                conversation_id=conversation_id,
                metadata={"error": str(e), "error_type": type(e).__name__}
            )
    except HTTPException:
        # Re-raise HTTP exceptions from outer try block
        raise
    except Exception as e:
        logger.error(f"Outer chat error: {e}", exc_info=True)
        return ChatResponse(
            success=False,
            answer=f"I encountered an error processing your request: {str(e)}. Please check the server logs for details.",
            citations=[],
            confidence=0.0,
            from_knowledge_base=False,
            escalation_suggested=True,
            conversation_id=conversation_id,
            metadata={"error": str(e), "error_type": type(e).__name__}
        )


# ============== Utility Endpoints ==============

@app.get("/kb/search")
@limiter.limit("30/minute", key_func=get_tenant_rate_limit_key)
async def search_kb(
    request: Request,
    query: str,
    tenant_id: Optional[str] = None,  # Optional in dev, ignored in prod
    kb_id: Optional[str] = None,
    user_id: Optional[str] = None,  # Optional in dev, ignored in prod
    top_k: int = 5
):
    """
    Search the knowledge base without generating an answer.
    Useful for debugging and testing retrieval.
    """
    # SECURITY: Extract tenant_id from auth token in production
    if settings.ENV == "prod":
        auth_context = await require_auth(request)
        tenant_id = auth_context.get("tenant_id")
        user_id = auth_context.get("user_id")
        if not tenant_id or not user_id:
            raise HTTPException(
                status_code=403,
                detail="tenant_id and user_id must come from authentication token in production mode"
            )
    elif not tenant_id or not kb_id or not user_id:
        raise HTTPException(
            status_code=400,
            detail="tenant_id, kb_id, and user_id are required"
        )
    
    try:
        retrieval_service = get_retrieval_service()
        results, confidence, has_relevant = retrieval_service.retrieve(
            query=query,
            tenant_id=tenant_id,  # CRITICAL: Multi-tenant isolation
            kb_id=kb_id,
            user_id=user_id,
            top_k=top_k
        )
        
        return {
            "success": True,
            "results": [
                {
                    "chunk_id": r.chunk_id,
                    "content": r.content[:500] + "..." if len(r.content) > 500 else r.content,
                    "metadata": r.metadata,
                    "similarity_score": r.similarity_score
                }
                for r in results
            ],
            "confidence": confidence,
            "has_relevant_results": has_relevant
        }
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Billing & Usage Endpoints ==============

@app.get("/billing/usage", response_model=UsageResponse)
async def get_usage(
    request: Request,
    range: str = "month",  # "day" or "month"
    year: Optional[int] = None,
    month: Optional[int] = None,
    day: Optional[int] = None
):
    """
    Get usage statistics for the current tenant.
    
    Args:
        range: "day" or "month"
        year: Year (optional, defaults to current)
        month: Month 1-12 (optional, defaults to current)
        day: Day 1-31 (optional, defaults to current, only for range="day")
    """
    # Get tenant from auth
    auth_context = await get_auth_context(request)
    tenant_id = auth_context.get("tenant_id")
    
    if not tenant_id:
        raise HTTPException(status_code=403, detail="tenant_id required")
    
    db = next(get_db())
    
    try:
        from app.db.models import UsageDaily, UsageMonthly
        from datetime import datetime
        from calendar import monthrange
        
        now = datetime.utcnow()
        target_year = year or now.year
        target_month = month or now.month
        
        if range == "day":
            target_day = day or now.day
            date_start = datetime(target_year, target_month, target_day)
            
            daily = db.query(UsageDaily).filter(
                UsageDaily.tenant_id == tenant_id,
                UsageDaily.date == date_start
            ).first()
            
            if not daily:
                return UsageResponse(
                    tenant_id=tenant_id,
                    period="day",
                    total_requests=0,
                    total_tokens=0,
                    total_cost_usd=0.0,
                    start_date=date_start,
                    end_date=date_start
                )
            
            return UsageResponse(
                tenant_id=tenant_id,
                period="day",
                total_requests=daily.total_requests,
                total_tokens=daily.total_tokens,
                total_cost_usd=daily.total_cost_usd,
                gemini_requests=daily.gemini_requests,
                openai_requests=daily.openai_requests,
                start_date=daily.date,
                end_date=daily.date
            )
        else:  # month
            monthly = db.query(UsageMonthly).filter(
                UsageMonthly.tenant_id == tenant_id,
                UsageMonthly.year == target_year,
                UsageMonthly.month == target_month
            ).first()
            
            if not monthly:
                # Calculate date range for the month
                _, last_day = monthrange(target_year, target_month)
                start_date = datetime(target_year, target_month, 1)
                end_date = datetime(target_year, target_month, last_day)
                
                return UsageResponse(
                    tenant_id=tenant_id,
                    period="month",
                    total_requests=0,
                    total_tokens=0,
                    total_cost_usd=0.0,
                    start_date=start_date,
                    end_date=end_date
                )
            
            _, last_day = monthrange(monthly.year, monthly.month)
            start_date = datetime(monthly.year, monthly.month, 1)
            end_date = datetime(monthly.year, monthly.month, last_day)
            
            return UsageResponse(
                tenant_id=tenant_id,
                period="month",
                total_requests=monthly.total_requests,
                total_tokens=monthly.total_tokens,
                total_cost_usd=monthly.total_cost_usd,
                gemini_requests=monthly.gemini_requests,
                openai_requests=monthly.openai_requests,
                start_date=start_date,
                end_date=end_date
            )
    except Exception as e:
        logger.error(f"Error getting usage: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/billing/limits", response_model=PlanLimitsResponse)
async def get_limits(request: Request):
    """Get current plan limits and usage for the tenant."""
    # Get tenant from auth
    auth_context = await get_auth_context(request)
    tenant_id = auth_context.get("tenant_id")
    
    if not tenant_id:
        raise HTTPException(status_code=403, detail="tenant_id required")
    
    db = next(get_db())
    
    try:
        from app.billing.quota import get_tenant_plan, get_monthly_usage
        from datetime import datetime
        
        plan = get_tenant_plan(db, tenant_id)
        if not plan:
            # Default to starter
            plan_name = "starter"
            monthly_limit = 500
        else:
            plan_name = plan.plan_name
            monthly_limit = plan.monthly_chat_limit
        
        # Get current month usage
        now = datetime.utcnow()
        monthly_usage = get_monthly_usage(db, tenant_id, now.year, now.month)
        current_usage = monthly_usage.total_requests if monthly_usage else 0
        
        remaining = None if monthly_limit == -1 else max(0, monthly_limit - current_usage)
        
        return PlanLimitsResponse(
            tenant_id=tenant_id,
            plan_name=plan_name,
            monthly_chat_limit=monthly_limit,
            current_month_usage=current_usage,
            remaining_chats=remaining
        )
    except Exception as e:
        logger.error(f"Error getting limits: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/billing/plan")
async def set_plan(request_body: SetPlanRequest, http_request: Request):
    """
    Set tenant's subscription plan (admin only in production).
    
    In dev mode, allows any tenant to set their plan.
    In prod mode, should be restricted to admin users.
    """
    # Get tenant from auth
    auth_context = await get_auth_context(http_request)
    auth_tenant_id = auth_context.get("tenant_id")
    
    # In prod, verify admin role (placeholder - implement actual admin check)
    if settings.ENV == "prod":
        # TODO: Add admin role check
        if auth_tenant_id != request_body.tenant_id:
            raise HTTPException(status_code=403, detail="Cannot set plan for other tenants")
    
    db = next(get_db())
    
    try:
        from app.billing.quota import set_tenant_plan
        
        plan = set_tenant_plan(db, request_body.tenant_id, request_body.plan_name)
        
        return {
            "success": True,
            "tenant_id": request_body.tenant_id,
            "plan_name": plan.plan_name,
            "monthly_chat_limit": plan.monthly_chat_limit
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error setting plan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/billing/cost-report", response_model=CostReportResponse)
async def get_cost_report(
    request: Request,
    range: str = "month",
    year: Optional[int] = None,
    month: Optional[int] = None
):
    """Get cost report with breakdown by provider and model."""
    # Get tenant from auth
    auth_context = await get_auth_context(request)
    tenant_id = auth_context.get("tenant_id")
    
    if not tenant_id:
        raise HTTPException(status_code=403, detail="tenant_id required")
    
    db = next(get_db())
    
    try:
        from app.db.models import UsageEvent
        from datetime import datetime
        from sqlalchemy import func, and_
        
        now = datetime.utcnow()
        target_year = year or now.year
        target_month = month or now.month
        
        # Query usage events for the period
        if range == "month":
            query = db.query(UsageEvent).filter(
                and_(
                    UsageEvent.tenant_id == tenant_id,
                    func.extract('year', UsageEvent.request_timestamp) == target_year,
                    func.extract('month', UsageEvent.request_timestamp) == target_month
                )
            )
        else:  # all time
            query = db.query(UsageEvent).filter(UsageEvent.tenant_id == tenant_id)
        
        events = query.all()
        
        # Calculate totals
        total_cost = sum(e.estimated_cost_usd for e in events)
        total_requests = len(events)
        total_tokens = sum(e.total_tokens for e in events)
        
        # Breakdown by provider
        breakdown_by_provider = {}
        for event in events:
            provider = event.provider
            if provider not in breakdown_by_provider:
                breakdown_by_provider[provider] = {
                    "requests": 0,
                    "tokens": 0,
                    "cost_usd": 0.0
                }
            breakdown_by_provider[provider]["requests"] += 1
            breakdown_by_provider[provider]["tokens"] += event.total_tokens
            breakdown_by_provider[provider]["cost_usd"] += event.estimated_cost_usd
        
        # Breakdown by model
        breakdown_by_model = {}
        for event in events:
            model = event.model
            if model not in breakdown_by_model:
                breakdown_by_model[model] = {
                    "requests": 0,
                    "tokens": 0,
                    "cost_usd": 0.0
                }
            breakdown_by_model[model]["requests"] += 1
            breakdown_by_model[model]["tokens"] += event.total_tokens
            breakdown_by_model[model]["cost_usd"] += event.estimated_cost_usd
        
        return CostReportResponse(
            tenant_id=tenant_id,
            period=range,
            total_cost_usd=total_cost,
            total_requests=total_requests,
            total_tokens=total_tokens,
            breakdown_by_provider=breakdown_by_provider,
            breakdown_by_model=breakdown_by_model
        )
    except Exception as e:
        logger.error(f"Error getting cost report: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

