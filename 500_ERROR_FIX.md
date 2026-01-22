# 500 Internal Server Error Fix Guide

## Problem
You're seeing a `500 (Internal Server Error)` when calling `/chat` endpoint. The backend is running, but something is failing internally.

## Quick Diagnosis

### Step 1: Check Backend Logs

**This is the most important step!** The backend logs will show the exact error.

Look at the terminal where you started `uvicorn`. You should see error messages like:
```
ERROR: Chat error: <specific error message>
```

Common errors you might see:

#### Error 1: Missing API Key
```
ValueError: Gemini API key not configured. Set GEMINI_API_KEY environment variable.
```

**Fix:**
1. Create/edit `rag-backend/.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   LLM_PROVIDER=gemini
   ```
2. Get your API key from: https://aistudio.google.com/app/apikey
3. Restart the backend server

#### Error 2: Database Not Initialized
```
OperationalError: no such table: tenants
```

**Fix:**
```bash
cd rag-backend
python scripts/create_billing_tables.py
```

#### Error 3: Vector Store Not Initialized
```
ChromaDB error: Collection not found
```

**Fix:** This usually resolves automatically when you upload your first document. Try uploading a document first.

#### Error 4: Import/Module Error
```
ModuleNotFoundError: No module named '...'
```

**Fix:**
```bash
cd rag-backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Verify Environment Variables

Check your `rag-backend/.env` file exists and has:

```env
# Required for chat to work
GEMINI_API_KEY=your_key_here
LLM_PROVIDER=gemini

# Optional but recommended
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENV=dev
```

### Step 3: Test Backend Health

```bash
# Test basic health
curl http://localhost:8000/health/live

# Test readiness (checks dependencies)
curl http://localhost:8000/health/ready
```

**Expected Response:**
```json
{"status": "ready", "checks": {"vector_db": true, "llm_configured": true}}
```

**If `llm_configured` is `false`:**
- Your API key is missing or not loaded
- Check `.env` file and restart backend

### Step 4: Test Chat Endpoint Directly

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user" \
  -d '{
    "tenant_id": "dev_tenant",
    "user_id": "dev_user",
    "kb_id": "default",
    "question": "test"
  }'
```

**Check the response:**
- If you get a proper JSON response → Backend is working
- If you get HTML error page → Check backend logs for the actual error

### Step 5: Check Database

```bash
cd rag-backend
python scripts/create_billing_tables.py
```

This ensures all required database tables exist.

## Common Solutions

### Solution 1: Missing GEMINI_API_KEY

**Symptoms:**
- Backend logs show: "API key not configured"
- Health check shows `"llm_configured": false`

**Fix:**
1. Get API key from https://aistudio.google.com/app/apikey
2. Add to `rag-backend/.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
3. Restart backend

### Solution 2: Database Tables Missing

**Symptoms:**
- Backend logs show: "no such table: tenants" or similar

**Fix:**
```bash
cd rag-backend
python scripts/create_billing_tables.py
```

### Solution 3: Dependencies Not Installed

**Symptoms:**
- Backend logs show: "ModuleNotFoundError"

**Fix:**
```bash
cd rag-backend
.\venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### Solution 4: Vector Store Not Initialized

**Symptoms:**
- Error about ChromaDB collection
- Works after uploading first document

**Fix:** Upload a document first via the Knowledge Base page, then try chat again.

## Step-by-Step Recovery

1. **Stop the backend** (Ctrl+C in the terminal)

2. **Check `.env` file:**
   ```bash
   cd rag-backend
   # Make sure .env exists and has GEMINI_API_KEY
   ```

3. **Initialize database:**
   ```bash
   python scripts/create_billing_tables.py
   ```

4. **Reinstall dependencies (if needed):**
   ```bash
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Start backend:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. **Check startup logs** for:
   - ✅ "CORS configured with origins: ..."
   - ✅ "Database initialized"
   - ✅ No error messages

7. **Test health:**
   ```bash
   curl http://localhost:8000/health/ready
   ```
   Should show: `"llm_configured": true`

8. **Try chat again** in the browser

## Getting API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `rag-backend/.env`:
   ```env
   GEMINI_API_KEY=paste_your_key_here
   ```

## Still Not Working?

1. **Check backend terminal logs** - they show the exact error
2. **Share the error message** from logs for specific help
3. **Try the test curl command** above to isolate the issue
4. **Check browser Network tab** - look at the actual error response

## Quick Checklist

- [ ] Backend is running (`uvicorn` process active)
- [ ] `.env` file exists in `rag-backend/` directory
- [ ] `GEMINI_API_KEY` is set in `.env`
- [ ] Backend restarted after adding API key
- [ ] Database initialized (`create_billing_tables.py` run)
- [ ] Health check shows `"llm_configured": true`
- [ ] Backend logs show no errors on startup
- [ ] Test curl command works

---

**Most Common Issue:** Missing `GEMINI_API_KEY` in `.env` file. Check backend logs to confirm!

