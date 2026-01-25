/**
 * RAG Backend API Client
 * Handles all communication with the FastAPI RAG backend
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Get RAG API URL with safe fallbacks
 * Priority:
 * 1. VITE_RAG_API_URL environment variable (set at build time)
 * 2. Production: Hugging Face Space URL (never localhost in prod)
 * 3. Development: localhost for local dev
 */
function getRAGApiUrl(): string {
  // If environment variable is explicitly set, use it
  if (import.meta.env.VITE_RAG_API_URL) {
    return import.meta.env.VITE_RAG_API_URL;
  }
  
  // In production builds, NEVER use localhost - always use HF Space
  // Note: Hugging Face Spaces URLs convert underscores to hyphens!
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return 'https://chiragpatankar-rag-backend.hf.space';
  }
  
  // Only use localhost in development
  return 'http://localhost:8000';
}

const RAG_API_URL = getRAGApiUrl();

// Log the API URL at startup for verification (always visible in production)
console.log('✅ RAG API URL =', RAG_API_URL);
console.log('✅ Environment:', import.meta.env.MODE || 'unknown');
console.log('✅ VITE_RAG_API_URL set:', !!import.meta.env.VITE_RAG_API_URL);
if (import.meta.env.PROD) {
  console.log('✅ Production build - using:', RAG_API_URL);
}

// Types matching backend schemas
export interface Citation {
  file_name: string;
  chunk_id: string;
  page_number?: number;
  relevance_score: number;
  excerpt: string;
}

export interface ChatRequest {
  kb_id: string;
  conversation_id?: string;
  question: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  citations: Citation[];
  confidence: number;
  from_knowledge_base: boolean;
  escalation_suggested: boolean;
  conversation_id: string;
  metadata: Record<string, any>;
  refused?: boolean;
  refusal_reason?: string;
  verifier_passed?: boolean;
}

export interface KnowledgeBaseStats {
  tenant_id: string;
  kb_id: string;
  user_id: string;
  total_documents: number;
  total_chunks: number;
  file_names: string[];
  last_updated?: string;
}

export interface RetrievalResult {
  chunk_id: string;
  content: string;
  metadata: Record<string, any>;
  similarity_score: number;
}

export interface SearchResponse {
  success: boolean;
  results: RetrievalResult[];
  confidence: number;
  has_relevant_results: boolean;
}

export interface UsageResponse {
  tenant_id: string;
  period: string;
  total_requests: number;
  total_tokens: number;
  total_cost_usd: number;
  gemini_requests: number;
  openai_requests: number;
  start_date: string;
  end_date: string;
}

export interface PlanLimitsResponse {
  tenant_id: string;
  plan_name: string;
  monthly_chat_limit: number;
  current_month_usage: number;
  remaining_chats: number | null;
}

export interface CostReportResponse {
  tenant_id: string;
  period: string;
  total_cost_usd: number;
  total_requests: number;
  total_tokens: number;
  breakdown_by_provider: Record<string, {
    requests: number;
    tokens: number;
    cost_usd: number;
  }>;
  breakdown_by_model: Record<string, {
    requests: number;
    tokens: number;
    cost_usd: number;
  }>;
}

/**
 * Get JWT token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth-token');
}

/**
 * Get user info from localStorage (fallback if JWT decode fails)
 */
function getUserFromStorage(): { tenantId?: string; userId?: string } {
  try {
    const userStr = localStorage.getItem('mcp-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Use user ID as both tenant_id and user_id for now
      // In a real multi-tenant system, tenant_id would come from user.tenantId
      return {
        tenantId: user.id || user.tenantId,
        userId: user.id,
      };
    }
  } catch (error) {
    console.warn('Failed to get user from storage:', error);
  }
  return {};
}

/**
 * Decode JWT to extract tenant_id and user_id
 */
function decodeJWT(token: string | null): { tenantId?: string; userId?: string } {
  if (!token) {
    return {};
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Not a standard JWT, try to get from localStorage user object
      console.warn('Token is not a standard JWT format, using user from localStorage');
      return getUserFromStorage();
    }
    
    const base64Url = parts[1];
    if (!base64Url) {
      console.warn('Invalid JWT format: missing payload');
      return getUserFromStorage();
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      tenantId: decoded.tenant_id || decoded.tenantId,
      userId: decoded.user_id || decoded.userId || decoded.sub,
    };
  } catch (error) {
    console.warn('Failed to decode JWT, trying localStorage fallback:', error);
    return getUserFromStorage();
  }
}

/**
 * Create axios instance with interceptors
 */
