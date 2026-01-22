import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Activity,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Clock,
  Target,
  Zap,
  Calendar,
  Globe,
  Settings,
  Bell,
  Filter,
  MoreHorizontal,
  TrendingDown,
  Eye,
  UserCheck,
  Bot
} from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { WelcomeDashboard } from '@/components/EmptyStates';
import { motion } from 'framer-motion';
import { OnboardingForm, ProductTour } from '@/components/onboarding';

// Type definitions for API responses
interface DashboardMetrics {
  totalConversations: number;
  thisMonthConversations: number;
  averageRating: number;
  resolutionRate: number;
  knowledgeBaseDocuments: number;
}

interface Conversation {
  id: string;
  session_token: string;
  started_at: string;
  ended_at?: string;
  resolved: boolean;
  rating?: number;
  feedback?: string;
  first_message?: string;
  message_count: number;
}

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType, 
  gradient,
  description,
  trend 
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  gradient: string;
  description?: string;
  trend?: number[];
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300">
        {/* Background gradient overlay */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-2xl`}></div>
        
        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
              {change && (
                <div className="flex items-center space-x-1">
                  {changeType === 'positive' && <ArrowUp className="h-4 w-4 text-green-500" />}
                  {changeType === 'negative' && <ArrowDown className="h-4 w-4 text-red-500" />}
                  <span className={`text-sm font-medium ${
                    changeType === 'positive' ? 'text-green-600' : 
                    changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              )}
            </div>
            {trend && (
              <div className="flex items-end space-x-1 h-8">
                {trend.map((value, index) => (
                  <div
                    key={index}
                    className={`w-1.5 bg-gradient-to-t ${gradient} rounded-full opacity-60`}
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActivityCard = ({ conversation, index }: { conversation: Conversation; index: number }) => {
  const getSentimentConfig = (rating?: number) => {
    if (!rating) return { color: 'bg-gray-500', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    if (rating >= 4) return { color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' };
    if (rating <= 2) return { color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' };
    return { color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
  };

  const sentimentConfig = getSentimentConfig(conversation.rating);
  const timeAgo = conversation.started_at ? 
    new Date(conversation.started_at).toLocaleDateString() : 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-soft transition-all duration-300 border border-gray-100/50 group-hover:border-primary-200">
        <div className={`w-3 h-3 rounded-full mt-3 ${sentimentConfig.color} shadow-sm`} />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <p className="font-semibold text-gray-900">Session #{conversation.id}</p>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentConfig.bgColor} ${sentimentConfig.textColor}`}>
                {conversation.rating ? `★ ${conversation.rating}` : 'No rating'}
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
              conversation.resolved 
                ? 'bg-green-100 text-green-700 group-hover:bg-green-200' 
                : 'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
            }`}>
              {conversation.resolved ? '✓ Resolved' : '⏳ Pending'}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
            {conversation.first_message || 'No message content'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                {conversation.message_count} messages
              </span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 hover:text-primary-700">
              <Eye className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyStateCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="bg-white border-2 border-dashed border-gray-200">
    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </CardContent>
  </Card>
);

// Onboarding state keys
const ONBOARDING_FORM_KEY = 'clientsphere_onboarding_form_completed';
const PRODUCT_TOUR_KEY = 'clientsphere_product_tour_completed';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Onboarding states
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);

  // Check if user is new (created less than 24 hours ago)
  const isNewUser = user?.createdAt ? 
    (new Date().getTime() - new Date(user.createdAt).getTime()) < 24 * 60 * 60 * 1000 
    : true;

  const hasAnyData = metrics && (
    metrics.totalConversations > 0 || 
    metrics.knowledgeBaseDocuments > 0 || 
    conversations.length > 0
  );
  
  // Check onboarding status on mount
  useEffect(() => {
    if (user) {
      const formCompleted = localStorage.getItem(`${ONBOARDING_FORM_KEY}_${user.id}`);
      const tourCompleted = localStorage.getItem(`${PRODUCT_TOUR_KEY}_${user.id}`);
      
      if (!formCompleted) {
        // Show onboarding form for new users
        setShowOnboardingForm(true);
      } else if (!tourCompleted) {
        // Show product tour after form is completed
        setShowProductTour(true);
      }
    }
  }, [user]);
  
  const handleOnboardingFormComplete = async (data: any) => {
    console.log('📝 Onboarding data:', data);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`${ONBOARDING_FORM_KEY}_${user.id}`, JSON.stringify({
        ...data,
        completedAt: new Date().toISOString()
      }));
    }
    
    // TODO: Optionally save to backend
    // await fetch(`${API_URL}/api/user/profile`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify(data)
    // });
    
    setShowOnboardingForm(false);
    setShowProductTour(true); // Show tour after form
  };
  
  const handleOnboardingFormSkip = () => {
    if (user) {
      localStorage.setItem(`${ONBOARDING_FORM_KEY}_${user.id}`, JSON.stringify({
        skipped: true,
        skippedAt: new Date().toISOString()
      }));
    }
    setShowOnboardingForm(false);
    setShowProductTour(true); // Still show tour
  };
  
  const handleProductTourComplete = () => {
    if (user) {
      localStorage.setItem(`${PRODUCT_TOUR_KEY}_${user.id}`, JSON.stringify({
        completedAt: new Date().toISOString()
      }));
    }
    setShowProductTour(false);
  };
  
  const handleProductTourSkip = () => {
    if (user) {
      localStorage.setItem(`${PRODUCT_TOUR_KEY}_${user.id}`, JSON.stringify({
        skipped: true,
        skippedAt: new Date().toISOString()
      }));
    }
    setShowProductTour(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        // For now, set mock data since analytics endpoints aren't implemented yet
        // TODO: Implement /api/analytics/metrics and /api/analytics/chat-history endpoints
        setMetrics({
          totalConversations: 0,
          thisMonthConversations: 0,
          averageRating: 0,
          resolutionRate: 0,
          knowledgeBaseDocuments: 0
        });
        setConversations([]);
        
        // Uncomment when backend analytics endpoints are ready:
        // const metricsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/metrics`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const conversationsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/chat-history?limit=5`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        // Set empty data for new users
        setMetrics({
          totalConversations: 0,
          thisMonthConversations: 0,
          averageRating: 0,
          resolutionRate: 0,
          knowledgeBaseDocuments: 0
        });
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      {/* Onboarding Form Modal */}
      {showOnboardingForm && (
        <OnboardingForm
          initialName={user?.name}
          initialEmail={user?.email}
          onComplete={handleOnboardingFormComplete}
          onSkip={handleOnboardingFormSkip}
        />
      )}
      
      {/* Product Tour Modal */}
      {showProductTour && (
        <ProductTour
          onComplete={handleProductTourComplete}
          onSkip={handleProductTourSkip}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    {isNewUser || !hasAnyData ? 'Welcome!' : 'Dashboard'}
                  </h1>
                  {hasAnyData && (
                    <div className="flex items-center bg-green-100 text-green-700 px-3 py-1.5 rounded-full shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">All Systems Active</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {isNewUser || !hasAnyData
                    ? `Let's get your AI assistant set up, ${user?.name}! Your journey to automated customer support starts here.` 
                    : `Here's what's happening with your AI support system, ${user?.name}. Everything is running smoothly.`
                  }
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Last updated</span>
                  </div>
                  <p className="font-semibold text-gray-900">{new Date().toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Show welcome dashboard for new users or users with no data */}
            {(isNewUser || !hasAnyData) ? (
              <WelcomeDashboard userName={user?.name || 'User'} />
            ) : (
              /* Existing dashboard for users with data */
              <>
                {/* Enhanced KPI Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <DashboardCard 
                    title="Total Conversations" 
                    value={metrics?.totalConversations?.toString() || "0"} 
                    icon={<MessageSquare className="h-6 w-6" />} 
                    change={metrics?.thisMonthConversations ? `+${metrics.thisMonthConversations} this month` : undefined}
                    changeType="positive"
                    gradient="from-blue-500 to-cyan-500"
                    description="All time conversations"
                  />
                  <DashboardCard 
                    title="Avg. Response Time" 
                    value="< 1 min" 
                    icon={<Zap className="h-6 w-6" />}
                    change="AI-powered"
                    changeType="positive"
                    gradient="from-green-500 to-emerald-500"
                    description="Instant AI responses"
                  />
                  <DashboardCard 
                    title="Resolution Rate" 
                    value={metrics?.resolutionRate ? `${Math.round(metrics.resolutionRate)}%` : "0%"} 
                    icon={<Target className="h-6 w-6" />}
                    change={metrics?.averageRating ? `★ ${metrics.averageRating.toFixed(1)} avg rating` : undefined}
                    changeType="positive"
                    gradient="from-purple-500 to-pink-500"
                    description="Customer satisfaction"
                  />
                  <DashboardCard 
                    title="Knowledge Base" 
                    value={`${metrics?.knowledgeBaseDocuments || 0} docs`} 
                    icon={<FileText className="h-6 w-6" />}
                    change={metrics?.knowledgeBaseDocuments ? "AI training active" : "Add documents to start"}
                    changeType="neutral"
                    gradient="from-orange-500 to-red-500"
                    description="Training documents"
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Recent Conversations */}
                  <div className="lg:col-span-2">
                    <Card className="bg-white border-0 shadow-soft">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-primary-600" />
                            Recent Conversations
                          </CardTitle>
                          <p className="text-gray-500 mt-1">Latest customer interactions across all channels</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {conversations.length > 0 ? (
                          <div className="space-y-1 p-6">
                            {conversations.map((conversation, index) => (
                              <ActivityCard key={conversation.id} conversation={conversation} index={index} />
                            ))}
                          </div>
                        ) : (
                          <div className="p-8">
                            <EmptyStateCard 
                              title="No conversations yet"
                              description="Conversations will appear here once customers start chatting with your AI assistant."
                              icon={<MessageSquare className="h-6 w-6 text-gray-400" />}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats & System Status */}
                  <div className="space-y-6">
                    {/* System Status */}
                    <Card className="bg-white border-0 shadow-soft">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                          <Bot className="h-5 w-5 mr-2 text-primary-600" />
                          AI Assistant Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-900">AI Assistant</span>
                          </div>
                          <span className="text-green-600 text-sm font-medium">Online</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-900">Chat Widget</span>
                          </div>
                          <span className="text-green-600 text-sm font-medium">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-blue-900">Knowledge Base</span>
                          </div>
                          <span className="text-blue-600 text-sm font-medium">
                            {metrics?.knowledgeBaseDocuments || 0} docs
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-white border-0 shadow-soft">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium">Add Knowledge Base Document</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                          <Settings className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium">Configure Chat Widget</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                          <BarChart3 className="h-4 w-4 text-primary-600" />
                          <span className="text-sm font-medium">View Full Analytics</span>
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default Dashboard;