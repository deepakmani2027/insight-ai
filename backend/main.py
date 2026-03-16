from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sqlite3
from pathlib import Path
import pandas as pd
import io
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from database import init_database, execute_query, get_db_connection, DATABASE_PATH
from sql_generator import generate_sql_query, validate_query, get_query_metadata, PREDEFINED_QUERIES
from chart_selector import select_chart_type, prepare_chart_data
from insight_generator import generate_insights, generate_kpi_summary

# Initialize database if it doesn't exist
if not DATABASE_PATH.exists():
    init_database()

# Create FastAPI app
app = FastAPI(title="InsightAI API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory conversation history for follow-up queries
conversation_history = {
    "last_query": None,
    "last_sql": None,
    "last_data": None,
    "query_context": None,
    "previous_filters": []
}

# Models
class QueryRequest(BaseModel):
    query: str
    is_followup: bool = False

class QueryResponse(BaseModel):
    success: bool
    sql_query: str | None
    chart_type: str
    data: list | None
    insights: str | None
    error: str | None
    query_metadata: dict | None = None

class DashboardChartRequest(BaseModel):
    chart_id: str  # "revenue_over_time", "revenue_by_category", etc.


def run_predefined_query(chart_id: str):
    """Execute a predefined query and return (data, chart_type)."""

    chart_types = {
        "revenue_over_time": "line",
        "revenue_by_category": "bar",
        "revenue_by_region": "pie",
        "payment_method_distribution": "donut",
        "discount_vs_sales": "scatter",
        "rating_vs_sales": "scatter",
        "top_products": "bar",
    }

    if chart_id not in PREDEFINED_QUERIES:
        raise HTTPException(status_code=400, detail="Invalid chart ID")

    sql_query = PREDEFINED_QUERIES[chart_id]
    result = execute_query(sql_query)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    data = result.get("data", [])
    chart_type = chart_types.get(chart_id, "bar")
    return data, chart_type, sql_query

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "InsightAI API is running"}

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process natural language query and return dashboard data with follow-up support"""
    
    # Get query metadata for context
    query_metadata = get_query_metadata(request.query)
    
    # Handle follow-up queries
    previous_query = conversation_history["last_sql"] if request.is_followup else None
    previous_context = conversation_history["query_context"] if request.is_followup else None
    
    # Generate SQL from natural language
    sql_response = generate_sql_query(request.query, previous_query, previous_context)
    
    if not sql_response["success"]:
        return QueryResponse(
            success=False,
            sql_query=None,
            chart_type="bar",
            data=None,
            insights=None,
            error=sql_response["error"],
            query_metadata=query_metadata
        )
    
    sql_query = sql_response["query"]
    
    # Validate query
    if not validate_query(sql_query):
        return QueryResponse(
            success=False,
            sql_query=sql_query,
            chart_type="bar",
            data=None,
            insights=None,
            error="Invalid query generated",
            query_metadata=query_metadata
        )
    
    # Execute query
    result = execute_query(sql_query)
    
    if not result["success"]:
        return QueryResponse(
            success=False,
            sql_query=sql_query,
            chart_type="bar",
            data=None,
            insights=None,
            error=result["error"],
            query_metadata=query_metadata
        )
    
    data = result["data"]
    
    # Select chart type
    if data:
        columns = list(data[0].keys())
        chart_type = select_chart_type(data, columns)
    else:
        chart_type = "bar"
    
    # Generate insights
    insights = generate_insights(data, request.query) if data else None
    
    # Update conversation history for follow-up queries
    conversation_history["last_query"] = request.query
    conversation_history["last_sql"] = sql_query
    conversation_history["last_data"] = data
    conversation_history["query_context"] = f"Previous results: {len(data) if data else 0} rows"
    
    return QueryResponse(
        success=True,
        sql_query=sql_query,
        chart_type=chart_type,
        data=data,
        insights=insights,
        error=None,
        query_metadata=query_metadata
    )

@app.post("/dashboard-chart")
async def get_dashboard_chart(request: DashboardChartRequest):
    """Get one of the 6 predefined dashboard charts"""
    
    data, chart_type, sql_query = run_predefined_query(request.chart_id)

    return {
        "success": True,
        "chart_id": request.chart_id,
        "chart_type": chart_type,
        "data": data,
        "sql_query": sql_query
    }

@app.get("/kpis")
async def get_kpis():
    """Get KPI metrics"""
    
    kpi_queries = {
        "revenue": "SELECT SUM(total_revenue) as value FROM amazon_sales",
        "orders": "SELECT COUNT(order_id) as value FROM amazon_sales",
        "products_sold": "SELECT SUM(quantity_sold) as value FROM amazon_sales",
        "avg_rating": "SELECT AVG(rating) as value FROM amazon_sales",
        "reviews": "SELECT SUM(review_count) as value FROM amazon_sales",
    }
    
    kpis = {}
    for key, query in kpi_queries.items():
        result = execute_query(query)
        if result["success"] and result["data"]:
            kpis[key] = result["data"][0]["value"]
        else:
            kpis[key] = 0
    
    return {
        "revenue": float(kpis.get("revenue", 0) or 0),
        "orders": int(kpis.get("orders", 0) or 0),
        "products_sold": int(kpis.get("products_sold", 0) or 0),
        "avg_rating": float(kpis.get("avg_rating", 0) or 0),
        "reviews": int(kpis.get("reviews", 0) or 0),
    }


@app.get("/dashboard-insights")
async def get_dashboard_insights():
    """Return quick AI-style insights for the default dashboard cards without calling the LLM."""

    summary_queries = {
        "category": PREDEFINED_QUERIES["revenue_by_category"],
        "region": PREDEFINED_QUERIES["revenue_by_region"],
        "payment": PREDEFINED_QUERIES["payment_method_distribution"],
        "top_products": PREDEFINED_QUERIES["top_products"],
    }

    results: dict[str, list[dict]] = {}
    for key, query in summary_queries.items():
        data_result = execute_query(query)
        if not data_result["success"]:
            raise HTTPException(status_code=500, detail=data_result.get("error", "Failed to compute insights"))
        results[key] = data_result.get("data", [])

    # Reuse KPI data for totals/averages
    kpi_result = await get_kpis()

    def pick_top(data: list[dict], value_key: str) -> tuple[str, float]:
        if not data:
            return ("N/A", 0.0)
        top_row = max(data, key=lambda row: float(row.get(value_key, 0) or 0))
        label_key = [k for k in top_row.keys() if k != value_key]
        label = str(top_row.get(label_key[0], "N/A")) if label_key else "N/A"
        return (label, float(top_row.get(value_key, 0) or 0))

    top_category, category_value = pick_top(results.get("category", []), "revenue")
    top_region, region_value = pick_top(results.get("region", []), "revenue")
    top_payment, payment_count = pick_top(results.get("payment", []), "count")
    top_product, product_value = pick_top(results.get("top_products", []), "revenue")

    insights = [
        f"{top_category} category drives ${category_value:,.0f} in revenue, leading all product groups.",
        f"{top_region} contributes ${region_value:,.0f} in revenue, making it the strongest region.",
        f"{top_payment} is the preferred payment method with {int(payment_count):,} orders.",
        f"Top product #{top_product} has generated ${product_value:,.0f}; consider featuring similar items.",
        f"Overall revenue stands at ${kpi_result.get('revenue', 0):,.0f} across {kpi_result.get('orders', 0):,} orders with an average rating of {kpi_result.get('avg_rating', 0):.1f}.",
    ]

    return {
        "success": True,
        "insights": insights,
        "highlights": {
            "top_category": {"label": top_category, "value": category_value},
            "top_region": {"label": top_region, "value": region_value},
            "top_payment": {"label": top_payment, "value": payment_count},
            "top_product": {"label": top_product, "value": product_value},
        },
        "kpis": kpi_result,
    }

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and process CSV file with schema detection"""
    
    try:
        # Read CSV
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Create new table
        table_name = file.filename.split('.')[0].lower().replace(' ', '_')
        
        conn = get_db_connection()
        df.to_sql(table_name, conn, if_exists='replace', index=False)
        conn.close()
        
        return {
            "success": True,
            "table_name": table_name,
            "rows": len(df),
            "columns": list(df.columns),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "message": f"Successfully uploaded {table_name} with {len(df)} rows and {len(df.columns)} columns"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/dashboard-data")
async def get_dashboard_data():
    """Return KPIs plus all dashboard chart datasets in one call."""

    kpis = await get_kpis()

    chart_ids = [
        "revenue_over_time",
        "revenue_by_category",
        "revenue_by_region",
        "payment_method_distribution",
        "discount_vs_sales",
        "rating_vs_sales",
        "top_products",
    ]

    charts: dict[str, dict] = {}
    for cid in chart_ids:
        data, chart_type, sql_query = run_predefined_query(cid)
        charts[cid] = {
            "data": data,
            "chart_type": chart_type,
            "sql_query": sql_query,
        }

    return {
        "success": True,
        "kpis": kpis,
        "revenue_trend": charts["revenue_over_time"]["data"],
        "category_sales": charts["revenue_by_category"]["data"],
        "region_sales": charts["revenue_by_region"]["data"],
        "payment_methods": charts["payment_method_distribution"]["data"],
        "discount_sales": charts["discount_vs_sales"]["data"],
        "rating_sales": charts["rating_vs_sales"]["data"],
        "top_products": charts["top_products"]["data"],
        "charts": charts,
    }


@app.get("/charts/revenue-trend")
async def chart_revenue_trend():
    data, chart_type, sql_query = run_predefined_query("revenue_over_time")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}


