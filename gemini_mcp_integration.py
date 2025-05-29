# Modified MCP Server with Google Gemini Integration
# Replace your existing AI integration with this code

import os
import google.generativeai as genai
from typing import Dict, Any, List
import json
import asyncio
import aiohttp

class GeminiMCPServer:
    def __init__(self):
        # Configure Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-1.5-flash')  # Fast and free
        
    async def process_query(self, query: str, tenant_id: str, priority: str = 'medium') -> Dict[str, Any]:
        """
        Process a single query using Gemini
        """
        try:
            # Enhanced prompt for customer support
            enhanced_prompt = f"""
            You are an AI customer support assistant. 
            
            Customer Query: {query}
            Tenant ID: {tenant_id}
            
            Please provide a helpful, accurate, and professional response.
            Focus on solving the customer's problem clearly and concisely.
            
            Response:
            """
            
            # Generate response with Gemini
            response = await self._generate_with_gemini(enhanced_prompt)
            
            return {
                'response': response,
                'tenant_id': tenant_id,
                'query': query,
                'model_used': 'gemini-1.5-flash',
                'status': 'success',
                'timestamp': self._get_timestamp()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error',
                'tenant_id': tenant_id,
                'query': query
            }
    
    async def process_batch(self, queries: List[str], tenant_id: str) -> List[Dict[str, Any]]:
        """
        Process multiple queries in batch
        """
        results = []
        
        # Process queries concurrently for better performance
        tasks = [
            self.process_query(query, tenant_id) 
            for query in queries
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return [
            result if not isinstance(result, Exception) 
            else {'error': str(result), 'status': 'error'} 
            for result in results
        ]
    
    async def _generate_with_gemini(self, prompt: str) -> str:
        """
        Generate response using Gemini API
        """
        try:
            # Use async generation for better performance
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=1000,
                    top_p=0.8,
                )
            )
            
            return response.text.strip()
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.utcnow().isoformat()

# FastAPI Integration
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="Gemini-Powered MCP Server",
    description="AI Customer Support Bot using Google Gemini",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini server
gemini_server = GeminiMCPServer()

# Request models
class QueryRequest(BaseModel):
    query: str
    priority: Optional[str] = 'medium'
    mcp_version: Optional[str] = '1.0'
    tenant_id: Optional[str] = 'default'

class BatchRequest(BaseModel):
    queries: List[str]
    mcp_version: Optional[str] = '1.0'
    tenant_id: Optional[str] = 'default'

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "Gemini-Powered MCP Server",
        "version": "2.0.0",
        "status": "running",
        "ai_provider": "Google Gemini"
    }

@app.get("/mcp/version")
async def get_version():
    return {"mcp_version": "1.0", "supported_versions": ["1.0"]}

@app.get("/mcp/capabilities")
async def get_capabilities():
    return {
        "capabilities": {
            "single_query_processing": True,
            "batch_processing": True,
            "priority_queuing": True,
            "tenant_isolation": True,
            "real_time_responses": True
        },
        "ai_provider": "Google Gemini",
        "models": ["gemini-1.5-flash", "gemini-1.5-pro"],
        "max_context_length": 1000000,  # Gemini's large context window
        "supported_languages": ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"]
    }

@app.post("/mcp/process")
async def process_query(
    request: QueryRequest,
    x_mcp_auth: Optional[str] = None,
    x_mcp_version: Optional[str] = None
):
    """Process a single customer support query"""
    try:
        result = await gemini_server.process_query(
            query=request.query,
            tenant_id=request.tenant_id,
            priority=request.priority
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mcp/batch")
async def process_batch(
    request: BatchRequest,
    x_mcp_auth: Optional[str] = None,
    x_mcp_version: Optional[str] = None
):
    """Process multiple queries in batch"""
    try:
        results = await gemini_server.process_batch(
            queries=request.queries,
            tenant_id=request.tenant_id
        )
        return {
            "results": results,
            "total_processed": len(results),
            "batch_id": f"batch_{request.tenant_id}_{int(asyncio.get_event_loop().time())}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/mcp/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Gemini connection
        test_response = await gemini_server._generate_with_gemini("Hello")
        
        return {
            "status": "healthy",
            "ai_provider": "Google Gemini",
            "gemini_status": "connected" if test_response else "disconnected",
            "timestamp": gemini_server._get_timestamp(),
            "version": "2.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": gemini_server._get_timestamp()
        }

if __name__ == "__main__":
    import uvicorn
    
    # Check for required environment variables
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ Error: GEMINI_API_KEY environment variable is required")
        print("Get your free key at: https://aistudio.google.com/app/apikey")
        exit(1)
    
    print("🚀 Starting Gemini-Powered MCP Server...")
    print("📚 Get your free Gemini API key at: https://aistudio.google.com/app/apikey")
    
    uvicorn.run(
        "app:app",  # Adjust if your file is named differently
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 