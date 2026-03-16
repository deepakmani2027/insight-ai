#!/usr/bin/env python3
import sqlite3
from pathlib import Path
import random
from datetime import datetime, timedelta

# Database path
db_path = Path(__file__).parent.parent / "data" / "amazon_sales.db"
db_path.parent.mkdir(parents=True, exist_ok=True)

# Create connection
conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Drop existing table if exists
cursor.execute("DROP TABLE IF EXISTS amazon_sales")

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

# Insert sample data
categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports']
regions = ['Asia', 'North America', 'Europe', 'Middle East', 'Africa']
payment_methods = ['Credit Card', 'UPI', 'Debit Card', 'PayPal', 'Cash']

base_date = datetime(2023, 1, 1)
for i in range(1, 5001):
    order_date = base_date + timedelta(days=random.randint(0, 365))
    product_category = random.choice(categories)
    quantity = random.randint(1, 10)
    discount = random.randint(0, 30)
    price = round(random.uniform(10, 500), 2)
    discounted_price = round(price * (1 - discount/100), 2)
    total_revenue = round(discounted_price * quantity, 2)
    rating = round(random.uniform(1, 5), 1)
    review_count = random.randint(0, 5000)
    
    cursor.execute("""
    INSERT INTO amazon_sales VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (i, order_date.strftime('%Y-%m-%d'), random.randint(1000, 9999),
          product_category, price, discount, quantity, 
          random.choice(regions), random.choice(payment_methods),
          rating, review_count, discounted_price, total_revenue))

conn.commit()
conn.close()

print(f"✅ Database created with 5000 sample records at {db_path}")
