#!/usr/bin/env python3
"""
Setup script for InsightAI backend
Initializes database and loads Amazon Sales data
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from database import init_database

if __name__ == "__main__":
    print("🚀 Initializing InsightAI Database...")
    try:
        db_path = init_database()
        print(f"✅ Database initialized successfully at: {db_path}")
        print("📊 Amazon Sales data loaded into database")
        print("\nNext steps:")
        print("1. Set GEMINI_API_KEY environment variable")
        print("2. Run: npm run dev (frontend)")
        print("3. In another terminal: npm run dev:backend (backend API)")
        print("4. Visit: http://localhost:3000")
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        sys.exit(1)
