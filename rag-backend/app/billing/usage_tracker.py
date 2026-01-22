"""
Usage tracking service.
Tracks token usage and costs for each LLM request.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Optional
import uuid
import logging

from app.db.models import UsageEvent, UsageDaily, UsageMonthly, Tenant
from app.billing.pricing import calculate_cost
from app.billing.quota import ensure_tenant_exists

logger = logging.getLogger(__name__)


def track_usage(
    db: Session,
    tenant_id: str,
    user_id: str,
    kb_id: str,
    provider: str,
    model: str,
    prompt_tokens: int,
    completion_tokens: int,
    request_timestamp: Optional[datetime] = None
) -> UsageEvent:
    """
    Track a single usage event.
    
    Args:
        db: Database session
        tenant_id: Tenant ID
        user_id: User ID
        kb_id: Knowledge base ID
        provider: "gemini" or "openai"
        model: Model name
        prompt_tokens: Input tokens
        completion_tokens: Output tokens
        request_timestamp: Request timestamp (defaults to now)
        
    Returns:
        Created UsageEvent
    """
    # Ensure tenant exists
    ensure_tenant_exists(db, tenant_id)
    
    # Calculate cost
    total_tokens = prompt_tokens + completion_tokens
    estimated_cost = calculate_cost(provider, model, prompt_tokens, completion_tokens)
    
    # Create usage event
    request_id = f"req_{uuid.uuid4().hex[:16]}"
    timestamp = request_timestamp or datetime.utcnow()
    
    usage_event = UsageEvent(
        request_id=request_id,
        tenant_id=tenant_id,
        user_id=user_id,
        kb_id=kb_id,
        provider=provider,
        model=model,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=total_tokens,
        estimated_cost_usd=estimated_cost,
        request_timestamp=timestamp
    )
    
    db.add(usage_event)
    
    # Update daily aggregation
    _update_daily_usage(db, tenant_id, timestamp, provider, total_tokens, estimated_cost)
    
    # Update monthly aggregation
    _update_monthly_usage(db, tenant_id, timestamp, provider, total_tokens, estimated_cost)
    
    db.commit()
    db.refresh(usage_event)
    
    logger.info(
        f"Tracked usage: tenant={tenant_id}, provider={provider}, "
        f"tokens={total_tokens}, cost=${estimated_cost:.6f}"
    )
    
    return usage_event


def _update_daily_usage(
    db: Session,
    tenant_id: str,
    timestamp: datetime,
    provider: str,
    tokens: int,
    cost: float
):
    """Update daily usage aggregation."""
    date = timestamp.date()
    date_start = datetime.combine(date, datetime.min.time())
    
    daily = db.query(UsageDaily).filter(
        and_(
            UsageDaily.tenant_id == tenant_id,
            UsageDaily.date == date_start
        )
    ).first()
    
    if daily:
        daily.total_requests += 1
        daily.total_tokens += tokens
        daily.total_cost_usd += cost
        if provider == "gemini":
            daily.gemini_requests += 1
        elif provider == "openai":
            daily.openai_requests += 1
        daily.updated_at = datetime.utcnow()
    else:
        daily = UsageDaily(
            tenant_id=tenant_id,
            date=date_start,
            total_requests=1,
            total_tokens=tokens,
            total_cost_usd=cost,
            gemini_requests=1 if provider == "gemini" else 0,
            openai_requests=1 if provider == "openai" else 0
        )
        db.add(daily)


def _update_monthly_usage(
    db: Session,
    tenant_id: str,
    timestamp: datetime,
    provider: str,
    tokens: int,
    cost: float
):
    """Update monthly usage aggregation."""
    year = timestamp.year
    month = timestamp.month
    
    monthly = db.query(UsageMonthly).filter(
        and_(
            UsageMonthly.tenant_id == tenant_id,
            UsageMonthly.year == year,
            UsageMonthly.month == month
        )
    ).first()
    
    if monthly:
        monthly.total_requests += 1
        monthly.total_tokens += tokens
        monthly.total_cost_usd += cost
        if provider == "gemini":
            monthly.gemini_requests += 1
        elif provider == "openai":
            monthly.openai_requests += 1
        monthly.updated_at = datetime.utcnow()
    else:
        monthly = UsageMonthly(
            tenant_id=tenant_id,
            year=year,
            month=month,
            total_requests=1,
            total_tokens=tokens,
            total_cost_usd=cost,
            gemini_requests=1 if provider == "gemini" else 0,
            openai_requests=1 if provider == "openai" else 0
        )
        db.add(monthly)

