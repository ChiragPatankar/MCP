# 🔍 RAG Pages Debug Guide

## Issue: Blank Screens on RAG Pages

If you're seeing blank screens on `/rag/chat`, `/rag/knowledge-base`, `/rag/retrieval`, or `/rag/billing`, follow these steps:

### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for any red error messages
4. Common errors:
   - `Authentication required` → You're not logged in
   - `Failed to fetch` → RAG backend is not running
   - `Cannot read property 'X' of undefined` → Component error

### Step 2: Verify Authentication

1. Check if you're logged in:
   - Look for `auth-token` in `localStorage` (F12 → Application → Local Storage)
   - If missing, go to `/login` and sign in

2. Test authentication:
   ```javascript
   // In browser console:
   localStorage.getItem('auth-token')
   // Should return a JWT token string
   ```

### Step 3: Check RAG Backend

1. **Is the backend running?**
   ```bash
   # In rag-backend directory
   cd rag-backend
   .\venv\Scripts\activate
   uvicorn app.main:app --reload --port 8000
   ```

2. **Test backend health:**
   - Open: http://localhost:8000/health/live
   - Should return: `{"status":"alive"}`

3. **Check environment variables:**
   - Make sure `.env` file exists in `rag-backend/`
   - Contains: `GEMINI_API_KEY=your_key`

### Step 4: Check Frontend Environment

1. **Verify `.env.local` or `.env` file:**
   ```env
   VITE_RAG_API_URL=http://localhost:8000
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Step 5: Test Routes Directly

Try accessing these URLs directly:
- http://localhost:5173/rag/knowledge-base
- http://localhost:5173/rag/chat
- http://localhost:5173/rag/retrieval
- http://localhost:5173/rag/billing

### Step 6: Common Fixes

#### Fix 1: Missing Button Import
If you see "Button is not defined":
- Already fixed in `RAGChatInterface.tsx`

#### Fix 2: Authentication Error
If API calls fail with 401:
- Log out and log back in
- Check JWT token is valid

#### Fix 3: CORS Error
If you see CORS errors:
- Make sure backend has CORS configured
- Check `rag-backend/app/main.py` has CORS middleware

#### Fix 4: Network Error
If you see "Failed to fetch":
- Backend is not running
- Wrong `VITE_RAG_API_URL`
- Firewall blocking localhost:8000

### Step 7: Quick Test

Run this in browser console on a RAG page:
```javascript
// Test if component rendered
document.querySelector('h1')?.textContent

// Test API connection
fetch('http://localhost:8000/health/live')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Test authentication
const token = localStorage.getItem('auth-token')
console.log('Token:', token ? 'Present' : 'Missing')
```

### Step 8: Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the page
3. Look for failed requests (red)
4. Check:
   - `/health/live` → Should be 200
   - `/kb/stats` → Should be 200 or 404 (not 401)
   - Any 401 errors → Authentication issue

## Still Blank?

1. **Hard refresh**: Ctrl+Shift+R (or Ctrl+F5)
2. **Clear cache**: DevTools → Application → Clear Storage
3. **Check React DevTools**: Install React DevTools extension and check component tree
4. **Check terminal**: Look for build errors in the terminal running `npm run dev`

## Expected Behavior

- **Knowledge Base Page**: Should show upload button and stats (even if empty)
- **Chat Page**: Should show chat interface with welcome message
- **Retrieval Page**: Should show search input and results area
- **Billing Page**: Should show usage stats (even if 0)

If pages are completely blank (no header, no sidebar), it's likely:
- Route not matching
- Component crashing before render
- Authentication redirect loop

