import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getEndpointUrl } from '@/config/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
  welcomeMessage?: string;
  placeholder?: string;
  height?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  className = '', 
  welcomeMessage = "Hello! How can I help you today? 👋",
  placeholder = "Type your message...",
  height = "h-[600px]"
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    // For Hugging Face MCP server, we'll use a simplified approach
    // The session token and tenant ID can be generated locally for this demo
    const initializeChat = () => {
      // Generate a simple session token for the demo
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tenantId = user?.id || `tenant_${Math.random().toString(36).substr(2, 9)}`;
      
      setSessionToken(sessionToken);
      setTenantId(tenantId);
      
      console.log('Chat session initialized:', { sessionToken, tenantId });
    };

    initializeChat();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading || !sessionToken || !tenantId) {
      if (!sessionToken || !tenantId) {
        console.error('Chat session not initialized');
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the centralized API configuration
      const response = await fetch(getEndpointUrl('PROCESS'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mcp-auth': 'demo-token', // Add required auth header
        },
        body: JSON.stringify({
          query: userMessage.content, // Use 'query' instead of 'prompt'
          sessionId: sessionToken,
          userId: tenantId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the MCP server response format
      const botResponse = data.response || data.message || data.content || "I received your message but couldn't generate a proper response.";
      
      console.log('MCP Server Response:', data); // For debugging

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm experiencing technical difficulties connecting to the AI server. Please check that the MCP server is running and try again. 🔧",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col card-modern ${height} ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-6 gradient-primary rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="font-semibold text-lg">AI Support Assistant</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-white/90">Online & Ready to Help</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 max-h-full bg-gradient-to-b from-gray-50/50 to-white"
        style={{ 
          scrollBehavior: 'smooth',
          overflowAnchor: 'none'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-soft transition-all duration-300 hover:shadow-medium ${
                message.sender === 'user'
                  ? 'gradient-primary text-white ml-12'
                  : 'bg-white border border-gray-100 text-gray-900 mr-12'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-1 ${
                  message.sender === 'user' ? 'order-2' : 'order-1'
                }`}>
                  {message.sender === 'user' ? (
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className={`flex-1 ${
                  message.sender === 'user' ? 'order-1' : 'order-2'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' 
                      ? 'text-white/70' 
                      : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-soft mr-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 p-6 bg-white border-t border-gray-100 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="input-modern pr-12"
              autoComplete="off"
            />
            {inputMessage.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Zap className="h-4 w-4 text-primary-500" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="btn-modern flex-shrink-0 group relative overflow-hidden"
          >
            <div className="flex items-center">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  <span className="ml-2 hidden sm:inline">Send</span>
                </>
              )}
            </div>
          </button>
        </form>
        
        {/* Quick suggestions for first message */}
        {messages.length === 1 && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-xs text-gray-500 w-full mb-2">Quick suggestions:</p>
            {[
              "How does this work?",
              "What can you help me with?",
              "Tell me about your features"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs px-3 py-2 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-gray-600 transition-all duration-200 hover:shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 