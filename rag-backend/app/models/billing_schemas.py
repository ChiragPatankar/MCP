"""
Pydantic schemas for billing endpoints.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UsageResponse(BaseModel):
    """Usage statistics response."""
    tenant_id: str
    period: str  # "day" or "month"
    total_requests: int
    total_tokens: int
    total_cost_usd: float
    gemini_requests: int = 0
    openai_requests: int = 0
    start_date: datetime
    end_date: datetime


class PlanLimitsResponse(BaseModel):
    """Current plan limits response."""
    tenant_id: str
    plan_name: str
    monthly_chat_limit: int  # -1 for unlimited
    current_month_usage: int
    remaining_chats: Optional[int]  # None if unlimited


class CostReportResponse(BaseModel):
    """Cost report response."""
    tenant_id: str
    period: str
    total_cost_usd: float
    total_requests: int
    total_tokens: int
    breakdown_by_provider: dict
    breakdown_by_model: dict


class SetPlanRequest(BaseModel):
    """Request to set tenant plan."""
    tenant_id: str
    plan_name: str  # "starter", "growth", or "pro"

