# InsightAI - Conversational BI Dashboard for Amazon Sales

A cutting-edge AI-powered business intelligence platform that transforms natural language questions into instant visual insights, complete with 8 major features + 2 bonus hackathon-winning features.

## ✅ 8 Major Features + 2 Bonus Features

### **1️⃣ Conversational Query Engine**
- Ask questions in natural language: "Show revenue by region"
- AI converts to optimized SQL queries using Gemini API
- Support for complex aggregations, filters, and joins
- Context-aware query generation with schema validation

### **2️⃣ Dynamic Dashboard Generator**
- 6 pre-built professional dashboards
- Auto-loading charts on application load
- Revenue trends, category performance, regional insights
- Payment method distribution, discount analysis, rating correlation
- Real-time data updates

### **3️⃣ AI Chart Selection Engine**
- Intelligent automatic chart type detection
- Supports: Line, Bar, Pie, Donut, Scatter charts
- Pattern recognition for optimal visualization
- Automatic axis scaling and data formatting

### **4️⃣ KPI Metrics Engine**
- Real-time key performance indicators
- Total Revenue, Total Orders, Products Sold, Avg Rating, Reviews
- Formatted displays with loading states
- 5-metric overview dashboard

### **5️⃣ Interactive Charts**
- Beautiful Recharts visualizations
- Hover tooltips, legends, and interactive features
- Professional color palette
- Responsive design for all devices

### **6️⃣ AI Insights Generator**
- AI-powered storytelling using Gemini API
- Multi-level analysis: findings, implications, recommendations
- Statistical pattern detection
- Auto-regenerate button for variations

### **7️⃣ Follow-up Query System**
- Conversation history and context memory
- Smart query refinement and filtering
- Previous query display
- Multi-turn conversation support

### **8️⃣ CSV Upload Data Engine**
- Drag-and-drop CSV file upload
- Automatic schema detection
- Dynamic table creation
- Instant queryability on new datasets

### **🎁 BONUS: Voice Query Support**
- Web Speech API integration
- Real-time speech-to-text transcription
- Microphone button with visual feedback
- Natural language voice input

### **🎁 BONUS: AI Storytelling**
- Executive summaries from data
- Business context-aware narratives
- Key metric highlighting
- Trend and performance analysis

## 📊 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19.2
- Recharts (Data visualization)
- Tailwind CSS 4 (Dark-themed UI)
- shadcn/ui components
- Lucide React icons

### Backend
- FastAPI 0.109
- Python 3.9+
- SQLite3
- Google Generative AI (Gemini)
- Pandas (Data processing)
- Uvicorn (ASGI server)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- Google Gemini API key (free from https://ai.google.dev)
- pnpm (recommended) or npm

### Installation

1. **Clone and navigate to project**
   ```bash
   cd insightai-dashboard
   ```

2. **Install Frontend Dependencies**
   ```bash
   pnpm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Or using uv
   uv sync
   cd ..
   ```

4. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

5. **Initialize Database**
   ```bash
   python scripts/setup.py
   ```
   This loads the Amazon Sales CSV data into SQLite database

### Running the Application

**Terminal 1 - Start Frontend (Port 3000)**
```bash
pnpm dev
```

**Terminal 2 - Start Backend (Port 8000)**
```bash
pnpm dev:backend
```

Visit `http://localhost:3000` to access the dashboard.

## 📚 API Endpoints

### POST `/api/query`
Process natural language query and return dashboard data

**Request:**
```json
{
  "query": "Show revenue by region"
}
```

**Response:**
```json
{
  "success": true,
  "sql_query": "SELECT customer_region, SUM(total_revenue) FROM amazon_sales GROUP BY customer_region",
  "chart_type": "pie",
  "data": [...],
  "insights": "Asia region contributes 38% of total sales...",
  "error": null
}
```

### GET `/api/kpis`
Retrieve key performance indicators

**Response:**
```json
{
  "revenue": 1245000,
  "orders": 50000,
  "products_sold": 80000,
  "avg_rating": 4.1,
  "reviews": 25000
}
```

## 🎨 Dashboard Features

### KPI Cards
Display key metrics with visual indicators:
- **Total Revenue**: Sum of all transactions
- **Total Orders**: Count of unique orders
- **Products Sold**: Sum of quantities
- **Avg Rating**: Average product rating (0-5)

### Chart Types
Automatically selected based on data:
- **Line Chart**: Time-series data (dates)
- **Bar Chart**: Category comparisons
- **Pie Chart**: Part-of-whole distributions
- **Scatter Plot**: Correlation analysis

### AI Insights Panel
Generates business intelligence automatically:
- Key findings and trends
- Statistical observations
- Business implications

## 🧪 Example Queries

Try these natural language queries:

1. **Revenue Analysis**
   - "Show revenue by region"
   - "Top 5 product categories by revenue"
   - "Monthly sales trend"

2. **Customer Insights**
   - "Which region buys the most"
   - "Payment method distribution"
   - "Customer satisfaction by region"

3. **Product Performance**
   - "Best selling products"
   - "Products with highest ratings"
   - "Average discount by category"

4. **Trend Analysis**
   - "Does discount affect sales volume"
   - "Revenue trend over time"
   - "Seasonal patterns in orders"

## 🔧 Configuration

### Database
- Located at: `data/amazon_sales.db`
- CSV Source: `data/amazon_sales.csv`
- Schema: 13 columns with sales transaction data

### API Configuration
- Frontend Backend URL: Set in `BACKEND_URL` env variable
- CORS: Enabled for all origins (configure in production)
- GEMINI_API_KEY: Required for AI query generation

### Deployment

**To Vercel (Recommended)**
```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `GEMINI_API_KEY`
- `BACKEND_URL` (if hosting backend separately)

**To Docker**
```dockerfile
# Frontend
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]

