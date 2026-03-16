# 🎨 InsightAI - Visual Overview & Architecture

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              React Dashboard (Port 3000)                 │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ QueryInput Component (with Voice Support 🎤)       │ │   │
│  │  │ • Text input field                                  │ │   │
│  │  │ • Microphone button                                 │ │   │
│  │  │ • Visual feedback                                   │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ KPI Cards Component (5 Metrics)                    │ │   │
│  │  │ • Total Revenue 💰                                  │ │   │
│  │  │ • Total Orders 📦                                   │ │   │
│  │  │ • Products Sold 📊                                  │ │   │
│  │  │ • Avg Rating ⭐                                     │ │   │
│  │  │ • Total Reviews 💬                                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Dashboard Charts (6 Predefined)                    │ │   │
│  │  │                                                     │ │   │
│  │  │ Chart 1: Revenue Over Time (Line)                  │ │   │
│  │  │ Chart 2: Revenue by Category (Bar)                 │ │   │
│  │  │ Chart 3: Revenue by Region (Pie)                   │ │   │
│  │  │ Chart 4: Payment Methods (Donut)                   │ │   │
│  │  │ Chart 5: Discount vs Sales (Scatter)               │ │   │
│  │  │ Chart 6: Rating vs Sales (Scatter)                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ AI Story Panel (📖 Insights)                       │ │   │
│  │  │ • Auto-generated stories                            │ │   │
│  │  │ • Business context                                  │ │   │
│  │  │ • Regenerate button                                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                          ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ CSV Upload Modal (📤)                              │ │   │
│  │  │ • Drag-drop area                                    │ │   │
│  │  │ • File validation                                   │ │   │
│  │  │ • Success feedback                                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP REST API Calls
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│               Next.js API Routes (Port 3000)                     │
│                                                                   │
│  • /api/query - Query endpoint                                   │
│  • /api/kpis - KPI metrics                                       │
│  • /api/dashboard-chart - Dashboard charts                       │
│  • /api/upload-csv - CSV upload                                  │
│  • /api/generate-story - Story generation                        │
│  • /api/health - Health check                                    │
│                                                                   │
│  (Proxy requests to FastAPI backend)                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP REST API Calls
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            FastAPI Backend Server (Port 8000)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ main.py (FastAPI Server)                               │   │
│  │ • Query endpoint - processes natural language          │   │
│  │ • KPI endpoint - aggregates metrics                    │   │
│  │ • Dashboard endpoint - returns chart data              │   │
│  │ • Upload endpoint - processes CSV files                │   │
│  │ • Story endpoint - generates AI insights               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ sql_generator.py (LLM → SQL Converter)                 │   │
│  │ • Gemini API integration                                │   │
│  │ • Schema context                                        │   │
│  │ • Query validation                                      │   │
│  │ • Follow-up enhancement                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ database.py (Query Execution)                           │   │
│  │ • SQLite connection                                     │   │
│  │ • Query execution                                       │   │
│  │ • Result formatting                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ chart_selector.py (Chart Intelligence)                 │   │
│  │ • Auto-detect chart type                                │   │
│  │ • Data pattern analysis                                 │   │
│  │ • Visualization selection                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ insight_generator.py (AI Insights)                      │   │
│  │ • Gemini API integration                                │   │
│  │ • Statistical analysis                                  │   │
│  │ • Story generation                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      Database Queries
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SQLite Database                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ amazon_sales Table (13 columns)                         │   │
│  │                                                          │   │
│  │ Columns:                                                │   │
│  │ • order_id (PK)                                         │   │
│  │ • order_date (indexed)                                  │   │
│  │ • product_id                                            │   │
│  │ • product_category (indexed)                            │   │
│  │ • price, discount_percent, quantity_sold               │   │
│  │ • customer_region (indexed)                             │   │
│  │ • payment_method (indexed)                              │   │
│  │ • rating, review_count                                  │   │
│  │ • discounted_price, total_revenue                       │   │
│  │                                                          │   │
│  │ Indexes:                                                │   │
│  │ • idx_order_date                                        │   │
│  │ • idx_category                                          │   │
│  │ • idx_region                                            │   │
│  │ • idx_payment                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │
                     Gemini API (Cloud)
                              ↑
                              │
            (SQL Generation, Insights, Storytelling)
