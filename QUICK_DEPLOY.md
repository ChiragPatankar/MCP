# ⚡ Quick Deploy Reference

## 🎯 One-Command Deploy

### Windows:
```powershell
.\deploy.ps1
```

### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel account created
- [ ] Render account created
- [ ] Google Gemini API key obtained
- [ ] Google OAuth credentials configured
- [ ] Environment variables documented

---

## 🚀 Step-by-Step (5 minutes)

### 1. Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Node.js Backend (Render)
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build: `npm install && npm run build`
6. Start: `npm start`
7. Add environment variables (see DEPLOYMENT_GUIDE.md)

### 3. RAG Backend (Render)
1. New → Web Service
2. Connect GitHub repo
3. Root Directory: `rag-backend`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (see DEPLOYMENT_GUIDE.md)

---

## 🔑 Required Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
VITE_RAG_API_URL=https://your-rag-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Node.js Backend (Render)
```
NODE_ENV=production
PORT=3001
JWT_SECRET=<generate-secure-random>
RAG_BACKEND_URL=https://your-rag-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### RAG Backend (Render)
```
GEMINI_API_KEY=your-gemini-key
ENV=prod
LLM_PROVIDER=gemini
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.onrender.com
JWT_SECRET=<same-as-node-backend>
```

---

## ✅ Post-Deployment

1. Update CORS in all services
2. Test endpoints:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.onrender.com/health`
   - RAG: `https://your-rag-backend.onrender.com/health/live`
3. Test authentication
4. Test chat functionality

---

## 🆘 Troubleshooting

**CORS errors?**
→ Check `ALLOWED_ORIGINS` matches your frontend URL exactly

**Connection refused?**
→ Verify service URLs in environment variables

**Build fails?**
→ Check deployment logs in platform dashboard

---

**Full guide:** See `DEPLOYMENT_GUIDE.md` for detailed instructions.