function createRAGClient(): AxiosInstance {
  const client = axios.create({
    baseURL: RAG_API_URL,
    timeout: 60000, // 60 seconds for LLM calls
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add auth token and dev headers
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // In dev mode, add X-Tenant-Id and X-User-Id headers if available
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        const userInfo = getUserFromStorage();
        if (userInfo.tenantId) {
          config.headers['X-Tenant-Id'] = userInfo.tenantId;
        }
        if (userInfo.userId) {
          config.headers['X-User-Id'] = userInfo.userId;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle 401 and 402
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Unauthorized - force logout
        localStorage.removeItem('auth-token');
        localStorage.removeItem('mcp-user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const ragClient = createRAGClient();

/**
 * RAG API Client
 */
export class RAGClient {
  /**
   * Upload a document to knowledge base
   */
  static async uploadDocument(
    file: File,
    kbId: string = 'default'
  ): Promise<{ success: boolean; message: string; file_name: string; chunks_created: number }> {
    const token = getAuthToken();
    
    // Try to get tenant_id and user_id from JWT or localStorage
    let tenantId: string | undefined;
    let userId: string | undefined;
    
    if (token) {
      const decoded = decodeJWT(token);
      tenantId = decoded.tenantId;
      userId = decoded.userId;
    }
    
    // Fallback: get from localStorage user object
    if (!tenantId || !userId) {
      const userInfo = getUserFromStorage();
      tenantId = userInfo.tenantId || tenantId;
      userId = userInfo.userId || userId;
    }
    
    // In dev mode, allow using default values
    if (import.meta.env.DEV && (!tenantId || !userId)) {
      console.warn('Using default dev tenant/user IDs for upload');
      tenantId = tenantId || 'dev_tenant';
      userId = userId || 'dev_user';
    }
    
    if (!tenantId || !userId) {
      throw new Error('Authentication required. Please log in.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kb_id', kbId);
    formData.append('tenant_id', tenantId);
    formData.append('user_id', userId);

    const response = await ragClient.post('/kb/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Get knowledge base statistics
   */
  static async getKBStats(kbId: string = 'default'): Promise<KnowledgeBaseStats> {
    const token = getAuthToken();
    
    // Try to get tenant_id and user_id from JWT or localStorage
    let tenantId: string | undefined;
    let userId: string | undefined;
    
    if (token) {
      const decoded = decodeJWT(token);
      tenantId = decoded.tenantId;
      userId = decoded.userId;
    }
    
    // Fallback: get from localStorage user object
    if (!tenantId || !userId) {
      const userInfo = getUserFromStorage();
      tenantId = userInfo.tenantId || tenantId;
      userId = userInfo.userId || userId;
    }
    
    // In dev mode, allow using default values
    if (import.meta.env.DEV && (!tenantId || !userId)) {
      console.warn('Using default dev tenant/user IDs for KB stats');
      tenantId = tenantId || 'dev_tenant';
      userId = userId || 'dev_user';
    }
    
    if (!tenantId || !userId) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await ragClient.get('/kb/stats', {
      params: { 
        kb_id: kbId,
        tenant_id: tenantId,
        user_id: userId,
      },
    });
    return response.data;
  }

  /**
   * Search knowledge base (retrieval only, no LLM)
   */
  static async searchKB(
    query: string,
    kbId: string = 'default',
    topK: number = 5
  ): Promise<SearchResponse> {
    const token = getAuthToken();
    
    // Try to get tenant_id and user_id from JWT or localStorage
    let tenantId: string | undefined;
    let userId: string | undefined;
    
    if (token) {
      const decoded = decodeJWT(token);
      tenantId = decoded.tenantId;
      userId = decoded.userId;
    }
    
    // Fallback: get from localStorage user object
    if (!tenantId || !userId) {
      const userInfo = getUserFromStorage();
      tenantId = userInfo.tenantId || tenantId;
      userId = userInfo.userId || userId;
    }
    
    // In dev mode, allow using default values
    if (import.meta.env.DEV && (!tenantId || !userId)) {
      console.warn('Using default dev tenant/user IDs for search');
      tenantId = tenantId || 'dev_tenant';
      userId = userId || 'dev_user';
    }
    
    if (!tenantId || !userId) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await ragClient.get('/kb/search', {
      params: {
        query,
        kb_id: kbId,
        tenant_id: tenantId,
        user_id: userId,
        top_k: topK,
      },
    });
    return response.data;
  }

  /**
   * Chat with RAG (full pipeline: retrieval + LLM)
   */
  static async chat(
    question: string,
    kbId: string = 'default',
    conversationId?: string
  ): Promise<ChatResponse> {
    const token = getAuthToken();
    
    // Try to get tenant_id and user_id from JWT or localStorage
    let tenantId: string | undefined;
    let userId: string | undefined;
    
    if (token) {
      const decoded = decodeJWT(token);
      tenantId = decoded.tenantId;
      userId = decoded.userId;
    }
    
    // Fallback: get from localStorage user object
    if (!tenantId || !userId) {
      const userInfo = getUserFromStorage();
      tenantId = userInfo.tenantId || tenantId;
      userId = userInfo.userId || userId;
    }
    
    // In dev mode, allow using default values
    if (import.meta.env.DEV && (!tenantId || !userId)) {
      console.warn('Using default dev tenant/user IDs');
      tenantId = tenantId || 'dev_tenant';
      userId = userId || 'dev_user';
    }
    
    if (!tenantId || !userId) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await ragClient.post<ChatResponse>('/chat', {
      tenant_id: tenantId,
      user_id: userId,
      kb_id: kbId,
      conversation_id: conversationId,
      question,
    });

    return response.data;
  }

  /**
   * Get usage statistics
   */
  static async getUsage(
    range: 'day' | 'month' = 'month',
    year?: number,
    month?: number,
    day?: number
  ): Promise<UsageResponse> {
    const params: Record<string, any> = { range };
    if (year) params.year = year;
    if (month) params.month = month;
    if (day) params.day = day;

    const response = await ragClient.get<UsageResponse>('/billing/usage', { params });
    return response.data;
  }

  /**
   * Get plan limits and current usage
   */
  static async getLimits(): Promise<PlanLimitsResponse> {
    const response = await ragClient.get<PlanLimitsResponse>('/billing/limits');
    return response.data;
  }

  /**
   * Get cost report
   */
  static async getCostReport(
    range: string = 'month',
    year?: number,
    month?: number
  ): Promise<CostReportResponse> {
    const params: Record<string, any> = { range };
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await ragClient.get<CostReportResponse>('/billing/cost-report', { params });
    return response.data;
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await ragClient.get('/health/live');
    return response.data;
  }

  /**
   * Readiness check
   */
  static async readinessCheck(): Promise<{
    status: string;
    version: string;
    vector_db_connected: boolean;
    llm_configured: boolean;
  }> {
    const response = await ragClient.get('/health/ready');
    return response.data;
  }
}

export default RAGClient;

