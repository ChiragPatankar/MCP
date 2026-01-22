# 🚀 Deploy RAG Backend to Hugging Face Spaces

Hugging Face Spaces is **perfect** for deploying Python/FastAPI applications with ML dependencies!

## ✅ Why Hugging Face Spaces?

- ✅ **Free tier** with generous limits
- ✅ **Full Python 3.11+** support
- ✅ **ML libraries** fully supported (sentence-transformers, chromadb, etc.)
- ✅ **Persistent storage** for vector database
- ✅ **No bundle size limits**
- ✅ **GPU support** available (paid)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **GitHub integration** (auto-deploy on push)

## 📋 Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Your `rag-backend/` directory should contain:
- ✅ `app.py` - Entry point (already created)
- ✅ `requirements.txt` - Dependencies
- ✅ `app/main.py` - FastAPI application
- ✅ All other application files

### Step 2: Create Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Configure:
   - **Owner**: Your username
   - **Space name**: `clientsphere-rag-backend` (or your choice)
   - **SDK**: **Docker** (recommended) or **Gradio** (if you want UI)
   - **Hardware**: 
     - **CPU basic** (free) - Good for testing
     - **CPU upgrade** (paid) - Better performance
     - **GPU** (paid) - For heavy ML workloads

### Step 3: Connect GitHub Repository

1. In Space creation, select **"Repository"** as source
2. Choose your GitHub repository
3. Set **Repository path** to: `rag-backend/` (subdirectory)
4. Click **"Create Space"**

### Step 4: Configure Environment Variables

1. Go to your Space's **Settings** tab
2. Scroll to **"Repository secrets"** or **"Variables"**
3. Add these secrets:

**Required:**
```
GEMINI_API_KEY=your_gemini_api_key_here
ENV=prod
LLM_PROVIDER=gemini
```

**Optional (but recommended):**
```
ALLOWED_ORIGINS=https://main.clientsphere.pages.dev,https://abaa49a3.clientsphere.pages.dev
JWT_SECRET=your_secure_jwt_secret
DEBUG=false
```

### Step 5: Configure Docker (if using Docker SDK)

If you selected **Docker** SDK, Hugging Face will use your `Dockerfile`.

**Your existing `Dockerfile` should work!** It's already configured correctly.

### Step 6: Alternative - Use app.py (Simpler)

If you want to use the simpler `app.py` approach:

1. In Space settings, set:
   - **SDK**: **Gradio** or **Streamlit** (but we'll override)
   - **App file**: `app.py`

2. Hugging Face will automatically:
   - Install dependencies from `requirements.txt`
   - Run `python app.py`
   - Expose on port 7860

### Step 7: Deploy!

1. **Push to GitHub** (if not already):
   ```bash
   git add rag-backend/app.py
   git commit -m "Add Hugging Face Spaces entry point"
   git push origin main
   ```

2. **Hugging Face will auto-deploy** from your GitHub repo!

3. **Wait for build** (5-10 minutes first time, faster after)

4. **Your Space URL**: `https://your-username-clientsphere-rag-backend.hf.space`

## 🔧 Configuration Options

### Option A: Docker (Recommended)

**Advantages:**
- Full control over environment
- Can customize Python version
- Better for production

**Setup:**
- Use existing `Dockerfile`
- Hugging Face will build and run it
- Exposes on port 7860 automatically

### Option B: app.py (Simpler)

**Advantages:**
- Simpler setup
- Faster builds
- Good for development

**Setup:**
- Create `app.py` in `rag-backend/` (already done)
- Hugging Face runs it automatically

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |
| `ENV` | ✅ Yes | Set to `prod` for production |
| `LLM_PROVIDER` | ✅ Yes | `gemini` or `openai` |
| `ALLOWED_ORIGINS` | ⚠️ Recommended | CORS allowed origins (comma-separated) |
| `JWT_SECRET` | ⚠️ Recommended | JWT secret for authentication |
| `DEBUG` | ❌ Optional | Set to `false` in production |
| `OPENAI_API_KEY` | ❌ Optional | If using OpenAI instead of Gemini |

## 🌐 CORS Configuration

After deployment, update `ALLOWED_ORIGINS` to include:
- Your Cloudflare Pages frontend URL
- Your Cloudflare Workers backend URL
- Any other origins that need access

Example:
```
ALLOWED_ORIGINS=https://main.clientsphere.pages.dev,https://mcp-backend.officialchiragp1605.workers.dev
```

## 🔄 Updating Deployment

**Automatic (Recommended):**
- Push to GitHub → Hugging Face auto-deploys

**Manual:**
- Go to Space → Settings → "Rebuild Space"

## 📊 Resource Limits

### Free Tier:
- ✅ **CPU**: Basic (sufficient for RAG)
- ✅ **Storage**: 50GB (plenty for vector DB)
- ✅ **Memory**: 16GB RAM
- ✅ **Build time**: 20 minutes
- ✅ **Sleep after inactivity**: 48 hours (wakes on request)

### Paid Tiers:
- **CPU upgrade**: Better performance
- **GPU**: For heavy ML workloads
- **No sleep**: Always-on service

## 🧪 Testing Deployment

After deployment, test your endpoints:

```bash
# Health check
curl https://your-username-clientsphere-rag-backend.hf.space/health/live

# KB Stats (with auth)
curl https://your-username-clientsphere-rag-backend.hf.space/kb/stats?kb_id=default&tenant_id=test&user_id=test
```

## 🔗 Update Frontend

After deployment, update Cloudflare Pages environment variable:

```
VITE_RAG_API_URL=https://your-username-clientsphere-rag-backend.hf.space
```

Then redeploy frontend:
```bash
npm run build
npx wrangler pages deploy dist --project-name=clientsphere
```

## ✅ Advantages Over Render

| Feature | Hugging Face Spaces | Render |
|---------|-------------------|--------|
| Free Tier | ✅ Generous | ⚠️ Limited |
| ML Libraries | ✅ Full support | ✅ Full support |
| Auto-deploy | ✅ GitHub integration | ✅ GitHub integration |
| Storage | ✅ 50GB free | ⚠️ Limited |
| Sleep Mode | ✅ Wakes on request | ❌ No sleep mode |
| GPU Support | ✅ Available | ❌ Not available |
| Community | ✅ Large ML community | ⚠️ Smaller |

## 🎯 Summary

1. ✅ Create Hugging Face Space
2. ✅ Connect GitHub repository (rag-backend/)
3. ✅ Set environment variables
4. ✅ Deploy (automatic on push)
5. ✅ Update frontend `VITE_RAG_API_URL`
6. ✅ Test and enjoy!

**Your RAG backend will be live at:**
`https://your-username-clientsphere-rag-backend.hf.space`

---

**Need help?** Check [Hugging Face Spaces Docs](https://huggingface.co/docs/hub/spaces)

