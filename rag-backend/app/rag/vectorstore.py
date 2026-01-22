"""
Vector store using ChromaDB for local storage.
Supports efficient similarity search and filtering.
"""
import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
import logging
from pathlib import Path

from app.config import settings
from app.rag.embeddings import get_embedding_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VectorStore:
    """
    Vector store using ChromaDB for persistent local storage.
    Supports CRUD operations and similarity search.
    """
    
    def __init__(
        self,
        persist_directory: Path = settings.VECTORDB_DIR,
        collection_name: str = settings.COLLECTION_NAME
    ):
        """
        Initialize the vector store.
        
        Args:
            persist_directory: Directory to persist the database
            collection_name: Name of the collection to use
        """
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        
        # Initialize ChromaDB client with persistence
        self.client = chromadb.PersistentClient(
            path=str(persist_directory),
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}  # Use cosine similarity
        )
        
        logger.info(f"Vector store initialized. Collection: {collection_name}, Items: {self.collection.count()}")
    
    def add_documents(
        self,
        documents: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        ids: List[str]
    ) -> None:
        """
        Add documents to the vector store.
        
        Args:
            documents: List of document texts
            embeddings: List of embedding vectors
            metadatas: List of metadata dictionaries
            ids: List of unique document IDs
        """
        if not documents:
            logger.warning("No documents to add")
            return
        
        # ChromaDB doesn't accept None values in metadata
        clean_metadatas = []
        for meta in metadatas:
            clean_meta = {}
            for k, v in meta.items():
                if v is not None:
                    clean_meta[k] = v
            clean_metadatas.append(clean_meta)
        
        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=clean_metadatas,
            ids=ids
        )
        
        logger.info(f"Added {len(documents)} documents to vector store")
    
    def search(
        self,
        query_embedding: List[float],
        top_k: int = settings.TOP_K,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            filter_dict: Optional filter criteria (e.g., {"kb_id": "123"})
            
        Returns:
            List of results with document, metadata, and similarity score
        """
        # ChromaDB requires filters in $and/$or format for multiple conditions
        where_filter = None
        if filter_dict:
            if len(filter_dict) == 1:
                # Single condition - use directly
                where_filter = filter_dict
            else:
                # Multiple conditions - use $and operator
                where_filter = {
                    "$and": [
                        {k: v} for k, v in filter_dict.items()
                    ]
                }
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        formatted_results = []
        if results and results['ids'] and results['ids'][0]:
            for i, doc_id in enumerate(results['ids'][0]):
                # ChromaDB returns distances, convert to similarity
                # For cosine distance: similarity = 1 - distance
                distance = results['distances'][0][i] if results['distances'] else 0
                similarity = 1 - distance  # Convert distance to similarity
                
                formatted_results.append({
                    'id': doc_id,
                    'content': results['documents'][0][i] if results['documents'] else "",
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'similarity_score': max(0, min(1, similarity))  # Clamp to 0-1
                })
        
        return formatted_results
    
    def delete_by_filter(self, filter_dict: Dict[str, Any]) -> int:
        """
        Delete documents matching a filter.
        
        Args:
            filter_dict: Filter criteria
            
        Returns:
            Number of documents deleted
        """
        # ChromaDB requires filters in $and/$or format for multiple conditions
        where_filter = None
        if len(filter_dict) == 1:
            where_filter = filter_dict
        else:
            where_filter = {
                "$and": [
                    {k: v} for k, v in filter_dict.items()
                ]
            }
        
        # First, find matching documents
        results = self.collection.get(
            where=where_filter,
            include=["metadatas"]
        )
        
        if results and results['ids']:
            self.collection.delete(ids=results['ids'])
            logger.info(f"Deleted {len(results['ids'])} documents matching filter")
            return len(results['ids'])
        
        return 0
    
    def delete_by_ids(self, ids: List[str]) -> None:
        """Delete documents by their IDs."""
        if ids:
            self.collection.delete(ids=ids)
            logger.info(f"Deleted {len(ids)} documents by ID")
    
    def get_stats(
        self, 
        tenant_id: Optional[str] = None,  # CRITICAL: Multi-tenant isolation
        kb_id: Optional[str] = None, 
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get statistics about the vector store.
        
        Args:
            tenant_id: Tenant ID for multi-tenant isolation (REQUIRED if filtering)
            kb_id: Optional knowledge base ID to filter
            user_id: Optional user ID to filter
            
        Returns:
            Statistics dictionary
        """
        filter_dict = {}
        if tenant_id:
            filter_dict["tenant_id"] = tenant_id  # CRITICAL: Multi-tenant isolation
        if kb_id:
            filter_dict["kb_id"] = kb_id
        if user_id:
            filter_dict["user_id"] = user_id
        
        if filter_dict:
            # ChromaDB requires filters in $and/$or format for multiple conditions
            where_filter = None
            if len(filter_dict) == 1:
                where_filter = filter_dict
            else:
                where_filter = {
                    "$and": [
                        {k: v} for k, v in filter_dict.items()
                    ]
                }
            
            results = self.collection.get(
                where=where_filter,
                include=["metadatas"]
            )
            count = len(results['ids']) if results and results['ids'] else 0
            
            # Get unique file names
            file_names = set()
            if results and results['metadatas']:
                for meta in results['metadatas']:
                    if 'file_name' in meta:
                        file_names.add(meta['file_name'])
            
            return {
                "total_chunks": count,
                "file_names": list(file_names),
                "tenant_id": tenant_id,
                "kb_id": kb_id,
                "user_id": user_id
            }
        else:
            return {
                "total_chunks": self.collection.count(),
                "collection_name": self.collection_name
            }
    
    def clear_collection(self) -> None:
        """Clear all documents from the collection."""
        self.client.delete_collection(self.collection_name)
        self.collection = self.client.create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"Cleared collection: {self.collection_name}")


# Global vector store instance
_vector_store: Optional[VectorStore] = None


def get_vector_store() -> VectorStore:
    """Get the global vector store instance."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
    return _vector_store

