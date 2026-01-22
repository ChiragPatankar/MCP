// API Configuration for ClientSphere - AI-Powered Chatbot & CRM
// Update this URL to point to your Hugging Face MCP Server

export const API_CONFIG = {
  // Cloudflare Worker Backend URL (primary)
  BACKEND_URL: import.meta.env.VITE_API_URL || 'https://mcp-backend.officialchiragp1605.workers.dev',
  
  // Hugging Face MCP Server URL (fallback for AI processing)
  MCP_SERVER_URL: import.meta.env.VITE_GEMINI_MCP_URL || 'https://chiragpatankar-gemini-mcp-server.hf.space',
  
  // Backend endpoint paths
  ENDPOINTS: {
    PROCESS: '/mcp/process',  // Chat processing via Cloudflare Worker
    HEALTH: '/health',
    STATUS: '/health',
    UPLOAD: '/api/upload',
    KNOWLEDGE_BASE: '/api/knowledge-base',
    CHAT: '/api/chat',
    AUTH_SIGNIN: '/auth/signin',
    AUTH_SIGNUP: '/auth/signup'
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  }
};

// Helper function to get the full endpoint URL
export const getEndpointUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${API_CONFIG.BACKEND_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Helper function to get MCP server URL (for direct AI processing)
export const getMCPServerUrl = (endpoint: string = ''): string => {
  return `${API_CONFIG.MCP_SERVER_URL}${endpoint}`;
};

// Test MCP connection
export const testMCPConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getEndpointUrl('HEALTH'), {
      method: 'GET',
      headers: API_CONFIG.REQUEST_CONFIG.headers,
    });
    return response.ok;
  } catch (error) {
    console.error('MCP connection test failed:', error);
    return false;
  }
}; 