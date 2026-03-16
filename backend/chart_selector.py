from typing import List, Dict, Any
from datetime import datetime

# Chart type mapping for the 6 dashboard charts
DASHBOARD_CHARTS = {
    "revenue_over_time": "line",  # Chart 1
    "revenue_by_category": "bar",  # Chart 2
    "revenue_by_region": "pie",  # Chart 3
    "payment_method_distribution": "donut",  # Chart 4
    "discount_vs_sales": "scatter",  # Chart 5
    "rating_vs_sales": "scatter"  # Chart 6
}

def select_chart_type(data: List[Dict], columns: List[str], query_type: str = None) -> str:
    """
    Select the best chart type based on data and columns.
    Prioritizes the 6 dashboard charts, then uses intelligent selection.
    
    Rules:
    - Time series (date column) -> Line chart
    - Two numeric columns -> Scatter plot
    - One categorical + one numeric -> Bar/Pie chart
    - Single categorical with few values -> Pie chart
    - Payment/Distribution -> Donut chart
    - Otherwise -> Bar chart
    """
    
    if not data or not columns:
        return "bar"
    
    # Get column information
    col_names = {col.lower(): col for col in columns}
    first_row = data[0]
    
    # Analyze columns
    has_date = any(col in col_names for col in ['date', 'order_date'])
    numeric_cols = count_numeric_columns(data, columns)
    categorical_cols = count_categorical_columns(data, columns)
    
    # Detect specific patterns
    has_payment = 'payment_method' in col_names
    has_region = 'region' in col_names
    has_category = 'category' in col_names
    has_discount = 'discount' in col_names
    has_rating = 'rating' in col_names
    
    # Check for time series
    if has_date and numeric_cols > 0:
        return "line"
    
    # Payment method distribution -> Donut chart
    if has_payment and numeric_cols >= 1:
        return "donut"
    
    # Region distribution -> Pie chart
    if has_region and not has_date and numeric_cols == 1 and len(data) <= 10:
        return "pie"
    
    # Discount vs Sales or Rating vs Sales -> Scatter plot
    if (has_discount or has_rating) and numeric_cols >= 2:
        return "scatter"
    
    # Category comparison -> Bar chart
    if has_category and numeric_cols >= 1:
        return "bar"
    
    # Two numeric columns -> Scatter plot
    if numeric_cols >= 2:
        return "scatter"
    
    # Pie chart for single categorical with few unique values
    if categorical_cols == 1 and numeric_cols >= 1:
        first_col = columns[0]
        unique_values = len(set(row.get(first_col) for row in data if first_col in row))
        if unique_values <= 8:
            return "pie"
        else:
            return "bar"
    
    # Default to bar chart
    return "bar"

def count_numeric_columns(data: List[Dict], columns: List[str]) -> int:
    """Count numeric columns in data"""
    if not data:
        return 0
    
    count = 0
    first_row = data[0]
    
    for col in columns:
        if col in first_row:
            val = first_row[col]
            if isinstance(val, (int, float)):
                count += 1
    
    return count

def count_categorical_columns(data: List[Dict], columns: List[str]) -> int:
    """Count categorical columns in data"""
    if not data:
        return 0
    
    count = 0
    first_row = data[0]
    
    for col in columns:
        if col in first_row:
            val = first_row[col]
            if isinstance(val, str):
                count += 1
    
    return count

def prepare_chart_data(data: List[Dict], chart_type: str) -> dict:
    """Prepare data in the format expected by frontend charts"""
    
    if not data:
        return {"type": chart_type, "data": []}
    
    if chart_type == "line":
        return {
            "type": "line",
            "data": data,
            "labels": [list(row.keys())[0] for row in data]
        }
    elif chart_type == "pie":
        return {
            "type": "pie",
            "data": data
        }
    elif chart_type == "scatter":
        return {
            "type": "scatter",
            "data": data
        }
    else:  # bar
        return {
            "type": "bar",
            "data": data
        }