```

---

## 🎯 Query Processing Flow

```
User Input
    ↓
┌─────────────────────────────────┐
│ Natural Language Query          │
│ "Show revenue by region"        │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ QueryInput Component (Frontend) │
│ • Text input                    │
│ • Voice support                 │
│ • Submit button                 │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ /api/query (Next.js proxy)      │
│ • HTTP POST                     │
│ • Validate input                │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ FastAPI Backend                 │
│ POST /query endpoint            │
│ • Check follow-up flag          │
│ • Get conversation history      │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ sql_generator.py                │
│ • Check predefined queries      │
│ • If match: use predefined SQL  │
│ • Else: call Gemini API         │
│ • Generate SQL query            │
│ • Validate for safety           │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Gemini API (LLM)                │
│ • Receives prompt with schema   │
│ • Generates SQL query           │
│ • Returns formatted SQL         │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ database.py                     │
│ • Execute SQL on SQLite         │
│ • Fetch results                 │
│ • Format as JSON                │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ chart_selector.py               │
│ • Analyze result columns        │
│ • Detect data patterns          │
│ • Select optimal chart type     │
│ • Return chart type             │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ insight_generator.py            │
│ • Send data to Gemini           │
│ • Generate insights             │
│ • Create story narrative        │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Response Object:                │
│ {                               │
│   success: true,                │
│   sql_query: "SELECT ...",      │
│   chart_type: "pie",            │
│   data: [{...}, ...],           │
│   insights: "...",              │
│   query_metadata: {...}         │
│ }                               │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Frontend Rendering              │
│ • Display KPI cards             │
│ • Render chart with data        │
│ • Show AI insights              │
│ • Update conversation history   │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Browser Display                 │
│ • Chart rendered                │
│ • Insights visible              │
│ • Ready for follow-up query     │
└─────────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
App (Dashboard Page)
│
├── Header
│   ├── Logo (InsightAI)
│   └── CSVUpload Button
│
├── QueryInput Component
│   ├── Text Input Field
│   ├── Microphone Button (Voice 🎤)
│   ├── Generate Button
│   └── Listening Indicator
│
├── KpiCards Component
│   ├── Revenue Card 💰
│   ├── Orders Card 📦
│   ├── Products Card 📊
│   ├── Rating Card ⭐
│   └── Reviews Card 💬
│
├── DashboardCharts Component
│   ├── Chart 1: Revenue Over Time (Line)
│   ├── Chart 2: Revenue by Category (Bar)
│   ├── Chart 3: Revenue by Region (Pie)
│   ├── Chart 4: Payment Methods (Donut)
│   ├── Chart 5: Discount vs Sales (Scatter)
│   └── Chart 6: Rating vs Sales (Scatter)
│
├── ChartContainer Component
│   ├── Chart Title
│   ├── Chart Rendering (Recharts)
│   ├── Tooltips & Legends
│   └── Loading State
│
├── AIStoryPanel Component
│   ├── Story Title
│   ├── AI-Generated Story
│   ├── Regenerate Button
│   └── Loading State
│
├── InsightsPanel Component
│   ├── Insights Title
│   ├── Bullet Points
│   └── Loading State
│
└── CSVUpload Modal Component
    ├── Modal Header
    ├── Drag-Drop Zone
    ├── File Input
    ├── Upload Button
    ├── Success/Error Message
    └── Close Button
```

---

## 🎨 Color Scheme & Design

```
Dark Theme Design
│
├── Primary Background: #0F172A (Dark Navy)
│   └── Used for: Page background, body
│
├── Card Background: #1E293B (Slate)
│   └── Used for: Component cards, containers
│
├── Primary Color: #2563EB (Blue)
│   └── Used for: Buttons, primary actions, accents
│
├── Accent Color: #10B981 (Emerald)
│   └── Used for: Success states, highlights, secondary actions
│
├── Text Primary: #F1F5F9 (Near White)
│   └── Used for: Main text, headings
│
├── Text Secondary: #94A3B8 (Slate Gray)
│   └── Used for: Secondary text, hints
│
├── Border Color: #334155 / #475569 (Slate)
│   └── Used for: Dividers, borders, lines
│
└── Hover States:
    ├── Button Hover: Lighten by 10%
    ├── Card Hover: Slight shadow increase
    └── Link Hover: Color brighten
