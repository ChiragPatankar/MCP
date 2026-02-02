# ClientSphere RAG Platform - Complete Implementation Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [RAG Architecture Deep Dive](#rag-architecture-deep-dive)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Services](#backend-services)
6. [Database Schema](#database-schema)
7. [Authentication & Security](#authentication--security)
8. [Deployment Architecture](#deployment-architecture)
9. [API Reference](#api-reference)
10. [Widget Implementation](#widget-implementation)
11. [File Processing Pipeline](#file-processing-pipeline)
12. [Vector Database & Embeddings](#vector-database--embeddings)
13. [LLM Integration](#llm-integration)
14. [Billing & Usage Tracking](#billing--usage-tracking)
15. [Configuration & Environment](#configuration--environment)

---

## Project Overview

### Concept

**ClientSphere** is a multi-tenant RAG (Retrieval-Augmented Generation) platform that enables businesses to create AI-powered customer support chatbots trained on their own knowledge base. The platform allows companies to:

- Upload documents (PDFs, DOCX, TXT, Markdown) to build a knowledge base
- Deploy a chat widget on their website
- Provide AI-powered answers with citations and confidence scores
- Track usage and manage billing per tenant

### Key Features

1. **Multi-Tenant Architecture**: Complete data isolation between tenants
2. **RAG Pipeline**: Document ingestion → Chunking → Embedding → Vector Search → LLM Generation
3. **Anti-Hallucination**: Strict prompting and verification to prevent incorrect answers
4. **Embeddable Widget**: JavaScript widget that can be embedded on any website
5. **Usage Tracking**: Token counting, cost estimation, and quota enforcement
6. **Production Ready**: Authentication, rate limiting, health checks, error handling

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Dashboard  │  │ Knowledge    │  │   Chat Test   │         │
│  │              │  │ Base Mgmt    │  │   Interface   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼───────────────┐
│         │                  │                  │                 │
│  ┌──────▼──────────┐  ┌───▼──────────┐  ┌───▼──────────┐     │
│  │  Node.js API    │  │  Node.js API │  │  Node.js API  │     │
│  │  (Session Mgmt) │  │  (Widget)    │  │  (Chat Proxy) │     │
│  └──────┬──────────┘  └───┬──────────┘  └───┬──────────┘     │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │  SQLite DB     │                          │
│                    │  (Sessions,    │                          │
│                    │   Messages)    │                          │
│                    └────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│              FastAPI RAG Backend (Python)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Document Upload → Parse → Chunk → Embed → Store         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Query → Embed → Vector Search → LLM → Answer            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  ChromaDB    │  │  Embedding    │  │  LLM Service │        │
│  │  (Vector DB) │  │  Service      │  │  (Gemini/    │        │
│  │              │  │  (Sentence    │  │   OpenAI)    │        │
│  │              │  │   Transformers│  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SQLite DB (Billing, Usage Tracking)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **Frontend (React + Vite)**
- **Location**: `src/`
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Deployment**: Cloudflare Pages

#### 2. **Node.js Backend (Session/API Layer)**
- **Location**: `server/`
- **Framework**: Express.js with TypeScript
- **Purpose**: 
  - Session management for chat widget
  - Message storage and history
  - Proxy to RAG backend
  - Widget script generation
- **Database**: SQLite (sessions, messages, tenants, users)
- **Deployment**: Cloudflare Workers or standalone server

#### 3. **FastAPI RAG Backend (AI Processing)**
- **Location**: `rag-backend/`
- **Framework**: FastAPI (Python 3.11+)
- **Purpose**:
  - Document ingestion and processing
  - Vector search and retrieval
  - LLM integration (Gemini/OpenAI)
  - Answer generation with citations
  - Billing and usage tracking
- **Database**: 
  - ChromaDB (vector storage)
  - SQLite (billing, usage)
- **Deployment**: Hugging Face Spaces (or Render/Railway)

---

## RAG Architecture Deep Dive

### RAG Pipeline Overview

The RAG (Retrieval-Augmented Generation) system follows a two-phase approach:

1. **Ingestion Phase**: Documents → Chunks → Embeddings → Vector Store
2. **Query Phase**: Question → Embedding → Vector Search → Context → LLM → Answer

### Phase 1: Document Ingestion

#### Step 1: Document Upload (`POST /kb/upload`)

```python
# Location: rag-backend/app/main.py

@app.post("/kb/upload")
async def upload_document(
    file: UploadFile,
    tenant_id: str,
    user_id: str,
    kb_id: str
):
    # 1. Validate file (type, size)
    # 2. Save to disk
    # 3. Create document record
    # 4. Trigger background processing
```

**File Validation**:
- Allowed types: PDF, DOCX, TXT, Markdown
- Max size: 50MB (configurable)
- Multi-tenant isolation: `tenant_id` required

#### Step 2: Document Parsing (`app/rag/ingest.py`)

```python
class DocumentParser:
    def parse(self, file_path: Path) -> ParsedDocument:
        # Extract text based on file type
        # - PDF: PyMuPDF (fitz)
        # - DOCX: python-docx
        # - TXT/MD: Direct read
        
        # Preserve page numbers for citations
        # Return: text + page_map (char_position → page_number)
```

**Key Features**:
- Preserves page numbers for accurate citations
- Handles multiple file formats
- Extracts metadata (file type, size)

#### Step 3: Text Chunking (`app/rag/chunking.py`)

```python
class DocumentChunker:
    def chunk_text(
        self,
        text: str,
        page_numbers: Dict[int, int]
    ) -> List[TextChunk]:
        # 1. Split into paragraphs (natural boundaries)
        # 2. Use tiktoken for accurate token counting
        # 3. Create chunks of ~600 tokens with 150 token overlap
        # 4. Preserve page numbers in chunks
        # 5. Ensure minimum chunk size (100 tokens)
```

**Chunking Strategy**:
- **Chunk Size**: 600 tokens (configurable)
- **Overlap**: 150 tokens (prevents context loss at boundaries)
- **Minimum Size**: 100 tokens (filters tiny chunks)
- **Token Counting**: Uses `tiktoken` with `cl100k_base` encoding (GPT-4 compatible)

**Why Overlap?**
- Prevents information loss at chunk boundaries
- Ensures context continuity for retrieval
- Example: If a sentence spans two chunks, it appears in both

#### Step 4: Embedding Generation (`app/rag/embeddings.py`)

```python
class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        # Lazy load SentenceTransformer model
        # Model: all-MiniLM-L6-v2 (384 dimensions)
        # Fast, good quality, optimized for semantic search
    
    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        # Batch processing for efficiency
        # Returns: List of 384-dimensional vectors
```

**Embedding Model**: `all-MiniLM-L6-v2`
- **Dimensions**: 384
- **Speed**: Fast inference (~100ms per batch)
- **Quality**: Good for semantic search
- **Size**: ~80MB (downloads on first use)

**Why This Model?**
- Optimized for semantic similarity search
- Fast enough for real-time queries
- Good balance between speed and quality
- Can be swapped for larger models (e.g., `all-mpnet-base-v2`) for better quality

#### Step 5: Vector Storage (`app/rag/vectorstore.py`)

```python
class VectorStore:
    def __init__(self):
        # Initialize ChromaDB with persistence
        self.client = chromadb.PersistentClient(
            path="data/vectordb",
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        self.collection = self.client.get_or_create_collection(
            name="clientsphere_kb",
            metadata={"hnsw:space": "cosine"}  # Cosine similarity
        )
    
    def add_documents(
        self,
        documents: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict],
        ids: List[str]
    ):
        # Store in ChromaDB with metadata
        # Metadata includes: tenant_id, kb_id, user_id, file_name, page_number
```

**ChromaDB Configuration**:
- **Similarity Metric**: Cosine similarity
- **Persistence**: Local file system (`data/vectordb/`)
- **Collection**: Single collection for all tenants (filtered by metadata)
- **Metadata**: Rich metadata for filtering and citations

**Multi-Tenant Isolation**:
- All chunks include `tenant_id` in metadata
- Vector searches always filter by `tenant_id`
- Zero risk of cross-tenant data leakage

### Phase 2: Query Processing

#### Step 1: Query Embedding

```python
# User asks: "What is your return policy?"
query_embedding = embedding_service.embed_query(query)
# Returns: 384-dimensional vector
```

#### Step 2: Vector Search (`app/rag/retrieval.py`)

```python
class RetrievalService:
    def retrieve(
        self,
        query: str,
        tenant_id: str,
        kb_id: str,
        user_id: str,
        top_k: int = 10
    ) -> Tuple[List[RetrievalResult], float, bool]:
        # 1. Generate query embedding
        query_embedding = self.embedding_service.embed_query(query)
        
        # 2. Search with filters (CRITICAL: tenant_id isolation)
        filter_dict = {
            "tenant_id": tenant_id,  # Multi-tenant isolation
            "kb_id": kb_id,
            "user_id": user_id
        }
        
        # 3. ChromaDB similarity search
        results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            filter_dict=filter_dict
        )
        
        # 4. Filter by similarity threshold (0.15)
        # 5. Calculate confidence score
        # 6. Check for direct matches (intent-based)
        
        return filtered_results, avg_confidence, has_relevant
```

**Retrieval Parameters**:
- **Top K**: 10 chunks retrieved (configurable)
- **Similarity Threshold**: 0.15 (low threshold to include more results)
- **Strict Threshold**: 0.45 (for answer generation - anti-hallucination)
- **Confidence Calculation**: Maximum of top 3 results (if >= 0.4) or weighted average

**Confidence Scoring**:
```python
# Heavy confidence mode: Use maximum similarity from top results
if max_score >= 0.4:
    avg_confidence = max_score  # Use best match
else:
    # Weighted average of top 3
    weighted_avg = sum(scores * weights) / sum(weights)
```

#### Step 3: Context Formatting

```python
def get_context_for_llm(
    results: List[RetrievalResult],
    max_tokens: int = 2500
) -> Tuple[str, List[Dict]]:
    # Format chunks with source citations
    # Example:
    # [Source 1: refund_policy.pdf] (Page 2)
    # We offer a 30-day return policy...
    
    # Build citation metadata
    # Return: formatted_context, citations_info
```

**Context Format**:
```
[Source 1: refund_policy.pdf] (Page 2)
We offer a 30-day return policy on all products. Items must be in original condition...

---

[Source 2: faq.pdf] (Page 5)
Returns can be initiated through your account dashboard or by contacting support...
```

#### Step 4: LLM Answer Generation (`app/rag/answer.py`)

```python
class AnswerService:
    def generate_answer(
        self,
        question: str,
        context: str,
        citations_info: List[Dict],
        confidence: float,
        has_relevant_results: bool
    ) -> Dict[str, Any]:
        # GATE 1: No relevant results → REFUSE
        if not has_relevant_results:
            return refusal_response()
        
        # GATE 2: Low confidence (< 0.30) → REFUSE
        if confidence < 0.30:
            return refusal_response()
        
        # GATE 3: Intent-based gating (integration/API questions)
        if "integration" in intents and confidence < 0.50:
            return refusal_response()
        
        # Generate draft answer
        draft_answer = self.provider.generate(
            system_prompt=format_draft_prompt(context, question),
            user_prompt=question
        )
        
        # Verify answer (MANDATORY)
        verification = verifier.verify_answer(
            draft_answer=draft_answer,
            context=context,
            citations_info=citations_info
        )
        
        if verification["pass"]:
            return {
                "answer": draft_answer,
                "citations": extract_citations(draft_answer, citations_info),
                "confidence": confidence,
                "from_knowledge_base": True,
                "verifier_passed": True
            }
        else:
            # Verifier failed → REFUSE
            return refusal_response()
```

**Anti-Hallucination Measures**:

1. **Strict System Prompts** (`app/rag/prompts.py`):
   ```
   You are a helpful assistant that answers questions ONLY from the provided context.
   
   RULES:
   1. If the context doesn't contain the answer, say "I don't know"
   2. Never make up information
   3. Always cite sources using [Source X]
   4. If unsure, suggest contacting support
   ```

2. **Temperature = 0.0**: Maximum determinism (no randomness)

3. **Verifier Service** (`app/rag/verifier.py`):
   - Checks if answer claims are supported by context
   - Flags unsupported claims
   - Refuses to answer if verification fails

4. **Confidence Thresholds**:
   - Retrieval threshold: 0.15 (lenient, to include more results)
   - Answer threshold: 0.30 (strict, to prevent low-quality answers)
   - Integration threshold: 0.50 (very strict for technical questions)

**LLM Providers**:

1. **Gemini** (Default):
   - Model: `gemini-1.5-flash` (fast, cost-effective)
   - Fallback: `gemini-pro`, `gemini-1.0-pro`
   - Auto-detects available models

2. **OpenAI** (Alternative):
   - Model: `gpt-3.5-turbo`
   - Configurable via `LLM_PROVIDER` env var

---

## Frontend Implementation

### Technology Stack

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Components**: Radix UI (headless, accessible)
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Context API
- **Routing**: React Router 6.22
- **HTTP Client**: Axios 1.13

### Project Structure

```
src/
├── api/
│   └── ragClient.ts          # RAG backend API client
├── components/              # Reusable UI components
│   ├── ChatInterface.tsx     # Main chat UI
│   ├── RAGChatInterface.tsx  # RAG-specific chat
│   └── ...
├── pages/                   # Page components
│   ├── tenant/
│   │   ├── Dashboard.tsx
│   │   ├── KnowledgeBase.tsx
│   │   ├── WidgetCustomization.tsx
│   │   └── ...
│   └── rag/
│       ├── KnowledgeBase.tsx
│       ├── RetrievalTest.tsx
│       ├── Chat.tsx
│       └── Billing.tsx
├── hooks/                   # Custom React hooks
├── context/                 # React Context providers
├── lib/                     # Utility functions
└── types/                   # TypeScript types
```

### RAG API Client (`src/api/ragClient.ts`)

**Key Features**:

1. **Environment-Aware URL Resolution**:
```typescript
function getRAGApiUrl(): string {
  // Priority:
  // 1. VITE_RAG_API_URL env var (build-time)
  // 2. Production: Hugging Face Space URL
  // 3. Development: localhost:8000
}
```

2. **Authentication**:
```typescript
// JWT token from localStorage
// X-Tenant-Id and X-User-Id headers (dev mode)
// Auto-logout on 401
```

3. **Error Handling**:
```typescript
// 401 → Logout and redirect
// 402 → Quota exceeded (show upgrade banner)
// Network errors → User-friendly messages
```

**API Methods**:
- `uploadDocument(file, kbId)` - Upload document
- `getKBStats(kbId)` - Get knowledge base statistics
- `searchKB(query, kbId, topK)` - Search without LLM
- `chat(question, kbId, conversationId)` - Full RAG chat
- `getUsage(range)` - Usage statistics
- `getLimits()` - Plan limits
- `getCostReport(range)` - Cost breakdown

### Knowledge Base Page (`src/pages/rag/KnowledgeBase.tsx`)

**Features**:
- Drag & drop file upload
- File validation (type, size)
- Real-time KB statistics
- Document list with status
- Delete documents
- Toast notifications

**Upload Flow**:
```typescript
1. User selects/drops file
2. Validate file (type: PDF/DOCX/TXT/MD, size: < 50MB)
3. Call RAGClient.uploadDocument()
4. Show loading state
5. Poll KB stats until chunks appear
6. Show success/error toast
```

### Chat Interface (`src/pages/rag/Chat.tsx`)

**Features**:
- Real-time chat UI
- Message history
- Confidence score display
- Citation links
- Refusal state handling
- Loading indicators

**Chat Flow**:
```typescript
1. User types question
2. Send to RAGClient.chat()
3. Display answer with citations
4. Show confidence score
5. Handle refusal (low confidence)
6. Show escalation suggestion if needed
```

---

## Backend Services

### Node.js Backend (`server/`)

**Purpose**: Session management and chat widget proxy

**Key Responsibilities**:
1. **Session Management**:
   - Create chat sessions for widget users
   - Store session tokens
   - Track session metadata (domain, IP, user agent)

2. **Message Storage**:
   - Store user messages
   - Store AI responses
   - Maintain conversation history

3. **RAG Proxy**:
   - Forward chat requests to RAG backend
   - Add authentication headers
   - Handle errors and retries

4. **Widget Script**:
   - Generate tenant-specific widget JavaScript
   - Inject tenant ID and API URL
   - Serve as `/api/widget/script/:tenantId`

**Database Schema** (SQLite):
```sql
-- Chat sessions
CREATE TABLE chat_sessions (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  domain TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY,
  session_id INTEGER NOT NULL,
  sender TEXT NOT NULL,  -- 'user' or 'ai'
  message TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Chat Endpoint** (`server/src/routes/chat.ts`):
```typescript
router.post('/messages', async (req, res) => {
  // 1. Get session from token
  // 2. Save user message
  // 3. Get chat history (last 20 messages)
  // 4. Call RAG backend with history
  // 5. Save AI response
  // 6. Return response with RAG metadata
});
```

### FastAPI RAG Backend (`rag-backend/`)

**Purpose**: AI processing and knowledge base management

**Key Modules**:

1. **`app/main.py`**: FastAPI application and endpoints
2. **`app/config.py`**: Configuration settings
3. **`app/rag/ingest.py`**: Document parsing
4. **`app/rag/chunking.py`**: Text chunking
5. **`app/rag/embeddings.py`**: Embedding generation
6. **`app/rag/vectorstore.py`**: ChromaDB operations
7. **`app/rag/retrieval.py`**: Vector search
8. **`app/rag/answer.py`**: LLM integration
9. **`app/rag/prompts.py`**: Prompt templates
10. **`app/rag/verifier.py`**: Answer verification
11. **`app/billing/`**: Usage tracking and quotas

**Database Schema** (SQLite):
```sql
-- Billing: Tenant plans
CREATE TABLE tenant_plans (
  tenant_id TEXT PRIMARY KEY,
  plan_name TEXT NOT NULL,
  monthly_chat_limit INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Billing: Usage tracking
CREATE TABLE usage_monthly (
  id INTEGER PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0.0,
  gemini_requests INTEGER DEFAULT 0,
  openai_requests INTEGER DEFAULT 0,
  UNIQUE(tenant_id, year, month)
);
```

---

## Database Schema

### Node.js Backend (SQLite)

**Tables**:
- `users`: User accounts (email, password_hash, google_id)
- `tenants`: Tenant/organization records
- `user_tenants`: User-tenant relationships (roles, permissions)
- `chat_sessions`: Chat session tracking
- `chat_messages`: Individual messages
- `widget_configs`: Widget customization settings
- `analytics_events`: Analytics tracking

### RAG Backend (SQLite + ChromaDB)

**SQLite Tables**:
- `tenant_plans`: Subscription plans per tenant
- `usage_monthly`: Monthly usage statistics
- `documents`: Document metadata (status, file info)

**ChromaDB**:
- **Collection**: `clientsphere_kb`
- **Metadata Fields**:
  - `tenant_id` (string): Multi-tenant isolation
  - `kb_id` (string): Knowledge base ID
  - `user_id` (string): User who uploaded
  - `file_name` (string): Original filename
  - `file_type` (string): PDF, DOCX, TXT, MD
  - `chunk_id` (string): Unique chunk identifier
  - `chunk_index` (int): Chunk position in document
  - `page_number` (int): Page number for citations
  - `token_count` (int): Tokens in chunk
  - `created_at` (string): ISO timestamp

---

## Authentication & Security

### Multi-Tenant Isolation

**Critical Security Measures**:

1. **Tenant ID Enforcement**:
   - All vector searches filter by `tenant_id`
   - Never accepts `tenant_id` from request body in production
   - Extracted from JWT token or headers (dev mode)

2. **Development vs Production**:
   ```python
   # Development (ENV=dev)
   # Allows X-Tenant-Id and X-User-Id headers
   
   # Production (ENV=prod)
   # Requires JWT token with tenant_id claim
   # Ignores headers from request body
   ```

3. **JWT Authentication**:
   ```python
   # JWT payload structure:
   {
     "tenant_id": "tenant_123",
     "user_id": "user_456",
     "sub": "user_456",
     "exp": 1234567890
   }
   ```

### Rate Limiting

**Per-Tenant Rate Limits**:
- `/chat`: 10 requests/minute
- `/kb/search`: 30 requests/minute
- `/kb/upload`: 20 requests/hour

**Implementation**: `slowapi` with Redis (optional) or in-memory

### CORS Configuration

```python
# Development: Allow all origins
# Production: Restrict to frontend domain
ALLOWED_ORIGINS = "https://main.clientsphere.pages.dev"
```

---

## Deployment Architecture

### Frontend (Cloudflare Pages)

**Build Process**:
```bash
npm run build  # Vite build
# Output: dist/
```

**Deployment**:
```bash
wrangler pages deploy dist --project-name=clientsphere
```

**Environment Variables** (Cloudflare Pages Dashboard):
- `VITE_API_URL`: Node.js backend URL
- `VITE_RAG_API_URL`: RAG backend URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

**URL**: `https://main.clientsphere.pages.dev`

### Node.js Backend

**Options**:
1. **Cloudflare Workers**: Serverless (if compatible)
2. **Standalone Server**: Express.js on Render/Railway
3. **Docker**: Containerized deployment

**Environment Variables**:
- `RAG_BACKEND_URL`: FastAPI backend URL
- `FRONTEND_URL`: Frontend URL (for widget script)
- `JWT_SECRET`: JWT signing secret
- `DATABASE_PATH`: SQLite database path

### RAG Backend (Hugging Face Spaces)

**Deployment**:
1. Push code to Hugging Face Space
2. Configure environment variables
3. Space auto-builds Docker image
4. Runs `app.py` entry point

**Dockerfile**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

**Environment Variables** (HF Spaces):
- `GEMINI_API_KEY`: Google Gemini API key
- `ENV`: `dev` or `prod`
- `JWT_SECRET`: JWT secret (for prod)
- `PORT`: 7860 (auto-set by HF Spaces)

**URL**: `https://chiragpatankar-rag-backend.hf.space`

**Note**: Hugging Face converts underscores to hyphens in URLs!

---

## API Reference

### RAG Backend Endpoints

#### Health Check
```http
GET /health
```
**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "vector_db_connected": true,
  "llm_configured": true
}
```

#### Upload Document
```http
POST /kb/upload
Content-Type: multipart/form-data

file: <file>
kb_id: default
tenant_id: tenant_123 (dev mode)
user_id: user_456 (dev mode)
```
**Response**:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "file_name": "manual.pdf",
  "chunks_created": 45,
  "document_id": "doc_abc123"
}
```

#### Get Knowledge Base Stats
```http
GET /kb/stats?kb_id=default&tenant_id=tenant_123&user_id=user_456
```
**Response**:
```json
{
  "tenant_id": "tenant_123",
  "kb_id": "default",
  "user_id": "user_456",
  "total_documents": 3,
  "total_chunks": 127,
  "file_names": ["manual.pdf", "faq.pdf", "policy.txt"]
}
```

#### Search Knowledge Base
```http
GET /kb/search?query=return%20policy&kb_id=default&top_k=5
```
**Response**:
```json
{
  "success": true,
  "results": [
    {
      "chunk_id": "tenant_123_default_manual.pdf_0_abc123",
      "content": "We offer a 30-day return policy...",
      "metadata": {
        "file_name": "manual.pdf",
        "page_number": 2
      },
      "similarity_score": 0.85
    }
  ],
  "confidence": 0.82,
  "has_relevant_results": true
}
```

#### Chat with RAG
```http
POST /chat
Content-Type: application/json

{
  "kb_id": "default",
  "question": "What is your return policy?",
  "conversation_id": "conv_abc123",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "ai", "content": "Hi! How can I help?"}
  ]
}
```
**Response**:
```json
{
  "success": true,
  "answer": "Based on the documentation, we offer a 30-day return policy... [Source 1]",
  "citations": [
    {
      "file_name": "manual.pdf",
      "chunk_id": "tenant_123_default_manual.pdf_0_abc123",
      "page_number": 2,
      "relevance_score": 0.85,
      "excerpt": "We offer a 30-day return policy..."
    }
  ],
  "confidence": 0.82,
  "from_knowledge_base": true,
  "escalation_suggested": false,
  "refused": false,
  "verifier_passed": true,
  "conversation_id": "conv_abc123"
}
```

#### Get Usage Statistics
```http
GET /billing/usage?range=month
```
**Response**:
```json
{
  "tenant_id": "tenant_123",
  "period": "2024-01",
  "total_requests": 450,
  "total_tokens": 125000,
  "total_cost_usd": 0.45,
  "gemini_requests": 450,
  "openai_requests": 0,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

---

## Widget Implementation

### Widget Script Generation

**Endpoint**: `GET /api/widget/script/:tenantId`

**Process**:
1. Verify tenant exists
2. Generate self-contained JavaScript
3. Inject tenant ID and API URL
4. Return as JavaScript file

**Widget Features**:
- Floating chat button
- Expandable chat window
- Session management
- Message history
- Typing indicators
- RAG metadata display (citations, confidence)

### Widget Code Structure

```javascript
(function() {
  const TENANT_ID = 'tenant_123';
  const API_URL = 'https://backend.example.com/api';
  
  // Create UI elements
  const button = createChatButton();
  const widget = createChatWidget();
  
  // Session management
  let sessionToken = null;
  
  async function initializeSession() {
    const response = await fetch(`${API_URL}/chat/sessions`, {
      method: 'POST',
      body: JSON.stringify({ tenantId: TENANT_ID })
    });
    sessionToken = (await response.json()).sessionToken;
  }
  
  async function sendMessage(message) {
    const response = await fetch(`${API_URL}/chat/messages`, {
      method: 'POST',
      body: JSON.stringify({
        sessionToken,
        message,
        tenantId: TENANT_ID
      })
    });
    return await response.json();
  }
  
  // Initialize on page load
  initializeSession();
})();
```

### Embedding the Widget

**HTML Code** (generated by frontend):
```html
<!-- ClientSphere Chat Widget -->
<script src="https://backend.example.com/api/widget/script/TENANT_ID" async></script>
```

**Placement**: Just before closing `</body>` tag

---

## File Processing Pipeline

### Complete Flow

```
1. User uploads file (PDF/DOCX/TXT/MD)
   ↓
2. File validation (type, size)
   ↓
3. Save to disk (data/uploads/)
   ↓
4. Background task triggered
   ↓
5. Document parsing
   - PDF: PyMuPDF → Extract text + page numbers
   - DOCX: python-docx → Extract text
   - TXT/MD: Direct read
   ↓
6. Text chunking
   - Split into paragraphs
   - Create chunks (~600 tokens)
   - Add overlap (150 tokens)
   - Preserve page numbers
   ↓
7. Embedding generation
   - Batch process chunks
   - Generate 384-dim vectors
   ↓
8. Vector storage
   - Add to ChromaDB with metadata
   - Include tenant_id, kb_id, user_id
   ↓
9. Update document status: "processed"
```

### Error Handling

- **Parsing errors**: Log and mark document as "error"
- **Chunking errors**: Skip document, notify user
- **Embedding errors**: Retry with exponential backoff
- **Storage errors**: Rollback, mark as "error"

---

## Vector Database & Embeddings

### ChromaDB Configuration

**Storage**: Local file system (`data/vectordb/`)

**Collection Settings**:
- **Name**: `clientsphere_kb`
- **Similarity Metric**: Cosine similarity
- **Persistence**: Enabled (survives restarts)

**Metadata Schema**:
```python
{
    "tenant_id": str,      # Multi-tenant isolation
    "kb_id": str,          # Knowledge base ID
    "user_id": str,        # User who uploaded
    "file_name": str,      # Original filename
    "file_type": str,      # PDF, DOCX, TXT, MD
    "chunk_id": str,       # Unique chunk ID
    "chunk_index": int,    # Position in document
    "page_number": int,    # Page number (for citations)
    "token_count": int,    # Tokens in chunk
    "created_at": str     # ISO timestamp
}
```

### Embedding Model

**Model**: `all-MiniLM-L6-v2` (Sentence Transformers)

**Specifications**:
- **Dimensions**: 384
- **Max Sequence Length**: 512 tokens
- **Language**: English (multilingual variants available)
- **Speed**: ~100ms per batch of 32 texts
- **Quality**: Good for semantic search (not best, but fast)

**Alternative Models** (for better quality):
- `all-mpnet-base-v2`: 768 dims, slower, better quality
- `sentence-transformers/all-MiniLM-L12-v2`: 384 dims, better than L6

### Similarity Search

**Algorithm**: Cosine similarity

**Formula**:
```
similarity = dot(query_embedding, chunk_embedding) / 
             (||query_embedding|| * ||chunk_embedding||)
```

**Range**: -1 to 1 (typically 0 to 1 for normalized embeddings)

**Thresholds**:
- **Retrieval**: 0.15 (lenient, to include more results)
- **Answer Generation**: 0.30 (strict, to prevent hallucinations)
- **Integration Questions**: 0.50 (very strict)

---

## LLM Integration

### Gemini Provider

**Model**: `gemini-1.5-flash` (default)

**Features**:
- Fast inference (~1-2 seconds)
- Cost-effective
- Good quality for RAG
- Auto-fallback to other models if unavailable

**Configuration**:
```python
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content(
    prompt,
    generation_config=genai.types.GenerationConfig(
        temperature=0.0,  # Maximum determinism
        max_output_tokens=1024
    )
)
```

**Usage Tracking**:
- Prompt tokens (estimated: 1 token ≈ 4 chars)
- Completion tokens (estimated)
- Actual usage from API response (if available)

### OpenAI Provider

**Model**: `gpt-3.5-turbo` (default)

**Configuration**:
```python
client = OpenAI(api_key=OPENAI_API_KEY)
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    temperature=0.0,
    max_tokens=1024
)
```

**Usage Tracking**:
- Exact token counts from API response
- Cost calculation based on model pricing

### Prompt Engineering

**System Prompt** (Draft Generation):
```
You are a helpful assistant that answers questions based ONLY on the provided context.

RULES:
1. Answer ONLY from the context provided
2. If the context doesn't contain the answer, say "I don't know"
3. Never make up information
4. Always cite sources using [Source X]
5. Be concise and helpful
6. If unsure, suggest contacting support
```

**Verifier Prompt**:
```
Verify if the following answer is supported by the context:

Answer: {draft_answer}
Context: {context}

Check:
1. Are all claims in the answer supported by the context?
2. Are there any unsupported claims?
3. Does the answer accurately represent the context?

Respond with JSON:
{
  "pass": true/false,
  "issues": ["list of issues"],
  "unsupported_claims": ["list of unsupported claims"]
}
```

---

## Billing & Usage Tracking

### Subscription Plans

**Starter Plan**:
- Monthly chat limit: 500
- Cost: $X/month
- Features: Basic RAG, standard support

**Growth Plan**:
- Monthly chat limit: 5,000
- Cost: $Y/month
- Features: Advanced RAG, priority support

**Pro Plan**:
- Monthly chat limit: Unlimited
- Cost: $Z/month
- Features: Enterprise RAG, dedicated support

### Usage Tracking

**Per Request Tracking**:
```python
# Tracked on every /chat request:
{
    "tenant_id": "tenant_123",
    "request_id": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "prompt_tokens": 1250,
    "completion_tokens": 350,
    "total_tokens": 1600,
    "estimated_cost_usd": 0.0012
}
```

**Monthly Aggregation**:
- Sum all requests for tenant in current month
- Calculate total tokens and cost
- Compare against plan limits

### Quota Enforcement

**Check Before LLM Call**:
```python
def check_quota(tenant_id: str) -> bool:
    plan = get_tenant_plan(tenant_id)
    usage = get_monthly_usage(tenant_id)
    
    if plan.monthly_chat_limit is None:
        return True  # Unlimited plan
    
    return usage.total_requests < plan.monthly_chat_limit
```

**Response on Quota Exceeded**:
```json
{
  "success": false,
  "error": "AI quota exceeded. Upgrade your plan.",
  "status_code": 402
}
```

### Cost Calculation

**Gemini Pricing** (example):
- Input: $0.00025 per 1K tokens
- Output: $0.0005 per 1K tokens

**OpenAI Pricing** (example):
- GPT-3.5-turbo: $0.0015 per 1K tokens (input), $0.002 per 1K tokens (output)

**Calculation**:
```python
cost = (prompt_tokens / 1000 * input_price) + 
       (completion_tokens / 1000 * output_price)
```

---

## Configuration & Environment

### Frontend Environment Variables

**.env.development**:
```bash
VITE_API_URL=http://localhost:3001
VITE_RAG_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id
```

**.env.production**:
```bash
VITE_API_URL=https://mcp-backend.example.com
VITE_RAG_API_URL=https://chiragpatankar-rag-backend.hf.space
VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Node.js Backend Environment Variables

**.env**:
```bash
NODE_ENV=production
PORT=3001
RAG_BACKEND_URL=https://chiragpatankar-rag-backend.hf.space
FRONTEND_URL=https://main.clientsphere.pages.dev
JWT_SECRET=your-secret-key
DATABASE_PATH=./database.sqlite
```

### RAG Backend Environment Variables

**.env**:
```bash
# Environment
ENV=dev  # or "prod"

# LLM Configuration
LLM_PROVIDER=gemini  # or "openai"
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key

# JWT (Production)
JWT_SECRET=your-jwt-secret

# Chunking
CHUNK_SIZE=600
CHUNK_OVERLAP=150
MIN_CHUNK_SIZE=100

# Retrieval
TOP_K=10
SIMILARITY_THRESHOLD=0.15
SIMILARITY_THRESHOLD_STRICT=0.30

# LLM Settings
TEMPERATURE=0.0
MAX_CONTEXT_TOKENS=2500
REQUIRE_VERIFIER=true

# Security
MAX_FILE_SIZE_MB=50
ALLOWED_ORIGINS=*
RATE_LIMIT_ENABLED=true

# Embedding Model
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

### Hugging Face Spaces Configuration

**README.md** (YAML frontmatter):
```yaml
---
title: ClientSphere RAG Backend
sdk: docker
app_file: app.py
---
```

**Environment Variables** (HF Spaces Settings):
- `GEMINI_API_KEY`: Your Gemini API key
- `ENV`: `dev` or `prod`
- `JWT_SECRET`: JWT secret (if `ENV=prod`)

---

## Conclusion

This document provides a comprehensive overview of the ClientSphere RAG platform implementation. The system is designed for:

- **Scalability**: Multi-tenant architecture with isolated data
- **Reliability**: Error handling, retries, health checks
- **Security**: JWT authentication, tenant isolation, rate limiting
- **Quality**: Anti-hallucination measures, confidence scoring, citations
- **Production Ready**: Billing, usage tracking, monitoring

For questions or contributions, please refer to the individual component README files or contact the development team.

---

**Last Updated**: January 2024
**Version**: 1.0.0

