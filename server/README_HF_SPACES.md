# 🚀 Deploy Node.js Backend to Hugging Face Spaces

This guide will help you deploy the Node.js/Express backend to Hugging Face Spaces.

## Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your `server/` directory contains:
- `package.json` - Node.js dependencies
- `src/server.ts` - Main Express application
- `Dockerfile` - Docker configuration
- `tsconfig.json` - TypeScript configuration
- All other necessary files

### 2. Create a Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Choose settings:
   - **Owner**: Your username
   - **Space name**: `mcp-chat-backend` (or your preferred name)
   - **License**: Choose appropriate license
   - **SDK**: **Docker**
   - **Hardware**: CPU (free tier)

### 3. Connect Your Repository

1. In the Space creation form, select **"Repository"** as the source
2. Choose your GitHub repository
3. Set the **Repository path** to: `server/` (since your backend is in a subdirectory)
4. Click **"Create Space"**

### 4. Configure Environment Variables

1. Go to your Space's **Settings** tab
2. Scroll down to **"Repository secrets"**
3. Add the following secrets:

**Required:**
```
JWT_SECRET=your_secure_jwt_secret_here
```

**Optional (but recommended):**
```
NODE_ENV=production
DATABASE_URL=sqlite:./database.sqlite
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 5. Deploy

1. The Space will automatically start building
2. Monitor the build logs in the **"Logs"** tab
3. Once successful, your API will be available at:
   ```
   https://your-username-mcp-chat-backend.hf.space
   ```

## API Endpoints

Once deployed, your API will have these endpoints:

- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tenants` - Tenant management
- `GET /api/knowledge-base` - Knowledge base
- `POST /api/chat` - Chat functionality
- `GET /api/analytics` - Analytics data
- `GET /api/widget` - Widget configuration

## WebSocket Support

The backend includes WebSocket support for real-time chat functionality. The WebSocket server runs on the same port as the HTTP server.

## Database

The backend uses SQLite by default, which is perfect for Hugging Face Spaces as it doesn't require external database connections.

## Testing Your Deployment

1. **Health Check**: Visit `https://your-space-url/health`
2. **API Test**: Test the authentication endpoints
3. **WebSocket Test**: Connect to the WebSocket server
4. **Integration**: Update your frontend to use the new backend URL

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check the logs for missing dependencies
2. **Port Issues**: The app automatically uses port 7860 for HF Spaces
3. **CORS Errors**: Check `ALLOWED_ORIGINS` configuration
4. **Database Errors**: Ensure the uploads directory is writable

### Getting Help:

- Check the **Logs** tab in your Space for detailed error messages
- Review the main `README.md` for more technical details
- Open an issue in the repository if you encounter problems

## Cost

- **Hugging Face Spaces**: Free tier available
- **Total Cost**: $0 for basic usage

## Next Steps

After successful deployment:

1. Update your frontend to point to the new backend URL
2. Test all functionality end-to-end
3. Monitor usage and performance
4. Consider upgrading to paid tiers if needed

## Integration with Frontend

Update your frontend configuration to use the new backend URL:

```javascript
// In your frontend config
const API_BASE_URL = 'https://your-username-mcp-chat-backend.hf.space';
const WS_URL = 'wss://your-username-mcp-chat-backend.hf.space';
```

---

**🎉 Congratulations!** Your Node.js backend is now deployed on Hugging Face Spaces! 