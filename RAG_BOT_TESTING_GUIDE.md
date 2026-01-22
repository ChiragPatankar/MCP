# RAG Bot Testing Guide

## 🚀 Quick Start Testing

### Prerequisites

1. **RAG Backend Running**
   ```bash
   cd rag-backend
   .\venv\Scripts\activate  # Windows
   # or: source venv/bin/activate  # Linux/Mac
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend Running**
   ```bash
   npm run dev
   # Should be on http://localhost:5173
   ```

3. **Environment Variables**
   - `VITE_RAG_API_URL=http://localhost:8000` in `.env.local`
   - `GEMINI_API_KEY` or `OPENAI_API_KEY` in `rag-backend/.env`

---

## 📋 Testing Methods

### Method 1: UI Testing (Recommended)

#### Step 1: Upload Documents to Knowledge Base

1. Navigate to: **RAG Knowledge Base** (`/rag/knowledge-base`)
2. Click **"Upload Document"**
3. Upload a test document (PDF, DOCX, TXT, or MD)
   - Example: Upload a document about your company policies, FAQ, or product documentation
4. Wait for processing (you'll see stats update)
5. Verify:
   - ✅ Document count increases
   - ✅ Chunks created
   - ✅ No error messages

#### Step 2: Test Retrieval (Optional - Test Search Without LLM)

1. Navigate to: **Retrieval Test** (`/rag/retrieval`)
2. Enter a search query related to your uploaded document
   - Example: If you uploaded a FAQ, search for "What is your refund policy?"
3. Click **Search**
4. Verify:
   - ✅ Results appear with similarity scores
   - ✅ Chunks show relevant content
   - ✅ File names and page numbers are displayed
   - ✅ Confidence score is shown

#### Step 3: Test Full RAG Chat

1. Navigate to: **Chat Test** (`/rag/chat`)
2. Check status indicator:
   - 🟢 **"RAG Online"** = Backend connected
   - 🔴 **"RAG Offline"** = Backend not running
3. Ask a question related to your uploaded documents:
   - Example: "What is your refund policy?"
   - Example: "Tell me about your services"
4. Verify:
   - ✅ AI responds with answer
   - ✅ Citations appear (click "Sources (n)")
   - ✅ Confidence badge shows (High/Medium/Low)
   - ✅ Answer is relevant to your documents

#### Step 4: Test Edge Cases

- **Question with no answer in KB**: Should refuse or say "I don't have that information"
- **Vague question**: Should ask for clarification or provide general answer
- **Multi-part question**: Should handle multiple questions
- **Long conversation**: Test conversation history persistence

---

### Method 2: API Testing (cURL)

#### Test Health Check
```bash
curl http://localhost:8000/health/live
# Expected: {"status":"healthy"}
```

#### Upload Document
```bash
curl -X POST http://localhost:8000/kb/upload \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user" \
  -F "file=@test_document.pdf" \
  -F "kb_id=default"
```

#### Get Knowledge Base Stats
```bash
curl "http://localhost:8000/kb/stats?kb_id=default" \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user"
```

#### Test Chat (Full RAG)
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user" \
  -d '{
    "kb_id": "default",
    "question": "What is your refund policy?",
    "conversation_id": "test_conv_123"
  }'
```

#### Test Retrieval Only (No LLM)
```bash
curl -X POST "http://localhost:8000/kb/search?query=refund%20policy&kb_id=default&top_k=5" \
  -H "X-Tenant-Id: dev_tenant" \
  -H "X-User-Id: dev_user"
