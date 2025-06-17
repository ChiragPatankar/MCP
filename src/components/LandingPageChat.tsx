import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LandingPageChatProps {
  className?: string;
}

// Platform knowledge base for the demo chatbot
const PLATFORM_CONTEXT = {
  company: "MCP Chat Support",
  description: "AI-powered customer support platform",
  features: [
    "AI chatbot powered by Google Gemini",
    "Knowledge base integration",
    "Widget customization",
    "Real-time analytics",
    "Multi-language support", 
    "24/7 automated responses",
    "Human handoff capability",
    "Easy website integration"
  ],
  pricing: {
    free: "14-day free trial",
    starter: "$29/month - Up to 1,000 conversations",
    pro: "$79/month - Up to 5,000 conversations", 
    enterprise: "$199/month - Unlimited conversations"
  },
  benefits: [
    "Reduce support workload by 70%",
    "24/7 customer support availability",
    "Instant responses to common questions",
    "Easy setup in under 5 minutes",
    "No coding required",
    "Scales with your business"
  ]
};

const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! 👋 Welcome to MCP Chat Support! I'm here to help you learn about our AI-powered customer support platform. What would you like to know?";
  }
  
  // Features
  if (message.includes('feature') || message.includes('what can') || message.includes('capabilities')) {
    return `Our platform offers amazing features:\n\n✨ **AI-Powered Conversations** - Powered by Google Gemini\n📚 **Smart Knowledge Base** - Upload your docs and FAQs\n🎨 **Customizable Widget** - Match your brand perfectly\n📊 **Real-time Analytics** - Track performance and insights\n🌍 **Multi-language Support** - Serve global customers\n🤝 **Human Handoff** - Seamless escalation when needed\n\nWould you like to know more about any specific feature?`;
  }
  
  // Pricing
  if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
    return `Here's our simple pricing structure:\n\n🆓 **Free Trial** - 14 days, full access\n🚀 **Starter** - $29/month (1,000 conversations)\n💼 **Pro** - $79/month (5,000 conversations)\n🏢 **Enterprise** - $199/month (unlimited)\n\nAll plans include AI responses, analytics, and customization. Want to start with our free trial?`;
  }
  
  // Setup/Getting started
  if (message.includes('setup') || message.includes('start') || message.includes('install') || message.includes('integrate')) {
    return `Getting started is super easy! 🎯\n\n1️⃣ **Sign up** for free (takes 30 seconds)\n2️⃣ **Upload your knowledge** (docs, FAQs, website content)\n3️⃣ **Customize your widget** (colors, position, messages)\n4️⃣ **Copy & paste** our embed code to your website\n\nThat's it! Your AI assistant will be live and helping customers immediately. No coding skills required!`;
  }
  
  // Benefits/Why choose
  if (message.includes('benefit') || message.includes('why') || message.includes('advantage')) {
    return `Here's why businesses love MCP Chat Support:\n\n📈 **Reduce workload by 70%** - AI handles routine questions\n⏰ **24/7 availability** - Never miss a customer inquiry\n⚡ **Instant responses** - No more waiting times\n💰 **Cost effective** - Much cheaper than hiring support staff\n📊 **Detailed insights** - Understand your customers better\n🔧 **Easy maintenance** - Updates knowledge base anytime\n\nReady to transform your customer support?`;
  }
  
  // Technical questions
  if (message.includes('gemini') || message.includes('ai') || message.includes('technology')) {
    return `Our AI is powered by Google Gemini, one of the most advanced language models! 🧠\n\n🎯 **High accuracy** - Understanding complex queries\n💬 **Natural conversations** - Feels like talking to a human\n🌐 **Multi-language** - Supports 50+ languages\n📚 **Context-aware** - Remembers conversation history\n🔄 **Continuous learning** - Gets smarter with your content\n\nThe best part? It's completely free to use Gemini's API!`;
  }
  
  // Demo request
  if (message.includes('demo') || message.includes('try') || message.includes('test')) {
    return `You're actually using our demo right now! 🎉\n\nThis chatbot is powered by the same technology you'll get:\n• Real-time AI responses\n• Natural conversation flow\n• Custom knowledge base (I know all about our platform!)\n\nTo see the full admin dashboard and customization options, sign up for our free 14-day trial. No credit card required!`;
  }
  
  // Contact/Support
  if (message.includes('contact') || message.includes('support') || message.includes('help')) {
    return `I'm here to help! 😊\n\n💬 **Chat with me** - Ask anything about our platform\n📧 **Email us** - support@mcpchat.com\n📅 **Book a demo** - Schedule a personal walkthrough\n📚 **Documentation** - Detailed guides and tutorials\n\nWhat specific question do you have? I'd love to help!`;
  }
  
  // Default responses for unclear queries
  const defaultResponses = [
    "That's a great question! Let me help you with that. Could you tell me more about what you're looking for? I can explain our features, pricing, setup process, or benefits.",
    "I'd be happy to help! Are you interested in learning about our AI features, pricing plans, or how to get started?",
    "Thanks for asking! I can provide information about our platform's capabilities, pricing, setup process, or answer any other questions you have about MCP Chat Support."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const LandingPageChat: React.FC<LandingPageChatProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi there! I'm your AI assistant for MCP Chat Support. I can answer questions about our features, pricing, setup process, and more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, Math.random() * 1000 + 500); // 500-1500ms delay for realism
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    "What features do you offer?",
    "How much does it cost?",
    "How do I get started?",
    "Why choose your platform?"
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center transition-colors group"
        >
          <MessageSquare className="h-6 w-6 text-white" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask me about MCP Chat Support!
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`bg-white rounded-lg shadow-2xl border border-gray-200 ${
              isMinimized ? 'h-14' : 'h-[500px]'
            } w-80 flex flex-col`}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 bg-primary text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-2">
                    <p className="font-medium text-sm">MCP Assistant</p>
                    <p className="text-xs opacity-90">Ask me anything!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1">
                            {message.sender === 'user' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
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
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-3 w-3 text-gray-600" />
                          <Loader2 className="h-3 w-3 animate-spin text-gray-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(question)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex-shrink-0 p-3 border-t bg-gray-50 rounded-b-lg">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about features, pricing..."
                      disabled={isLoading}
                      className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageChat; 