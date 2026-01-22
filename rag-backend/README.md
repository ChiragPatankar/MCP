# ClientSphere RAG Backend

A production-ready RAG (Retrieval-Augmented Generation) pipeline for the ClientSphere customer support chatbot.

## Features

- **Document Ingestion**: Upload PDFs, DOCX, TXT, and Markdown files
- **Intelligent Chunking**: Token-aware chunking with overlap for context preservation
- **Local Vector Store**: ChromaDB for efficient similarity search
- **Anti-Hallucination**: Strict prompting to only answer from knowledge base
- **Citations**: Every answer includes source document references
- **Confidence Scoring**: Low-confidence answers trigger escalation suggestions
- **Swappable LLM**: Support for Gemini and OpenAI

## Quick Start

### 1. Install Dependencies

```bash
cd rag-backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Test the API

Open http://localhost:8000/docs for interactive API documentation.

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Upload Document to Knowledge Base
```bash
curl -X POST http://localhost:8000/kb/upload \
  -F "file=@your_document.pdf" \
  -F "user_id=user123" \
  -F "kb_id=kb001"
```

### Get Knowledge Base Stats
```bash
curl "http://localhost:8000/kb/stats?kb_id=kb001&user_id=user123"
```

### Chat with RAG
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "kb_id": "kb001",
    "question": "What is your return policy?"
  }'
```

### Search Knowledge Base (without LLM)
```bash
curl -X POST "http://localhost:8000/kb/search?query=return%20policy&kb_id=kb001&user_id=user123&top_k=5"
```

### Delete Document
```bash
curl -X DELETE "http://localhost:8000/kb/document?kb_id=kb001&user_id=user123&file_name=document.pdf"
```

### Clear Knowledge Base
```bash
curl -X DELETE "http://localhost:8000/kb/clear?kb_id=kb001&user_id=user123"
```

## Example Responses

### Successful Answer with Citations
```json
{
  "success": true,
  "answer": "Based on the documentation, we offer a 30-day return policy on all products [Source 1]. Items must be in original condition with tags attached [Source 1]. Returns can be initiated through your account dashboard or by contacting support [Source 1].",
  "citations": [
    {
      "file_name": "faq.pdf",
      "chunk_id": "kb001_faq.pdf_0_abc123",
      "page_number": 2,
      "relevance_score": 0.85,
      "excerpt": "We offer a 30-day return policy on all products..."
    }
  ],
  "confidence": 0.82,
  "from_knowledge_base": true,
  "escalation_suggested": false,
  "conversation_id": "conv_abc123xyz"
}
```

### No Relevant Information Found
```json
{
  "success": true,
  "answer": "I apologize, but I couldn't find relevant information in the knowledge base to answer your question...",
  "citations": [],
  "confidence": 0.0,
  "from_knowledge_base": false,
  "escalation_suggested": true,
  "conversation_id": "conv_xyz789"
}
```

## Running Evaluation

Test the RAG pipeline with sample questions:

```bash
python evaluate.py
```

This will:
1. Upload a sample FAQ document
2. Run 10 test questions
3. Evaluate retrieval accuracy and answer quality
4. Report pass/fail for each test

## Project Structure

```
rag-backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── rag/
│   │   ├── ingest.py        # Document parsing
│   │   ├── chunking.py      # Text chunking
│   │   ├── embeddings.py    # Embedding generation
│   │   ├── vectorstore.py   # ChromaDB operations
│   │   ├── retrieval.py     # Similarity search
│   │   ├── prompts.py       # LLM prompts
│   │   └── answer.py        # Answer generation
│   └── utils/
├── data/
│   ├── uploads/             # Uploaded files
│   ├── processed/           # Processed documents
│   └── vectordb/            # ChromaDB storage
├── requirements.txt
├── .env.example
├── evaluate.py              # Evaluation script
└── README.md
```

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `gemini` | LLM provider (gemini/openai) |
| `GEMINI_API_KEY` | - | Google Gemini API key |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `CHUNK_SIZE` | 500 | Target chunk size in tokens |
| `CHUNK_OVERLAP` | 100 | Overlap between chunks |
| `TOP_K` | 6 | Number of chunks to retrieve |
| `SIMILARITY_THRESHOLD` | 0.35 | Minimum similarity score |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Sentence transformer model |

## Production Essentials

This backend includes production-ready features:

### 1. Authentication & Tenant Enforcement

