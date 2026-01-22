# 🚀 Complete Deployment Guide - ClientSphere

This guide will help you deploy all three services:
1. **Frontend** (React/Vite) → Vercel/Netlify
2. **Node.js Backend** (Express) → Render/Railway
3. **Python RAG Backend** (FastAPI) → Render/Railway

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available) OR Railway account
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Google OAuth credentials (for authentication)

---

## 🎯 Deployment Strategy

### Recommended Setup:
- **Frontend**: Vercel (automatic deployments, CDN, free tier)
- **Node.js Backend**: Render (free tier, easy setup)
- **RAG Backend**: Render (free tier, Python support)

### Alternative:
- **Frontend**: Netlify
- **Backend**: Railway (both services on one platform)

---

## 1️⃣ Deploy Frontend (Vercel)

### Step 1: Prepare Frontend

1. **Ensure build works locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Create `.env.production` file:**
   ```env
   VITE_API_URL=https://your-node-backend.onrender.com
   VITE_RAG_API_URL=https://your-rag-backend.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

   OR use Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables (from `.env.production`)
   - Deploy!

### Step 3: Update CORS

After deployment, update your backend CORS settings to include your Vercel URL.

---

## 2️⃣ Deploy Node.js Backend (Render)

### Step 1: Prepare Backend

1. **Update `server/render.yaml`:**
   ```yaml
   services:
     - type: web
       name: clientsphere-backend
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 3001
         - key: JWT_SECRET
           generateValue: true
         - key: RAG_BACKEND_URL
           value: https://your-rag-backend.onrender.com
         - key: FRONTEND_URL
           value: https://your-frontend.vercel.app
         - key: GOOGLE_CLIENT_ID
           sync: false  # Set in dashboard
         - key: GOOGLE_CLIENT_SECRET
           sync: false  # Set in dashboard
   ```

### Step 2: Deploy to Render

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - **Name**: `clientsphere-backend`
     - **Root Directory**: `server`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid for better performance)

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=<generate-secure-random-string>
   RAG_BACKEND_URL=https://your-rag-backend.onrender.com
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL=./database.sqlite
   ```

4. **Deploy!**

### Step 3: Get Backend URL

After deployment, copy your Render service URL (e.g., `https://clientsphere-backend.onrender.com`)

---

## 3️⃣ Deploy RAG Backend (Render)

### Step 1: Prepare RAG Backend

1. **Create `rag-backend/render.yaml`:**
   ```yaml
   services:
     - type: web
       name: clientsphere-rag-backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: GEMINI_API_KEY
           sync: false  # Set in dashboard
         - key: ENV
           value: prod
         - key: ALLOWED_ORIGINS
           value: https://your-frontend.vercel.app,https://your-node-backend.onrender.com
   ```

### Step 2: Deploy to Render

1. **Create Render Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `clientsphere-rag-backend`
     - **Root Directory**: `rag-backend`
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free (or paid for better performance)

2. **Add Environment Variables:**
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ENV=prod
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-node-backend.onrender.com
   LLM_PROVIDER=gemini
   JWT_SECRET=<same-as-node-backend>
   ```

3. **Deploy!**

### Step 3: Get RAG Backend URL

After deployment, copy your Render service URL (e.g., `https://clientsphere-rag-backend.onrender.com`)

---

## 4️⃣ Update Environment Variables

### Frontend (Vercel)
Update environment variables in Vercel dashboard:
```
VITE_API_URL=https://clientsphere-backend.onrender.com
VITE_RAG_API_URL=https://clientsphere-rag-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Node.js Backend (Render)
Update in Render dashboard:
```
RAG_BACKEND_URL=https://clientsphere-rag-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### RAG Backend (Render)
Update in Render dashboard:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://clientsphere-backend.onrender.com
```

---

## 5️⃣ Alternative: Railway Deployment

If you prefer Railway for all services:

### Frontend (Railway)
1. Create new project
2. Connect GitHub repo
3. Set root directory to project root
4. Add build command: `npm run build`
5. Add start command: `npm run preview` (or use static files)

### Backend Services (Railway)
1. Create new project
2. Add services:
   - Node.js service (root: `server`)
   - Python service (root: `rag-backend`)
3. Configure each service with appropriate commands
4. Add environment variables

---

## 6️⃣ Post-Deployment Checklist

- [ ] All three services are running
- [ ] Frontend can connect to Node.js backend
- [ ] Node.js backend can connect to RAG backend
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Google OAuth is working
- [ ] Health checks are passing
- [ ] Test chat functionality
- [ ] Test document upload
- [ ] Test knowledge base

---

## 7️⃣ Testing Deployment

### Test Frontend:
```bash
curl https://your-frontend.vercel.app
```

### Test Node.js Backend:
```bash
curl https://your-node-backend.onrender.com/health
```

### Test RAG Backend:
```bash
curl https://your-rag-backend.onrender.com/health/live
```

---

## 8️⃣ Troubleshooting

### CORS Errors
- Check `ALLOWED_ORIGINS` in RAG backend
- Check `FRONTEND_URL` in Node.js backend
- Ensure URLs match exactly (including https)

### Connection Refused
- Check if services are running
- Check environment variables
- Check service URLs are correct

### Build Failures
- Check build logs in deployment platform
- Ensure all dependencies are in `package.json`/`requirements.txt`
- Check for TypeScript errors

### Database Issues
- SQLite files may not persist on free tiers
- Consider upgrading to paid tier or using external database

---

## 9️⃣ Production Optimizations

### Frontend:
- Enable Vercel Analytics
- Configure custom domain
- Enable caching headers

### Backend:
- Upgrade to paid tier for better performance
- Set up database backups
- Configure monitoring/logging
- Set up SSL certificates

---

## 🔟 Quick Deploy Script

Create a script to deploy all services:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying ClientSphere..."

# Deploy frontend
echo "📦 Deploying frontend..."
vercel --prod

# Deploy backends (via Git push triggers Render)
echo "📦 Pushing to GitHub (triggers Render deployment)..."
git add .
git commit -m "Deploy to production"
git push origin main

echo "✅ Deployment initiated!"
echo "Check your Render and Vercel dashboards for status."
```

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in your platform dashboard
2. Verify environment variables are set correctly
3. Test endpoints individually
4. Check CORS configuration

---

**🎉 Congratulations! Your ClientSphere application is now deployed!**

