# 🛠️ Enterprise Features Implementation Guide
**Step-by-step implementation of critical enterprise features**

---

## 1. Monitoring & Metrics (Prometheus)

### Step 1: Install Dependencies
```bash
pip install prometheus-client prometheus-fastapi-instrumentator
```

### Step 2: Add Metrics Middleware
```python
# app/main.py
from prometheus_fastapi_instrumentator import Instrumentator

# After app creation
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app)
```

### Step 3: Add Custom Metrics
```python
# app/utils/metrics.py
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
request_count = Counter(
    'rag_requests_total',
    'Total number of requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'rag_request_duration_seconds',
    'Request duration',
    ['method', 'endpoint']
)

# Business metrics
llm_calls = Counter(
    'rag_llm_calls_total',
    'Total LLM API calls',
    ['provider', 'model', 'status']
)

llm_cost = Counter(
    'rag_llm_cost_total',
    'Total LLM cost in USD',
    ['provider', 'model']
)

vector_db_queries = Counter(
    'rag_vector_db_queries_total',
    'Total vector DB queries',
    ['operation', 'status']
)

active_tenants = Gauge(
    'rag_active_tenants',
    'Number of active tenants'
)
```

---

## 2. Structured Logging

### Step 1: Install Dependencies
```bash
pip install structlog python-json-logger
```

### Step 2: Configure Structured Logging
```python
# app/utils/logging.py
import structlog
import logging
from pythonjsonlogger import jsonlogger

def setup_logging():
    """Configure structured logging"""
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Configure root logger
    handler = logging.StreamHandler()
    handler.setFormatter(jsonlogger.JsonFormatter())
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
    
    return structlog.get_logger()
```

### Step 3: Use in Code
```python
# app/main.py
from app.utils.logging import setup_logging

logger = setup_logging()

@app.post("/chat")
async def chat(request: ChatRequest):
    log = logger.bind(
        tenant_id=request.tenant_id,
        user_id=request.user_id,
        kb_id=request.kb_id,
        question_length=len(request.question)
    )
    log.info("chat_request_received")
    # ... rest of code
```

---

## 3. Redis Caching

### Step 1: Install Dependencies
```bash
pip install redis aiocache
```

### Step 2: Create Cache Utility
```python
# app/utils/cache.py
from aiocache import Cache
from aiocache.serializers import JsonSerializer
from app.config import settings
import hashlib
import json

cache = Cache(
    Cache.REDIS,
    endpoint=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    serializer=JsonSerializer(),
    namespace="rag"
)

def cache_key(prefix: str, **kwargs) -> str:
    """Generate cache key from prefix and kwargs"""
    key_data = json.dumps(kwargs, sort_keys=True)
    key_hash = hashlib.md5(key_data.encode()).hexdigest()
    return f"{prefix}:{key_hash}"

async def get_cached_embeddings(text: str) -> Optional[List[float]]:
    """Get cached embeddings for text"""
    key = cache_key("embedding", text=text)
    return await cache.get(key)

async def set_cached_embeddings(text: str, embedding: List[float], ttl: int = 86400):
    """Cache embeddings"""
    key = cache_key("embedding", text=text)
    await cache.set(key, embedding, ttl=ttl)

async def get_cached_query_results(query: str, tenant_id: str, kb_id: str) -> Optional[List]:
    """Get cached query results"""
    key = cache_key("query", query=query, tenant_id=tenant_id, kb_id=kb_id)
    return await cache.get(key)

async def set_cached_query_results(query: str, tenant_id: str, kb_id: str, results: List, ttl: int = 3600):
    """Cache query results"""
    key = cache_key("query", query=query, tenant_id=tenant_id, kb_id=kb_id)
    await cache.set(key, results, ttl=ttl)
```

### Step 3: Use in Retrieval
```python
# app/rag/retrieval.py
from app.utils.cache import get_cached_query_results, set_cached_query_results

async def retrieve(self, query: str, tenant_id: str, kb_id: str, user_id: str):
    # Check cache first
    cached_results = await get_cached_query_results(query, tenant_id, kb_id)
    if cached_results:
        logger.info("Cache hit for query")
        return cached_results
    
    # ... perform retrieval ...
    
    # Cache results
    await set_cached_query_results(query, tenant_id, kb_id, results)
    return results
```