```

---

## 📈 Data Flow Diagram

```
                    User Query Input
                           │
                           ↓
                ┌───────────────────────┐
                │ Text or Voice Input   │
                │ (Web Speech API)      │
                └───────────────────────┘
                           │
                           ↓
                ┌───────────────────────┐
                │ Query Processing      │
                │ - Validate input      │
                │ - Check follow-up     │
                └───────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ↓             ↓
            ┌─────────────┐  ┌──────────────┐
            │ Predefined? │  │ New Query?   │
            └─────────────┘  └──────────────┘
                    │             │
            YES ────┼─────────────┤
                    │             │
                    ↓             ↓
            ┌─────────────────────────────┐
            │ Gemini API                  │
            │ - Process query             │
            │ - Generate SQL              │
            │ - Validate safety           │
            └─────────────────────────────┘
                           │
                           ↓
            ┌─────────────────────────────┐
            │ Database Execution          │
            │ - Execute SQL               │
            │ - Fetch results             │
            │ - Format data               │
            └─────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ↓             ↓
            ┌──────────────┐  ┌────────────┐
            │ Chart        │  │ Insights   │
            │ Selection    │  │ Generation │
            └──────────────┘  └────────────┘
                    │             │
                    └──────┬──────┘
                           │
                           ↓
            ┌─────────────────────────────┐
            │ Response Construction       │
            │ - SQL query                 │
            │ - Chart type                │
            │ - Data                      │
            │ - Insights                  │
            └─────────────────────────────┘
                           │
                           ↓
            ┌─────────────────────────────┐
            │ Frontend Rendering          │
            │ - Display chart             │
            │ - Show insights             │
            │ - Update UI                 │
            └─────────────────────────────┘
                           │
                           ↓
            ┌─────────────────────────────┐
            │ Conversation Memory Update  │
            │ - Store query               │
            │ - Store context             │
            │ - Ready for follow-up       │
            └─────────────────────────────┘
```

---

## 🚀 Feature Highlights

```
┌──────────────────────────────────────────────┐
│  1. CONVERSATIONAL QUERIES                   │
│  User: "Show revenue by region"              │
│  System: Auto-generates SQL + executes       │
│  Result: Interactive chart + AI insights    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  2. DASHBOARD OVERVIEW                       │
│  - 6 pre-built charts                        │
│  - Auto-loading on page load                 │
│  - Real-time data updates                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  3. SMART CHART SELECTION                    │
│  Data Analysis → Optimal Chart Type          │
│  Time Series → Line                          │
│  Categories → Bar/Pie                        │
│  Correlations → Scatter                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  4. KPI METRICS (5 Cards)                    │
│  💰 Revenue     📦 Orders    📊 Products     │
│  ⭐ Rating      💬 Reviews                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  5. INTERACTIVE VISUALIZATION                │
│  Tooltips • Legends • Zooming                │
│  Responsive • Color-coded • Professional    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  6. AI INSIGHTS & STORYTELLING               │
│  Auto-generated business narratives         │
│  Statistical analysis • Recommendations     │
│  Regenerate for variations                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  7. FOLLOW-UP QUERIES                        │
│  Conversation Memory • Context Awareness     │
│  Query Refinement • Filter Application      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  8. CSV UPLOAD                               │
│  Drag-Drop • Auto Schema Detection          │
│  Dynamic Table Creation • Query Ready        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  BONUS: VOICE QUERIES 🎤                     │
│  Web Speech API • Real-time Transcription   │
│  Natural Language Support                    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  BONUS: AI STORYTELLING 📖                   │
│  Executive Summaries • Key Highlights        │
│  Business Context Awareness                  │
└──────────────────────────────────────────────┘
```

---

## 🎯 The 6 Dashboard Charts

```
Chart 1: Revenue Over Time (Line)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Track sales growth trends
Data: Daily/monthly revenue
Display: Line chart with trend line
Example: "$2M → $2.5M over Q1"

