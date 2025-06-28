import express from 'express';
import { database } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    
    // Get total conversations
    const totalConversations = await database.get(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?',
      [tenantId]
    );

    // Get conversations this month
    const thisMonthConversations = await database.get(
      `SELECT COUNT(*) as count FROM chat_sessions 
       WHERE tenant_id = ? AND started_at >= date('now', 'start of month')`,
      [tenantId]
    );

    // Get average rating
    const avgRating = await database.get(
      'SELECT AVG(rating) as avg FROM chat_sessions WHERE tenant_id = ? AND rating IS NOT NULL',
      [tenantId]
    );

    // Get resolution rate
    const resolutionRate = await database.get(
      `SELECT 
         COUNT(CASE WHEN resolved = 1 THEN 1 END) * 100.0 / COUNT(*) as rate
       FROM chat_sessions WHERE tenant_id = ?`,
      [tenantId]
    );

    // Get knowledge base count
    const knowledgeBaseCount = await database.get(
      'SELECT COUNT(*) as count FROM knowledge_base WHERE tenant_id = ? AND status = "active"',
      [tenantId]
    );

    res.json({
      totalConversations: totalConversations.count || 0,
      thisMonthConversations: thisMonthConversations.count || 0,
      averageRating: parseFloat((avgRating.avg || 0).toFixed(1)),
      resolutionRate: parseFloat((resolutionRate.rate || 0).toFixed(1)),
      knowledgeBaseDocuments: knowledgeBaseCount.count || 0
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation trends
router.get('/conversations', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { period = '7d' } = req.query;

    let dateRange = '';
    switch (period) {
      case '1d':
        dateRange = "date('now', '-1 day')";
        break;
      case '7d':
        dateRange = "date('now', '-7 days')";
        break;
      case '30d':
        dateRange = "date('now', '-30 days')";
        break;
      default:
        dateRange = "date('now', '-7 days')";
    }

    const conversations = await database.query(
      `SELECT 
         date(started_at) as date,
         COUNT(*) as count,
         AVG(CASE WHEN rating IS NOT NULL THEN rating END) as avg_rating,
         COUNT(CASE WHEN resolved = 1 THEN 1 END) * 100.0 / COUNT(*) as resolution_rate
       FROM chat_sessions 
       WHERE tenant_id = ? AND started_at >= ${dateRange}
       GROUP BY date(started_at)
       ORDER BY date`,
      [tenantId]
    );

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat history with filters
router.get('/chat-history', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { limit = 50, offset = 0, status, sentiment } = req.query;

    let whereClause = 'WHERE cs.tenant_id = ?';
    const params = [tenantId];

    if (status === 'resolved') {
      whereClause += ' AND cs.resolved = 1';
    } else if (status === 'unresolved') {
      whereClause += ' AND cs.resolved = 0';
    }

    const conversations = await database.query(
      `SELECT 
         cs.id, cs.session_token, cs.started_at, cs.ended_at, cs.resolved, cs.rating, cs.feedback,
         (SELECT message FROM chat_messages WHERE session_id = cs.id AND sender = 'user' ORDER BY timestamp LIMIT 1) as first_message,
         (SELECT COUNT(*) FROM chat_messages WHERE session_id = cs.id) as message_count
       FROM chat_sessions cs
       ${whereClause}
       ORDER BY cs.started_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({ conversations });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top questions/issues
router.get('/top-questions', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    
    const topQuestions = await database.query(
      `SELECT 
         cm.message,
         COUNT(*) as frequency
       FROM chat_messages cm
       JOIN chat_sessions cs ON cm.session_id = cs.id
       WHERE cs.tenant_id = ? AND cm.sender = 'user'
       GROUP BY cm.message
       HAVING frequency > 1
       ORDER BY frequency DESC
       LIMIT 10`,
      [tenantId]
    );

    res.json({ topQuestions });
  } catch (error) {
    console.error('Get top questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sentiment analysis
router.get('/sentiment', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    
    // For now, we'll simulate sentiment analysis
    // In a real app, you'd analyze message content
    const totalSessions = await database.get(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?',
      [tenantId]
    );

    const resolvedSessions = await database.get(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ? AND resolved = 1',
      [tenantId]
    );

    const highRatingSessions = await database.get(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ? AND rating >= 4',
      [tenantId]
    );

    const total = totalSessions.count || 1;
    const positive = (resolvedSessions.count || 0) * 0.7 + (highRatingSessions.count || 0) * 0.3;
    const negative = total * 0.1; // Assume 10% negative
    const neutral = total - positive - negative;

    res.json({
      sentiment: {
        positive: Math.round((positive / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        negative: Math.round((negative / total) * 100)
      }
    });
  } catch (error) {
    console.error('Get sentiment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 