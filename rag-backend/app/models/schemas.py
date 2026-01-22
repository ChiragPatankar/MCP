"""
Pydantic models for API request/response schemas.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ChunkMetadata(BaseModel):
    """Metadata for a document chunk."""
    tenant_id: str  # CRITICAL: Multi-tenant isolation
    kb_id: str
    user_id: str
    file_name: str
    file_type: str
    chunk_id: str
    chunk_index: int
    page_number: Optional[int] = None
    total_chunks: int
    document_id: Optional[str] = None  # Track original document
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DocumentChunk(BaseModel):
    """A chunk of text with metadata."""
    id: str
    content: str
    metadata: ChunkMetadata
    embedding: Optional[List[float]] = None


class UploadRequest(BaseModel):
    """Request model for file upload."""
    tenant_id: str  # CRITICAL: Multi-tenant isolation
    user_id: str
    kb_id: str


class UploadResponse(BaseModel):
    """Response model for file upload."""
    success: bool
    message: str
    document_id: Optional[str] = None
    file_name: str
    chunks_created: int = 0
    status: DocumentStatus = DocumentStatus.PENDING


class Citation(BaseModel):
    """Citation reference for an answer."""
    file_name: str
    chunk_id: str
    page_number: Optional[int] = None
    relevance_score: float
    excerpt: str  # Short excerpt from the chunk


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    tenant_id: str  # CRITICAL: Multi-tenant isolation
    user_id: str
    kb_id: str
    conversation_id: Optional[str] = None
    question: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    success: bool
    answer: str
    citations: List[Citation] = []
    confidence: float  # 0-1 score
    from_knowledge_base: bool = True
    escalation_suggested: bool = False
    conversation_id: str
    metadata: Dict[str, Any] = {}


class RetrievalResult(BaseModel):
    """Result from vector store retrieval."""
    chunk_id: str
    content: str
    metadata: Dict[str, Any]
    similarity_score: float


class KnowledgeBaseStats(BaseModel):
    """Statistics for a knowledge base."""
    tenant_id: str  # CRITICAL: Multi-tenant isolation
    kb_id: str
    user_id: str
    total_documents: int
    total_chunks: int
    file_names: List[str]
    last_updated: Optional[datetime] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str = "1.0.0"
    vector_db_connected: bool
    llm_configured: bool

