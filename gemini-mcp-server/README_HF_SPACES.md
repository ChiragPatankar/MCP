# 🚀 Deploy to Hugging Face Spaces

This guide will help you deploy the Gemini MCP Server to Hugging Face Spaces.

## Prerequisites

1. **Google Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository contains:
- `app.py` - Main FastAPI application
- `requirements.txt` - Python dependencies
- `app_config.py` - Configuration file
- All other necessary files

### 2. Create a Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Choose settings:
   - **Owner**: Your username
   - **Space name**: `gemini-mcp-server` (or your preferred name)
   - **License**: Choose appropriate license
   - **SDK**: **Docker**
   - **Python version**: 3.9
   - **Hardware**: CPU (free tier)

### 3. Connect Your Repository

1. In the Space creation form, select **"Repository"** as the source
2. Choose your GitHub repository
3. Set the **Repository path** to: `gemini-mcp-server/` (if your backend is in a subdirectory)
4. Click **"Create Space"**

### 4. Configure Environment Variables

1. Go to your Space's **Settings** tab
2. Scroll down to **"Repository secrets"**
3. Add the following secrets:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Optional environment variables:**
```
DATABASE_URL=sqlite:///./data/mcp_server.db
ALLOWED_ORIGINS=*
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=3600
LOG_LEVEL=INFO
```

### 5. Deploy

1. The Space will automatically start building
2. Monitor the build logs in the **"Logs"** tab
3. Once successful, your API will be available at:
   ```
   https://your-username-gemini-mcp-server.hf.space
   ```

## API Endpoints

Once deployed, your API will have these endpoints:

- `GET /` - Health check and server info
- `GET /mcp/version` - MCP version information
- `GET /mcp/capabilities` - Available capabilities
- `POST /mcp/process` - Process single query
- `POST /mcp/batch` - Process multiple queries
- `GET /mcp/health` - Detailed health check

## Testing Your Deployment

1. **Health Check**: Visit your Space URL to see the welcome message
2. **API Test**: Use the `/mcp/health` endpoint to verify all services
3. **Integration**: Update your frontend to use the new backend URL

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check the logs for missing dependencies
2. **API Key Error**: Ensure `GEMINI_API_KEY` is set correctly
3. **Port Issues**: The app automatically uses port 7860 for HF Spaces
4. **CORS Errors**: Check `ALLOWED_ORIGINS` configuration

### Getting Help:

- Check the **Logs** tab in your Space for detailed error messages
- Review the main `README.md` for more technical details
- Open an issue in the repository if you encounter problems

## Cost

- **Hugging Face Spaces**: Free tier available
- **Google Gemini API**: Free tier with generous limits
- **Total Cost**: $0 for basic usage

## Next Steps

After successful deployment:

1. Update your frontend to point to the new backend URL
2. Test all functionality end-to-end
3. Monitor usage and performance
4. Consider upgrading to paid tiers if needed

---

**🎉 Congratulations!** Your Gemini MCP Server is now deployed on Hugging Face Spaces! 