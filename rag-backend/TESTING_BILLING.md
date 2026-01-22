# Testing Billing & Usage Tracking

## Prerequisites

1. **Server must be running** with the latest code:
   ```bash
   # Stop existing server (Ctrl+C)
   # Then restart:
   uvicorn app.main:app --reload --port 8000
   ```

2. **Database initialized**:
   ```bash
   python scripts/create_billing_tables.py
   ```

## Manual Testing

### 1. Test Billing Endpoints

**Get Plan Limits:**
```bash
curl -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  http://localhost:8000/billing/limits
```

Expected: Returns plan info (defaults to "starter" with 500 chats/month)

**Get Usage:**
```bash
curl -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  "http://localhost:8000/billing/usage?range=month"
```

Expected: Returns usage statistics (0 if no usage yet)

**Get Cost Report:**
```bash
curl -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  "http://localhost:8000/billing/cost-report?range=month"
```

Expected: Returns cost breakdown by provider and model

**Set Plan:**
```bash
curl -X POST -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  -H "Content-Type: application/json" \
  -d '{"tenant_id": "test_tenant", "plan_name": "growth"}' \
  http://localhost:8000/billing/plan
```

Expected: Updates tenant plan to "growth" (5000 chats/month)

### 2. Test Quota Enforcement

**Step 1: Set a plan with low limit**
```bash
curl -X POST -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  -H "Content-Type: application/json" \
  -d '{"tenant_id": "test_tenant", "plan_name": "starter"}' \
  http://localhost:8000/billing/plan
```

**Step 2: Manually set usage to exceed limit** (using Python):
```python
from app.db.database import get_db, init_db
from app.db.models import UsageMonthly
from datetime import datetime

init_db()
db = next(get_db())

now = datetime.utcnow()
monthly = UsageMonthly(
    tenant_id="test_tenant",
    year=now.year,
    month=now.month,
    total_requests=500,  # At limit
    total_tokens=100000,
    total_cost_usd=0.5
)
db.add(monthly)
db.commit()
```

**Step 3: Try to make a chat request**
```bash
curl -X POST -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "test_tenant",
    "user_id": "test_user",
    "kb_id": "test_kb",
    "question": "Test question"
  }' \
  http://localhost:8000/chat
```

Expected: Returns `402 Payment Required` with message about quota exceeded

### 3. Test Usage Tracking

**Make a chat request** (if quota allows):
```bash
curl -X POST -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "test_tenant",
    "user_id": "test_user",
    "kb_id": "test_kb",
    "question": "What is the refund policy?"
  }' \
  http://localhost:8000/chat
```

**Check usage after request:**
```bash
curl -H "X-Tenant-Id: test_tenant" -H "X-User-Id: test_user" \
  "http://localhost:8000/billing/usage?range=month"
```

Expected: Shows 1 request, token counts, and estimated cost

## Automated Tests

Run all billing tests:
```bash
pytest tests/test_billing.py -v
```

Run specific test:
```bash
pytest tests/test_billing.py::test_tenant_creation -v
pytest tests/test_billing.py::test_quota_checking -v
pytest tests/test_billing.py::test_usage_tracking -v
pytest tests/test_billing.py::test_billing_endpoints -v
pytest tests/test_billing.py::test_quota_enforcement -v
```

## Expected Test Results

After server restart:
- ✅ `test_tenant_creation` - PASS
- ✅ `test_quota_checking` - PASS
- ✅ `test_usage_tracking` - PASS
- ✅ `test_billing_endpoints` - PASS (after server restart)
- ✅ `test_quota_enforcement` - PASS (after server restart)

## Troubleshooting

### Endpoints return 404
- **Fix**: Restart the server to load new endpoints
- **Command**: Stop server (Ctrl+C), then `uvicorn app.main:app --reload --port 8000`

### Quota check not working
- **Check**: Database has tenant plan record
- **Check**: Monthly usage record exists
- **Fix**: Ensure `check_quota()` is called before LLM call in `/chat` endpoint

### Usage not tracked
- **Check**: LLM provider returns usage info
- **Check**: `track_usage()` is called after LLM call
- **Fix**: Verify `generate_with_usage()` returns token counts

### Database errors
- **Fix**: Run `python scripts/create_billing_tables.py`
- **Check**: Database file exists at `data/billing/billing.db`

