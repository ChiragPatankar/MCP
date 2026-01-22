"""
Database models for billing and usage tracking.
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional

from app.db.database import Base


class Tenant(Base):
    """Tenant/organization model."""
    __tablename__ = "tenants"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    plan = relationship("TenantPlan", back_populates="tenant", uselist=False)
    usage_events = relationship("UsageEvent", back_populates="tenant")
    daily_usage = relationship("UsageDaily", back_populates="tenant")
    monthly_usage = relationship("UsageMonthly", back_populates="tenant")


class TenantPlan(Base):
    """Tenant subscription plan."""
    __tablename__ = "tenant_plans"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String, ForeignKey("tenants.id"), unique=True, nullable=False, index=True)
    plan_name = Column(String, nullable=False, index=True)  # "starter", "growth", "pro"
    monthly_chat_limit = Column(Integer, nullable=False)  # -1 for unlimited
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="plan")


class UsageEvent(Base):
    """Individual usage event (each /chat request)."""
    __tablename__ = "usage_events"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(String, unique=True, nullable=False, index=True)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)
    kb_id = Column(String, nullable=False)
    
    # LLM details
    provider = Column(String, nullable=False)  # "gemini" or "openai"
    model = Column(String, nullable=False)
    
    # Token usage
    prompt_tokens = Column(Integer, nullable=False, default=0)
    completion_tokens = Column(Integer, nullable=False, default=0)
    total_tokens = Column(Integer, nullable=False, default=0)
    
    # Cost tracking
    estimated_cost_usd = Column(Float, nullable=False, default=0.0)
    
    # Timestamp
    request_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="usage_events")


class UsageDaily(Base):
    """Daily aggregated usage per tenant."""
    __tablename__ = "usage_daily"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    
    # Aggregated metrics
    total_requests = Column(Integer, nullable=False, default=0)
    total_tokens = Column(Integer, nullable=False, default=0)
    total_cost_usd = Column(Float, nullable=False, default=0.0)
    
    # Provider breakdown
    gemini_requests = Column(Integer, nullable=False, default=0)
    openai_requests = Column(Integer, nullable=False, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Unique constraint: one record per tenant per day
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )
    
    # Relationships
    tenant = relationship("Tenant", back_populates="daily_usage")


class UsageMonthly(Base):
    """Monthly aggregated usage per tenant."""
    __tablename__ = "usage_monthly"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    month = Column(Integer, nullable=False, index=True)  # 1-12
    
    # Aggregated metrics
    total_requests = Column(Integer, nullable=False, default=0)
    total_tokens = Column(Integer, nullable=False, default=0)
    total_cost_usd = Column(Float, nullable=False, default=0.0)
    
    # Provider breakdown
    gemini_requests = Column(Integer, nullable=False, default=0)
    openai_requests = Column(Integer, nullable=False, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Unique constraint: one record per tenant per month
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )
    
    # Relationships
    tenant = relationship("Tenant", back_populates="monthly_usage")

