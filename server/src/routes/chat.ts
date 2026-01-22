import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { database } from '../db/database';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { normalizeCitations, safeParseJson } from '../utils/rag';

const router = express.Router();

// Create a new chat session (authenticated - for tenant dashboard)
router.post('/sessions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { domain, userAgent } = req.body;
    const userIp = req.ip || req.connection.remoteAddress;

    // Verify tenant exists
    const tenant = await database.get('SELECT id FROM tenants WHERE id = ?', [tenantId]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Generate session token
    const sessionToken = uuidv4();

    // Create chat session
    const result = await database.run(
      'INSERT INTO chat_sessions (tenant_id, domain, user_ip, user_agent, session_token) VALUES (?, ?, ?, ?, ?)',
      [tenantId, domain, userIp, userAgent, sessionToken]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'chat_session_started', JSON.stringify({ sessionId: result.lastID, domain })]
    );

    res.status(201).json({
      sessionId: result.lastID,
      sessionToken,
      tenantId,
      message: 'Chat session created successfully'
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new chat session (public - for widget)
router.post('/public/sessions', async (req, res) => {
  try {
    const { tenantId, domain, userAgent } = req.body;
    const userIp = req.ip || req.connection.remoteAddress;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Verify tenant exists
    const tenant = await database.get('SELECT id FROM tenants WHERE id = ?', [tenantId]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Generate session token
    const sessionToken = uuidv4();

    // Create chat session
    const result = await database.run(
      'INSERT INTO chat_sessions (tenant_id, domain, user_ip, user_agent, session_token) VALUES (?, ?, ?, ?, ?)',
      [tenantId, domain, userIp, userAgent, sessionToken]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'chat_session_started', JSON.stringify({ sessionId: result.lastID, domain })]
    );

    res.status(201).json({
      sessionId: result.lastID,
      sessionToken,
      message: 'Chat session created successfully'
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message and get AI response
router.post('/messages', async (req, res) => {
  try {
    const { sessionToken, message, tenantId } = req.body;

    if (!sessionToken || !message) {
      return res.status(400).json({ error: 'Session token and message are required' });
    }

    // Get chat session
    const session = await database.get(
      'SELECT * FROM chat_sessions WHERE session_token = ?',
      [sessionToken]
    );

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // SECURITY: tenantId must come from sessionToken (never trust request body)
    const sessionTenantId = session.tenant_id;
    if (tenantId !== undefined && tenantId !== null && String(tenantId) !== String(sessionTenantId)) {
      return res.status(403).json({ error: 'Tenant mismatch for session' });
    }

    // Save user message
    await database.run(
      'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
      [session.id, 'user', message]
    );

    // Get chat history for context
    // Limit to last N messages to reduce context size
    const historyRows = await database.query(
      'SELECT sender, message, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?',
      [session.id, 20]
    );
    const chatHistory = [...historyRows].reverse();

    // Convert DB history into RAG history format
    const ragHistory = chatHistory
      .filter((m: any) => m && (m.sender === 'user' || m.sender === 'ai') && typeof m.message === 'string')
      .map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.message
      }));

    try {
      const start = Date.now();

      // Call RAG backend for AI response (Gemini+RAG)
      const ragBaseUrl = process.env.RAG_BACKEND_URL;
      if (!ragBaseUrl) {
        throw new Error('RAG_BACKEND_URL is not configured');
      }

      const incomingAuth = req.headers.authorization;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Auth forwarding priority:
      // 1) Forward Authorization from client (preferred for prod)
      // 2) Use service token (server-to-server)
      // 3) DEV fallback: X-Tenant-Id / X-User-Id
      if (incomingAuth && typeof incomingAuth === 'string') {
        headers['Authorization'] = incomingAuth;
      } else if (process.env.RAG_SERVICE_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.RAG_SERVICE_TOKEN}`;
      } else if (process.env.NODE_ENV !== 'production') {
        headers['X-Tenant-Id'] = String(sessionTenantId);
        headers['X-User-Id'] = `widget_${session.id}`;
      }

      const ragPayload = {
        kb_id: 'default',
        question: message,
        conversation_id: String(sessionToken),
        history: ragHistory
      };

      const ragResponse = await axios.post(`${ragBaseUrl}/chat`, ragPayload, {
        headers,
        timeout: 30000 // 30 second timeout
      });

      const latencyMs = Date.now() - start;

      const data = ragResponse.data || {};
      const aiResponse =
        data.answer ||
        data.response ||
        'I apologize, but I encountered an issue processing your request.';

      const confidence = typeof data.confidence === 'number' ? data.confidence : undefined;
      const refusalReason = data.refusal_reason || data.refusalReason;
      const refused =
        typeof data.refused === 'boolean'
          ? data.refused
          : Boolean(refusalReason);
      const rawCitations = Array.isArray(data.citations)
        ? data.citations
        : Array.isArray(data.sources)
          ? data.sources
          : [];
      const citations = normalizeCitations(rawCitations);
      const model = data.model || data.model_used || data.modelUsed;
      const provider = data.provider || 'gemini';

      const metadata = {
        source: 'rag-backend',
        model,
        confidence,
        refused,
        citations,
        kb_id: 'default',
        provider,
        latency_ms: latencyMs
      };

      // Save AI response
      await database.run(
        'INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)',
        [session.id, 'ai', aiResponse, JSON.stringify(metadata)]
      );

      // Log analytics event
      await database.run(
        'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
        [sessionTenantId, 'message_sent', JSON.stringify({ 
          sessionId: session.id, 
          messageLength: message.length,
          responseLength: aiResponse.length
        })]
      );

      // Log RAG-specific analytics event
      await database.run(
        'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
        [sessionTenantId, 'rag_answer_generated', JSON.stringify({
          sessionId: session.id,
          refused,
          confidence,
          citations_count: Array.isArray(citations) ? citations.length : 0,
          latency_ms: latencyMs
        })]
      );

      res.json({
        response: aiResponse,
        messageId: session.id,
        timestamp: new Date().toISOString(),
        rag: {
          confidence,
          refused,
          refusal_reason: refusalReason,
          citations,
          provider,
          model
        }
      });

    } catch (ragError) {
      console.error('RAG backend error:', ragError);
      
      // Fallback response if RAG backend is down/unavailable
      const fallbackResponse = "I'm sorry, but I'm experiencing technical difficulties at the moment. Please try again in a few minutes or contact support if the issue persists.";
      
      await database.run(
        'INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)',
        [session.id, 'ai', fallbackResponse, JSON.stringify({ source: 'rag-backend', error: 'rag_backend_unavailable', kb_id: 'default' })]
      );

      res.json({
        response: fallbackResponse,
        messageId: session.id,
        timestamp: new Date().toISOString(),
        error: 'Service temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat history
router.get('/sessions/:sessionToken/history', async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Get session
    const session = await database.get(
      'SELECT * FROM chat_sessions WHERE session_token = ? AND tenant_id = ?',
      [sessionToken, tenantId]
    );

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Get messages
    const messages = await database.query(
      'SELECT sender, message, metadata, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC',
      [session.id]
    );

    const normalizedMessages = messages.map((m: any) => {
      const parsedMetadata = safeParseJson<any>(m.metadata);
      let citations = parsedMetadata?.citations;

      if (citations) {
        citations = normalizeCitations(citations);
      }

      const citationsCount = Array.isArray(citations) ? citations.length : undefined;

      return {
        ...m,
        metadata: parsedMetadata
          ? {
              ...parsedMetadata,
              citations
            }
          : null,
        citations_count: citationsCount
      };
    });

    res.json({
      sessionId: session.id,
      messages: normalizedMessages,
      session: {
        started_at: session.started_at,
        resolved: session.resolved,
        rating: session.rating
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rate conversation
router.post('/sessions/:sessionToken/rate', async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const { rating, feedback, tenantId } = req.body;

    if (!tenantId || rating === undefined) {
      return res.status(400).json({ error: 'Tenant ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Update session
    await database.run(
      'UPDATE chat_sessions SET rating = ?, feedback = ?, resolved = TRUE WHERE session_token = ? AND tenant_id = ?',
      [rating, feedback, sessionToken, tenantId]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'conversation_rated', JSON.stringify({ 
        sessionToken, 
        rating, 
        hasFeedback: !!feedback 
      })]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// End chat session
router.post('/sessions/:sessionToken/end', async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const { tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Update session
    await database.run(
      'UPDATE chat_sessions SET ended_at = CURRENT_TIMESTAMP WHERE session_token = ? AND tenant_id = ?',
      [sessionToken, tenantId]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'chat_session_ended', JSON.stringify({ sessionToken })]
    );

    res.json({ message: 'Chat session ended successfully' });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 