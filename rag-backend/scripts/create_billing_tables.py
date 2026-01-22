"""
Create billing database tables.
Run this script to initialize the billing database.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.database import init_db, engine
from app.db.models import Base

def main():
    """Create all billing tables."""
    print("Creating billing database tables...")
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Billing tables created successfully!")
        print("\nTables created:")
        print("  - tenants")
        print("  - tenant_plans")
        print("  - usage_events")
        print("  - usage_daily")
        print("  - usage_monthly")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

