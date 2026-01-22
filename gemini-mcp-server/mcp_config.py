import os
from dotenv import load_dotenv

load_dotenv()

class MCPSettings:
    # Server configuration
    SERVER_NAME = os.getenv("SERVER_NAME", "Gemini MCP Server")
    SERVER_VERSION = os.getenv("SERVER_VERSION", "2.0.0")
    
    # Model configuration
    MODEL_NAME = "gemini-1.5-flash"
    MODEL_VERSION = "1.5"
    CONTEXT_PROVIDER = "internal"
    
    # Rate limiting
    RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_PERIOD = int(os.getenv("RATE_LIMIT_PERIOD", "60"))
    
    # Context settings
    MAX_CONTEXT_RESULTS = int(os.getenv("MAX_CONTEXT_RESULTS", "10"))
    
    # Debug mode
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Create global settings instance
mcp_settings = MCPSettings()