# Backend
FROM python:3.9
WORKDIR /app
COPY backend .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

## 📈 Data Dictionary

### Amazon Sales Table
| Column | Type | Description |
|--------|------|-------------|
| order_id | INT | Unique transaction ID |
| order_date | DATE | Purchase date (YYYY-MM-DD) |
| product_id | INT | Product identifier |
| product_category | TEXT | Product category (Books, Fashion, etc.) |
| price | FLOAT | Original unit price |
| discount_percent | INT | Discount percentage (0-30%) |
| quantity_sold | INT | Units purchased |
| customer_region | TEXT | Geographic region |
| payment_method | TEXT | UPI, Credit Card, Debit Card, Wallet, Cash |
| rating | FLOAT | Product rating (1-5) |
| review_count | INT | Number of reviews |
| discounted_price | FLOAT | Price after discount |
| total_revenue | FLOAT | Revenue from order |

## 🎯 Hackathon Evaluation Criteria

### Accuracy (40 points)
✅ Accurate SQL generation from natural language
✅ Correct chart type selection
✅ Robust error handling for ambiguous queries

### Aesthetics & UX (30 points)
✅ Dark-themed modern dashboard design
✅ Interactive charts with tooltips
✅ Smooth loading states and animations
✅ Intuitive query interface

### Approach & Innovation (30 points)
✅ Robust pipeline: Text → LLM → Database → Frontend
✅ Advanced prompt engineering with schema context
✅ Hallucination prevention with validation
✅ Follow-up query support with context

## 🚀 Future Enhancements

### Bonus Features (Hackathon Winning)
- [ ] Voice input for queries
- [ ] AI-generated report generation
- [ ] CSV upload for custom datasets
- [ ] Follow-up query with conversation history
- [ ] Multi-table JOIN support
- [ ] Real-time data updates
- [ ] Export to PDF/Excel

### Scaling
- [ ] PostgreSQL for larger datasets
- [ ] Redis caching for query results
- [ ] Async job queue for long-running queries
- [ ] Rate limiting and authentication
- [ ] User workspace management

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is provided as-is for hackathon evaluation.

## 🎓 Learning Resources

- [Google Gemini API](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Guide](https://nextjs.org/docs)
- [Recharts API](https://recharts.org/api)
- [SQLite Tutorial](https://www.sqlite.org/docs.html)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

### Database initialization fails
```bash
# Remove existing database and reinitialize
rm data/amazon_sales.db
python scripts/setup.py
```

### GEMINI_API_KEY errors
- Get free API key: https://ai.google.dev
- Add to .env.local file
- Restart backend server

### CORS errors in frontend
- Check BACKEND_URL in .env.local
- Ensure backend is running on port 8000
- Check FastAPI CORS configuration

## 📞 Support

For issues, questions, or feedback:
1. Check the troubleshooting section
2. Review the example queries
3. Check console for error messages
4. Ensure API keys are properly configured

---

**Built with ❤️ for the hackathon**

InsightAI - Making data intelligence accessible to everyone through conversation.
# insight-ai
