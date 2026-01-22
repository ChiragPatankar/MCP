# 🚀 RAG Backend Setup & Testing Guide

## ✅ Current Status

**Server is running!** ✅
- Health check: ✅ Working
- Document upload: ✅ Working  
- Vector store: ✅ Working (ChromaDB)
- Retrieval: ✅ Working (0.467 confidence on test query)
- LLM generation: ⚠️ Needs API key

## 📝 Step 1: Add Your Gemini API Key

1. **Get your API key** (if you don't have one):
   - Go to: https://aistudio.google.com/app/apikey
   - Create a new API key (it's FREE)

2. **Add to `.env` file**:
   ```powershell
   # Open .env file in rag-backend folder
   notepad .env
   ```

3. **Set the key**:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   LLM_PROVIDER=gemini
   ```

4. **Restart the server** (if it's running):
   - Stop current server (Ctrl+C)
   - Start again: `.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000`

## 🧪 Step 2: Test with Your Real Documents

### Option A: Using Swagger UI (Easiest)

1. Open: **http://localhost:8000/docs**
2. Find `POST /kb/upload`
3. Click "Try it out"
4. Upload your PDF/DOCX file
5. Set:
   - `user_id`: your user ID
   - `kb_id`: your KB ID
6. Click "Execute"
7. Wait 5-10 seconds for processing

### Option B: Using curl

```powershell
curl -X POST http://localhost:8000/kb/upload `
  -F "file=@your_document.pdf" `
  -F "user_id=user123" `
  -F "kb_id=kb001"
```

## 🔍 Step 3: Check Retrieval Quality

**BEFORE testing chat**, verify retrieval works:

```powershell
# Test search endpoint
curl -X POST "http://localhost:8000/kb/search?query=your%20question&kb_id=kb001&user_id=user123&top_k=5"
```

**What to look for:**
- ✅ Similarity scores > 0.35 (good)
- ✅ Relevant chunks returned
- ✅ Correct file names in metadata

**If scores are low (< 0.3):**
- Try rephrasing your question
- Check if document was fully processed
- Verify chunks were created (check `/kb/stats`)

## 💬 Step 4: Test Full Chat

Once retrieval looks good, test chat:

```powershell
curl -X POST http://localhost:8000/chat `
  -H "Content-Type: application/json" `
  -d '{\"user_id\":\"user123\",\"kb_id\":\"kb001\",\"question\":\"Your question here\"}'
```

**Expected response:**
- ✅ Answer based on your documents
- ✅ Citations with file names
- ✅ Confidence score > 0.35
- ✅ `from_knowledge_base: true`

## 🐛 Troubleshooting

### Issue: "LLM not configured"
**Fix:** Add `GEMINI_API_KEY` to `.env` file

### Issue: Low similarity scores
**Fix:** 
- Adjust threshold: Set `SIMILARITY_THRESHOLD=0.25` in `.env` (lower = more lenient)
- Re-upload document with better formatting
- Try different query phrasing

### Issue: "No chunks found"
**Fix:**
- Wait 10-15 seconds after upload
- Check `/kb/stats` to verify chunks exist
- Check server logs for parsing errors

### Issue: Hallucination (wrong answers)
**Fix:**
- Increase `SIMILARITY_THRESHOLD=0.45` (stricter)
- Check retrieval quality first (Step 3)
- Verify citations are present

## 📊 Quick Test Script

Run the automated test:
```powershell
.\venv\Scripts\python.exe test_rag.py
```

## 🎯 Next Steps

1. ✅ Add Gemini API key
2. ✅ Upload your real KB documents
3. ✅ Test retrieval quality
4. ✅ Test chat with real questions
5. ✅ Adjust thresholds based on results

## 📞 Need Help?

Check the logs in the terminal where the server is running for detailed error messages.