---

## 4. Rate Limiting

### Step 1: Install Dependencies
```bash
pip install slowapi
```

### Step 2: Configure Rate Limiting
```python
# app/middleware/rate_limit.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)

def get_tenant_rate_limit_key(request: Request) -> str:
    """Get rate limit key from tenant_id"""
    tenant_id = request.headers.get("X-Tenant-Id") or "anonymous"
    return f"tenant:{tenant_id}"

# In app/main.py
from app.middleware.rate_limit import limiter, get_tenant_rate_limit_key
from slowapi.errors import RateLimitExceeded

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/chat")
@limiter.limit("10/minute", key_func=get_tenant_rate_limit_key)
async def chat(request: Request, chat_request: ChatRequest):
    # ... existing code ...
```

---

## 5. Complete Authentication

### Step 1: Install Dependencies
```bash
pip install python-jose[cryptography] passlib[bcrypt]
```

### Step 2: Implement JWT Authentication
```python
# app/middleware/auth.py
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.config import settings

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt

async def require_auth(request: Request) -> dict:
    """Require authentication and return user context"""
    if settings.ENV == "dev":
        # Dev mode: allow headers
        tenant_id = request.headers.get("X-Tenant-Id", "dev_tenant")
        user_id = request.headers.get("X-User-Id", "dev_user")
        return {"user_id": user_id, "tenant_id": tenant_id}
    
    # Production: require JWT
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = auth_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        tenant_id = payload.get("tenant_id")
        user_id = payload.get("user_id")
        
        if not tenant_id or not user_id:
            raise HTTPException(status_code=403, detail="Invalid token")
        
        return {"user_id": user_id, "tenant_id": tenant_id}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
```

---

## 6. Health Checks

### Add to app/main.py
```python
@app.get("/health/live")
async def liveness():
    """Kubernetes liveness probe"""
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    """Kubernetes readiness probe"""
    checks = {
        "vector_db": await check_vector_db_connection(),
        "llm": await check_llm_api(),
        "cache": await check_cache_connection()
    }
    
    if all(checks.values()):
        return {"status": "ready", "checks": checks}
    else:
        raise HTTPException(status_code=503, detail={"status": "not_ready", "checks": checks})

async def check_vector_db_connection() -> bool:
    """Check vector DB connection"""
    try:
        vector_store = get_vector_store()
        vector_store.get_stats()
        return True
    except:
        return False

async def check_llm_api() -> bool:
    """Check LLM API availability"""
    try:
        # Try a simple API call
        return bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
    except:
        return False

async def check_cache_connection() -> bool:
    """Check cache connection"""
    try:
        from app.utils.cache import cache
        await cache.get("health_check")
        return True
    except:
        return False
```

---

## 7. Configuration Updates

### Add to app/config.py
```python
class Settings(BaseSettings):
    # ... existing settings ...
    
    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # "json" or "text"
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
```

---

## 8. Docker Setup

### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/live || exit 1

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=redis
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis
    volumes:
      - ./data:/app/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

---

## 9. Testing

### Add Integration Tests
```python
# tests/integration/test_monitoring.py
import pytest
from fastapi.testclient import TestClient

def test_metrics_endpoint(client: TestClient):
    """Test Prometheus metrics endpoint"""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "rag_requests_total" in response.text

def test_health_checks(client: TestClient):
    """Test health check endpoints"""
    # Liveness
    response = client.get("/health/live")
    assert response.status_code == 200
    
    # Readiness
    response = client.get("/health/ready")
    assert response.status_code == 200
```

---

## 10. Deployment Checklist

- [ ] Set up Redis instance
- [ ] Configure environment variables
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure log aggregation
- [ ] Set up secrets management
- [ ] Configure rate limiting
- [ ] Test health checks
- [ ] Load test the system
- [ ] Set up alerts
- [ ] Document runbooks

---

**Next:** Start with Phase 1 items (Monitoring, Logging, Rate Limiting, Auth) - these provide the biggest impact with minimal effort.

