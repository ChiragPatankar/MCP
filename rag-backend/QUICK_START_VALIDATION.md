# Quick Start: RAG Pipeline Validation

## 🚀 Quick Test (5 minutes)

### 1. Start Server
```bash
cd rag-backend
.\venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --port 8000
```

### 2. Run Tests (in another terminal)
```bash
cd rag-backend
.\venv\Scripts\activate  # Windows
python scripts/validate_rag.py
```

### 3. Expected Result
```
✅ ALL TESTS PASSED - RAG Pipeline is working correctly
```

---

## 📋 What Gets Tested

1. ✅ Document upload for both tenants
2. ✅ Retrieval accuracy (correct answers)
3. ✅ Tenant isolation (no cross-tenant leaks)
4. ✅ Hallucination refusal (out-of-scope queries)
5. ✅ Citation integrity (all answers cited)

---

## 🔧 Troubleshooting

### Server Not Starting?
- Check if port 8000 is available
- Verify virtual environment is activated
- Check `GEMINI_API_KEY` is set in `.env`

### Tests Failing?
- Ensure server is running on `http://localhost:8000`
- Check server logs for errors
- Verify test documents exist in `data/test_docs/`

### Import Errors?
- Run: `pip install -r requirements.txt`
- Ensure you're in the `rag-backend` directory

---

## 📊 Full Report

See `VALIDATION_REPORT.md` for detailed results and `FINAL_VALIDATION_SUMMARY.md` for executive summary.