Chart 2: Revenue by Category (Bar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Compare category performance
Data: Total revenue per category
Display: Horizontal bar chart
Example: "Electronics $2.4M, Fashion $1.8M"

Chart 3: Revenue by Region (Pie)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Show market share by region
Data: Revenue distribution by region
Display: Pie chart with percentages
Example: "Asia 38%, Europe 32%, Americas 30%"

Chart 4: Payment Methods (Donut)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Track payment method preferences
Data: Count by payment method
Display: Donut chart with legend
Example: "Credit Card 45%, UPI 35%, Others 20%"

Chart 5: Discount vs Sales (Scatter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Analyze discount impact
Data: Discount % vs quantity sold
Display: Scatter plot
Example: "Shows positive correlation"

Chart 6: Rating vs Sales (Scatter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Correlate quality & sales
Data: Rating vs quantity sold
Display: Scatter plot
Example: "Higher ratings → more sales"
```

---

## ✨ Visual Design Elements

```
Header Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────────┐
│ InsightAI                                   │
│ Conversational BI Dashboard                │
│                               [Upload CSV]  │
└────────────────────────────────────────────┘

Query Input Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────────┐
│ [📝 Ask your data anything...]  [🎤] [→]  │
│ Last query: "Show revenue by region"       │
└────────────────────────────────────────────┘

KPI Cards Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│💰 Revenue│📦Orders │📊Products│⭐Rating │💬Reviews │
│$1.2M    │50,000   │80,000   │4.1/5    │25,000   │
└──────────┴──────────┴──────────┴──────────┴──────────┘

Dashboard Charts (2x3 Grid)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────┬─────────────────────┐
│ Revenue Over Time   │ Revenue by Category  │
│ [Line Chart]        │ [Bar Chart]          │
└─────────────────────┴─────────────────────┘
┌─────────────────────┬─────────────────────┐
│ Revenue by Region   │ Payment Methods     │
│ [Pie Chart]         │ [Donut Chart]       │
└─────────────────────┴─────────────────────┘
┌─────────────────────┬─────────────────────┐
│ Discount vs Sales   │ Rating vs Sales     │
│ [Scatter Plot]      │ [Scatter Plot]      │
└─────────────────────┴─────────────────────┘

Insights Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────────────┐
│ 📖 AI-Generated Insights      [🔄 Regenerate]
│                                              │
│ Electronics category generates highest       │
│ revenue at $2.4M (45% of total).            │
│                                              │
│ Asia region contributes 38% of total sales, │
│ with a 4.2/5 average rating.                │
│                                              │
│ Products with discounts above 20% show 18%  │
│ higher volume but slightly lower margins.   │
└────────────────────────────────────────────┘
```

---

## 🎯 User Interaction Flow

```
Start
  │
  ├─→ View Dashboard
  │   ├─→ See 5 KPI Cards
  │   ├─→ See 6 Dashboard Charts
  │   └─→ Read Welcome Message
  │
  ├─→ Type Query
  │   ├─→ "Show revenue by region"
  │   ├─→ [Generate Button]
  │   └─→ Wait for AI processing
  │
  ├─→ View Results
  │   ├─→ Chart appears (Pie Chart)
  │   ├─→ AI Insights appear
  │   ├─→ See SQL query
  │   └─→ Previous query shows
  │
  ├─→ Try Follow-up
  │   ├─→ Type: "Filter only Asia"
  │   ├─→ [Generate Button]
  │   └─→ Chart updates with filter
  │
  ├─→ Try Voice
  │   ├─→ Click microphone
  │   ├─→ Speak: "Show top categories"
  │   ├─→ [Listening animation]
  │   └─→ Results appear
  │
  ├─→ Upload CSV
  │   ├─→ Click [Upload CSV]
  │   ├─→ Drag file or select
  │   ├─→ Upload completes
  │   └─→ Query new data
  │
  ├─→ Regenerate Insights
  │   ├─→ Click [Regenerate]
  │   ├─→ New story appears
  │   └─→ Different perspective
  │
  └─→ Continue Exploring!
```

---

**🎨 Professional Dark Theme Design with Glassmorphism Effects**
**✨ Responsive & Optimized for All Devices**
**🚀 Production-Ready Architecture**
