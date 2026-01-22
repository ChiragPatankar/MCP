# 🔧 Fix Frontend RAG Backend URL

## Problem
Frontend is trying to connect to `http://localhost:8000` instead of the Hugging Face Space.

## Solution: Update Cloudflare Pages Environment Variable

### Method 1: Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Login to your account

2. **Navigate to Pages**
   - Click "Pages" in the left sidebar
   - Click on your project: `clientsphere`

3. **Go to Settings**
   - Click "Settings" tab
   - Scroll to "Environment Variables" section

4. **Add/Update Variable**
   - Click "Add variable" or edit existing
   - **Variable name**: `VITE_RAG_API_URL`
   - **Value**: `https://ChiragPatankar-RAG_backend.hf.space`
   - **Environment**: Select "Production" (or "All environments")
   - Click "Save"

5. **Redeploy**
   - Go to "Deployments" tab
   - Find the latest deployment
   - Click the three dots (⋯) → "Retry deployment"
   - OR trigger a new deployment by pushing to GitHub

### Method 2: Update via Wrangler (Alternative)

If you have Wrangler CLI configured:

```bash
# Note: Wrangler doesn't directly support setting public env vars
# You'll need to use the dashboard or set it during deployment
```

### Method 3: Update .env.production and Redeploy

1. **Update .env.production** (if it exists):
   ```
   VITE_RAG_API_URL=https://ChiragPatankar-RAG_backend.hf.space
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=clientsphere
   ```

   **Note**: This only works if Cloudflare Pages reads .env.production during build. Usually, you need to set it in the dashboard.

## ✅ After Update

1. **Wait for deployment** (1-2 minutes)
2. **Hard refresh** your browser (Ctrl+Shift+R)
3. **Test the knowledge base** page
4. **Check browser console** - should see requests to Hugging Face Space URL

## 🧪 Verify It's Working

After updating, check browser console:
- ✅ Should see requests to: `https://ChiragPatankar-RAG_backend.hf.space`
- ❌ Should NOT see: `http://localhost:8000`

## 🆘 If Still Not Working

1. **Clear browser cache** completely
2. **Check environment variable** is set correctly in dashboard
3. **Verify deployment** completed successfully
4. **Check CORS** - make sure `ALLOWED_ORIGINS` in HF Space includes your frontend URL

---

**Quick Fix**: Go to Cloudflare Dashboard → Pages → clientsphere → Settings → Environment Variables → Add `VITE_RAG_API_URL` = `https://ChiragPatankar-RAG_backend.hf.space` → Redeploy

