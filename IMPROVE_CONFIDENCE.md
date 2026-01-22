# How to Increase RAG Confidence Scores

## Understanding Confidence

Confidence is calculated as the **average similarity score** of retrieved document chunks:
- **High confidence (≥0.7)**: Excellent match, highly relevant content
- **Medium confidence (0.5-0.69)**: Good match, relevant content  
- **Low confidence (<0.5)**: Weak match, may need better documents or queries

Your current confidence: **0.306 (30.6%)** - This is low and indicates the retrieved chunks don't match your query very well.

---

## Quick Fixes (Immediate Impact)

### 1. **Improve Query Specificity**

**Instead of:** "what is client sphere"  
**Try:** "What is ClientSphere and what does it do?"

**Tips:**
- Use complete questions, not fragments
- Include key terms from your documents
- Be specific about what you're asking

### 2. **Upload More Relevant Documents**

Your knowledge base might not have enough content matching your queries.

**Action:**
- Upload documents that directly answer common questions
- Ensure documents contain the exact terms users will search for
- Add FAQ-style documents with Q&A format

### 3. **Improve Document Structure**

**Good document structure:**
```
# What is ClientSphere?

ClientSphere is an AI-powered customer support platform...

## Key Features
- Feature 1: Description
- Feature 2: Description
```

**Bad document structure:**
```
client sphere platform support ai chatbot
```

**Tips:**
- Use clear headings and sections
- Write in complete sentences
- Include relevant keywords naturally

---

## Configuration Changes (Backend)

### Option 1: Increase TOP_K (Retrieve More Chunks)

**File:** `rag-backend/app/config.py`

```python
TOP_K: int = 10  # Increase from 6 to 10
```

**Effect:** Retrieves more chunks, potentially finding better matches

**Trade-off:** May include less relevant results, but increases chance of finding good matches

### Option 2: Lower Similarity Threshold (Include More Results)

**File:** `rag-backend/app/config.py`

```python
SIMILARITY_THRESHOLD: float = 0.15  # Lower from 0.20 to 0.15
```

**Effect:** Includes chunks with lower similarity scores in confidence calculation

**Trade-off:** May include less relevant content

### Option 3: Use Weighted Confidence (Weight Top Results More)

**File:** `rag-backend/app/rag/retrieval.py` (line 96-98)

**Current:**
```python
scores = [r.similarity_score for r in results]
avg_confidence = sum(scores) / len(scores) if scores else 0.0
```

**Improved (weighted):**
```python
scores = [r.similarity_score for r in results]
if scores:
    # Weight top results more heavily
    weights = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5][:len(scores)]
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    total_weight = sum(weights[:len(scores)])
    avg_confidence = weighted_sum / total_weight
else:
    avg_confidence = 0.0
```

**Effect:** Top results contribute more to confidence score

---

## Long-Term Improvements

### 1. **Better Embedding Model**

**Current:** `all-MiniLM-L6-v2` (384 dimensions)

**Better options:**
- `sentence-transformers/all-mpnet-base-v2` (768 dimensions, better quality)
- `BAAI/bge-large-en-v1.5` (1024 dimensions, state-of-the-art)

**To change:** Update `EMBEDDING_MODEL` in `rag-backend/app/config.py`

**Note:** Requires re-indexing all documents after changing models

### 2. **Document Preprocessing**

**Improve document quality:**
- Remove irrelevant content
- Add metadata (tags, categories)
- Structure content with clear sections
- Use consistent terminology

### 3. **Query Expansion**

**Enhance queries before retrieval:**
- Add synonyms
- Include related terms
- Expand abbreviations

### 4. **Hybrid Search**

**Combine semantic + keyword search:**
- Semantic search (current): Finds conceptually similar content
- Keyword search: Finds exact term matches
- Hybrid: Best of both worlds

---

## Testing Your Changes

### 1. Test Retrieval Directly

Use the Retrieval Test page (`/rag/retrieval`) to see:
- Which chunks are retrieved
- Their individual similarity scores
- Why confidence is low

### 2. Check Individual Scores

If top result has 0.46 similarity but confidence is 0.30:
- Lower-scoring results are dragging down the average
- Consider using weighted confidence (see Option 3 above)

### 3. Monitor Patterns

- Which queries get low confidence?
- Which documents are retrieved?
- Are the right documents being found?

---

## Recommended Quick Wins

### Priority 1: Improve Documents
1. ✅ Upload more relevant documents
2. ✅ Structure documents better
3. ✅ Use clear, descriptive language

### Priority 2: Better Queries
1. ✅ Use complete, specific questions
2. ✅ Include key terms from your documents
3. ✅ Test different phrasings

### Priority 3: Configuration Tuning
1. ✅ Increase TOP_K to 8-10
2. ✅ Use weighted confidence calculation
3. ✅ Consider better embedding model (requires re-indexing)

---

## Example: Improving "What is ClientSphere?"

**Current query:** "what is client sphere"  
**Confidence:** 0.306 (Low)

**Better query:** "What is ClientSphere and what are its main features?"  
**Expected confidence:** 0.5+ (Medium/High)

**Why it's better:**
- Complete sentence
- Includes key term "ClientSphere" (matches document)
- Asks about "features" (matches document structure)

---

## Advanced: Custom Confidence Calculation

If you want more control, you can modify the confidence calculation in `rag-backend/app/rag/retrieval.py`:

```python
# Option A: Use only top 3 results
scores = [r.similarity_score for r in results[:3]]
avg_confidence = sum(scores) / len(scores) if scores else 0.0

# Option B: Use median instead of mean
scores = sorted([r.similarity_score for r in results])
avg_confidence = scores[len(scores) // 2] if scores else 0.0

# Option C: Weighted (top results count more)
weights = [1.0, 0.8, 0.6, 0.4, 0.2][:len(results)]
weighted_sum = sum(r.similarity_score * w for r, w in zip(results, weights))
total_weight = sum(weights[:len(results)])
avg_confidence = weighted_sum / total_weight if total_weight > 0 else 0.0
```

---

## Summary

**Quick fixes:**
1. Use more specific queries
2. Upload better-structured documents
3. Increase TOP_K to 8-10

**Medium-term:**
1. Use weighted confidence calculation
2. Improve document quality and structure
3. Add more relevant content

**Long-term:**
1. Upgrade embedding model
2. Implement hybrid search
3. Add query expansion

**Most important:** Better documents + Better queries = Higher confidence! 🎯

