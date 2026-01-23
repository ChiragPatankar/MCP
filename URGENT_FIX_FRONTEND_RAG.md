# 🚨 URGENT: Fix Frontend RAG Backend Connection

## Current Problem

The deployed frontend is trying to connect to `http://localhost:8000` instead of the Hugging Face Space, causing:
- ❌ "Failed to load stats" errors
- ❌ "No Knowledge Base Yet" message
- ❌ `ERR_CONNECTION_REFUSED` in console

## ✅ Solution: Update Cloudflare Pages Environment Variable

### Step 1: Go to Cloudflare Dashboard

1. Visit: **https://dash.cloudflare.com**
2. Login to your account
3. Click **"Pages"** in the left sidebar
4. Click on your project: **`clientsphere`**

### Step 2: Update Environment Variable

1. Click the **"Settings"** tab
2. Scroll down to **"Environment Variables"** section
3. Click **"Add variable"** (or edit existing `VITE_RAG_API_URL` if it exists)
4. Fill in:
   - **Variable name**: `VITE_RAG_API_URL`
   - **Value**: `https://ChiragPatankar-RAG_backend.hf.space`
   - **Environment**: Select **"Production"** (or "All environments")
5. Click **"Save"**

### Step 3: Redeploy Frontend

**Option A: Retry Latest Deployment (Fastest)**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (⋯)** next to it
4. Click **"Retry deployment"**
5. Wait 1-2 minutes for deployment to complete

**Option B: Trigger New Deployment**
```bash
# Make a small change and push to trigger auto-deploy
git commit --allow-empty -m "Trigger Cloudflare Pages redeploy"
git push origin main
```

### Step 4: Verify

1. **Wait for deployment** (1-2 minutes)
2. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Open browser console** (F12)
4. **Check for**:
   - ✅ Requests to `https://ChiragPatankar-RAG_backend.hf.space`
   - ❌ NO requests to `http://localhost:8000`

## 🔍 Verify Hugging Face Space is Working

Before updating the frontend, verify the Space is accessible:

1. **Visit Space page**: https://huggingface.co/spaces/ChiragPatankar/RAG_backend
2. **Check status**: Should show "Running" (not "Building" or "Error")
3. **Check Logs tab**: Look for any errors
4. **Test in browser**: Visit https://ChiragPatankar-RAG_backend.hf.space/
   - If it's sleeping, first request takes 30-60 seconds
   - Should return JSON with `{"status":"ok",...}`

## ⚠️ If Hugging Face Space Returns 404

If the Space is returning 404:

1. **Check Space Status**:
   - Go to: https://huggingface.co/spaces/ChiragPatankar/RAG_backend
   - Check if it shows "Running" or "Building"
   - If "Building", wait for it to complete

2. **Check Environment Variables** (Settings → Variables):
   ```
   GEMINI_API_KEY=your_key
   ENV=prod
   LLM_PROVIDER=gemini
   ALLOWED_ORIGINS=https://main.clientsphere.pages.dev,https://abaa49a3.clientsphere.pages.dev
   ```

3. **Check Logs Tab**:
   - Look for errors during startup
   - Verify `app.py` is being executed
   - Check if FastAPI app started successfully

4. **Verify app.py exists**:
   - Should be in `rag-backend/app.py`
   - Should import from `app.main`
   - Should run uvicorn on port 7860

## 📝 Quick Checklist

- [ ] Updated `VITE_RAG_API_URL` in Cloudflare Pages
- [ ] Redeployed frontend
- [ ] Verified Space is running (not 404)
- [ ] Hard refreshed browser
- [ ] Checked browser console for correct URL
- [ ] Knowledge base stats loading successfully

## 🆘 Still Not Working?

1. **Clear browser cache completely**
2. **Check Cloudflare deployment logs** for errors
3. **Verify environment variable** is set correctly in dashboard
4. **Test Space directly** in browser or with curl
5. **Check CORS settings** in Space (ALLOWED_ORIGINS)

---

**Priority**: Update the Cloudflare Pages environment variable first - this is the main issue!

