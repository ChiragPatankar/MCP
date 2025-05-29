import React from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import ChatInterface from '@/components/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, CheckCircle } from 'lucide-react';

const LiveChatTestPage: React.FC = () => {
  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Chat Test</h2>
          <p className="text-muted-foreground mt-1">Test your AI support bot powered by Google Gemini.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
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

            <Card>
              <CardHeader>
                <CardTitle>Quick Test Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    "What are your pricing plans?"
                  </div>
                  <div className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    "How do I reset my password?"
                  </div>
                  <div className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    "Tell me about your services"
                  </div>
                  <div className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    "I need help with integration"
                  </div>
                  <div className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    "What languages do you support?"
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Click any question above to copy it, then paste into the chat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default LiveChatTestPage; 