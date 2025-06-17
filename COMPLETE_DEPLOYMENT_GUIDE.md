# Complete MCP Chat Support Platform Deployment Guide

This guide will help you deploy the complete AI customer support platform with your existing Gemini MCP server.

## 🏗️ Architecture Overview

- **Frontend**: React/TypeScript with Vite (Port 5173)
- **Backend API**: Node.js/Express with SQLite (Port 3001) 
- **MCP Server**: Already deployed at `https://gemini-mcp-server-production.up.railway.app`
- **Database**: SQLite (auto-created)
- **Authentication**: JWT + Google OAuth (optional)

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup

```bash
# Install backend dependencies
cd server
npm install

# Copy environment file
cp env.example env
# OR copy env to .env if your system supports it

# Start the backend server
npm run dev
```

The backend will:
- ✅ Create SQLite database automatically
- ✅ Set up all tables and indexes
- ✅ Connect to your existing MCP server
- ✅ Start on port 3001

### 2. Frontend Setup

```bash
# Go back to root and install frontend dependencies
cd ..
npm install

# Update frontend environment
# Create .env.local file:
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
echo "VITE_MCP_AUTH_TOKEN=test-token" >> .env.local

# Start the frontend
npm run dev
```

### 3. Test the Application

1. **Open**: http://localhost:5173
2. **Sign up**: Create a new account
3. **Test Chat**: Use the interactive demo
4. **Dashboard**: Explore all features

## 📋 Complete API Endpoints

### Authentication
- `POST /api/auth/signup` - Email/password registration
- `POST /api/auth/signin` - Email/password login  
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tenant Management
- `GET /api/tenants/me` - Get tenant info
- `PUT /api/tenants/me` - Update tenant
- `POST /api/tenants/domains` - Add domain
- `DELETE /api/tenants/domains/:id` - Remove domain

### Knowledge Base
- `GET /api/knowledge-base` - List documents
- `POST /api/knowledge-base/upload` - Upload file
- `POST /api/knowledge-base/url` - Add website
- `DELETE /api/knowledge-base/:id` - Delete document

### Chat System
- `POST /api/chat/sessions` - Create chat session
- `POST /api/chat/messages` - Send message (integrates with MCP)
- `GET /api/chat/sessions/:token/history` - Get chat history
- `POST /api/chat/sessions/:token/rate` - Rate conversation

### Analytics
- `GET /api/analytics/metrics` - Dashboard metrics
- `GET /api/analytics/conversations` - Conversation trends
- `GET /api/analytics/sentiment` - Sentiment analysis

### Widget
- `GET /api/widget/config/:tenantId` - Widget configuration
- `GET /api/widget/script/:tenantId` - Embeddable JavaScript

## 🔧 Configuration

### Environment Variables

**Backend** (`server/env`):
```env
PORT=3001
JWT_SECRET=your-secure-secret-change-this
MCP_SERVER_URL=https://gemini-mcp-server-production.up.railway.app
MCP_AUTH_TOKEN=test-token
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_MCP_AUTH_TOKEN=test-token
VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
6. Update environment variables with client ID and secret

## 📱 Chat Widget Integration

To embed the chat widget on any website:

```html
<!-- Add this script tag to any website -->
<script src="http://localhost:3001/api/widget/script/TENANT_ID"></script>
```

Replace `TENANT_ID` with the actual tenant ID from the database.

## 🗄️ Database Schema

The application automatically creates these tables:
- `users` - User accounts and profiles
- `tenants` - Multi-tenant workspaces
- `user_tenants` - User-tenant relationships
- `domains` - Verified domains per tenant
- `knowledge_base` - Documents and websites
- `chat_sessions` - Chat conversations
- `chat_messages` - Individual messages
- `analytics_events` - Event tracking
- `widget_configs` - Widget customization

## 🔗 MCP Server Integration

The backend integrates with your existing MCP server:

**When a user sends a message**:
1. Message saved to database
2. Chat history + knowledge base sent to MCP server
3. MCP server responds with AI-generated answer
4. Response saved and returned to user
5. Analytics events logged

**Fallback handling**:
- If MCP server is down, shows friendly error message
- Retries with exponential backoff
- Logs all errors for debugging

## 🚢 Production Deployment

### Backend (Railway/Heroku/VPS)

1. **Deploy to Railway**:
   ```bash
   # In server directory
   railway login
   railway init
   railway add
   railway deploy
   ```

2. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Update `JWT_SECRET` to secure random string
   - Update `FRONTEND_URL` to your frontend domain
   - Set database URL if using PostgreSQL

### Frontend (Vercel/Netlify)

1. **Deploy to Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Environment Variables**:
   - `VITE_API_URL=https://your-backend-url/api`
   - `VITE_MCP_AUTH_TOKEN=test-token`

### Database Migration

For production, consider migrating to PostgreSQL:

```bash
# Update DATABASE_URL in production
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## 📊 Features Included

### ✅ User Management
- Email/password registration
- Google OAuth login
- User profiles and avatars
- Multi-tenant architecture

### ✅ Knowledge Base
- File uploads (PDF, DOCX, TXT)
- Website URL crawling
- Document management
- AI training integration

### ✅ Chat System
- Real-time messaging
- Session management
- Message history
- Conversation rating
- Sentiment tracking

### ✅ Analytics
- Dashboard metrics
- Conversation trends
- Resolution rates
- Top questions analysis

### ✅ Widget System
- Embeddable JavaScript widget
- Customizable styling
- Cross-domain support
- Mobile responsive

### ✅ Admin Features
- Tenant management
- Domain verification
- Settings management
- User administration

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**:
- Check if port 3001 is available
- Verify environment file exists
- Check database permissions

**Frontend can't connect**:
- Verify API URL in `.env.local`
- Check CORS settings in backend
- Ensure backend is running

**MCP server integration fails**:
- Verify MCP server URL is accessible
- Check auth token matches
- Review server logs for errors

**Database issues**:
- Delete `database.sqlite` and restart
- Check file permissions
- Verify SQLite is installed

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Frontend  
VITE_DEBUG=true npm run dev
```

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Test MCP server connectivity separately
4. Review the database schema
5. Check CORS and authentication settings

## 🎉 Success!

You now have a complete AI customer support platform that:

- ✅ Handles user registration and authentication
- ✅ Manages knowledge bases and documents  
- ✅ Provides real-time chat with AI responses
- ✅ Tracks analytics and performance metrics
- ✅ Generates embeddable chat widgets
- ✅ Integrates with your existing Gemini MCP server
- ✅ Ready for production deployment

The platform is fully functional and can be deployed immediately! 