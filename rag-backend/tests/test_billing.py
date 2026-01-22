"""
Tests for billing and usage tracking.
"""
import pytest
import httpx
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.database import get_db, init_db
from app.db.models import Tenant, TenantPlan, UsageEvent, UsageMonthly
from app.billing.quota import check_quota, set_tenant_plan, get_monthly_usage
from app.billing.usage_tracker import track_usage

BASE_URL = "http://localhost:8000"


@pytest.fixture(scope="module")
def db_session():
    """Get database session."""
    init_db()
    db = next(get_db())
    yield db
    db.close()


@pytest.fixture(scope="module")
def client():
    """HTTP client."""
    return httpx.Client(base_url=BASE_URL, timeout=30.0)


def test_tenant_creation(db_session: Session):
    """Test tenant creation."""
    tenant_id = "test_tenant_billing"
    
    # Clean up if exists
    db_session.query(TenantPlan).filter(TenantPlan.tenant_id == tenant_id).delete()
    db_session.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db_session.commit()
    
    # Create tenant via set_tenant_plan (should auto-create tenant)
    plan = set_tenant_plan(db_session, tenant_id, "starter")
    
    assert plan.tenant_id == tenant_id
    assert plan.plan_name == "starter"
    assert plan.monthly_chat_limit == 500
    
    # Verify tenant exists
    tenant = db_session.query(Tenant).filter(Tenant.id == tenant_id).first()
    assert tenant is not None
    assert tenant.id == tenant_id


def test_quota_checking(db_session: Session):
    """Test quota checking."""
    tenant_id = "test_quota_tenant"
    
    # Clean up
    db_session.query(UsageMonthly).filter(UsageMonthly.tenant_id == tenant_id).delete()
    db_session.query(TenantPlan).filter(TenantPlan.tenant_id == tenant_id).delete()
    db_session.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db_session.commit()
    
    # Set starter plan (500 chats/month)
    set_tenant_plan(db_session, tenant_id, "starter")
    
    # Check quota - should pass
    has_quota, error = check_quota(db_session, tenant_id)
    assert has_quota is True
    assert error is None
    
    # Manually set usage to exceed limit
    now = datetime.utcnow()
    monthly_usage = UsageMonthly(
        tenant_id=tenant_id,
        year=now.year,
        month=now.month,
        total_requests=500,  # At limit
        total_tokens=100000,
        total_cost_usd=0.5
    )
    db_session.add(monthly_usage)
    db_session.commit()
    
    # Check quota - should fail
    has_quota, error = check_quota(db_session, tenant_id)
    assert has_quota is False
    assert "quota exceeded" in error.lower()
    
    # Test unlimited plan
    set_tenant_plan(db_session, tenant_id, "pro")
    has_quota, error = check_quota(db_session, tenant_id)
    assert has_quota is True  # Unlimited always passes


def test_usage_tracking(db_session: Session):
    """Test usage tracking."""
    tenant_id = "test_usage_tenant"
    user_id = "test_user"
    kb_id = "test_kb"
    
    # Clean up
    db_session.query(UsageEvent).filter(UsageEvent.tenant_id == tenant_id).delete()
    db_session.query(UsageMonthly).filter(UsageMonthly.tenant_id == tenant_id).delete()
    db_session.query(TenantPlan).filter(TenantPlan.tenant_id == tenant_id).delete()
    db_session.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db_session.commit()
    
    # Track usage
    usage_event = track_usage(
        db=db_session,
        tenant_id=tenant_id,
        user_id=user_id,
        kb_id=kb_id,
        provider="gemini",
        model="gemini-pro",
        prompt_tokens=100,
        completion_tokens=50
    )
    
    assert usage_event.tenant_id == tenant_id
    assert usage_event.user_id == user_id
    assert usage_event.provider == "gemini"
    assert usage_event.model == "gemini-pro"
    assert usage_event.prompt_tokens == 100
    assert usage_event.completion_tokens == 50
    assert usage_event.total_tokens == 150
    assert usage_event.estimated_cost_usd > 0
    
    # Verify monthly aggregation
    now = datetime.utcnow()
    monthly = get_monthly_usage(db_session, tenant_id, now.year, now.month)
    assert monthly is not None
    assert monthly.total_requests == 1
    assert monthly.total_tokens == 150
    assert monthly.gemini_requests == 1


def test_billing_endpoints(client: httpx.Client):
    """Test billing API endpoints."""
    tenant_id = "test_billing_api"
    headers = {
        "X-Tenant-Id": tenant_id,
        "X-User-Id": "test_user"
    }
    
    # Test get limits
    response = client.get("/billing/limits", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tenant_id"] == tenant_id
    assert "plan_name" in data
    assert "monthly_chat_limit" in data
    assert "current_month_usage" in data
    
    # Test get usage
    response = client.get("/billing/usage?range=month", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tenant_id"] == tenant_id
    assert data["period"] == "month"
    assert "total_requests" in data
    assert "total_cost_usd" in data
    
    # Test cost report
    response = client.get("/billing/cost-report?range=month", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tenant_id"] == tenant_id
    assert "breakdown_by_provider" in data
    assert "breakdown_by_model" in data


def test_quota_enforcement(client: httpx.Client, db_session: Session):
    """Test quota enforcement in chat endpoint."""
    tenant_id = "test_quota_enforcement"
    headers = {
        "X-Tenant-Id": tenant_id,
        "X-User-Id": "test_user"
    }
    
    # Clean up
    db_session.query(UsageMonthly).filter(UsageMonthly.tenant_id == tenant_id).delete()
    db_session.query(TenantPlan).filter(TenantPlan.tenant_id == tenant_id).delete()
    db_session.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db_session.commit()
    
    # Set plan with very low limit
    set_tenant_plan(db_session, tenant_id, "starter")
    
    # Manually exceed quota
    now = datetime.utcnow()
    monthly_usage = UsageMonthly(
        tenant_id=tenant_id,
        year=now.year,
        month=now.month,
        total_requests=500,  # At limit
        total_tokens=100000,
        total_cost_usd=0.5
    )
    db_session.add(monthly_usage)
    db_session.commit()
    
    # Try to make chat request - should fail with 402
    response = client.post(
        "/chat",
        json={
            "tenant_id": tenant_id,
            "user_id": "test_user",
            "kb_id": "test_kb",
            "question": "Test question"
        },
        headers=headers
    )
    
    assert response.status_code == 402
    assert "quota exceeded" in response.json()["detail"].lower()

