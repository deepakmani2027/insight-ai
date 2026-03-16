# InsightAI - Quick Start (5 Minutes)

Get InsightAI running in under 5 minutes.

## Prerequisites
- Node.js 18+ and Python 3.9+
- Google Gemini API key (free from [ai.google.dev](https://ai.google.dev))

## Quick Install

### 1. Install Dependencies (1 min)
```bash
# Frontend
pnpm install

# Backend
cd backend && pip install -r requirements.txt && cd ..
```

### 2. Setup Environment (1 min)
```bash
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

### 3. Initialize Database (1 min)
```bash
python scripts/setup.py
```

### 4. Run Application (2 min)

**Terminal 1:**
```bash
pnpm dev
# Opens http://localhost:3000
```

**Terminal 2:**
```bash
pnpm dev:backend
# Runs on http://localhost:8000
```

## Try It!

1. Open http://localhost:3000
2. Click "Show revenue by region"
3. Watch the dashboard generate charts and insights automatically

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup guide
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Read [README.md](README.md) for full documentation

---

**That's it!** You have a working AI-powered BI dashboard.
