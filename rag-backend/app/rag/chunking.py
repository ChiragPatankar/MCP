"""
Document chunking with overlap and metadata preservation.
"""
import tiktoken
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import re
import uuid
from datetime import datetime

from app.config import settings


@dataclass
class TextChunk:
    """Represents a chunk of text with metadata."""
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    page_number: Optional[int] = None
    token_count: int = 0


class DocumentChunker:
    """
    Chunks documents into smaller pieces with overlap.
    Uses tiktoken for accurate token counting.
    """
    
    def __init__(
        self,
        chunk_size: int = settings.CHUNK_SIZE,
        chunk_overlap: int = settings.CHUNK_OVERLAP,
        min_chunk_size: int = settings.MIN_CHUNK_SIZE
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size
        # Use cl100k_base encoding (same as GPT-4, good general purpose)
        self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.encoding.encode(text))
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences while preserving structure."""
        # Split on sentence boundaries but keep delimiters
        sentence_endings = r'(?<=[.!?])\s+'
        sentences = re.split(sentence_endings, text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _split_into_paragraphs(self, text: str) -> List[str]:
        """Split text into paragraphs."""
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]
    
    def chunk_text(
        self,
        text: str,
        page_numbers: Optional[Dict[int, int]] = None  # char_position -> page_number
    ) -> List[TextChunk]:
        """
        Chunk text into smaller pieces with overlap.
        
        Args:
            text: The text to chunk
            page_numbers: Optional mapping of character positions to page numbers
            
        Returns:
            List of TextChunk objects
        """
        if not text.strip():
            return []
        
        chunks = []
        current_chunk = ""
        current_start = 0
        chunk_index = 0
        
        # First, split into paragraphs for natural boundaries
        paragraphs = self._split_into_paragraphs(text)
        
        char_position = 0
        for para in paragraphs:
            para_tokens = self.count_tokens(para)
            current_tokens = self.count_tokens(current_chunk)
            
            # If adding this paragraph exceeds chunk size
            if current_tokens + para_tokens > self.chunk_size and current_chunk:
                # Save current chunk if it meets minimum size
                if current_tokens >= self.min_chunk_size:
                    page_num = None
                    if page_numbers:
                        # Find the page number for this chunk's start position
                        for pos, page in sorted(page_numbers.items()):
                            if pos <= current_start:
                                page_num = page
                    
                    chunks.append(TextChunk(
                        content=current_chunk.strip(),
                        chunk_index=chunk_index,
                        start_char=current_start,
                        end_char=char_position,
                        page_number=page_num,
                        token_count=current_tokens
                    ))
                    chunk_index += 1
                
                # Start new chunk with overlap
                overlap_text = self._get_overlap_text(current_chunk)
                current_chunk = overlap_text + "\n\n" + para if overlap_text else para
                current_start = char_position - len(overlap_text) if overlap_text else char_position
            else:
                # Add paragraph to current chunk
                if current_chunk:
                    current_chunk += "\n\n" + para
                else:
                    current_chunk = para
                    current_start = char_position
            
            char_position += len(para) + 2  # +2 for paragraph separator
        
        # Don't forget the last chunk
        if current_chunk and self.count_tokens(current_chunk) >= self.min_chunk_size:
            page_num = None
            if page_numbers:
                for pos, page in sorted(page_numbers.items()):
                    if pos <= current_start:
                        page_num = page
            
            chunks.append(TextChunk(
                content=current_chunk.strip(),
                chunk_index=chunk_index,
                start_char=current_start,
                end_char=len(text),
                page_number=page_num,
                token_count=self.count_tokens(current_chunk)
            ))
        
        return chunks
    
    def _get_overlap_text(self, text: str) -> str:
        """Get the overlap text from the end of a chunk."""
        sentences = self._split_into_sentences(text)
        if not sentences:
            return ""
        
        overlap = ""
        tokens = 0
        
        # Work backwards through sentences
        for sentence in reversed(sentences):
            sentence_tokens = self.count_tokens(sentence)
            if tokens + sentence_tokens <= self.chunk_overlap:
                overlap = sentence + " " + overlap if overlap else sentence
                tokens += sentence_tokens
            else:
                break
        
        return overlap.strip()
    
    def create_chunk_metadata(
        self,
        chunk: TextChunk,
        tenant_id: str,  # CRITICAL: Multi-tenant isolation
        kb_id: str,
        user_id: str,
        file_name: str,
        file_type: str,
        total_chunks: int,
        document_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create metadata dictionary for a chunk."""
        chunk_id = f"{tenant_id}_{kb_id}_{file_name}_{chunk.chunk_index}_{uuid.uuid4().hex[:8]}"
        
        return {
            "tenant_id": tenant_id,  # CRITICAL: Multi-tenant isolation
            "kb_id": kb_id,
            "user_id": user_id,
            "file_name": file_name,
            "file_type": file_type,
            "chunk_id": chunk_id,
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number,
            "total_chunks": total_chunks,
            "token_count": chunk.token_count,
            "document_id": document_id,  # Track original document
            "created_at": datetime.utcnow().isoformat()
        }


# Global chunker instance
chunker = DocumentChunker()

