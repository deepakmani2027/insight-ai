# InsightAI Setup Guide

Complete step-by-step guide to get InsightAI running on your machine.

## Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher ([Download](https://nodejs.org))
- **Python**: 3.9 or higher ([Download](https://www.python.org/downloads))
- **pnpm**: Latest version (or npm/yarn)
- **Git**: For version control

### API Requirements
- **Google Gemini API Key**: Free from [ai.google.dev](https://ai.google.dev)
  - Click "Get API Key"
  - Create a new project
  - Copy your API key

## Installation Steps

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd insightai-dashboard
```

### 2. Setup Frontend

```bash
# Install Node dependencies
pnpm install
# or npm install

# Verify installation
pnpm list next react
```

### 3. Setup Backend

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
pip list | grep fastapi
```

### 4. Configure Environment

```bash
# Go back to project root
cd ..

# Copy environment template
cp .env.example .env.local

# Edit with your API key
nano .env.local
# or use your editor to set GEMINI_API_KEY
```

**Expected .env.local:**
```
GEMINI_API_KEY=your_actual_api_key_here
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Initialize Database

```bash
python scripts/setup.py
```

**Expected output:**
```
🚀 Initializing InsightAI Database...
✅ Database initialized successfully at: data/amazon_sales.db
📊 Amazon Sales data loaded into database
```

If you see errors:
- Verify Python path: `which python3` or `where python`
- Check if pandas is installed: `pip list | grep pandas`
- Remove old database: `rm data/amazon_sales.db` then retry

## Running the Application

### Option A: Separate Terminals (Recommended)

**Terminal 1 - Start Frontend:**
```bash
pnpm dev
```
- Runs on http://localhost:3000
- Hot reload enabled

**Terminal 2 - Start Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn main:app --reload --port 8000
```
- Runs on http://localhost:8000
- API docs at http://localhost:8000/docs

### Option B: Using npm Scripts

Make sure you have both terminals open:

```bash
# Terminal 1
pnpm dev

# Terminal 2
pnpm dev:backend
```

### Option C: Using Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Or build individually
docker build -f Dockerfile.backend -t insightai-backend .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key insightai-backend
```

## Verify Installation

### Frontend Verification
Open http://localhost:3000 in browser
- See the InsightAI dashboard
- Try a sample query

### Backend Verification
```bash
# In another terminal
curl http://localhost:8000/health
# Should return: {"status":"ok","message":"InsightAI API is running"}
```

### Database Verification
```bash
# Check database file exists
ls -la data/amazon_sales.db

# Query database directly (optional)
python
# Then:
# >>> import sqlite3
# >>> conn = sqlite3.connect('data/amazon_sales.db')
# >>> cursor = conn.cursor()
# >>> cursor.execute('SELECT COUNT(*) FROM amazon_sales')
# >>> print(cursor.fetchone())
# Should show a number like (50000,)
```

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
# Verify
pip show fastapi
```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Find process on port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
# Or use a different port
python -m uvicorn main:app --port 8001
```

### Issue: "GEMINI_API_KEY not found"

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify key is set
echo $GEMINI_API_KEY

# If not set, reload environment
source .env.local  # macOS/Linux
# On Windows, set manually in terminal
```

### Issue: "Database file not found"

**Solution:**
```bash
# Reinitialize database
python scripts/setup.py

# Verify data folder exists
ls -la data/
# Should show amazon_sales.db
```

### Issue: "Connection refused" when calling API

**Solution:**
```bash
# Make sure backend is running
curl http://localhost:8000/health

# Check BACKEND_URL in .env.local
cat .env.local | grep BACKEND_URL

# Update if needed:
# BACKEND_URL=http://localhost:8000
```

### Issue: "401 Unauthorized" from Gemini API

**Solution:**
```bash
# Get a new API key from https://ai.google.dev
# Update .env.local with new key
# Restart backend:
# Kill running backend and restart
```

## Testing the Dashboard

### Quick Test
1. Open http://localhost:3000
2. Click one of the sample queries:
   - "Show revenue by region"
   - "Top 5 product categories by revenue"
3. See the dashboard update with chart

### Manual API Test
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue by region"}'
```

Expected response includes SQL, chart type, and data.

## Development Workflow

### Making Code Changes

**Frontend changes:**
- Edit files in `/app` or `/components`
- Hot reload will update automatically
- No restart needed

**Backend changes:**
- Edit files in `/backend`
- With `--reload` flag, uvicorn restarts automatically
- May need to refresh browser after backend restart

### Adding New Features

**Adding a new chart type:**
1. Update `chart_selector.py` logic
2. Add rendering in `ChartContainer.tsx`
3. Test with sample query

**Adding new metrics:**
1. Add query to `/kpis` endpoint in `main.py`
2. Add KPI card in `KpiCards.tsx`
3. Update KPI types in `page.tsx`

## Next Steps

1. **Explore the dashboard**: Try different queries
2. **Read the API docs**: Visit http://localhost:8000/docs
3. **Check example queries**: See README.md for more
4. **Deploy to production**: See DEPLOYMENT.md

## Getting Help

1. Check README.md for overview
2. Review example queries in dashboard
3. Check console for error messages (F12)
4. Review backend logs in terminal
5. Check error alerts in dashboard

---

**Ready to use!** Start with `pnpm dev` in one terminal and `pnpm dev:backend` in another.
