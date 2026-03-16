# InsightAI Deployment Guide

Deploy InsightAI to production using Vercel, Railway, or Docker.

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub account with repository

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: InsightAI dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/insightai.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repository
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add the following:

```
GEMINI_API_KEY=your_actual_api_key
BACKEND_URL=https://insightai-api.railway.app  (if using Railway)
NEXT_PUBLIC_API_URL=https://insightai-dashboard.vercel.app/api
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Get your URL: `https://insightai-dashboard.vercel.app`

### Backend on Railway (Recommended)

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your insightai repository
5. Add environment variable: `GEMINI_API_KEY`
6. Set start command: `pip install -r backend/requirements.txt && cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Deploy and copy URL

Then update Vercel env var `BACKEND_URL` with Railway URL.

## Option 2: Deploy to Railway (Full Stack)

### Step 1: Create Railway Project

1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project
4. Select "Deploy from GitHub"
5. Choose your repository

### Step 2: Configure Services

**Service 1: Frontend (Next.js)**
```
Build Command: pnpm install && pnpm run build
Start Command: pnpm start
Port: 3000
```

**Service 2: Backend (FastAPI)**
```
Build Command: pip install -r backend/requirements.txt
Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
Port: 8000
```

### Step 3: Environment Variables

In Railway Project Settings:
```
GEMINI_API_KEY=your_api_key
BACKEND_URL=https://[backend-railway-url]
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy"
2. Railway automatically deploys both services
3. View at Railway dashboard URLs

## Option 3: Docker Deployment

### Using Docker Compose (Local)

```bash
# Build and run
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Using Docker Swarm (Production)

```bash
# Initialize swarm
docker swarm init

# Deploy
docker stack deploy -c docker-compose.yml insightai

# View services
docker service ls

# Stop
docker stack rm insightai
```

### Using Kubernetes

Create `kubernetes/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: insightai-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: insightai-backend
  template:
    metadata:
      labels:
        app: insightai-backend
    spec:
      containers:
      - name: backend
        image: insightai-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: gemini
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: insightai-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: insightai-frontend
  template:
    metadata:
      labels:
        app: insightai-frontend
    spec:
      containers:
      - name: frontend
        image: insightai-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: BACKEND_URL
          value: "http://insightai-backend:8000"
```

Deploy:
```bash
kubectl apply -f kubernetes/deployment.yaml
```

## Option 4: Deploy to AWS

### Using EC2 + RDS

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium instance type
   - Security group: Allow ports 80, 443, 3000, 8000

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   
   # Install dependencies
   sudo apt update && sudo apt upgrade -y
   sudo apt install nodejs npm python3-pip nginx -y
   
   # Clone repository
   git clone your-repo-url
   cd insightai
   
   # Setup frontend
   npm install -g pnpm
   pnpm install
   pnpm run build
   
   # Setup backend
   cd backend
   pip install -r requirements.txt
   
   # Configure Nginx as reverse proxy
   sudo nano /etc/nginx/sites-available/default
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:8000;
       }
   }
   ```

4. **Start Services**
   ```bash
   # Backend
   cd ~/insightai/backend
   nohup uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
   
   # Frontend
   cd ~/insightai
   nohup npm start > frontend.log 2>&1 &
   ```

### Using AWS Lambda + API Gateway (Serverless)

For the FastAPI backend:

```bash
# Install serverless framework
npm install -g serverless

# Create serverless configuration
serverless create --template aws-python3 --path insightai-serverless

# Deploy
serverless deploy
```

## Production Checklist

- [ ] API keys stored in environment variables (not in code)
- [ ] Database backups configured
- [ ] CORS properly configured for domain
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Monitoring/alerts setup
- [ ] SSL/TLS certificate installed
- [ ] CDN configured for static assets
- [ ] Database indexes optimized
- [ ] API response caching enabled

## Performance Optimization

### Frontend

```javascript
// next.config.mjs
export default {
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
}
```

### Backend

```python
# main.py
from fastapi.middleware.gzip import GZIPMiddleware

app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Add caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend
```

## Monitoring & Logging

### Vercel
- Built-in analytics at vercel.com/dashboard
- Real-time logs in Vercel dashboard

### Railway
- Real-time metrics and logs
- Error tracking integration

### Custom Logging

Add to backend:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/query")
async def process_query(request: QueryRequest):
    logger.info(f"Query received: {request.query}")
    # ...
```

## Backup & Recovery

### Database Backup

```bash
# SQLite backup
cp data/amazon_sales.db data/amazon_sales.db.backup

# Automated backup with cron
0 2 * * * cp /path/to/data/amazon_sales.db /path/to/backups/amazon_sales_$(date +\%Y\%m\%d).db
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer in front of multiple backend instances
- Use PostgreSQL instead of SQLite for production
- Implement query result caching with Redis

### Database Optimization
```sql
-- Create indexes for faster queries
CREATE INDEX idx_order_date ON amazon_sales(order_date);
CREATE INDEX idx_region ON amazon_sales(customer_region);
CREATE INDEX idx_category ON amazon_sales(product_category);
```

## Security Hardening

### Environment Variables
```bash
# Never commit .env files
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore
```

### API Security
```python
# Rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/query")
@limiter.limit("10/minute")
async def process_query(request: QueryRequest):
    # ...
```

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Cost Estimation

### Monthly Costs (Approximate)

**Vercel Frontend**
- Free tier or $20/month (Pro)

**Railway Backend**
- $5-50/month depending on usage

**Gemini API**
- Free tier: 60 requests/minute
- Paid: $0.00075 per 1K input tokens

**Total**: ~$5-70/month

## Troubleshooting

### "Backend not responding"
1. Check backend service status
2. Verify environment variables set
3. Check backend logs for errors
4. Verify BACKEND_URL in frontend env vars

### "Out of memory" errors
1. Increase instance size
2. Implement query caching
3. Limit result set size
4. Use pagination for large datasets

### "Database locked"
1. Migrate to PostgreSQL
2. Implement connection pooling
3. Reduce concurrent queries

---

**Deployment Complete!** Your InsightAI dashboard is now in production.
