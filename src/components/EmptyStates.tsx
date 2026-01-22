import React from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Users, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      
      {actionLabel && (actionHref || onAction) && (
        <div className="mb-4">
          {actionHref ? (
            <Link to={actionHref}>
              <Button className="flex items-center gap-2">
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} className="flex items-center gap-2">
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export const WelcomeDashboard: React.FC<{ userName: string }> = ({ userName }) => {
  const setupSteps = [
    {
      id: 1,
      title: 'Test Live Chat',
      description: 'Try out the chat interface and see how it works',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/live-chat',
      completed: false
    },
    {
      id: 2,
      title: 'Upload Knowledge Base',
      description: 'Add documents and FAQs to train your AI',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/knowledge-base',
      completed: false
    },
    {
      id: 3,
      title: 'Customize Widget',
      description: 'Personalize your chat widget appearance',
      icon: <Settings className="h-5 w-5" />,
      href: '/widget-customization',
      completed: false
    },
    {
      id: 4,
      title: 'Deploy to Website',
      description: 'Get your embed code and go live',
      icon: <Rocket className="h-5 w-5" />,
      href: '/settings',
      completed: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to ClientSphere, {userName}! 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              You're just a few steps away from having an AI-powered customer support system. 
              Let's get you set up in under 5 minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/live-chat">
                <Button size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Try Live Chat
                </Button>
              </Link>
              <Link to="/knowledge-base">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Upload Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Quick Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {setupSteps.map((step) => (
              <Link 
                key={step.id} 
                to={step.href}
                className="group block"
              >
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary">
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {step.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Empty State */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-sm text-gray-500">Conversations</p>
            <p className="text-xs text-gray-400 mt-1">Start chatting to see data</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">-</div>
            <p className="text-sm text-gray-500">Response Time</p>
            <p className="text-xs text-gray-400 mt-1">Will show after first chat</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xs text-gray-400 mt-1">Deploy widget to track users</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📚 Documentation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Learn how to set up and customize your chat bot
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                View Docs →
              </a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💬 Support Chat</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get help from our team via our own chat widget
              </p>
              <a href="#" className="text-sm text-primary hover:underline">
                Chat with Us →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Empty state for specific pages
export const EmptyConversations: React.FC = () => (
  <EmptyState
    icon={<MessageSquare className="h-8 w-8" />}
    title="No conversations yet"
    description="Your chat conversations will appear here once users start interacting with your bot."
    actionLabel="Test Live Chat"
    actionHref="/live-chat"
  />
);

export const EmptyKnowledgeBase: React.FC = () => (
  <EmptyState
    icon={<BookOpen className="h-8 w-8" />}
    title="Build your knowledge base"
    description="Upload documents, FAQs, and guides to train your AI assistant and improve response accuracy."
    actionLabel="Upload First Document"
    actionHref="/knowledge-base"
  />
);

export const EmptyAnalytics: React.FC = () => (
  <EmptyState
    icon={<BarChart3 className="h-8 w-8" />}
    title="No analytics data yet"
    description="Analytics and insights will appear here after your chat bot starts handling conversations."
    actionLabel="View Live Chat"
    actionHref="/live-chat"
  />
); 