@app.get("/charts/category-sales")
async def chart_category_sales():
    data, chart_type, sql_query = run_predefined_query("revenue_by_category")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}


@app.get("/charts/region-sales")
async def chart_region_sales():
    data, chart_type, sql_query = run_predefined_query("revenue_by_region")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}


@app.get("/charts/payment-methods")
async def chart_payment_methods():
    data, chart_type, sql_query = run_predefined_query("payment_method_distribution")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}


@app.get("/charts/discount-sales")
async def chart_discount_sales():
    data, chart_type, sql_query = run_predefined_query("discount_vs_sales")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}


@app.get("/charts/rating-sales")
async def chart_rating_sales():
    data, chart_type, sql_query = run_predefined_query("rating_vs_sales")
    return {"success": True, "chart_type": chart_type, "data": data, "sql_query": sql_query}

@app.post("/voice-query")
async def process_voice_query(request: dict):
    """Process voice-based query (receives transcribed text)"""
    
    transcribed_text = request.get("transcript", "")
    
    if not transcribed_text:
        raise HTTPException(status_code=400, detail="No transcript provided")
    
    # Process as regular query
    query_request = QueryRequest(query=transcribed_text)
    return await process_query(query_request)

@app.post("/generate-story")
async def generate_ai_story(request: dict):
    """Generate AI storytelling based on dashboard data"""
    
    data = request.get("data", [])
    query = request.get("query", "")
    
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")
    
    # Generate comprehensive story from data
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY", "your-api-key-here"))
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Create story prompt
        prompt = f"""
        Based on the following business analytics data, generate a compelling business story in 3-4 sentences.
        Focus on key insights, trends, and actionable recommendations.
        
        User Query: {query}
        
        Data Summary:
        {json.dumps(data[:10], indent=2)}  # Sample data
        
        Generate an engaging narrative that tells the story of this data.
        """
        
        response = model.generate_content(prompt)
        story = response.text.strip()
        
        return {
            "success": True,
            "story": story,
            "query": query
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/schema")
async def get_schema():
    """Get database schema"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        schema = {}
        for table in tables:
            cursor.execute(f"PRAGMA table_info({table})")
            columns = []
            for row in cursor.fetchall():
                columns.append({
                    "name": row[1],
                    "type": row[2]
                })
            schema[table] = columns
        
        conn.close()
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
