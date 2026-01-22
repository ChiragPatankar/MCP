# ☁️ Cloudflare Deployment Status

## ✅ Frontend (Cloudflare Pages)

**Status:** ✅ Deployed  
**URL:** https://main.clientsphere.pages.dev  
**Deployment URL:** https://abaa49a3.clientsphere.pages.dev

### Deployment Command:
```bash
npm run build
npx wrangler pages deploy dist --project-name=clientsphere
```

### Environment Variables (Set in Cloudflare Pages Dashboard):
```
VITE_API_URL=https://mcp-backend.officialchiragp1605.workers.dev
VITE_RAG_API_URL=https://your-rag-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## ✅ Cloudflare Workers (MCP Backend)

**Status:** ✅ Deployed  
**URL:** https://mcp-backend.officialchiragp1605.workers.dev

### Deployment Command:
```bash
cd mcp-backend
npx wrangler deploy
```

---

## ⚠️ RAG Backend - Cloudflare Limitation

**Status:** ❌ Cannot deploy to Cloudflare Workers

### Why?
The RAG backend is a Python FastAPI application with heavy ML dependencies:
- `sentence-transformers` (embedding models)
- `chromadb` (vector database)
- `pymupdf`, `python-docx` (document processing)
- Large model files and dependencies

**Cloudflare Workers limitations:**
- Python support is limited/beta
- 10MB bundle size limit (our dependencies are much larger)
- No persistent file system for vector database
- CPU/memory limits too restrictive for ML workloads

### ✅ Recommended Deployment:
**Deploy to Render or Railway** (see `DEPLOYMENT_GUIDE.md`)

The RAG backend needs:
- Full Python 3.11+ environment
- Persistent storage for vector database
- Sufficient CPU/memory for ML operations
- Ability to install large Python packages

### Alternative: Cloudflare Workers Proxy
If you want to keep everything on Cloudflare, you could:
1. Deploy RAG backend to Render/Railway
2. Create a Cloudflare Worker that proxies requests to the RAG backend
3. This gives you Cloudflare's CDN benefits while hosting the heavy backend elsewhere

---

## 🔄 Updating Deployments

### Update Frontend:
```bash
npm run build
npx wrangler pages deploy dist --project-name=clientsphere
```

### Update Workers Backend:
```bash
cd mcp-backend
npx wrangler deploy
```

### Update RAG Backend (on Render/Railway):
- Push to GitHub (auto-deploys if configured)
- Or manually redeploy from dashboard

---

## 📝 Notes

- Frontend and Workers backend are fully deployed on Cloudflare
- RAG backend must be deployed to Render/Railway due to technical limitations
- All services can work together via their respective URLs
- Update environment variables to connect all services

