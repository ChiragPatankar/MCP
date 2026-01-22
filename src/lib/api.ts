// API Service for connecting to Gemini MCP Server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://huggingface.co/spaces/ChiragPatankar/Gemini_MCP_Server';
const AUTH_TOKEN = import.meta.env.VITE_MCP_AUTH_TOKEN || 'test-token';

export interface MCPResponse {
  response: string;
  message_id: string;
  timestamp: string;
  processing_time: number;
  mcp_version: string;
}

export interface MCPRequest {
  query: string;
  user_id: string;
  priority?: 'high' | 'normal' | 'low';
  metadata?: any;
}

export class ApiService {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.authToken = AUTH_TOKEN;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-mcp-auth': this.authToken,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/mcp/health');
  }

  // Process single chat message
  async processMessage(query: string, userId: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<MCPResponse> {
    return this.makeRequest('/mcp/process', {
      method: 'POST',
      body: JSON.stringify({
        query,
        user_id: userId,
        priority,
        mcp_version: '1.0'
      }),
    });
  }

  // Process multiple messages (batch)
  async processBatch(queries: string[], userId: string): Promise<MCPResponse[]> {
    const response = await this.makeRequest('/mcp/batch', {
      method: 'POST',
      body: JSON.stringify({
        queries,
        user_id: userId,
        mcp_version: '1.0'
      }),
    });
    
    return response.responses || [];
  }

  // Get server capabilities
  async getCapabilities() {
    return this.makeRequest('/mcp/capabilities');
  }

  // Get server version
  async getVersion() {
    return this.makeRequest('/mcp/version');
  }
}

export const apiService = new ApiService(); 