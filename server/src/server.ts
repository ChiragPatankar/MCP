import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import tenantRoutes from './routes/tenants';
import knowledgeBaseRoutes from './routes/knowledge-base';
import chatRoutes from './routes/chat';
import analyticsRoutes from './routes/analytics';
import widgetRoutes from './routes/widget';

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Import database initialization
import { initializeDatabase } from './db/database';

// Import WebSocket handler
import { setupWebSocket } from './services/websocket';

// Import configuration
import config from './config';

const app = express();

// Create HTTP server for WebSocket support
const server = createServer(app);

// Initialize WebSocket
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', authenticateToken, tenantRoutes);
app.use('/api/knowledge-base', authenticateToken, knowledgeBaseRoutes);
app.use('/api/chat', chatRoutes); // No auth required for public chat widget
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/widget', widgetRoutes); // No auth required for widget access

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    server.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📱 Health check: http://localhost:${config.PORT}/health`);
      console.log(`🔌 WebSocket server ready`);
      console.log(`🌐 CORS enabled for: ${config.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app; 