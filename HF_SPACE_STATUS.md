# 🔍 Hugging Face Space Status

## Space Information

- **Space URL**: https://huggingface.co/spaces/ChiragPatankar/RAG_backend
- **API URL**: https://ChiragPatankar-RAG_backend.hf.space
- **Status**: Running (as of last check)

## Endpoints

### Health Check
- **Root**: `GET /` - Basic health info
- **Health**: `GET /health` - Detailed health check
- **Live**: `GET /health/live` - Liveness probe
- **Ready**: `GET /health/ready` - Readiness probe

### API Endpoints
- `GET /kb/stats` - Knowledge base statistics
- `POST /kb/upload` - Upload documents
- `POST /chat` - Chat with RAG
- `GET /kb/search` - Search knowledge base

## Troubleshooting

### If endpoints return 404:

1. **Check Space Status**
   - Go to: https://huggingface.co/spaces/ChiragPatankar/RAG_backend
   - Check if it shows "Running" or "Building"
   - If "Building", wait for it to complete

2. **Wake Up the Space**
   - Hugging Face Spaces sleep after inactivity
   - Make a request to wake it up
   - First request may take 30-60 seconds

3. **Check Logs**
   - Go to Space → Logs tab
   - Look for errors or warnings
   - Check if the app started successfully

4. **Verify Environment Variables**
   - Go to Space → Settings → Variables
   - Ensure required variables are set:
     - `GEMINI_API_KEY`
     - `ENV=prod`
     - `LLM_PROVIDER=gemini`
     - `ALLOWED_ORIGINS` (with your frontend URL)

5. **Check app.py**
   - Ensure `app.py` exists in root of `rag-backend/`
   - Verify it imports and runs the FastAPI app correctly

## Testing the Space

```bash
# Test root endpoint
curl https://ChiragPatankar-RAG_backend.hf.space/

# Test health endpoint
curl https://ChiragPatankar-RAG_backend.hf.space/health

# Test with authentication (if required)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://ChiragPatankar-RAG_backend.hf.space/health
```

## Next Steps

1. ✅ Verify Space is running
2. ✅ Test health endpoints
3. ✅ Update frontend `VITE_RAG_API_URL` in Cloudflare Pages
4. ✅ Test end-to-end from frontend

