# HTTP MCP Server Integration Plan
## Direct Integration with Your Existing Python MCP Server

Based on your repository: https://github.com/ChiragPatankar/AI-Customer-Support-Bot--MCP-Server

---

## 🎯 **Current State Analysis**

### ✅ **You Already Have:**
- ✅ **Fully functional MCP server** (Python/FastAPI)
- ✅ **Database layer** (PostgreSQL + models)
- ✅ **AI integration** (Glama.ai + Cursor AI)
- ✅ **Rate limiting & monitoring**
- ✅ **Docker containerization**
- ✅ **Health check endpoints**
- ✅ **Batch processing capabilities**

### 🔴 **Missing for Production SaaS:**
- ❌ **Frontend-to-MCP connection**
- ❌ **Multi-tenant user management**
- ❌ **Authentication bridge**
- ❌ **Real-time chat interface**
- ❌ **File upload integration**

---

## 🚀 **Simple Integration Plan (3-4 Weeks)**

### **Phase 1: Direct HTTP Integration (Week 1)**

#### 1. Create API Service Layer
```typescript
// src/lib/mcpApi.ts
const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL;
const MCP_AUTH_TOKEN = import.meta.env.VITE_MCP_AUTH_TOKEN;

export class MCPApiClient {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-MCP-Auth': this.authToken,
        'X-MCP-Version': '1.0',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`MCP API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Single query processing
  async processQuery(query: string, tenantId: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    return this.makeRequest('/mcp/process', {
      method: 'POST',
      body: JSON.stringify({
        query,
        priority,
        mcp_version: '1.0',
        tenant_id: tenantId  // Add tenant context
      }),
    });
  }

  // Batch processing
  async processBatch(queries: string[], tenantId: string) {
    return this.makeRequest('/mcp/batch', {
      method: 'POST',
      body: JSON.stringify({
        queries,
        mcp_version: '1.0',
        tenant_id: tenantId
      }),
    });
  }

  // Health check
  async getHealth() {
    return this.makeRequest('/mcp/health');
  }

  // Server capabilities
  async getCapabilities() {
    return this.makeRequest('/mcp/capabilities');
  }
}

export const mcpApi = new MCPApiClient(MCP_SERVER_URL, MCP_AUTH_TOKEN);
```

#### 2. Update Frontend Authentication
```typescript
// src/context/AuthContext.tsx - Replace mock with real API
const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    // Call your authentication API (create simple Express server)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Invalid credentials');

    const { token, user } = await response.json();
    
    // Store auth token for API calls
    localStorage.setItem('auth-token', token);
    localStorage.setItem('mcp-user', JSON.stringify(user));
    
    setUser(user);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

### **Phase 2: Real-time Chat Integration (Week 2)**

#### 1. Create Chat Service
```typescript
// src/lib/chatService.ts
import { mcpApi } from './mcpApi';

export class ChatService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async sendMessage(message: string): Promise<{response: string, timestamp: Date}> {
    try {
      const result = await mcpApi.processQuery(message, this.tenantId, 'high');
      
      return {
        response: result.response || result.answer || 'Sorry, I could not process your request.',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to send message');
    }
  }

  async sendBatchMessages(messages: string[]) {
    return mcpApi.processBatch(messages, this.tenantId);
  }
}
```

#### 2. Update Chat Components
```typescript
// In your chat components, replace mock responses
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const chatService = new ChatService(user.tenantId);

const handleSendMessage = async (message: string) => {
  setIsLoading(true);
  
  // Add user message
  const userMessage = {
    id: Date.now().toString(),
    content: message,
    sender: 'user' as const,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);

  try {
    // Get AI response from your MCP server
    const { response, timestamp } = await chatService.sendMessage(message);
    
    // Add bot response
    const botMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'bot' as const,
      timestamp
    };
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    // Handle error
    console.error('Failed to send message:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### **Phase 3: Authentication Bridge (Week 2-3)**

Create a simple Express.js server to handle user management:

```javascript
// backend/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Simple SQLite database for users
const db = new sqlite3.Database('./users.db');

// Initialize user table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'tenant',
    tenant_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id
      }
    });
  });
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, companyName } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const tenantId = `tenant_${Date.now()}`;
  
  db.run(
    'INSERT INTO users (name, email, password, tenant_id) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, tenantId],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const token = jwt.sign(
        { userId: this.lastID, tenantId, role: 'tenant' },
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      res.json({
        token,
        user: {
          id: this.lastID,
          name,
          email,
          role: 'tenant',
          tenantId
        }
      });
    }
  );
});

app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});
```

### **Phase 4: Enhanced Features (Week 3-4)**

#### 1. Knowledge Base Integration
```typescript
// Extend your MCP server to handle file uploads
// Add endpoint to your Python server: POST /mcp/upload
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenant_id', user.tenantId);
  
  const response = await fetch(`${MCP_SERVER_URL}/mcp/upload`, {
    method: 'POST',
    headers: {
      'X-MCP-Auth': MCP_AUTH_TOKEN,
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });
  
  return response.json();
};
```

#### 2. Analytics Integration
```typescript
// Get analytics from your MCP server
const getAnalytics = async (tenantId: string) => {
  const response = await fetch(`${MCP_SERVER_URL}/mcp/analytics/${tenantId}`, {
    headers: {
      'X-MCP-Auth': MCP_AUTH_TOKEN,
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  return response.json();
};
```

---

## 🔧 **Environment Configuration**

```bash
# Frontend .env
VITE_MCP_SERVER_URL=http://localhost:8000
VITE_API_URL=http://localhost:3001

# Your MCP Server .env (already configured)
GLAMA_API_KEY=your_glama_api_key
CURSOR_API_KEY=your_cursor_api_key
DATABASE_URL=postgresql://user:password@localhost/customer_support_bot
```

---

## 💰 **Updated Cost Estimate**

### Development
- **Your MCP Server**: $20-50/month (VPS hosting)
- **Simple Auth API**: $10-20/month (small VPS)
- **PostgreSQL**: $25-50/month (managed database)
- **AI APIs**: $50-200/month (Glama.ai + Cursor AI)

**Total: $105-320/month** 🎉

### Production
- **MCP Server**: $50-100/month (better VPS)
- **Auth API**: $25-50/month
- **Database**: $100-200/month
- **AI APIs**: $200-1000/month
- **CDN/Storage**: $20-50/month

**Total: $395-1400/month** 🎉

---

## ⚡ **Immediate Next Steps**

1. **✅ Deploy your MCP server** (if not already deployed)
2. **Create simple auth API** (1-2 days)
3. **Connect frontend to MCP server** (2-3 days)
4. **Test chat functionality** (1 day)
5. **Add file upload to MCP server** (2-3 days)

**Time to MVP: 2-3 weeks!** 🚀

---

## 🎯 **Your Advantages**

✅ **MCP Server already built** - Saves 4-6 weeks of development
✅ **Multiple AI providers** - Glama.ai + Cursor AI integration
✅ **Production-ready features** - Rate limiting, health checks, batch processing
✅ **Docker ready** - Easy deployment
✅ **Cost effective** - No OpenAI API needed

Your setup is actually **better than most SaaS solutions** because you have multiple AI providers and a robust MCP implementation! 