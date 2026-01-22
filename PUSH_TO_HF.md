# 🚀 Push Files to Hugging Face Space

## Quick Steps

### 1. Get Hugging Face Token

1. Go to: https://huggingface.co/settings/tokens
2. Click **"New token"**
3. **Name**: `RAG Backend Deploy`
4. **Type**: **Write** (needed to push files)
5. **Copy the token** (you'll only see it once!)

### 2. Push Using Token

**Option A: One-time push (replace YOUR_TOKEN)**
```bash
cd D:\project\rag-backend
git push https://YOUR_TOKEN@huggingface.co/spaces/ChiragPatankar/RAG_backend main
```

**Option B: Set up remote with token (replace YOUR_TOKEN)**
```bash
cd D:\project\rag-backend
git remote set-url hf https://YOUR_TOKEN@huggingface.co/spaces/ChiragPatankar/RAG_backend
git push hf main
```

**Option C: Use Git Credential Helper (Recommended)**
```bash
cd D:\project\rag-backend
# First time: enter token when prompted
git push hf main
# Username: ChiragPatankar
# Password: <paste your token>
```

### 3. Alternative: Use HF CLI

```bash
# Install HF CLI
pip install huggingface_hub

# Login
huggingface-cli login

# Then push
git push hf main
```

## ✅ After Push

1. **Files will appear** in your Space's "Files" tab
2. **Auto-deploy starts** automatically
3. **Check "Logs"** tab for build progress
4. **Wait 5-10 minutes** for first build

## 🔒 Security Note

- ⚠️ **Never commit tokens to git**
- ✅ Use environment variables or credential helper
- ✅ Revoke old tokens if compromised

## 🆘 Troubleshooting

**"Authentication failed"**
→ Make sure token has **Write** permission

**"Repository not found"**
→ Check Space name: `ChiragPatankar/RAG_backend`

**"Permission denied"**
→ Token might be expired, generate a new one

---

**Quick Command (after getting token):**
```bash
cd D:\project\rag-backend
git push https://YOUR_TOKEN@huggingface.co/spaces/ChiragPatankar/RAG_backend main
```

