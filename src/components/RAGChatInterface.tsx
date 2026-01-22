import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import RAGClient, { ChatResponse, Citation } from '@/api/ragClient';
import { useToast } from '@/components/ToastContainer';
import { Button } from '@/components/ui/button';
import CitationList, { UICitation } from '@/components/CitationList';
import ConfidenceBadge from '@/components/ConfidenceBadge';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: Citation[];
  confidence?: number;
  refused?: boolean;
  refusal_reason?: string;
}

interface RAGChatInterfaceProps {
  className?: string;
  welcomeMessage?: string;
  placeholder?: string;
  height?: string;
  kbId?: string;
}

const RAGChatInterface: React.FC<RAGChatInterfaceProps> = ({
  className = '',
  welcomeMessage = "Hello! I'm your AI support assistant powered by RAG. Ask me anything from your knowledge base!",
  placeholder = "Ask a question...",
  height = "h-[600px]",
  kbId = 'default',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { success, error } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await RAGClient.chat(question, kbId, conversationId);

      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: 'bot',
        timestamp: new Date(),
        citations: response.citations,
        confidence: response.confidence,
        refused: response.refused,
        refusal_reason: response.refusal_reason,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (response.refused) {
        error(response.refusal_reason || 'Answer was refused due to low confidence');
      } else if (response.citations.length > 0) {
        success(`Answer generated with ${response.citations.length} citation(s)`);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      
      let errorMessage = 'Failed to get response';
      if (err.response?.status === 402) {
        errorMessage = 'AI quota exceeded. Please upgrade your plan.';
        error(errorMessage);
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
        error(errorMessage);
      } else {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
        error(errorMessage);
      }

      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${height} ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* RAG metadata for bot messages */}
              {message.sender === 'bot' && (
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-2 text-xs">
                  {/* Refusal state */}
                  {message.refused && (
                    <div className="flex flex-col gap-2 rounded-md bg-amber-50 border border-amber-200 p-2 text-amber-800">
                      <div className="flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        <span>Answer limited for safety</span>
                      </div>
                      {message.refusal_reason && (
                        <p className="text-[11px] text-amber-800/90">
                          {message.refusal_reason}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 px-2 text-[11px] border-amber-300 text-amber-800 bg-white"
                          onClick={() => {
                            window.location.href =
                              'mailto:support@clientsphere.com?subject=AI%20assistance%20needed';
                          }}
                        >
                          Contact Support
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-6 px-2 text-[11px] text-amber-800 underline"
                          onClick={() => {
                            window.location.href = '/contact-support';
                          }}
                        >
                          Create Ticket
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Confidence badge */}
                  <ConfidenceBadge confidence={message.confidence} />

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <CitationList
                      className="pt-1"
                      citations={message.citations as unknown as UICitation[]}
                    />
                  )}
                </div>
              )}
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="btn-modern"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RAGChatInterface;

