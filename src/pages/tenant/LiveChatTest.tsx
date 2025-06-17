import React, { useState } from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import ChatInterface from '@/components/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, CheckCircle, Calendar, Settings, Bell, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LiveChatTestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleQuestionClick = (question: string) => {
    navigator.clipboard.writeText(question).then(() => {
      setCopiedQuestion(question);
      setTimeout(() => setCopiedQuestion(null), 2000);
    });
  };

  const quickQuestions = [
    "What are your pricing plans?",
    "How do I reset my password?", 
    "Tell me about your services",
    "I need help with integration",
    "What languages do you support?"
  ];

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Live Chat Test
                  </h1>
                  <div className="flex items-center bg-green-100 text-green-700 px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">AI Online</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Test your AI support bot powered by Google Gemini. Experience real-time responses and see how your customers will interact with your intelligent assistant.
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Session started</span>
                  </div>
                  <p className="font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
                </div>
                <div className="flex space-x-2 relative">
                  <button 
                    onClick={handleNotificationsClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                  <button 
                    onClick={handleSettingsClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Chat session started</p>
                            <p className="text-xs text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">AI model connected</p>
                            <p className="text-xs text-gray-500">5 minutes ago</p>
                          </div>
                        </div>
                        <div className="text-center py-2">
                          <button className="text-sm text-primary-600 hover:underline">View all</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary-600" />
                      AI Chat Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[600px]">
                      <ChatInterface 
                        welcomeMessage="Hello! I'm your AI support assistant. Ask me anything about our services, pricing, or how I can help your business!"
                        placeholder="Ask me anything..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status & Info */}
              <div className="space-y-6">
                <Card className="bg-white border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary-600" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">AI Server: Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Gemini AI: Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Database: Active</span>
                    </div>
                    <hr className="my-4" />
                    <div className="text-xs text-gray-500">
                      <p><strong>Model:</strong> Google Gemini 1.5 Flash</p>
                      <p><strong>Response Time:</strong> ~2 seconds</p>
                      <p><strong>API Cost:</strong> $0.00 (Free)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                      Test Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Ask about pricing plans</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Request technical support</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Get product information</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Account assistance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>General inquiries</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Quick Test Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {quickQuestions.map((question, index) => (
                        <div 
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                          className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between group"
                        >
                          <span>"{question}"</span>
                          {copiedQuestion === question ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Click any question above to copy it to clipboard.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default LiveChatTestPage; 