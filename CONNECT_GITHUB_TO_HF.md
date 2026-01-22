# 🔗 Connect GitHub Repository to Hugging Face Space

## Method 1: Connect During Space Creation (If you haven't created yet)

1. When creating the Space, look for **"Repository"** option
2. Select **"Repository"** instead of creating from scratch
3. Choose your GitHub repository: `ChiragPatankar/MCP`
4. Set **Repository path**: `rag-backend/` (subdirectory)
5. Click **"Create Space"**

## Method 2: Connect Existing Space (Your Current Situation)

Since you already created the Space, you need to connect it manually:

### Step 1: Go to Settings
1. In your Space (`ChiragPatankar/RAG_backend`)
2. Click the **"Settings"** tab (top right)

### Step 2: Connect Repository
1. Scroll down to **"Repository"** section
2. Look for **"Connect repository"** or **"Link repository"** button
3. Click it

### Step 3: Authorize GitHub
1. You'll be asked to authorize Hugging Face to access GitHub
2. Click **"Authorize"** or **"Connect GitHub"**
3. Select your repository: `ChiragPatankar/MCP`

### Step 4: Set Repository Path
1. **Repository path**: Enter `rag-backend/`
   - This tells HF to look in the `rag-backend/` subdirectory
2. **Branch**: `main` (or `master`)
3. Click **"Save"** or **"Connect"**

### Step 5: Wait for Sync
- Hugging Face will sync your repository
- This may take a few minutes
- You'll see files appear in the "Files" tab

## Method 3: Manual Push (Alternative)

If connection doesn't work, you can push directly:

### Step 1: Add Hugging Face Remote
```bash
cd D:\project\rag-backend
git remote add huggingface https://huggingface.co/spaces/ChiragPatankar/RAG_backend
```

### Step 2: Push to Hugging Face
```bash
git push huggingface main
```

**Note:** You may need to authenticate with Hugging Face token.

## Method 4: Use Git LFS (If files are large)

If you have large files:
```bash
git lfs install
git lfs track "*.db"
git lfs track "data/**"
```

## ✅ After Connection

1. **Files should appear** in the "Files" tab
2. **Auto-deploy** will start automatically
3. **Check "Logs"** tab to see build progress
4. **Wait 5-10 minutes** for first build

## 🔧 If Connection Fails

### Troubleshooting:
1. **Check repository visibility**: Make sure repo is public or you've granted access
2. **Verify path**: Ensure `rag-backend/` path is correct
3. **Check branch**: Make sure branch name matches (`main` vs `master`)
4. **Re-authorize**: Try disconnecting and reconnecting GitHub

### Alternative: Clone and Push
```bash
# Clone your HF Space
git clone https://huggingface.co/spaces/ChiragPatankar/RAG_backend
cd RAG_backend

# Copy files from your local rag-backend
cp -r D:\project\rag-backend/* .

# Commit and push
git add .
git commit -m "Add RAG backend files"
git push
```

## 📝 Required Files in Space

After connection, your Space should have:
- ✅ `app.py` - Entry point
- ✅ `Dockerfile` - Docker configuration
- ✅ `requirements.txt` - Python dependencies
- ✅ `app/` - Application directory
- ✅ All other RAG backend files

## 🚀 Next Steps After Connection

1. **Add Environment Variables** (Settings → Variables):
   ```
   GEMINI_API_KEY=your_key
   ENV=prod
   LLM_PROVIDER=gemini
   ALLOWED_ORIGINS=https://main.clientsphere.pages.dev
   ```

2. **Wait for Build** (check "Logs" tab)

3. **Test Deployment**:
   ```
   https://ChiragPatankar-RAG_backend.hf.space/health/live
   ```

4. **Update Frontend**:
   ```
   VITE_RAG_API_URL=https://ChiragPatankar-RAG_backend.hf.space
   ```

---

**Quick Tip:** The easiest way is Method 2 (Settings → Connect Repository). If that doesn't work, use Method 3 (manual push).

