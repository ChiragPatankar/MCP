# 🔗 Connect GitHub Repository to Hugging Face Space - Step by Step

## ✅ Easiest Method (Recommended)

Since direct git push is blocked by binary files, connecting GitHub is the best solution!

### Step-by-Step Instructions:

1. **Go to Your Space Settings**
   - Visit: https://huggingface.co/spaces/ChiragPatankar/RAG_backend/settings
   - Or: Go to your Space → Click "Settings" tab

2. **Find Repository Section**
   - Scroll down to find "Repository" section
   - Look for:
     - "Repository" field (text input)
     - OR "Connect repository" button
     - OR "Link repository" option

3. **Enter Repository Details**
   - **Repository**: `ChiragPatankar/MCP`
   - **Path**: `rag-backend/` (important: include trailing slash)
   - **Branch**: `main`

4. **Save/Connect**
   - Click "Save" or "Connect" button
   - Authorize GitHub access if prompted

5. **Wait for Sync**
   - Hugging Face will sync from GitHub
   - Files will appear in "Files" tab
   - Auto-deploy will start automatically

## 📝 What to Look For in Settings

The Settings page should have a section like:

```
Repository
├── Repository: [ChiragPatankar/MCP]
├── Path: [rag-backend/]
└── Branch: [main]
```

OR a button:
```
[Connect repository] or [Link repository]
```

## ✅ After Connection

1. **Check Files Tab**
   - All RAG backend files should appear
   - Should see: `app.py`, `Dockerfile`, `requirements.txt`, `app/`, etc.

2. **Add Environment Variables** (Settings → Variables):
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ENV=prod
   LLM_PROVIDER=gemini
   ALLOWED_ORIGINS=https://main.clientsphere.pages.dev
   ```

3. **Check Logs Tab**
   - Build should start automatically
   - Wait 5-10 minutes for first build

4. **Test Your Space**
   ```
   https://ChiragPatankar-RAG_backend.hf.space/health/live
   ```

## 🆘 If You Can't Find Repository Option

Some Spaces might not have this option visible. In that case:

1. **Delete and Recreate Space** (with GitHub connection):
   - Delete current Space
   - Create new Space
   - During creation, select "Repository" as source
   - Connect GitHub repo
   - Set path: `rag-backend/`

2. **OR Use HF Web Interface**:
   - Upload files manually via web interface
   - Go to "Files" tab
   - Click "Upload file" or drag & drop

## 🎯 Why This Works

- ✅ GitHub already has all files (including binaries)
- ✅ Hugging Face syncs from GitHub (handles binaries better)
- ✅ Auto-deploys on every GitHub push
- ✅ No binary file blocking issues

---

**This is the recommended method and will work perfectly!**

