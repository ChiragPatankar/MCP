# Billing & Usage Tracking Implementation Summary

## Overview

This document summarizes the billing-ready usage tracking and quota enforcement system implemented for the ClientSphere RAG backend.

## Features Implemented

### 1. Database Models

**Tables Created:**
- `tenants`: Tenant/organization records
- `tenant_plans`: Subscription plans per tenant
- `usage_events`: Individual LLM request tracking
- `usage_daily`: Daily aggregated usage
- `usage_monthly`: Monthly aggregated usage

**Database:**
- SQLite for local dev (stored in `data/billing/billing.db`)
- Postgres-compatible schema for easy migration

### 2. Usage Tracking

**Tracked Metrics:**
- `tenant_id`, `user_id`, `kb_id`
- Provider (`gemini`/`openai`)
- Model name
- `prompt_tokens`, `completion_tokens`, `total_tokens`
- `estimated_cost_usd` (calculated from pricing table)
- `request_timestamp`, `request_id`

**Automatic Aggregation:**
- Daily usage aggregated automatically
- Monthly usage aggregated automatically
- Provider breakdown (Gemini vs OpenAI)

### 3. Quota Enforcement

**Plan Limits:**
- **Starter**: 500 chats/month
- **Growth**: 5,000 chats/month
- **Pro**: Unlimited (-1)

**Enforcement:**
- Checked **before** LLM call in `/chat` endpoint
- Returns `402 Payment Required` if quota exceeded
- Tenant isolation enforced (quota per tenant)

### 4. Token Counting

**LLM Providers Updated:**
- `GeminiProvider.generate_with_usage()`: Returns tokens + model used
- `OpenAIProvider.generate_with_usage()`: Returns tokens from API response
- Falls back to estimation if exact counts unavailable

### 5. Cost Calculation

**Pricing Table:**
- Gemini models: `gemini-pro`, `gemini-1.5-pro`, `gemini-1.5-flash`
- OpenAI models: `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Prices per 1M tokens (input/output separate)

**Cost Tracking:**
- Calculated automatically per request
- Aggregated in daily/monthly reports

### 6. API Endpoints

**GET `/billing/usage`**
- Get usage statistics (day or month)
- Returns: requests, tokens, cost, provider breakdown

**GET `/billing/limits`**
- Get current plan limits and usage
- Returns: plan name, limit, current usage, remaining

**POST `/billing/plan`**
- Set tenant subscription plan (admin only in prod)
- Validates plan name and updates limits

**GET `/billing/cost-report`**
- Get cost breakdown by provider and model
- Supports month or all-time range

## Integration Points

### `/chat` Endpoint Changes

1. **Quota Check**: Before LLM call
   ```python
   has_quota, quota_error = check_quota(db, tenant_id)
   if not has_quota:
       raise HTTPException(status_code=402, detail=quota_error)
   ```

2. **Usage Tracking**: After LLM call
   ```python
   usage_info = answer_result.get("usage")
   if usage_info:
       track_usage(db, tenant_id, user_id, kb_id, ...)
   ```

3. **Tenant Auto-Creation**: Ensures tenant exists in billing DB

## Security & Multi-Tenancy

- ✅ Tenant isolation enforced in all queries
- ✅ `tenant_id` from auth context (never from request body in prod)
- ✅ Usage tracking does not log sensitive content (only metadata)
- ✅ Admin-only plan changes in production mode

## Testing

**Test File:** `tests/test_billing.py`

**Test Cases:**
- Tenant creation
- Quota checking (pass/fail)
- Usage tracking
- Billing API endpoints
- Quota enforcement in chat endpoint

**Run Tests:**
```bash
pytest tests/test_billing.py -v
```

## Database Migration

**Initialize Tables:**
```bash
python scripts/create_billing_tables.py
```

**Manual Migration (Postgres):**
1. Export schema from SQLite
2. Create tables in Postgres
3. Update `DATABASE_URL` in config

## Configuration

**No new env vars required** - uses existing:
- `ENV`: Controls tenant security (dev/prod)
- Database auto-initializes on startup

## Future Enhancements

1. **Admin Dashboard**: Web UI for plan management
2. **Usage Alerts**: Email notifications at 80% quota
3. **Billing Integration**: Stripe/Paddle webhooks
4. **Cost Optimization**: Model selection based on cost/performance
5. **Usage Analytics**: Trends, peak hours, popular queries

## Files Changed

**New Files:**
- `app/db/database.py`: Database setup
- `app/db/models.py`: SQLAlchemy models
- `app/billing/pricing.py`: Pricing table
- `app/billing/quota.py`: Quota management
- `app/billing/usage_tracker.py`: Usage tracking
- `app/models/billing_schemas.py`: API schemas
- `scripts/create_billing_tables.py`: Migration script
- `tests/test_billing.py`: Tests

**Modified Files:**
- `app/main.py`: Added billing endpoints, quota check, usage tracking
- `app/rag/answer.py`: Added `generate_with_usage()` to providers
- `requirements.txt`: Added `sqlalchemy`
- `README.md`: Added billing documentation

## Summary

✅ **Complete Implementation:**
- Database models and migrations
- Usage tracking per request
- Quota enforcement (402 on exceed)
- Cost calculation and reporting
- Billing API endpoints
- Comprehensive tests
- Documentation

✅ **Production Ready:**
- Tenant isolation enforced
- No sensitive data logged
- Error handling and fallbacks
- Postgres-compatible schema

✅ **Non-Breaking:**
- Existing endpoints unchanged
- Backward compatible
- Optional feature (auto-creates tenants)

