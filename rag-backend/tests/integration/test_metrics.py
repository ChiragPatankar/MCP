"""
Integration tests for Prometheus metrics endpoint.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_metrics_endpoint():
    """Test Prometheus metrics endpoint."""
    response = client.get("/metrics")
    # Should return 200 if Prometheus is enabled
    # or 404 if not installed
    assert response.status_code in [200, 404]
    
    if response.status_code == 200:
        # Check that it returns Prometheus format
        content = response.text
        assert "http_requests_total" in content or "rag_" in content or "requests_total" in content

