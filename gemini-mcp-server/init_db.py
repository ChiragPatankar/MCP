#!/usr/bin/env python3
"""
Database initialization script for Gemini MCP Server
Run this script to create all database tables
"""

from database import engine, Base
from models import ChatMessage, User, Tenant
import os

def init_database():
    """Initialize the database with all tables"""
    print("🚀 Initializing database...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Show created tables
        print("\n📊 Created tables:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
        print(f"\n💾 Database location: {os.getenv('DATABASE_URL', 'sqlite:///./mcp_server.db')}")
        print("🎉 Database initialization complete!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    init_database() 