```

---

### Method 3: Widget Testing (End-to-End)

1. **Set up Widget** (if configured)
2. **Create a chat session** via `/api/chat/public/sessions`
3. **Send messages** via `/api/chat/messages`
4. **Verify**:
   - ✅ Messages appear in chat history
   - ✅ RAG metadata (citations, confidence) stored
   - ✅ Citations display in widget UI
   - ✅ Refusal states handled correctly

---

## ✅ What to Verify

### 1. **Answer Quality**
- [ ] Answers are relevant to the question
- [ ] Answers cite sources from knowledge base
- [ ] Answers don't hallucinate (make up information)
- [ ] Answers are concise but complete

### 2. **Citations**
- [ ] Citations appear for each answer
- [ ] File names are correct
- [ ] Page numbers are accurate (if available)
- [ ] Text previews are shown (max 200 chars)

### 3. **Confidence Scoring**
- [ ] High confidence (≥0.45) for relevant answers
- [ ] Medium confidence (0.35-0.44) for partial matches
- [ ] Low confidence (<0.35) triggers appropriate handling
- [ ] Confidence badge displays correctly

### 4. **Refusal Handling**
- [ ] Questions outside KB scope are refused
- [ ] Refusal reason is clear
- [ ] CTA buttons appear (Contact Support, Create Ticket)
- [ ] User can escalate when needed

### 5. **Performance**
- [ ] Response time: 2-5 seconds typical
- [ ] No timeout errors
- [ ] Handles multiple concurrent requests
- [ ] Conversation history works correctly

### 6. **Error Handling**
- [ ] Backend offline → Shows "RAG Offline" status
- [ ] Network errors → User-friendly error message
- [ ] Quota exceeded → Shows 402 error with upgrade message
- [ ] Invalid KB ID → Clear error message

---

## 🧪 Test Scenarios

### Scenario 1: First-Time Setup
1. Start with empty knowledge base
2. Upload first document
3. Ask question about that document
4. **Expected**: Answer with citations from uploaded doc

### Scenario 2: Multiple Documents
1. Upload 3-5 different documents
2. Ask question that spans multiple docs
3. **Expected**: Answer cites multiple sources

### Scenario 3: Out-of-Scope Question
1. Ask question NOT in knowledge base
2. **Expected**: Refusal or "I don't have that information"

### Scenario 4: Conversation Flow
1. Ask follow-up questions
2. Reference previous answers
3. **Expected**: Context maintained, coherent conversation

### Scenario 5: Edge Cases
- Empty question → Error handling
- Very long question → Handled gracefully
- Special characters → Escaped properly
- Non-English text → Handled (if supported)

---

## 🔧 Troubleshooting

### RAG Backend Not Connecting
- ✅ Check `VITE_RAG_API_URL` in `.env.local`
- ✅ Verify backend is running on port 8000
- ✅ Check CORS settings in backend
- ✅ Check browser console for errors

### No Answers / Empty Responses
- ✅ Verify documents are uploaded
- ✅ Check KB stats show documents/chunks
- ✅ Verify LLM API key is set
- ✅ Check backend logs for errors

### Citations Not Showing
- ✅ Verify documents were processed successfully
- ✅ Check retrieval test returns results
- ✅ Verify frontend is parsing citations correctly

### Low Confidence Scores
- ✅ Upload more relevant documents
- ✅ Improve document quality/chunking
- ✅ Check if query matches document content
- ✅ Verify embeddings are working

---

## 📊 Monitoring

### Check Backend Logs
```bash
# In rag-backend terminal, watch for:
- "Retrieval results: X results, confidence=Y"
- "Formatted context length: X chars"
- "Generated answer successfully"
- Any error tracebacks
```

### Check Frontend Console
- Open browser DevTools (F12)
- Check Network tab for API calls
- Verify responses include `rag` metadata
- Check for any JavaScript errors

### Check Database (Optional)
```bash
# SQLite database: rag-backend/rag_data.db
# Check tables:
# - usage_events (tracks all chat requests)
# - usage_daily (daily aggregates)
# - usage_monthly (monthly aggregates)
```

---

## 🎯 Quick Test Checklist

- [ ] Backend health check passes
- [ ] Can upload document successfully
- [ ] KB stats show documents/chunks
- [ ] Retrieval test returns results
- [ ] Chat test answers questions
- [ ] Citations appear correctly
- [ ] Confidence badges display
- [ ] Refusal states work
- [ ] Mobile responsive
- [ ] No horizontal scrolling

---

## 💡 Pro Tips

1. **Start Small**: Upload 1-2 test documents first
2. **Use Real Data**: Test with actual company docs/FAQ
3. **Test Incrementally**: Upload → Retrieve → Chat
4. **Monitor Logs**: Watch backend terminal for errors
5. **Check Citations**: Always verify sources are correct
6. **Test Edge Cases**: Empty KB, invalid queries, etc.

---

## 🆘 Need Help?

- Check backend logs: `rag-backend` terminal
- Check frontend console: Browser DevTools
- Verify environment variables are set
- Ensure both servers are running
- Check network connectivity between frontend/backend

