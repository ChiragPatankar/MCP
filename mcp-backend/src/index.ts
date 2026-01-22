import { createClient } from '@supabase/supabase-js'

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    console.log('Worker received request:', request.method, request.url)
    
    const url = new URL(request.url)
    const path = url.pathname
    
    // CORS headers
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-mcp-auth',
    }
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      })
    }
    
    // Initialize Supabase client - temporarily hardcoded for testing
    const SUPABASE_URL = "https://jtkajqhpaqbpwdkmloym.supabase.co"
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0a2FqcWhwYXFicHdka21sb3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODMwMjEsImV4cCI6MjA2NzM1OTAyMX0.aRCRcA5T3W7KRkAjDfugcfdUrR8NYsIrIHKd-xf1xXg"
    const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0a2FqcWhwYXFicHdka21sb3ltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc4MzAyMSwiZXhwIjoyMDY3MzU5MDIxfQ.q3l11UUteFC5V-5a7SeN9LQgS1t3i7OzENEvyTblB6I"
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Supabase configuration missing'
      }), {
        status: 500,
        headers: corsHeaders
      })
    }
    
    // Use service role client for admin operations (bypasses RLS)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Root endpoint
    if (path === '/') {
      return new Response(JSON.stringify({ 
        message: 'ClientSphere API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          chat: '/api/chat (GET, POST)',
          auth: '/auth/signin, /auth/signup',
          upload: '/api/upload (POST)',
          knowledgeBase: '/api/knowledge-base (GET, POST, DELETE)',
          mcpProcess: '/mcp/process (POST)'
        },
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: corsHeaders
      })
    }
    
    // Health check endpoint
    if (path === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: corsHeaders
      })
    }
    
    // Chat endpoints
    if (path === '/api/chat') {
      
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return new Response(JSON.stringify({ 
          error: 'Supabase configuration missing'
        }), {
          status: 500,
          headers: corsHeaders
        })
      }
      
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      
      if (request.method === 'GET') {
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true })
          
          if (error) {
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            data: data || [],
            count: data?.length || 0
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to fetch messages',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
      
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            message?: string;
            user_id?: string;
            user_name?: string;
          }
          
          // Validate required fields
          if (!body.message || !body.user_id) {
            return new Response(JSON.stringify({ 
              error: 'Missing required fields: message, user_id'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          const { data, error } = await supabase
            .from('chat_messages')
            .insert([{
              message: body.message,
              user_id: body.user_id,
              user_name: body.user_name || 'Anonymous',
              created_at: new Date().toISOString()
            }])
            .select()
          
          if (error) {
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            data: data,
            message: 'Message saved successfully'
          }), {
            status: 201,
            headers: corsHeaders
  })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to save message',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // Authentication endpoints
    if (path === '/auth/signup') {
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            name?: string;
            email?: string;
            password?: string;
          }
          
          // Validate required fields
          if (!body.name || !body.email || !body.password) {
            return new Response(JSON.stringify({ 
              error: 'Missing required fields: name, email, password'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // For demo purposes, create a mock user (in production, save to database)
          const mockUser = {
            id: Date.now().toString(),
            name: body.name,
            email: body.email,
            created_at: new Date().toISOString()
          }
          
          // Generate a simple token (in production, use JWT)
          const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          return new Response(JSON.stringify({ 
            token,
            user: mockUser,
            message: 'User registered successfully'
          }), {
            status: 201,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to register user',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    if (path === '/auth/signin') {
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            email?: string;
            password?: string;
          }
          
          // Validate required fields
          if (!body.email || !body.password) {
            return new Response(JSON.stringify({ 
              error: 'Missing required fields: email, password'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // For demo purposes, create a mock user (in production, verify against database)
          const mockUser = {
            id: Date.now().toString(),
            name: body.email.split('@')[0],
            email: body.email,
            created_at: new Date().toISOString()
          }
          
          // Generate a simple token (in production, use JWT)
          const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          return new Response(JSON.stringify({ 
            token,
            user: mockUser,
            message: 'Login successful'
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to authenticate',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // Google OAuth endpoint
    if (path === '/auth/google') {
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            credential?: string;
          }
          
          if (!body.credential) {
            return new Response(JSON.stringify({ 
              error: 'Missing Google credential token'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // Decode the Google ID token to get user info
          // The credential is a JWT token from Google
          const parts = body.credential.split('.');
          if (parts.length !== 3) {
            return new Response(JSON.stringify({ 
              error: 'Invalid Google token format'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // Decode the payload (middle part of JWT)
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          
          const googleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            picture: payload.picture,
            email_verified: payload.email_verified
          }
          
          // Check if user exists in database or create new one
          const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('email', googleUser.email)
            .single();
          
          let user;
          if (existingUser) {
            user = existingUser;
          } else {
            // Create new user profile
            const { data: newUser, error: createError } = await supabaseAdmin
              .from('profiles')
              .insert([{
                email: googleUser.email,
                full_name: googleUser.name,
                avatar_url: googleUser.picture,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select()
              .single();
            
            if (createError) {
              console.log('Profile creation error (may already exist):', createError.message);
              // User might already exist, just continue
            }
            user = newUser || { email: googleUser.email, full_name: googleUser.name };
          }
          
          // Generate auth token
          const token = `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          return new Response(JSON.stringify({ 
            token,
            user: {
              id: user?.id || googleUser.id,
              name: googleUser.name,
              email: googleUser.email,
              avatar: googleUser.picture,
              created_at: user?.created_at || new Date().toISOString()
            },
            message: 'Google authentication successful'
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          console.error('Google auth error:', error);
          return new Response(JSON.stringify({ 
            error: 'Google authentication failed',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // MCP Process endpoint (for chat integration)
    if (path === '/mcp/process') {
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            query?: string;
            sessionId?: string;
            userId?: string;
          }
          
          if (!body.query) {
            return new Response(JSON.stringify({ 
              error: 'Missing required field: query'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // Fetch knowledge base to provide context (filtered by user if provided)
          let kbQuery = supabaseAdmin
            .from('knowledge_base')
            .select('name, type, source, content, size')
            .eq('status', 'active')
            .limit(10);
          
          // Filter by user_id if provided
          if (body.userId) {
            kbQuery = kbQuery.eq('user_id', body.userId);
          }
          
          const { data: knowledgeBase } = await kbQuery;
          
          // Build context from knowledge base as a Dict object (not string)
          const contextData: any = {
            knowledge_base: [],
            user_session: {
              sessionId: body.sessionId,
              userId: body.userId
            }
          };
          
          if (knowledgeBase && knowledgeBase.length > 0) {
            contextData.knowledge_base = knowledgeBase.map(doc => ({
              name: doc.name,
              type: doc.type,
              source: doc.source,
              content: doc.content ? doc.content.substring(0, 500) : null
            }));
          }
          
          // Smart AI-like response system using knowledge base
          let response: string;
          const query = body.query.toLowerCase();
          
          if (knowledgeBase && knowledgeBase.length > 0) {
            const docNames = knowledgeBase.map(d => d.name).join(', ');
            
            // Greeting responses
            if (query.match(/\b(hi|hello|hey|greetings)\b/)) {
              response = `Hello! 👋 I'm your AI support assistant. I have access to ${knowledgeBase.length} documents in the knowledge base: ${docNames}. How can I help you today?`;
            }
            // Document listing queries
            else if (query.includes('what') && (query.includes('document') || query.includes('file') || query.includes('pdf') || query.includes('have'))) {
              response = `I have access to the following ${knowledgeBase.length} documents:\n\n${knowledgeBase.map((d, i) => `${i + 1}. **${d.name}** (${d.type}) - ${d.source}`).join('\n')}\n\nFeel free to ask me about any of these documents!`;
            }
            // Specific document queries - CHECK THIS FIRST before help (to avoid "support" triggering help)
            else if (knowledgeBase.some(doc => {
              const normalizedQuery = query.replace(/[_\s-]/g, '').toLowerCase();
              const normalizedDocName = doc.name.replace(/[_\s-]/g, '').toLowerCase();
              return normalizedQuery.includes(normalizedDocName) || normalizedDocName.includes(normalizedQuery.split(' ').find(word => word.length > 3) || '');
            })) {
              const matchedDoc = knowledgeBase.find(doc => {
                const normalizedQuery = query.replace(/[_\s-]/g, '').toLowerCase();
                const normalizedDocName = doc.name.replace(/[_\s-]/g, '').toLowerCase();
                return normalizedQuery.includes(normalizedDocName) || normalizedDocName.includes(normalizedQuery.split(' ').find(word => word.length > 3) || '');
              })!;
              
              if (matchedDoc.content) {
                // If we have content, show a substantial preview or summary
                const contentLength = matchedDoc.content.length;
                let preview = '';
                
                // For summarize/details queries, show more content
                if (query.includes('summarize') || query.includes('summary') || query.includes('about') || query.includes('detail')) {
                  preview = matchedDoc.content.substring(0, 800);
                  if (contentLength > 800) preview += '...';
                  
                  response = `📄 **${matchedDoc.name}** - Summary\n\n${preview}\n\n---\n📊 Document Info:\n• Type: ${matchedDoc.type.toUpperCase()}\n• Source: ${matchedDoc.source}\n• Size: ${matchedDoc.size || 'Unknown'} MB\n• Total Length: ${contentLength} characters\n\nThis is a summary of the document. Would you like me to focus on a specific section?`;
                } else {
                  // Regular query - show first 500 chars
                  preview = matchedDoc.content.substring(0, 500);
                  if (contentLength > 500) preview += '...';
                  
                  response = `📄 **${matchedDoc.name}**\n\n${preview}\n\n---\n📊 Info: ${matchedDoc.type.toUpperCase()} • ${matchedDoc.size || '?'} MB • ${contentLength} characters\n\nWhat specific information from this document are you looking for?`;
                }
              } else {
                // No content available
                response = `📄 **${matchedDoc.name}**\n\nType: ${matchedDoc.type.toUpperCase()}\nSource: ${matchedDoc.source}\n${matchedDoc.size ? `Size: ${matchedDoc.size} MB\n` : ''}\n⚠️ Content not yet extracted. The document exists but its text content hasn't been processed yet. Try re-uploading it to extract the text.`;
              }
            }
            // Help requests - CHECK THIS AFTER specific documents
            else if (query.includes('help') || query.includes('assist')) {
              response = `I'm here to assist you! I can help you with:\n\n✅ Information from ${knowledgeBase.length} documents in my knowledge base\n✅ General questions about our services\n✅ Technical support inquiries\n\nAvailable documents: ${docNames}\n\nWhat would you like to know?`;
            }
            // Pricing/cost queries
            else if (query.includes('pric') || query.includes('cost') || query.includes('plan')) {
              response = `I can help with pricing information! Based on the documents in my knowledge base (${docNames}), I can provide details about our pricing plans. Could you please specify which service or product you're interested in?`;
            }
            // Technical/integration queries  
            else if (query.includes('integrat') || query.includes('api') || query.includes('technical')) {
              response = `I can assist with technical and integration questions! I have ${knowledgeBase.length} technical documents available. The relevant documents are: ${docNames}. What specific aspect of integration or technical setup are you asking about?`;
            }
            // Generic query with context
            else {
              response = `I understand you're asking about: "${body.query}"\n\nI have ${knowledgeBase.length} documents that might help:\n${knowledgeBase.map((d, i) => `${i + 1}. ${d.name}`).join('\n')}\n\nCould you please be more specific about which document or topic you'd like to learn about? Or I can provide general information if you tell me more about what you need.`;
            }
          } else {
            response = `Hello! I'm your AI support assistant. Currently, there are no documents in the knowledge base. Please upload some documents first, and I'll be able to help you with information from them. In the meantime, feel free to ask me general questions!`;
          }
          
          return new Response(JSON.stringify({ 
            response,
            sessionId: body.sessionId,
            userId: body.userId,
            timestamp: new Date().toISOString(),
            knowledgeBaseUsed: knowledgeBase?.length || 0
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to process MCP request',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // File Upload endpoint
    if (path === '/api/upload') {
      if (request.method === 'POST') {
        try {
          // Note: Cloudflare Workers have limitations with file uploads
          // For now, we'll simulate the upload process
          const contentType = request.headers.get('content-type') || ''
          
          if (!contentType.includes('multipart/form-data')) {
            return new Response(JSON.stringify({ 
              error: 'Content-Type must be multipart/form-data'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // Simulate file processing
          const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          // In a real implementation, you would:
          // 1. Parse the multipart form data
          // 2. Extract the file
          // 3. Upload to Cloudflare R2 or another storage service
          // 4. Process the file (extract text, etc.)
          // 5. Store metadata in Supabase
          
          return new Response(JSON.stringify({ 
            uploadId,
            status: 'processing',
            message: 'File upload initiated successfully',
            timestamp: new Date().toISOString()
          }), {
            status: 201,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to upload file',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // Knowledge Base endpoints
    if (path === '/api/knowledge-base') {
      if (request.method === 'GET') {
        try {
          // Get user_id from query params for filtering
          const userId = url.searchParams.get('user_id');
          
          // Build query - filter by user_id if provided
          let query = supabaseAdmin
            .from('knowledge_base')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Filter by user_id if provided
          if (userId) {
            query = query.eq('user_id', userId);
          }
          
          const { data, error } = await query
          
          if (error) {
            // Handle specific error codes
            if (error.code === '42P01' || error.message.includes('1016')) {
              return new Response(JSON.stringify({ 
                error: 'Database setup required',
                details: 'The knowledge_base table does not exist. Please run the database schema setup.',
                setupRequired: true,
                sqlFile: 'supabase_schema_fix.sql'
              }), {
                status: 503, // Service Unavailable
                headers: corsHeaders
              })
            }
            
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message,
              code: error.code
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            data: data || [],
            count: data?.length || 0
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to fetch knowledge base',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
      
      if (request.method === 'POST') {
        try {
          const body = await request.json() as {
            name?: string;
            type?: string;
            source?: string;
            tenant_id?: string;
            user_id?: string;
            size?: number;
            content?: string;
          }
          
          if (!body.name || !body.type || !body.source) {
            return new Response(JSON.stringify({ 
              error: 'Missing required fields: name, type, source'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          // Use user_id for document isolation (each user has their own documents)
          const userId = body.user_id || body.tenant_id || null;
          
          // For tenant_id, use a default tenant (for database schema compatibility)
          let tenantId: string;
          
          // Try to find or create a default tenant
          const { data: existingTenant, error: tenantError } = await supabaseAdmin
            .from('tenants')
            .select('id')
            .eq('name', 'Default Tenant')
            .single();
          
          if (existingTenant) {
            tenantId = existingTenant.id;
          } else {
            // Create default tenant
            const { data: newTenant, error: createError } = await supabaseAdmin
              .from('tenants')
              .insert([{
                name: 'Default Tenant',
                domain: 'default.local'
              }])
              .select('id')
              .single();
            
            if (createError || !newTenant) {
              // If tenant creation fails, generate a random UUID for demo
              tenantId = crypto.randomUUID();
            } else {
              tenantId = newTenant.id;
            }
          }
          
          const { data, error } = await supabaseAdmin
            .from('knowledge_base')
            .insert([{
              name: body.name,
              type: body.type,
              source: body.source,
              tenant_id: tenantId,
              user_id: userId, // Store user_id for document isolation
              size: body.size || 0,
              status: body.content ? 'active' : 'processing', // Active if content provided, otherwise processing
              content: body.content || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
          
          if (error) {
            // Handle specific error codes
            if (error.code === '42P01' || error.message.includes('1016')) {
              return new Response(JSON.stringify({ 
                error: 'Database setup required',
                details: 'The knowledge_base table does not exist. Please run the database schema setup.',
                setupRequired: true,
                sqlFile: 'supabase_schema_fix.sql'
              }), {
                status: 503, // Service Unavailable
                headers: corsHeaders
              })
            }
            
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message,
              code: error.code
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            data: data,
            message: 'Knowledge base entry created successfully'
          }), {
            status: 201,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to create knowledge base entry',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
      
      if (request.method === 'PATCH') {
        try {
          const body = await request.json() as {
            id?: string;
            status?: string;
            content?: string;
          }
          
          if (!body.id) {
            return new Response(JSON.stringify({ 
              error: 'Missing required field: id'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          const updateData: any = { updated_at: new Date().toISOString() };
          if (body.status) updateData.status = body.status;
          if (body.content !== undefined) updateData.content = body.content;
          
          const { data, error } = await supabaseAdmin
            .from('knowledge_base')
            .update(updateData)
            .eq('id', body.id)
            .select()
          
          if (error) {
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            data,
            message: 'Knowledge base entry updated successfully'
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to update knowledge base entry',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
      
      if (request.method === 'DELETE') {
        try {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          
          if (!id) {
            return new Response(JSON.stringify({ 
              error: 'Missing required parameter: id'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }
          
          const { error } = await supabaseAdmin
            .from('knowledge_base')
            .delete()
            .eq('id', id)
          
          if (error) {
            // Handle specific error codes
            if (error.code === '42P01' || error.message.includes('1016')) {
              return new Response(JSON.stringify({ 
                error: 'Database setup required',
                details: 'The knowledge_base table does not exist. Please run the database schema setup.',
                setupRequired: true,
                sqlFile: 'supabase_schema_fix.sql'
              }), {
                status: 503, // Service Unavailable
                headers: corsHeaders
              })
            }
            
            return new Response(JSON.stringify({ 
              error: 'Database error',
              details: error.message,
              code: error.code
            }), {
              status: 500,
              headers: corsHeaders
            })
          }
          
          return new Response(JSON.stringify({ 
            message: 'Knowledge base entry deleted successfully'
          }), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Failed to delete knowledge base entry',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }
    }
    
    // Analytics endpoints
    if (path.startsWith('/api/analytics')) {
      if (path === '/api/analytics/metrics') {
        if (request.method === 'GET') {
          // Return mock analytics data for now
          return new Response(JSON.stringify({ 
            totalConversations: 0,
            thisMonthConversations: 0,
            averageRating: 0,
            resolutionRate: 0,
            knowledgeBaseDocuments: 0
          }), {
            status: 200,
            headers: corsHeaders
          })
        }
      }
      
      if (path === '/api/analytics/chat-history') {
        if (request.method === 'GET') {
          // Return mock chat history for now
          return new Response(JSON.stringify({ 
            conversations: []
          }), {
            status: 200,
            headers: corsHeaders
          })
        }
      }
    }
    
    // Default 404 response
    return new Response(JSON.stringify({ 
      error: 'Not found',
      path: path,
      method: request.method
    }), {
    status: 404,
      headers: corsHeaders
  })
  }
}