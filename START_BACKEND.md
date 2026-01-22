# How to Start the RAG Backend

## Quick Start

1. **Open a NEW terminal window** (keep it open)

2. **Navigate to the backend directory:**
   ```bash
   cd rag-backend
   ```

3. **Activate the virtual environment:**
   ```bash
   .\venv\Scripts\activate
   ```
   You should see `(venv)` in your prompt.

4. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

5. **Wait for these messages:**
   ```
   INFO:     CORS configured with origins: ['http://localhost:5173', 'http://localhost:3000']
   INFO:     Database initialized
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   ```

6. **Keep this terminal window open** - don't close it!

7. **Now try the chat in your browser** - it should work!

## Verify It's Running

Open another terminal and run:
```bash
curl http://localhost:8000/health/live
```

You should see:
```json
{"status": "alive"}
```

## Troubleshooting

### "Port 8000 already in use"
- Another process is using port 8000
- Find and stop it, or use a different port:
  ```bash
  uvicorn app.main:app --reload --port 8001
  ```
- Then update frontend `.env.local`:
  ```
  VITE_RAG_API_URL=http://localhost:8001
  ```

### "Module not found" errors
- Activate venv first: `.\venv\Scripts\activate`
- Install dependencies: `pip install -r requirements.txt`

### Backend starts but chat still doesn't work
- Check backend terminal for error messages
- Look for: `=== CHAT REQUEST RECEIVED ===` when you send a message
- If you don't see this, the request isn't reaching the backend

---

**Important:** The backend must be running for the chat to work. Keep the terminal window open!

