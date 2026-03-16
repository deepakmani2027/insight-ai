# 🚀 InsightAI Quick Reference Guide

## ⚡ Fast Start (5 Minutes)

### Terminal 1: Backend
```bash
cd backend
export GEMINI_API_KEY="your-key-here"
python -m uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
npm install
npm run dev
```

**Open**: http://localhost:3000

---

## 📝 Test Queries (Copy & Paste)

### Basic Revenue Analysis
```
Show revenue by region
```
**Expected**: Pie chart with regional breakdown + AI insights

### Category Performance
```
Top 5 product categories by revenue
```
**Expected**: Bar chart with top categories sorted

### Trend Analysis
```
Revenue trend over time
```
**Expected**: Line chart showing daily revenue trend

### Payment Methods
```
Most used payment method
```
**Expected**: Donut chart with payment distribution

### Correlation Analysis
```
Does discount affect sales volume?
```
**Expected**: Scatter plot showing discount vs quantity relationship

### Follow-up Test
1. First: `Show revenue by region`
2. Then: `Filter only Asia`
**Expected**: Chart updates with Asia data only

### Voice Query Test
1. Click microphone button
2. Say: "Show revenue by category"
3. System transcribes and executes
**Expected**: Bar chart appears

### CSV Upload Test
1. Click "Upload CSV"
2. Drag any CSV file
3. System creates table
4. Query the new data: "Show data from [table_name]"

---

## 🎨 Feature Checklist

### Dashboard Display
- [ ] KPI cards showing (Revenue, Orders, Products, Rating, Reviews)
- [ ] 6 dashboard charts loading automatically
- [ ] Dark theme visible
- [ ] Responsive layout on mobile

### Query Processing
- [ ] Can enter text query
- [ ] Results display in 1-2 seconds
- [ ] Chart renders correctly
- [ ] AI insights appear below chart

### Advanced Features
- [ ] Voice button works (click to listen)
- [ ] AI story panel generates insights
- [ ] Previous query shown for follow-ups
- [ ] CSV upload modal opens and works

### Error Handling
- [ ] Try ambiguous query: System suggests alternatives
- [ ] Try malformed CSV: Friendly error message
- [ ] No GEMINI_API_KEY: Clear error message
- [ ] Backend down: Connection error message

---

## 🔧 Environment Variables

```env
# Required
GEMINI_API_KEY=your-gemini-api-key

# Optional
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Get GEMINI_API_KEY: https://makersuite.google.com/app/apikey

---

## 📊 Database

**Location**: `data/amazon_sales.db`
**Source**: `data/amazon_sales.csv`
**Type**: SQLite3

### Tables
- `amazon_sales` - Main sales data (13 columns)

### Query Database Directly
```bash
sqlite3 data/amazon_sales.db
sqlite> SELECT * FROM amazon_sales LIMIT 5;
sqlite> .schema amazon_sales
```

---

## 🔌 API Endpoints

### POST /api/query
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue by region", "is_followup": false}'
```

### GET /api/kpis
```bash
curl http://localhost:3000/api/kpis
```

### POST /api/dashboard-chart
```bash
curl -X POST http://localhost:3000/api/dashboard-chart \
  -H "Content-Type: application/json" \
  -d '{"chart_id": "revenue_over_time"}'
```

---

## 🎯 8 Features Quick Demo

### 1️⃣ Conversational Query
- Input: "Show revenue by region"
- Output: Natural language → SQL → Chart

### 2️⃣ Dynamic Dashboard
- 6 charts auto-load on page load
- Real-time data fetching
- Responsive layout

### 3️⃣ Chart Selection
- Automatically picks chart type
- Line for dates, Pie for regions, etc.

### 4️⃣ KPI Metrics
- 5 cards at top of page
- Real-time calculation
- Formatted numbers

### 5️⃣ Interactive Charts
- Hover for tooltips
- Click legend to toggle
- Responsive scaling

### 6️⃣ AI Insights
- Auto-generated below each chart
- Regenerate button
- Business context aware

### 7️⃣ Follow-up Queries
- Ask follow-up: "Filter only Asia"
- Previous query shown
- Context-aware refinement

### 8️⃣ CSV Upload
- Click "Upload CSV" button
- Drag file to upload
- Query new data immediately

---

## 🎁 Bonus Features Demo

### Voice Query
1. Click microphone 🎤
2. Speak: "Show revenue by region"
3. Results appear automatically

### AI Storytelling
- "Electronics dominates market at $2.4M revenue"
- "Asia contributes 38% of sales"
- "Discounts increase volume by 18%"

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |
| GEMINI_API_KEY error | Add to `.env.local`, restart backend |
| Charts not loading | Check browser console, clear cache |
| CSV upload fails | Check file format, file < 50MB |

---

## 📁 File Locations

```
Backend:
  ├── backend/main.py              # FastAPI server
  ├── backend/sql_generator.py     # LLM → SQL
  ├── backend/chart_selector.py    # Chart logic
  ├── backend/insight_generator.py # AI insights
  └── backend/database.py          # DB setup

Frontend:
  ├── app/page.tsx                 # Main dashboard
  ├── components/QueryInput.tsx    # Query + voice
  ├── components/DashboardCharts.tsx
  ├── components/AIStoryPanel.tsx
  └── components/CSVUpload.tsx

API Routes:
  ├── app/api/query/route.ts
  ├── app/api/kpis/route.ts
  ├── app/api/dashboard-chart/route.ts
  ├── app/api/upload-csv/route.ts
  └── app/api/generate-story/route.ts

Data:
  ├── data/amazon_sales.csv        # Source data
  └── data/amazon_sales.db         # SQLite DB
```

---

## 📚 Documentation

- **README.md** - Overview and setup
- **FEATURES_IMPLEMENTED.md** - All features detailed
- **IMPLEMENTATION_COMPLETE.md** - Checklist
- **SETUP.md** - Step-by-step setup
- **DEPLOYMENT.md** - Production guide
- **TESTING.md** - Testing procedures
- **PRESENTATION.md** - Presentation outline

---

## 🎓 Sample Queries for Demo

**Easy**
- Show revenue by region
- Total products sold
- Average rating

**Medium**
- Top 5 categories by revenue
- Payment method distribution
- Revenue by product category

**Hard**
- Compare Asia vs Europe revenue
- Does discount affect sales?
- Show seasonal trends

**Follow-ups**
- "Now filter only Electronics"
- "Show top 3"
- "What about monthly?"

---

## ✨ Pro Tips

1. **Voice Query**: Works in Chrome/Edge, not Safari
2. **Dark Mode**: Built-in, no toggle needed
3. **Mobile**: Responsive design works on phones
4. **CSV Upload**: Column names become queryable fields
5. **Follow-ups**: System remembers previous context
6. **Insights**: Click regenerate for different angle
7. **Dashboard**: Auto-refreshes every 10 mins
8. **API**: All endpoints support CORS

---

## 🚀 Next Steps

1. Follow Quick Start above
2. Try sample queries
3. Test voice feature
4. Upload custom CSV
5. Read full documentation
6. Deploy to production

---

**Happy exploring! 🎉**
