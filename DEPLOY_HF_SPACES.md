# 🚀 Quick Deploy to Hugging Face Spaces

## ⚡ 5-Minute Setup

### 1. Create Space
1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Settings:
   - **Name**: `clientsphere-rag-backend`
   - **SDK**: **Docker** (recommended)
   - **Hardware**: CPU basic (free)

### 2. Connect GitHub
- Select your repository
- **Path**: `rag-backend/`
- Click **"Create"**

### 3. Add Secrets
In Space Settings → Variables:
```
GEMINI_API_KEY=your_key
ENV=prod
LLM_PROVIDER=gemini
ALLOWED_ORIGINS=https://main.clientsphere.pages.dev
```

### 4. Deploy
- Push to GitHub → Auto-deploys!
- Wait 5-10 minutes for first build

### 5. Update Frontend
In Cloudflare Pages → Environment Variables:
```
VITE_RAG_API_URL=https://your-username-clientsphere-rag-backend.hf.space
```

Redeploy frontend:
```bash
npm run build
npx wrangler pages deploy dist --project-name=clientsphere
```

## ✅ Done!

Your RAG backend is now live on Hugging Face Spaces!

**See `rag-backend/README_HF_SPACES.md` for full details.**

