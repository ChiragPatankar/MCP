import express from 'express';
import { database } from '../db/database';

const router = express.Router();

// Get widget configuration
router.get('/config/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Get tenant info
    const tenant = await database.get(
      'SELECT id, name, plan FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Get widget configuration
    const config = await database.get(
      'SELECT config FROM widget_configs WHERE tenant_id = ?',
      [tenantId]
    );

    const defaultConfig = {
      theme: {
        primaryColor: '#6366f1',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderRadius: '12px'
      },
      position: {
        bottom: '20px',
        right: '20px'
      },
      size: 'medium',
      welcome: {
        title: `Hi! I'm ${tenant.name}'s AI assistant`,
        message: 'How can I help you today?',
        showAvatar: true
      },
      features: {
        fileUpload: false,
        typing: true,
        ratings: true
      }
    };

    const widgetConfig = config ? 
      { ...defaultConfig, ...JSON.parse(config.config) } : 
      defaultConfig;

    res.json({
      tenantId,
      config: widgetConfig
    });
  } catch (error) {
    console.error('Get widget config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get widget script
router.get('/script/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify tenant exists
    const tenant = await database.get(
      'SELECT id FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const script = `
(function() {
  // ClientSphere Chat Widget
  const TENANT_ID = '${tenantId}';
  const API_URL = '${process.env.FRONTEND_URL || 'http://localhost:3001'}/api';
  
  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'clientsphere-chat-widget';
  widget.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 10000;
    display: none;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border: 1px solid #e5e7eb;
  \`;

  // Create chat button
  const button = document.createElement('div');
  button.id = 'clientsphere-chat-button';
  button.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    transition: transform 0.2s ease;
  \`;
  
  button.innerHTML = \`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  \`;

  button.onmouseover = () => button.style.transform = 'scale(1.05)';
  button.onmouseout = () => button.style.transform = 'scale(1)';

  // Widget header
  const header = document.createElement('div');
  header.style.cssText = \`
    padding: 16px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  \`;
  
  header.innerHTML = \`
    <div>
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Chat Support</h3>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">We're here to help!</p>
    </div>
    <button id="clientsphere-close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px;">×</button>
  \`;

  // Messages container
  const messages = document.createElement('div');
  messages.id = 'clientsphere-messages';
  messages.style.cssText = \`
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  \`;

  // Input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = \`
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  \`;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your message...';
  input.style.cssText = \`
    flex: 1;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
  \`;

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.style.cssText = \`
    padding: 12px 16px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  \`;

  // Assemble widget
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  widget.appendChild(header);
  widget.appendChild(messages);
  widget.appendChild(inputContainer);

  // Add to page
  document.body.appendChild(button);
  document.body.appendChild(widget);

  // Session management
  let sessionToken = null;
  let isVisible = false;

  // Toggle widget
  function toggleWidget() {
    isVisible = !isVisible;
    widget.style.display = isVisible ? 'flex' : 'none';
    button.style.display = isVisible ? 'none' : 'flex';
    
    if (isVisible && !sessionToken) {
      initializeSession();
    }
  }

  // Initialize chat session
  async function initializeSession() {
    try {
      const response = await fetch(\`\${API_URL}/chat/sessions\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: TENANT_ID,
          domain: window.location.hostname,
          userAgent: navigator.userAgent
        })
      });
      
      const data = await response.json();
      sessionToken = data.sessionToken;
      
      // Add welcome message
      addMessage('ai', 'Hello! How can I help you today?');
    } catch (error) {
      console.error('Failed to initialize session:', error);
      addMessage('ai', 'Sorry, I\\'m having trouble connecting. Please try again later.');
    }
  }

  // Send message
  async function sendMessage(message) {
    if (!sessionToken || !message.trim()) return;

    addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    const typingEl = addMessage('ai', 'Typing...', true);
    
    try {
      const response = await fetch(\`\${API_URL}/chat/messages\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          message,
          tenantId: TENANT_ID
        })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      typingEl.remove();
      
      // Add AI response with optional RAG metadata
      addMessage('ai', data.response, false, data.rag || null);
      
    } catch (error) {
      typingEl.remove();
      addMessage('ai', 'Sorry, I encountered an error. Please try again.');
    }
  }

  // Add message to chat
  function addMessage(sender, text, isTyping = false, rag = null) {
    const isAi = sender === 'ai';
    const isRefused = !!(rag && rag.refused);

    const messageEl = document.createElement('div');
    messageEl.style.cssText = \`
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      \${sender === 'user' ? 
        'background: #6366f1; color: white; align-self: flex-end; margin-left: auto;' : 
        isRefused
          ? 'background: #FEF3C7; color: #92400E; align-self: flex-start; border: 1px solid #FBBF24;'
          : 'background: #f3f4f6; color: #374151; align-self: flex-start;'
      }
      \${isTyping ? 'opacity: 0.7; font-style: italic;' : ''}
    \`;
    
    const contentEl = document.createElement('div');
    contentEl.textContent = text;
    messageEl.appendChild(contentEl);

    // RAG metadata (citations, confidence, refusal)
    if (isAi && !isTyping && rag) {
      const metaContainer = document.createElement('div');
      metaContainer.style.cssText = 'margin-top: 8px; border-top: 1px solid rgba(209,213,219,0.7); padding-top: 8px;';

      // Confidence badge
      if (typeof rag.confidence === 'number') {
        const badge = document.createElement('span');
        let label = 'Low confidence';
        let bg = '#FEE2E2';
        let color = '#991B1B';

        if (rag.confidence >= 0.50) {
          label = 'Very High confidence';
          bg = '#DCFCE7';
          color = '#166534';
        } else if (rag.confidence >= 0.40) {
          label = 'High confidence';
          bg = '#BBF7D0';
          color = '#14532D';
        } else if (rag.confidence >= 0.30) {
          label = 'Medium confidence';
          bg = '#FEF9C3';
          color = '#92400E';
        }

        badge.textContent = label;
        badge.style.cssText = \`display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; background: \${bg}; color: \${color}; margin-right: 8px;\`;
        metaContainer.appendChild(badge);
      }

      // Refusal state + CTAs
      if (rag.refused) {
        const refusedBadge = document.createElement('span');
        refusedBadge.textContent = 'Answer limited for safety';
        refusedBadge.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;background:#FEF3C7;color:#92400E;margin-right:8px;';
        metaContainer.appendChild(refusedBadge);

        const ctaContainer = document.createElement('div');
        ctaContainer.style.cssText = 'margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;';

        const contactBtn = document.createElement('button');
        contactBtn.textContent = 'Contact Support';
        contactBtn.style.cssText = 'padding:6px 10px;font-size:12px;border-radius:9999px;border:none;background:#6366f1;color:white;cursor:pointer;';
        contactBtn.onclick = () => {
          window.location.href = 'mailto:support@clientsphere.com?subject=AI%20assistance%20needed';
        };

        const ticketBtn = document.createElement('button');
        ticketBtn.textContent = 'Create Ticket';
        ticketBtn.style.cssText = 'padding:6px 10px;font-size:12px;border-radius:9999px;border:1px solid #d1d5db;background:white;color:#374151;cursor:pointer;';
        ticketBtn.onclick = () => {
          window.location.href = '/contact-support';
        };

        ctaContainer.appendChild(contactBtn);
        ctaContainer.appendChild(ticketBtn);
        metaContainer.appendChild(ctaContainer);
      }

      // Citations / sources
      if (Array.isArray(rag.citations) && rag.citations.length > 0) {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = \`Sources (\${rag.citations.length})\`;
        toggleBtn.style.cssText = 'margin-top:6px;font-size:12px;color:#4B5563;text-decoration:underline;background:none;border:none;padding:0;cursor:pointer;';

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-top:6px;padding:8px;border-radius:8px;background:#F9FAFB;max-height:150px;overflow-y:auto;display:none;font-size:12px;';

        rag.citations.forEach(function (c) {
          const item = document.createElement('div');
          item.style.cssText = 'margin-bottom:6px;';

          const title = document.createElement('div');
          title.style.cssText = 'font-weight:500;color:#111827;';
          title.textContent = c.file_name || 'Source';
          if (typeof c.page === 'number') {
            title.textContent += ' (Page ' + c.page + ')';
          }

          const snippet = document.createElement('div');
          snippet.style.cssText = 'color:#4B5563;margin-top:2px;';
          if (c.text_preview) {
            snippet.textContent = c.text_preview;
          }

          item.appendChild(title);
          if (c.text_preview) item.appendChild(snippet);
          panel.appendChild(item);
        });

        let isOpen = false;
        toggleBtn.onclick = () => {
          isOpen = !isOpen;
          panel.style.display = isOpen ? 'block' : 'none';
        };

        metaContainer.appendChild(toggleBtn);
        metaContainer.appendChild(panel);
      }

      if (metaContainer.children.length > 0) {
        messageEl.appendChild(metaContainer);
      }
    }

    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
    
    return messageEl;
  }

  // Event listeners
  button.onclick = toggleWidget;
  header.querySelector('#clientsphere-close-btn').onclick = toggleWidget;
  sendBtn.onclick = () => sendMessage(input.value);
  input.onkeypress = (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  };

  console.log('ClientSphere Chat Widget loaded successfully');
})();
`;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    console.error('Get widget script error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 