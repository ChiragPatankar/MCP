import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { database } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, TXT, and MD files are allowed.'));
    }
  }
});

// Get knowledge base documents
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;

    const documents = await database.query(
      'SELECT id, name, type, source, status, size, created_at, updated_at FROM knowledge_base WHERE tenant_id = ? ORDER BY created_at DESC',
      [tenantId]
    );

    res.json({ documents });
  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload document
router.post('/upload', upload.single('document'), async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, size, mimetype } = req.file;
    const fileType = path.extname(originalname).toLowerCase().substring(1);

    // Save to database
    const result = await database.run(
      'INSERT INTO knowledge_base (tenant_id, name, type, source, status, size, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        tenantId,
        originalname,
        fileType,
        filename,
        'processing',
        size,
        JSON.stringify({ mimetype, uploadedAt: new Date().toISOString() })
      ]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'document_uploaded', JSON.stringify({ 
        documentId: result.lastID, 
        type: fileType, 
        size 
      })]
    );

    res.status(201).json({
      id: result.lastID,
      name: originalname,
      type: fileType,
      status: 'processing',
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add website URL
router.post('/url', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { url, name } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const displayName = name || new URL(url).hostname;

    // Save to database
    const result = await database.run(
      'INSERT INTO knowledge_base (tenant_id, name, type, source, status, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      [
        tenantId,
        displayName,
        'website',
        url,
        'processing',
        JSON.stringify({ addedAt: new Date().toISOString() })
      ]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'website_added', JSON.stringify({ 
        documentId: result.lastID, 
        url 
      })]
    );

    res.status(201).json({
      id: result.lastID,
      name: displayName,
      type: 'website',
      source: url,
      status: 'processing',
      message: 'Website added successfully'
    });
  } catch (error) {
    console.error('Add URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
router.delete('/:documentId', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { documentId } = req.params;

    // Get document info
    const document = await database.get(
      'SELECT * FROM knowledge_base WHERE id = ? AND tenant_id = ?',
      [documentId, tenantId]
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file if it's a uploaded document
    if (document.type !== 'website') {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', document.source);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    await database.run(
      'DELETE FROM knowledge_base WHERE id = ? AND tenant_id = ?',
      [documentId, tenantId]
    );

    // Log analytics event
    await database.run(
      'INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)',
      [tenantId, 'document_deleted', JSON.stringify({ 
        documentId, 
        name: document.name, 
        type: document.type 
      })]
    );

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document status (for processing updates)
router.put('/:documentId/status', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { documentId } = req.params;
    const { status } = req.body;

    if (!['processing', 'active', 'error'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await database.run(
      'UPDATE knowledge_base SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?',
      [status, documentId, tenantId]
    );

    res.json({ message: 'Document status updated successfully' });
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document by ID
router.get('/:documentId', async (req: AuthenticatedRequest, res) => {
  try {
    const { tenantId } = req.user!;
    const { documentId } = req.params;

    const document = await database.get(
      'SELECT * FROM knowledge_base WHERE id = ? AND tenant_id = ?',
      [documentId, tenantId]
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      ...document,
      metadata: JSON.parse(document.metadata || '{}')
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 