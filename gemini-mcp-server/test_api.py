#!/usr/bin/env python3
"""
Simple test script for Gemini MCP Server API
Run this after starting the server to verify it's working
"""

import requests
import json
import time

# Server configuration
BASE_URL = "http://localhost:8000"
AUTH_TOKEN = "test-token"  # Replace with actual token

def test_endpoint(endpoint, method="GET", data=None):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    headers = {
        "Content-Type": "application/json",
        "x-mcp-auth": AUTH_TOKEN
    }
    
    try:
        if method == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=30)
        else:
            response = requests.get(url, timeout=10)
            
        print(f"✅ {method} {endpoint}: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
        else:
            print(f"   Error: {response.text}")
            
        return response.status_code == 200
        
    except requests.exceptions.RequestException as e:
        print(f"❌ {method} {endpoint}: Connection error - {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Gemini MCP Server API...")
    print(f"🌐 Server: {BASE_URL}")
    print("-" * 50)
    
    tests = [
        ("Root endpoint", "/", "GET"),
        ("Health check", "/mcp/health", "GET"),
        ("Version info", "/mcp/version", "GET"),
        ("Capabilities", "/mcp/capabilities", "GET"),
    ]
    
    # Test basic endpoints
    for name, endpoint, method in tests:
        print(f"\n🔍 Testing {name}...")
        test_endpoint(endpoint, method)
    
    # Test process endpoint
    print(f"\n🔍 Testing MCP Process...")
    test_data = {
        "query": "Hello, can you help me with my account?",
        "user_id": "test_user_123",
        "priority": "normal",
        "mcp_version": "1.0"
    }
    test_endpoint("/mcp/process", "POST", test_data)
    
    # Test batch endpoint
    print(f"\n🔍 Testing MCP Batch...")
    batch_data = {
        "queries": ["How do I reset my password?", "What are your business hours?"],
        "user_id": "test_user_123",
        "mcp_version": "1.0"
    }
    test_endpoint("/mcp/batch", "POST", batch_data)
    
    print("\n🎉 API testing complete!")

if __name__ == "__main__":
    main() 