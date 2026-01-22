# RAG Testing Guide

This guide helps you test the Retrieval Test and Chat Test pages effectively.

## 📋 Prerequisites

1. **RAG Backend Running**: Make sure the FastAPI RAG backend is running on `http://localhost:8000`
2. **Knowledge Base Setup**: Upload at least one document to your knowledge base
3. **Authentication**: You must be logged in to use these features

## 🔍 Retrieval Test Page

**Location**: `/rag/retrieval`

### What It Does
- Tests document retrieval **without** generating AI answers
- Shows which chunks from your knowledge base match your query
- Displays similarity scores (0.0 to 1.0)
- Perfect for debugging and understanding how your documents are indexed

### How to Use

1. **Enter a Query**
   - Type a question or search term in the search box
   - Click "Search" or press Enter
   - Use the example queries for quick testing

2. **Review Results**
   - **Confidence Score**: Overall match quality
     - 🟢 Green (≥70%): Excellent match
     - 🟡 Yellow (50-69%): Good match
     - 🔴 Red (<50%): Weak match
   - **Similarity Score**: Individual chunk relevance
   - **File Name & Page**: Source document information
   - **Chunk Content**: Preview of matching text

3. **Expand Chunks**
   - Click "Show More" to see full chunk content
   - Click "Show Less" to collapse

### Example Queries to Try

Based on the sample documents (`company_faq.md`, `product_features.txt`, `refund_policy.md`):

- "What are your pricing plans?"
- "How do I reset my password?"
- "What file types can I upload?"
- "What is your refund policy?"
- "How do I integrate ClientSphere?"
- "What languages do you support?"
- "What are your support hours?"
- "How secure is my data?"

### Tips

✅ **Do:**
- Upload documents first before testing
- Use specific queries related to your uploaded content
- Check similarity scores to understand match quality
- Use this to verify documents are indexed correctly

❌ **Don't:**
- Expect AI-generated answers (this is retrieval only)
- Use queries unrelated to your documents
- Ignore low similarity scores (may indicate indexing issues)

---

## 💬 Chat Test Page

**Location**: `/rag/chat`

### What It Does
- Full RAG pipeline: Retrieval + LLM generation
- Real-time chat interface with your AI assistant
- Shows citations, confidence scores, and refusal states
- Experience how your customers will interact

### How to Use

1. **Check Status**
   - Look for the "RAG Online" badge in the header
   - Green = Connected and ready
   - Red = Backend offline (check your RAG server)

2. **Start Chatting**
   - Type your question in the chat input
   - Press Enter or click Send
   - Wait for AI response (typically 2-5 seconds)

3. **Review Response**
   - **Answer**: AI-generated response
   - **Confidence Badge**: High/Medium/Low confidence indicator
   - **Sources**: Click "Sources (n)" to see citations
   - **Refusal State**: If query is out of scope, you'll see refusal UI

4. **Use Quick Questions**
   - Click any question in the sidebar to copy it
   - Paste it into the chat input
   - Great for quick testing

### Features to Test

#### ✅ Citations
- Every AI response should include source citations
- Click "Sources (n)" to expand
- See file names, page numbers, and text previews

#### ✅ Confidence Levels
- **High** (≥0.45): AI is confident in the answer
- **Medium** (0.35-0.44): Moderate confidence
- **Low** (<0.35): Low confidence, may be less accurate

#### ✅ Refusal Handling
- If query is outside knowledge base scope
- AI will refuse with explanation
- Shows "Contact Support" and "Create Ticket" buttons

#### ✅ Conversation Context
- Chat maintains conversation history
- Follow-up questions work naturally
- Context is preserved across messages

### Example Conversation Flow

```
You: What are your pricing plans?
AI: [Answer with citations]

You: What about the Growth plan?
AI: [Follow-up answer using conversation context]

You: How do I upgrade?
AI: [Answer with citations]
```

### Troubleshooting

**Problem**: "RAG Offline" status
- **Solution**: Check if RAG backend is running on port 8000
- Run: `cd rag-backend && uvicorn app.main:app --reload --port 8000`

**Problem**: No citations in responses
- **Solution**: Make sure documents are uploaded and processed
- Check Knowledge Base stats to verify documents exist

**Problem**: Low confidence scores
- **Solution**: 
  - Upload more relevant documents
  - Use more specific queries
  - Check if documents are properly indexed

**Problem**: "Quota exceeded" error
- **Solution**: Check your billing plan limits
- Upgrade plan or wait for next billing cycle

---

## 🚀 Quick Start Checklist

- [ ] RAG backend is running (`http://localhost:8000`)
- [ ] Frontend is running (`http://localhost:5173`)
- [ ] Logged in to the tenant dashboard
- [ ] Uploaded at least one document to Knowledge Base
- [ ] Tested retrieval with example queries
- [ ] Tested chat with sample questions
- [ ] Verified citations are showing
- [ ] Checked confidence badges
- [ ] Tested refusal handling with out-of-scope queries

---

## 📊 Understanding Scores

### Similarity Score (Retrieval Test)
- **0.9-1.0**: Perfect match, highly relevant
- **0.7-0.9**: Very good match
- **0.5-0.7**: Good match, relevant
- **0.3-0.5**: Moderate match, may be relevant
- **<0.3**: Weak match, likely not relevant

### Confidence Score (Chat Test)
- **≥0.45**: High confidence - answer is likely accurate
- **0.35-0.44**: Medium confidence - answer is probably correct
- **<0.35**: Low confidence - answer may be less reliable

---

## 🎯 Best Practices

1. **Start with Retrieval Test**
   - Verify documents are indexed correctly
   - Understand what content matches your queries
   - Debug any indexing issues

2. **Then Test Chat**
   - Use the same queries from retrieval test
   - Compare AI answers with retrieved chunks
   - Verify citations match retrieval results

3. **Test Edge Cases**
   - Out-of-scope questions (should refuse)
   - Ambiguous queries
   - Multi-part questions
   - Follow-up questions

4. **Monitor Performance**
   - Check response times
   - Review confidence scores
   - Verify citation accuracy

---

## 🔗 Related Pages

- **Knowledge Base** (`/rag/knowledge-base`): Upload and manage documents
- **Billing & Usage** (`/rag/billing`): Check quota and usage stats
- **Chat History** (`/chat-history`): View past conversations

---

## 💡 Pro Tips

1. **Use Retrieval Test First**: Always test retrieval before chat to ensure documents are indexed
2. **Check Similarity Scores**: Low scores indicate you may need better documents or queries
3. **Review Citations**: Make sure citations are accurate and relevant
4. **Test Refusal**: Try asking questions outside your knowledge base to test refusal handling
5. **Monitor Quotas**: Keep an eye on your usage to avoid hitting limits

---

**Need Help?** Check the main `RAG_BOT_TESTING_GUIDE.md` for more detailed information.