**Development Mode (`ENV=dev`):**
- Uses headers `X-Tenant-Id` and `X-User-Id` for easy testing
- Falls back to defaults if headers missing

**Production Mode (`ENV=prod`):**
- Requires JWT token in `Authorization: Bearer <token>` header
- Extracts `tenant_id` and `user_id` from JWT claims
- **SECURITY**: Never accepts `tenant_id` from request body/query params in prod
- Requires `JWT_SECRET` environment variable

**Example:**
```bash
# Dev mode
curl -H "X-Tenant-Id: tenant_123" -H "X-User-Id: user_456" \
  http://localhost:8000/chat -d '{"kb_id": "kb1", "question": "..."}'

# Prod mode
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8000/chat -d '{"kb_id": "kb1", "question": "..."}'
```

### 2. Rate Limiting

Per-tenant rate limits (configurable via `RATE_LIMIT_ENABLED`):
- `POST /chat`: 10 requests/minute per tenant
- `GET /kb/search`: 30 requests/minute per tenant
- `POST /kb/upload`: 20 requests/hour per tenant

Rate limits are enforced per tenant (from auth context) and fall back to IP address if tenant unavailable.

### 3. Health Checks

**Liveness Probe:**
```bash
curl http://localhost:8000/health/live
# Returns: {"status": "alive"}
```

**Readiness Probe:**
```bash
curl http://localhost:8000/health/ready
# Returns: {"status": "ready", "checks": {"vector_db": true, "llm_configured": true}}
# Or 503 if dependencies unavailable
```

Use these endpoints for Kubernetes/Docker health checks.

### 4. Prometheus Metrics

Metrics endpoint available at `/metrics`:
- Request count and latency
- No PII logged
- Standard Prometheus format

**Example:**
```bash
curl http://localhost:8000/metrics
```

### 5. Billing & Usage Tracking

The backend tracks AI usage per tenant and enforces quotas based on subscription plans.

#### Subscription Plans

- **Starter**: 500 chats/month
- **Growth**: 5,000 chats/month
- **Pro**: Unlimited

#### Usage Tracking

Every `/chat` request tracks:
- Token usage (prompt + completion)
- Estimated cost (based on model pricing)
- Provider and model used
- Timestamp and request ID

#### Quota Enforcement

Quotas are checked **before** making LLM calls. If quota is exceeded:
- Returns `402 Payment Required` status
- Message: "AI quota exceeded. Upgrade your plan."

#### Billing Endpoints

**Get Usage Statistics:**
```bash
curl -H "X-Tenant-Id: tenant_123" \
  "http://localhost:8000/billing/usage?range=month"
```

**Get Plan Limits:**
```bash
curl -H "X-Tenant-Id: tenant_123" \
  http://localhost:8000/billing/limits
```

**Get Cost Report:**
```bash
curl -H "X-Tenant-Id: tenant_123" \
  "http://localhost:8000/billing/cost-report?range=month"
```

**Set Tenant Plan (Admin):**
```bash
curl -X POST -H "X-Tenant-Id: tenant_123" \
  http://localhost:8000/billing/plan \
  -d '{"tenant_id": "tenant_123", "plan_name": "growth"}'
```

#### Database Setup

Initialize billing tables:
```bash
python scripts/create_billing_tables.py
```

The database uses SQLite for local dev (Postgres-compatible schema).

### Configuration

Add to `.env`:
```bash
# Environment
ENV=dev  # or "prod"

# JWT Secret (required for prod)
JWT_SECRET=your-secret-key-here

# Rate Limiting
RATE_LIMIT_ENABLED=true
```

## Deployment Notes

This backend is designed for easy deployment:

1. **Docker**: Add a Dockerfile for containerization
2. **Cloud Vector DB**: Replace ChromaDB with Pinecone/Weaviate for scale
3. **Queue System**: Add Redis/RabbitMQ for async document processing
4. **Caching**: Add Redis for query result caching

## Troubleshooting

### "No chunks found" after upload
- Wait a few seconds for background processing
- Check logs for parsing errors
- Verify file format is supported

### Low confidence scores
- Add more relevant documents to KB
- Adjust `SIMILARITY_THRESHOLD` lower
- Check if query terms match document vocabulary

### LLM not responding
- Verify API key is correct
- Check rate limits on your API account
- Try switching to alternative provider

## License

Part of the ClientSphere project.



