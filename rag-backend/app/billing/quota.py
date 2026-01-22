"""
Quota management and enforcement.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Optional, Tuple
import logging

from app.db.models import TenantPlan, UsageMonthly, Tenant
logger = logging.getLogger(__name__)

# Plan limits (chats per month)
PLAN_LIMITS = {
    "starter": 500,
    "growth": 5000,
    "pro": -1  # -1 means unlimited
}


def get_tenant_plan(db: Session, tenant_id: str) -> Optional[TenantPlan]:
    """Get tenant's current plan."""
    return db.query(TenantPlan).filter(TenantPlan.tenant_id == tenant_id).first()


def get_monthly_usage(db: Session, tenant_id: str, year: Optional[int] = None, month: Optional[int] = None) -> Optional[UsageMonthly]:
    """Get monthly usage for tenant."""
    now = datetime.utcnow()
    target_year = year or now.year
    target_month = month or now.month
    
    return db.query(UsageMonthly).filter(
        and_(
            UsageMonthly.tenant_id == tenant_id,
            UsageMonthly.year == target_year,
            UsageMonthly.month == target_month
        )
    ).first()


def check_quota(db: Session, tenant_id: str) -> Tuple[bool, Optional[str]]:
    """
    Check if tenant has quota remaining for the current month.
    
    Returns:
        (has_quota, error_message)
        has_quota: True if quota available, False if exceeded
        error_message: None if quota available, error message if exceeded
    """
    # Get tenant plan
    plan = get_tenant_plan(db, tenant_id)
    
    if not plan:
        # Default to starter plan if no plan assigned
        logger.warning(f"Tenant {tenant_id} has no plan assigned, defaulting to starter")
        monthly_limit = PLAN_LIMITS.get("starter", 500)
    else:
        monthly_limit = plan.monthly_chat_limit
    
    # Unlimited plan (-1) always passes
    if monthly_limit == -1:
        return True, None
    
    # Get current month usage
    now = datetime.utcnow()
    monthly_usage = get_monthly_usage(db, tenant_id, now.year, now.month)
    
    current_usage = monthly_usage.total_requests if monthly_usage else 0
    
    # Check if quota exceeded
    if current_usage >= monthly_limit:
        return False, f"AI quota exceeded ({current_usage}/{monthly_limit} chats this month). Upgrade your plan."
    
    return True, None


def ensure_tenant_exists(db: Session, tenant_id: str) -> None:
    """Ensure tenant record exists in database."""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        # Create tenant with default starter plan
        tenant = Tenant(id=tenant_id, name=f"Tenant {tenant_id}")
        db.add(tenant)
        
        # Create default starter plan
        plan = TenantPlan(
            tenant_id=tenant_id,
            plan_name="starter",
            monthly_chat_limit=PLAN_LIMITS["starter"]
        )
        db.add(plan)
        db.commit()
        logger.info(f"Created tenant {tenant_id} with starter plan")


def set_tenant_plan(db: Session, tenant_id: str, plan_name: str) -> TenantPlan:
    """
    Set tenant's subscription plan.
    
    Args:
        db: Database session
        tenant_id: Tenant ID
        plan_name: "starter", "growth", or "pro"
        
    Returns:
        Updated TenantPlan
    """
    if plan_name not in PLAN_LIMITS:
        raise ValueError(f"Invalid plan name: {plan_name}. Must be one of: {list(PLAN_LIMITS.keys())}")
    
    # Ensure tenant exists
    ensure_tenant_exists(db, tenant_id)
    
    # Get or create plan
    plan = get_tenant_plan(db, tenant_id)
    if plan:
        plan.plan_name = plan_name
        plan.monthly_chat_limit = PLAN_LIMITS[plan_name]
        plan.updated_at = datetime.utcnow()
    else:
        plan = TenantPlan(
            tenant_id=tenant_id,
            plan_name=plan_name,
            monthly_chat_limit=PLAN_LIMITS[plan_name]
        )
        db.add(plan)
    
    db.commit()
    db.refresh(plan)
    return plan

