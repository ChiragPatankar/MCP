# Production Setup Guide

## Quick Start Commands

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
# Copy example env file
cp env.example.txt .env

# Edit .env and set:
# - ENV=dev (for development) or ENV=prod (for production)
# - GEMINI_API_KEY=your_key_here
# - JWT_SECRET=your_jwt_secret_here (required for prod)
# - RATE_LIMIT_ENABLED=true
```

### 3. Start Server
```bash
# Activate venv first
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 4. Test Health Checks
```bash
# Liveness
curl http://localhost:8000/health/live

# Readiness
curl http://localhost:8000/health/ready

# Metrics
curl http://localhost:8000/metrics
```

### 5. Run Validation Tests
```bash
python scripts/validate_rag.py
```

## Development Mode

In `ENV=dev` mode:
- Use headers `X-Tenant-Id` and `X-User-Id` for authentication
- Falls back to defaults if headers missing
- Easy for local testing

**Example:**
```bash
curl -H "X-Tenant-Id: tenant_A" \
     -H "X-User-Id: user_A" \
     -X POST http://localhost:8000/chat \
     -H "Content-Type: application/json" \
     -d '{"kb_id": "kb_A", "question": "What is the refund window?"}'
```

## Production Mode

In `ENV=prod` mode:
- Requires JWT token in `Authorization: Bearer <token>` header
- `tenant_id` and `user_id` extracted from JWT claims
- Never accepts `tenant_id` from request body/query params

**Example:**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     -X POST http://localhost:8000/chat \
     -H "Content-Type: application/json" \
     -d '{"kb_id": "kb_A", "question": "What is the refund window?"}'
```

## Rate Limits

- `POST /chat`: 10/minute per tenant
- `GET /kb/search`: 30/minute per tenant
- `POST /kb/upload`: 20/hour per tenant

Disable rate limiting by setting `RATE_LIMIT_ENABLED=false` in `.env`.

## Testing

### Run Integration Tests
```bash
pytest tests/integration/
```

### Run Full Validation
```bash
python scripts/validate_rag.py
```

## Troubleshooting

### "JWT_SECRET not configured"
- Set `JWT_SECRET` in `.env` file
- Required for production mode

### Rate Limit Errors
- Check rate limit settings in `.env`
- Disable temporarily for testing: `RATE_LIMIT_ENABLED=false`

### Health Check Fails
- Check vector DB connection
- Verify LLM API key is set
- Check server logs for details

