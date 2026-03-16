# InsightAI - Testing Guide

Comprehensive guide for testing InsightAI features and performance.

## Manual Testing

### Setup
1. Start frontend: `pnpm dev`
2. Start backend: `pnpm dev:backend`
3. Open http://localhost:3000 in browser
4. Open http://localhost:8000/docs for API documentation

## Test Scenarios

### Test 1: Basic Query Execution

**Test**: Execute a simple revenue query

**Steps**:
1. Type "Show revenue by region" in query input
2. Click "Generate" button
3. Observe dashboard update

**Expected Result**:
- Loading spinner shows during execution
- Pie chart appears with regions and revenue values
- KPI cards show revenue total
- Insights panel displays 2-3 business insights

**Pass Criteria**: Chart renders correctly and data is accurate

---

### Test 2: Chart Type Selection

**Test**: Verify correct chart types for different queries

**Queries to Test**:
1. "Monthly sales trend" → Should show **Line Chart** (date-based)
2. "Show revenue by region" → Should show **Pie Chart** (few categories)
3. "Revenue by product category" → Should show **Bar Chart** (many categories)
4. "Does discount affect sales" → Should show **Scatter Plot** (correlation)

**Pass Criteria**: All queries render the expected chart type

---

### Test 3: Error Handling

**Test**: Application handles invalid/ambiguous queries gracefully

**Test Queries**:
1. "blah blah random text" → Should show helpful error message
2. "Show column that doesn't exist" → Should ask for clarification
3. "SELECT * FROM users" → Should reject non-SELECT queries
4. Empty query → Should show validation error

**Pass Criteria**: All errors display user-friendly messages

---

### Test 4: KPI Metrics

**Test**: Verify KPI values are accurate

**Steps**:
1. Note the values on KPI cards on page load
2. Run query: "Count total orders"
3. Verify KPI "Total Orders" matches query result

**Metrics to Verify**:
- Total Revenue (should be ~$12.4M)
- Total Orders (should be ~50,000)
- Products Sold (should be ~80,000)
- Avg Rating (should be ~3.5-4.0)
- Total Reviews (should be ~250,000)

**Pass Criteria**: All KPI values match database calculations

---

### Test 5: AI Insights Generation

**Test**: Verify insights are relevant and accurate

**Steps**:
1. Execute any query
2. Read insights in the insights panel
3. Verify insights relate to the query results

**Pass Criteria**: 
- Insights generated within 3 seconds
- Insights are relevant to the query
- No hallucinated data in insights

---

### Test 6: Interactive Charts

**Test**: Verify chart interactivity

**Steps**:
1. Generate a pie chart (e.g., "Show revenue by region")
2. Hover over pie slices → Tooltip shows value
3. Hover over bar chart → Tooltip shows data
4. For line charts, hover over points → Tooltip shows date and value

**Pass Criteria**: All tooltips appear correctly and show accurate data

---

### Test 7: Responsive Design

**Test**: UI works on different screen sizes

**Device Sizes to Test**:
1. Mobile: 375px width
2. Tablet: 768px width
3. Desktop: 1920px width

**Pass Criteria**:
- All elements readable on mobile
- Layout adapts to screen size
- No horizontal scrolling on mobile
- Charts scale properly

---

### Test 8: Sample Queries

**Test**: Run all predefined sample queries

**Queries**:
1. "Show revenue by region" → Pie Chart
2. "Top 5 product categories by revenue" → Bar Chart
3. "Monthly sales trend" → Line Chart
4. "Most used payment method" → Pie/Bar Chart
5. "Average rating by category" → Bar Chart
6. "Revenue trend over time" → Line Chart

**Pass Criteria**: All queries execute successfully

---

## API Testing

### Test Backend Directly

```bash
# Health check
curl http://localhost:8000/health

# KPI metrics
curl http://localhost:8000/kpis

# Query execution
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue by region"}'

# Database schema
curl http://localhost:8000/schema
```

### Expected Responses

**Health Check**:
```json
{"status":"ok","message":"InsightAI API is running"}
```

**KPI Metrics**:
```json
{
  "revenue": 12456789.50,
  "orders": 50000,
  "products_sold": 80000,
  "avg_rating": 3.8,
  "reviews": 250000
}
```

**Query Response**:
```json
{
  "success": true,
  "sql_query": "SELECT customer_region, SUM(total_revenue) FROM amazon_sales GROUP BY customer_region",
  "chart_type": "pie",
  "data": [
    {"customer_region": "Asia", "SUM(total_revenue)": 4700000},
    {"customer_region": "North America", "SUM(total_revenue)": 3100000},
    ...
  ],
  "insights": "Asia region dominates with 38% of total revenue...",
  "error": null
}
```

---

## Performance Testing

### Test 1: Query Response Time

**Measurement**:
- Open DevTools (F12)
- Go to Network tab
- Execute query
- Check response time for /api/query

**Target**: < 3 seconds

---

### Test 2: Page Load Time

**Measurement**:
1. Open DevTools Performance tab
2. Reload page
3. Check Largest Contentful Paint (LCP)
4. Check Cumulative Layout Shift (CLS)

**Target**:
- LCP: < 2.5 seconds
- CLS: < 0.1
- Total Load: < 3 seconds

---

### Test 3: Memory Usage

