import google.generativeai as genai
import os
import re
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "your-api-key-here"))

# Predefined dashboard queries (Chart 1-6)
PREDEFINED_QUERIES = {
    "revenue_over_time": """
        SELECT DATE(order_date) as date, SUM(total_revenue) as revenue
        FROM amazon_sales
        GROUP BY DATE(order_date)
        ORDER BY date
    """,
    "revenue_by_category": """
        SELECT product_category, SUM(total_revenue) as revenue
        FROM amazon_sales
        GROUP BY product_category
        ORDER BY revenue DESC
    """,
    "revenue_by_region": """
        SELECT customer_region, SUM(total_revenue) as revenue
        FROM amazon_sales
        GROUP BY customer_region
        ORDER BY revenue DESC
    """,
    "payment_method_distribution": """
        SELECT payment_method, COUNT(order_id) as count
        FROM amazon_sales
        GROUP BY payment_method
        ORDER BY count DESC
    """,
    "discount_vs_sales": """
        SELECT discount_percent, SUM(quantity_sold) as quantity
        FROM amazon_sales
        GROUP BY discount_percent
        ORDER BY discount_percent
    """,
    "rating_vs_sales": """
        SELECT rating, SUM(quantity_sold) as quantity
        FROM amazon_sales
        GROUP BY rating
        ORDER BY rating
    """,
    "top_products": """
        SELECT product_id, SUM(total_revenue) as revenue
        FROM amazon_sales
        GROUP BY product_id
        ORDER BY revenue DESC
        LIMIT 10
    """
}

SCHEMA_CONTEXT = """
You are a SQL query generator for business intelligence. You have access to this database schema:

Table: amazon_sales
Columns: order_id (INT), order_date (DATE), product_id (INT), product_category (TEXT), 
price (FLOAT), discount_percent (INT), quantity_sold (INT), customer_region (TEXT), 
payment_method (TEXT), rating (FLOAT), review_count (INT), discounted_price (FLOAT), 
total_revenue (FLOAT)

Available categories: Books, Fashion, Sports, Electronics, Beauty, Home & Kitchen
Available regions: North America, Asia, Europe, Middle East
Available payment methods: UPI, Credit Card, Debit Card, Wallet, Cash on Delivery

Instructions:
1. Generate ONLY valid SQLite3 queries
2. For date-based queries, use DATE() function on order_date
3. Always use proper aggregations (SUM, COUNT, AVG, etc.)
4. Use GROUP BY when needed
5. Return only SELECT queries, never UPDATE or DELETE
6. Include ORDER BY for better results
7. Limit results to 100 rows for performance
8. If the user query is ambiguous or cannot be answered with the data, respond with: ERROR: Cannot answer this query
9. Format your response as valid SQL, nothing else
10. For multi-field queries, always return at least one aggregated column

User query: {query}

Generate the SQL query:
"""

# Follow-up query context
FOLLOWUP_CONTEXT = """
Previous query: {previous_query}
Previous context: {previous_context}
Current query: {current_query}

You are enhancing the previous query based on the current user input. 
Examples:
- "Now filter only Asia" → Add WHERE clause with Asia
- "Show me top 5" → Add LIMIT 5 and ORDER BY DESC
- "Group by region" → Modify GROUP BY clause

Return only the enhanced SQL query.
"""

def check_predefined_query(user_query: str) -> str | None:
    """Check if the query matches predefined dashboard queries"""
    query_lower = user_query.lower()
    
    # Revenue over time
    if any(kw in query_lower for kw in ["revenue trend", "sales trend", "revenue over time", "sales over time", "monthly sales", "daily sales", "revenue by date"]):
        return PREDEFINED_QUERIES["revenue_over_time"]
    
    # Revenue by category
    if any(kw in query_lower for kw in ["revenue by category", "category revenue", "sales by category", "category sales", "top categories", "product category revenue"]):
        return PREDEFINED_QUERIES["revenue_by_category"]
    
    # Revenue by region
    if any(kw in query_lower for kw in ["revenue by region", "region revenue", "sales by region", "region sales", "regional sales", "regional revenue"]):
        return PREDEFINED_QUERIES["revenue_by_region"]
    
    # Payment method distribution
    if any(kw in query_lower for kw in ["payment method", "payment distribution", "payment type", "payment breakdown"]):
        return PREDEFINED_QUERIES["payment_method_distribution"]
    
    # Discount vs sales
    if any(kw in query_lower for kw in ["discount", "discount sales", "discount impact", "does discount affect"]):
        return PREDEFINED_QUERIES["discount_vs_sales"]
    
    # Rating vs sales
    if any(kw in query_lower for kw in ["rating sales", "rating impact", "rating performance"]):
        return PREDEFINED_QUERIES["rating_vs_sales"]
    
    return None

def generate_sql_query(user_query: str, previous_query: str | None = None, previous_context: str | None = None) -> dict:
    """Generate SQL query from natural language using Gemini API with follow-up support"""
    try:
        # Check for predefined queries first
        predefined = check_predefined_query(user_query)
        if predefined:
            return {"success": True, "query": predefined, "error": None}
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Handle follow-up queries
        if previous_query and previous_context:
            prompt = FOLLOWUP_CONTEXT.format(
                previous_query=previous_query,
                previous_context=previous_context,
                current_query=user_query
            )
        else:
            prompt = SCHEMA_CONTEXT.format(query=user_query)
        
        response = model.generate_content(prompt)
        sql_query = response.text.strip()
        
        # Check for error responses
        if sql_query.startswith("ERROR:"):
            return {"success": False, "query": None, "error": sql_query}
        
        # Extract SQL from markdown code blocks if present
        if "```sql" in sql_query:
            sql_query = sql_query.split("```sql")[1].split("```")[0].strip()
        elif "```" in sql_query:
            sql_query = sql_query.split("```")[1].split("```")[0].strip()
        
        return {"success": True, "query": sql_query, "error": None}
    except Exception as e:
        error_msg = str(e)
        # If quota exceeded, return a helpful fallback
        if "429" in error_msg or "quota" in error_msg.lower():
            fallback_query = PREDEFINED_QUERIES.get("revenue_over_time")
            return {
                "success": True, 
                "query": fallback_query, 
                "error": None,
                "note": "Using demo chart due to API quota limit. Try our predefined dashboards or upgrade API."
            }
        return {"success": False, "query": None, "error": f"Failed to generate SQL: {str(e)}"}

def validate_query(query: str) -> bool:
    """Validate that the query is safe and contains SELECT only"""
    query_upper = query.upper().strip()
    
    # Check for dangerous operations
    dangerous = ["DELETE", "DROP", "INSERT", "UPDATE", "ALTER", "CREATE", "PRAGMA"]
    for op in dangerous:
        if op in query_upper:
            return False
    
    # Must be a SELECT query
    if not query_upper.startswith("SELECT"):
        return False
    
    # Check query length
    if len(query) > 1000:
        return False
    
    return True

def get_query_metadata(user_query: str) -> dict:
    """Extract metadata about the query to help with insights"""
    query_lower = user_query.lower()
    
    metadata = {
        "has_time_component": any(kw in query_lower for kw in ["trend", "over time", "daily", "monthly", "yearly"]),
        "has_regional_component": any(kw in query_lower for kw in ["region", "country", "area"]),
        "has_category_component": any(kw in query_lower for kw in ["category", "product", "type"]),
        "has_comparison": any(kw in query_lower for kw in ["vs", "versus", "compare", "comparison"]),
        "has_ranking": any(kw in query_lower for kw in ["top", "bottom", "highest", "lowest", "rank"]),
    }
    
    return metadata
