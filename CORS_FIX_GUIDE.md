# CORS Error Fix Guide

## Problem
You're seeing this error in the browser console:
```
Access to XMLHttpRequest at 'http://localhost:8000/chat' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Quick Diagnosis

### Step 1: Check if Backend is Running

Open a new terminal and run:
```bash
curl http://localhost:8000/health/live
```

**Expected Response:**
```json
{"status": "alive"}
```

**If it fails:**
- Backend is not running → Go to Step 2
- Connection refused → Backend is not running → Go to Step 2
- Timeout → Backend might be on a different port → Check Step 3

### Step 2: Start the RAG Backend

```bash
cd rag-backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

# Start the server
uvicorn app.main:app --reload --port 8000
```

**Look for this in the startup logs:**
```
INFO:     CORS configured with origins: ['*']  # or specific origins
INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Verify CORS Configuration

Check your `rag-backend/.env` file (create it if it doesn't exist):

```env
# For development (allows all origins)
ALLOWED_ORIGINS=*

# OR for specific origins (recommended)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Important:** After changing `.env`, **restart the backend server**.

### Step 4: Test CORS Manually

Open browser console and run:
```javascript
fetch('http://localhost:8000/health/live')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**If this works:** CORS is configured correctly, the issue might be with the chat endpoint specifically.

**If this fails:** CORS is not working → Check Step 5

### Step 5: Verify CORS Middleware Order

The CORS middleware should be added **before** other middleware. Check `rag-backend/app/main.py`:

```python
# CORS should be added early, before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Tenant-Id", "X-User-Id"],
)
```

### Step 6: Check Browser Network Tab

1. Open browser DevTools → Network tab
2. Try sending a chat message
3. Look for the request to `http://localhost:8000/chat`
4. Check:
   - **Status Code**: Should be 200 (not CORS error)
   - **Response Headers**: Should include `Access-Control-Allow-Origin`
   - **Request Method**: Should show OPTIONS (preflight) then POST

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptom:** `curl http://localhost:8000/health/live` fails

**Solution:**
```bash
cd rag-backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Issue 2: Wrong Port
**Symptom:** Backend running on different port

**Solution:** 
- Check backend logs for the port number
- Update `VITE_RAG_API_URL` in frontend `.env.local`:
  ```env
  VITE_RAG_API_URL=http://localhost:8000  # Change port if needed
  ```

### Issue 3: CORS Not Configured
**Symptom:** No CORS headers in response

**Solution:**
1. Check `rag-backend/.env` has `ALLOWED_ORIGINS`
2. Restart backend after changing `.env`
3. Verify CORS middleware is added in `app/main.py`

### Issue 4: Preflight (OPTIONS) Request Failing
**Symptom:** OPTIONS request returns 405 or fails

**Solution:**
- Ensure `OPTIONS` is in `allow_methods`:
  ```python
  allow_methods=["GET", "POST", "DELETE", "OPTIONS"]
  ```

### Issue 5: JWT Token Format Warning
**Symptom:** Console shows "Token is not a standard JWT format"

**Note:** This is just a warning, not an error. The app falls back to localStorage user data. This is fine for development.

## Verification Checklist

- [ ] Backend is running (`curl http://localhost:8000/health/live` works)
- [ ] CORS logs show origins configured
- [ ] `.env` file has `ALLOWED_ORIGINS` set
- [ ] Backend restarted after `.env` changes
- [ ] Frontend `.env.local` has correct `VITE_RAG_API_URL`
- [ ] Browser Network tab shows CORS headers in response
- [ ] OPTIONS preflight request succeeds (200 status)

## Still Not Working?

1. **Check backend logs** for errors
2. **Check browser console** for specific error messages
3. **Try a different browser** to rule out browser-specific issues
4. **Verify firewall** isn't blocking port 8000
5. **Check if another service** is using port 8000

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:8000/health/live

# Test CORS (should return CORS headers)
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8000/chat \
     -v

# Test chat endpoint (with auth headers for dev)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user" \
  -d '{"kb_id":"default","question":"test","tenant_id":"dev_tenant","user_id":"dev_user"}'
```

---

**Need more help?** Check the main `RAG_BOT_TESTING_GUIDE.md` for setup instructions.