**Steps**:
1. Open DevTools Memory tab
2. Take heap snapshot
3. Execute 10 queries
4. Take another snapshot
5. Compare memory increase

**Target**: < 50MB increase after 10 queries

---

## Database Testing

### Verify Data Integrity

```bash
python3

# In Python shell:
import sqlite3
conn = sqlite3.connect('data/amazon_sales.db')
cursor = conn.cursor()

# Count records
cursor.execute('SELECT COUNT(*) FROM amazon_sales')
print(cursor.fetchone())  # Should be (50000,)

# Check categories
cursor.execute('SELECT DISTINCT product_category FROM amazon_sales')
print(cursor.fetchall())

# Verify revenue calculation
cursor.execute('SELECT SUM(total_revenue) FROM amazon_sales')
print(cursor.fetchone())

# Check date range
cursor.execute('SELECT MIN(order_date), MAX(order_date) FROM amazon_sales')
print(cursor.fetchone())
```

---

## Regression Testing

### Test Suite

```bash
# After any code changes, run these queries:

# Revenue analysis
echo "Show revenue by region"
echo "Top 5 categories by revenue"
echo "Monthly sales trend"

# Customer analysis
echo "Payment method distribution"
echo "Average rating by region"
echo "Customer count by region"

# Trend analysis
echo "Does discount affect sales"
echo "Products with highest reviews"
echo "Revenue trend 2023"
```

---

## Edge Case Testing

### Test 1: Empty Results

**Query**: "Show sales where region = 'NonExistent'"

**Expected**: Empty state message or empty chart

---

### Test 2: Large Result Sets

**Query**: "Show all sales by order date"

**Expected**: Charts handle 500+ data points gracefully

---

### Test 3: Special Characters

**Query**: "Show sales for \"Electronics\" category"

**Expected**: Proper handling of quotes and special chars

---

### Test 4: Unicode Support

**Query**: "Show sales for región (Spanish word)"

**Expected**: Proper handling of unicode characters

---

### Test 5: Concurrent Requests

**Test**:
1. Open dashboard in multiple tabs
2. Execute queries simultaneously
3. Observe behavior

**Expected**: No conflicts or errors

---

## Browser Compatibility

### Test on Multiple Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Test Specific Features

- [ ] Charts render correctly
- [ ] Input works properly
- [ ] Tooltips display correctly
- [ ] Dark mode applies
- [ ] Animations smooth
- [ ] No console errors

---

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Focus visible on all buttons

### Screen Reader

- [ ] Use NVDA (Windows) or JAWS
- [ ] Verify page structure is announced
- [ ] Verify all buttons have labels
- [ ] Verify chart descriptions available
- [ ] Verify alt text for images

### Color Contrast

- [ ] Check contrast ratios (WCAG AA minimum 4.5:1)
- [ ] Verify readable in dark mode
- [ ] Verify readable in high contrast mode

---

## Security Testing

### API Security

```bash
# Test SQL injection prevention
curl -X POST http://localhost:8000/query \
  -d '{"query": "'; DROP TABLE amazon_sales; --"}'

# Expected: Error message, not actual deletion

# Test CORS
curl -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  http://localhost:8000/query

# Expected: Proper CORS headers or 403
```

### XSS Prevention

**Test**: Submit query with HTML/JavaScript

```
<script>alert('XSS')</script>
```

**Expected**: Treated as plain text, no execution

---

## Load Testing

### Simulate Multiple Users

```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:3000/

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3000/
```

**Target**: 
- Successful requests: > 95%
- Response time: < 1 second (p95)
- Throughput: > 100 req/sec

---

## Deployment Testing

### Before Production Deployment

- [ ] All manual tests pass
- [ ] All API tests pass
- [ ] No console errors in browser
- [ ] No backend errors in logs
- [ ] Performance targets met
- [ ] Security checks passed
- [ ] Database backup verified
- [ ] SSL/TLS certificate valid
- [ ] Environment variables set
- [ ] CORS properly configured

---

## Checklist for Each Release

- [ ] Feature functionality verified
- [ ] Error messages clear and helpful
- [ ] Performance acceptable
- [ ] No new console errors
- [ ] Responsive on mobile
- [ ] Accessibility standards met
- [ ] Database changes tested
- [ ] Backwards compatible
- [ ] Documentation updated
- [ ] Changelog updated

---

## Test Results Template

```
Date: __________
Tester: ________
Version: _______

Manual Tests:
- [ ] Basic Query Execution: PASS/FAIL
- [ ] Chart Type Selection: PASS/FAIL
- [ ] Error Handling: PASS/FAIL
- [ ] KPI Metrics: PASS/FAIL
- [ ] AI Insights: PASS/FAIL
- [ ] Interactive Charts: PASS/FAIL
- [ ] Responsive Design: PASS/FAIL
- [ ] Sample Queries: PASS/FAIL

API Tests:
- [ ] Health Check: PASS/FAIL
- [ ] KPI Endpoint: PASS/FAIL
- [ ] Query Endpoint: PASS/FAIL
- [ ] Error Handling: PASS/FAIL

Performance:
- Query Response: _____ ms
- Page Load: _____ ms
- Memory Usage: _____ MB

Issues Found:
1. ___________
2. ___________
3. ___________

Overall Result: PASS/FAIL/CONDITIONAL

Sign-off: ________________________
```

---

**Testing complete!** Record all results before production deployment.
