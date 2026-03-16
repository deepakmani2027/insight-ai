import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "your-api-key-here"))

def analyze_data_patterns(data: list) -> dict:
    """Analyze data patterns for basic statistics"""
    if not data:
        return {}
    
    analysis = {
        "total_rows": len(data),
        "columns": list(data[0].keys()) if data else [],
        "numeric_stats": {}
    }
    
    # Extract numeric columns and compute stats
    for col in analysis["columns"]:
        values = [row.get(col) for row in data if isinstance(row.get(col), (int, float))]
        if values:
            analysis["numeric_stats"][col] = {
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "total": sum(values)
            }
    
    return analysis

def generate_insights(data: list, query: str) -> str:
    """Generate AI insights from dashboard data with statistical analysis"""
    try:
        if not data:
            return "No data available to generate insights."
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Analyze data patterns
        patterns = analyze_data_patterns(data)
        
        # Prepare data summary for the model (limit to first 10 rows)
        data_sample = data[:10]
        data_summary = json.dumps(data_sample, indent=2, default=str)
        
        prompt = f"""
You are a senior business intelligence analyst. Based on the following Amazon sales data query results, 
generate 3-4 actionable business insights. Each insight should be specific, data-driven, and concise.

Original Query: {query}

Data Overview:
- Total Records: {patterns.get('total_rows', len(data))}
- Columns: {', '.join(patterns.get('columns', []))}

Sample Data (first 10 rows):
{data_summary}

Generate insights in a numbered list format. Focus on:
1. **Key Finding**: A specific metric or discovery from the data
2. **Business Implication**: What this means for the business
3. **Actionable Recommendation**: What to do with this insight

Format each insight as a clear, professional statement suitable for a business report.

Generate the insights:
"""
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        error_msg = str(e)
        # If quota exceeded or API error, return statistical summary
        if "429" in error_msg or "quota" in error_msg.lower() or "api" in error_msg.lower():
            stats = patterns.get('numeric_stats', {})
            summary = "📊 Data Statistics:\n"
            for col, values in stats.items():
                summary += f"• {col}: Min={values.get('min')}, Max={values.get('max')}, Avg={values.get('avg'):.2f}\n"
            if not stats:
                summary += "• Data analysis available (try exploring different queries)"
            return summary
        return f"Could not generate insights: {str(e)}"

def generate_kpi_summary(kpi_data: dict) -> str:
    """Generate a summary of KPI metrics"""
    summary = f"""
📊 Key Performance Indicators:
• Total Revenue: ${kpi_data.get('revenue', 0):,.2f}
• Total Orders: {kpi_data.get('orders', 0):,}
• Products Sold: {kpi_data.get('products_sold', 0):,}
• Average Rating: {kpi_data.get('avg_rating', 0):.1f}/5.0
• Total Reviews: {kpi_data.get('reviews', 0):,}
"""
    return summary
