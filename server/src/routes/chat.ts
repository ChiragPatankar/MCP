import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { database } from '../db/database';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';

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

    if (!sessionToken || !message || !tenantId) {
      return res.status(400).json({ error: 'Session token, message, and tenant ID are required' });
    }

    // Get chat session
    const session = await database.get(
      'SELECT * FROM chat_sessions WHERE session_token = ? AND tenant_id = ?',
      [sessionToken, tenantId]
    );

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Save user message
    await database.run(
      'INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)',
      [session.id, 'user', message]
    );

    // Get chat history for context
    const chatHistory = await database.query(
      'SELECT sender, message, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC',
      [session.id]
    );

    // Get tenant's knowledge base
    const knowledgeBase = await database.query(
      'SELECT name, type, source FROM knowledge_base WHERE tenant_id = ? AND status = "active"',
      [tenantId]
    );

    try {
      // Call MCP server for AI response
      const mcpResponse = await axios.post(`${process.env.MCP_SERVER_URL}/chat`, {
        message,
        history: chatHistory,
        knowledge_base: knowledgeBase,
        tenant_id: tenantId
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MCP_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      const aiResponse = mcpResponse.data.response || 'I apologize, but I encountered an issue processing your request.';

      // Save AI response
      await database.run(
        'INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)',
        [session.id, 'ai', aiResponse, JSON.stringify({ 
          model: mcpResponse.data.model || 'gemini-1.5-flash',
          confidence: mcpResponse.data.confidence || 0.8
        })]
      );

      // Log analytics event
      await database.run(
        'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
        [tenantId, 'message_sent', JSON.stringify({ 
          sessionId: session.id, 
          messageLength: message.length,
          responseLength: aiResponse.length
        })]
      );

      res.json({
        response: aiResponse,
        messageId: session.id,
        timestamp: new Date().toISOString()
      });

    } catch (mcpError) {
      console.error('MCP Server error:', mcpError);
      
      // Fallback response if MCP server is down
      const fallbackResponse = "I'm sorry, but I'm experiencing technical difficulties at the moment. Please try again in a few minutes or contact support if the issue persists.";
      
      await database.run(
        'INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)',
        [session.id, 'ai', fallbackResponse, JSON.stringify({ error: 'mcp_server_unavailable' })]
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

    res.json({
      sessionId: session.id,
      messages,
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