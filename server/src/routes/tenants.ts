import express from 'express';
import { database } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get current tenant info
router.get('/me', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;

    const tenant = await database.get(
      'SELECT id, name, subdomain, plan, settings, created_at FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Get domains
    const domains = await database.query(
      'SELECT id, domain, verified, created_at FROM domains WHERE tenant_id = ?',
      [tenantId]
    );

    res.json({
      ...tenant,
      settings: JSON.parse(tenant.settings || '{}'),
      domains
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update tenant settings
router.put('/me', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { name, settings } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }

    if (settings) {
      updates.push('settings = ?');
      params.push(JSON.stringify(settings));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(tenantId);

    await database.run(
      `UPDATE tenants SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Tenant updated successfully' });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add domain
router.post('/domains', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Check if domain already exists
    const existingDomain = await database.get(
      'SELECT id FROM domains WHERE domain = ?',
      [domain]
    );

    if (existingDomain) {
      return res.status(400).json({ error: 'Domain already exists' });
    }

    // Add domain
    const result = await database.run(
      'INSERT INTO domains (tenant_id, domain) VALUES (?, ?)',
      [tenantId, domain]
    );

    res.status(201).json({
      id: result.lastID,
      domain,
      verified: false,
      message: 'Domain added successfully'
    });
  } catch (error) {
    console.error('Add domain error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove domain
router.delete('/domains/:domainId', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { domainId } = req.params;

    await database.run(
      'DELETE FROM domains WHERE id = ? AND tenant_id = ?',
      [domainId, tenantId]
    );

    res.json({ message: 'Domain removed successfully' });
  } catch (error) {
    console.error('Remove domain error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tenant analytics summary
router.get('/analytics/summary', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;

    // Get basic stats
    const totalConversations = await database.get(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?',
      [tenantId]
    );

    const totalMessages = await database.get(
      'SELECT COUNT(*) as count FROM chat_messages cm JOIN chat_sessions cs ON cm.session_id = cs.id WHERE cs.tenant_id = ?',
      [tenantId]
    );

    const avgRating = await database.get(
      'SELECT AVG(rating) as avg FROM chat_sessions WHERE tenant_id = ? AND rating IS NOT NULL',
      [tenantId]
    );

    const knowledgeBaseCount = await database.get(
      'SELECT COUNT(*) as count FROM knowledge_base WHERE tenant_id = ?',
      [tenantId]
    );

    res.json({
      totalConversations: totalConversations.count,
      totalMessages: totalMessages.count,
      averageRating: avgRating.avg || 0,
      knowledgeBaseDocuments: knowledgeBaseCount.count
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 