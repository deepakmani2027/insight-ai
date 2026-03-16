import sqlite3
import pandas as pd
import os
from pathlib import Path

DATABASE_PATH = Path(__file__).parent.parent / "data" / "amazon_sales.db"
CSV_PATH = Path(__file__).parent.parent / "data" / "amazon_sales.csv"

def init_database():
    """Initialize SQLite database and load Amazon Sales data"""
    
    # Create data directory if it doesn't exist
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Create connection
    conn = sqlite3.connect(str(DATABASE_PATH))
    cursor = conn.cursor()
    
    # Check if table already exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='amazon_sales'")
    table_exists = cursor.fetchone() is not None
    
    if not table_exists:
        # Create table
        cursor.execute("""
        CREATE TABLE amazon_sales (
            order_id INTEGER PRIMARY KEY,
            order_date TEXT,
            product_id INTEGER,
            product_category TEXT,
            price REAL,
            discount_percent INTEGER,
            quantity_sold INTEGER,
            customer_region TEXT,
            payment_method TEXT,
            rating REAL,
            review_count INTEGER,
            discounted_price REAL,
            total_revenue REAL
        )
        """)
        
        # Create indexes for faster queries
        cursor.execute("CREATE INDEX idx_order_date ON amazon_sales(order_date)")
        cursor.execute("CREATE INDEX idx_category ON amazon_sales(product_category)")
        cursor.execute("CREATE INDEX idx_region ON amazon_sales(customer_region)")
        cursor.execute("CREATE INDEX idx_payment ON amazon_sales(payment_method)")
        
        # Load CSV data if it exists
        if CSV_PATH.exists():
            try:
                df = pd.read_csv(str(CSV_PATH))
                # Clean up column names
                df.columns = df.columns.str.lower().str.strip()
                df.to_sql('amazon_sales', conn, if_exists='append', index=False)
                print(f"Loaded {len(df)} rows from {CSV_PATH}")
            except Exception as e:
                print(f"Error loading CSV: {e}")
        
        conn.commit()
        print(f"Database initialized at {DATABASE_PATH}")
    
    conn.close()
    return DATABASE_PATH

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def execute_query(query: str):
    """Execute SQL query and return results"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        
        # Convert to list of dicts
        data = [dict(row) for row in results]
        return {"success": True, "data": data, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e)}

if __name__ == "__main__":
    init_database()
