"""
Configuration settings for the RAG backend.
"""
from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # App settings
    APP_NAME: str = "ClientSphere RAG Backend"
    DEBUG: bool = True
    ENV: str = "dev"  # "dev" or "prod" - controls tenant_id security
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    UPLOADS_DIR: Path = DATA_DIR / "uploads"
    PROCESSED_DIR: Path = DATA_DIR / "processed"
    VECTORDB_DIR: Path = DATA_DIR / "vectordb"
    
    # Chunking settings (optimized for retrieval quality)
    CHUNK_SIZE: int = 600  # tokens (increased for better context)
    CHUNK_OVERLAP: int = 150  # tokens (increased for better continuity)
    MIN_CHUNK_SIZE: int = 100  # minimum tokens per chunk (increased to avoid tiny chunks)
    
    # Embedding settings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"  # Fast, good quality
    EMBEDDING_DIMENSION: int = 384
    
    # Vector store settings
    COLLECTION_NAME: str = "clientsphere_kb"
    
    # Retrieval settings (optimized for maximum confidence)
    TOP_K: int = 10  # Number of chunks to retrieve (increased to maximize chance of finding strong matches)
    SIMILARITY_THRESHOLD: float = 0.15  # Minimum similarity score (0-1) - lowered to include more potentially relevant chunks
    SIMILARITY_THRESHOLD_STRICT: float = 0.45  # Strict threshold for answer generation (anti-hallucination)
    
    # LLM settings
    LLM_PROVIDER: str = "gemini"  # Options: "gemini", "openai"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"  # Use latest stable model
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Response settings
    MAX_CONTEXT_TOKENS: int = 2500  # Max tokens for context in prompt (reduced for focus)
    TEMPERATURE: float = 0.0  # Zero temperature for maximum determinism (anti-hallucination)
    REQUIRE_VERIFIER: bool = True  # Always use verifier for hallucination prevention
    
    # Security settings
    MAX_FILE_SIZE_MB: int = 50  # Maximum file size in MB
    ALLOWED_ORIGINS: str = "*"  # CORS allowed origins (comma-separated, use "*" for all)
    RATE_LIMIT_PER_MINUTE: int = 60  # Rate limit per user per minute
    JWT_SECRET: Optional[str] = None  # JWT secret for authentication
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True  # Enable/disable rate limiting
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Create directories if they don't exist
        self.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
        self.PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
        self.VECTORDB_DIR.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()

