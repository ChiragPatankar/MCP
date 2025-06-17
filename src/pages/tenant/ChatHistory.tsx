import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Calendar, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, TrendingUp, Users, Eye, Archive, Download, Bot, Sparkles, Settings, Bell } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Types
interface ChatSession {
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

const StatsCard = ({ icon, title, value, description, gradient, trend }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  gradient: string;
  trend?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-xl`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              <p className="text-sm text-gray-600 font-medium">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          {trend && (
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </div>
              <p className="text-xs text-gray-500">vs last week</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ChatCard = ({ chat, index, onView, onDownload }: { 
  chat: ChatSession; 
  index: number;
  onView: (chatId: string) => void;
  onDownload: (chatId: string) => void;
}) => {
  const getSentimentConfig = (rating?: number) => {
    if (!rating) {
      return { 
        icon: <div className="w-4 h-4 rounded-full bg-gray-400"></div>, 
        color: 'text-gray-600', 
        bg: 'bg-gray-100', 
        text: 'No Rating',
        border: 'border-gray-200'
      };
    }
    if (rating >= 4) {
      return { 
        icon: <ThumbsUp className="h-4 w-4" />, 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        text: 'Positive',
        border: 'border-green-200'
      };
    }
    if (rating <= 2) {
      return { 
        icon: <ThumbsDown className="h-4 w-4" />, 
        color: 'text-red-600', 
        bg: 'bg-red-100', 
        text: 'Negative',
        border: 'border-red-200'
      };
    }
    return { 
      icon: <div className="w-4 h-4 rounded-full bg-yellow-400"></div>, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      text: 'Neutral',
      border: 'border-yellow-200'
    };
  };

  const getSatisfactionStars = (rating?: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 ${rating && i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </div>
    ));
  };

  const sentimentConfig = getSentimentConfig(chat.rating);
  const timeAgo = chat.started_at ? 
    new Date(chat.started_at).toLocaleDateString() : 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Chat Session #{chat.id}
                </h3>
                <p className="text-sm text-gray-500">{chat.session_token.substring(0, 16)}...</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {chat.first_message || 'No message content available'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${sentimentConfig.bg} ${sentimentConfig.color} border ${sentimentConfig.border}`}>
                {sentimentConfig.icon}
                <span>{sentimentConfig.text}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{chat.ended_at ? 'Completed' : 'Active'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span>{chat.message_count} messages</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center space-x-1">
              {getSatisfactionStars(chat.rating)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                chat.resolved 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {chat.resolved ? (
                  <>
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Resolved
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 inline mr-1" />
                    Pending
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onView(chat.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn"
                title="View chat details"
              >
                <Eye className="h-4 w-4 text-gray-600 group-hover/btn:text-primary-600" />
              </button>
              <button 
                onClick={() => onDownload(chat.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn"
                title="Download chat transcript"
              >
                <Download className="h-4 w-4 text-gray-600 group-hover/btn:text-primary-600" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyStateCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full"
  >
    <Card className="bg-white border-2 border-dashed border-gray-200">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Chat History Yet</h3>
        <p className="text-gray-500 mb-8 max-w-md">
          Once customers start chatting with your AI assistant, all conversation history will appear here. 
          You'll be able to review interactions and improve your service.
        </p>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="btn-secondary">
            <Bot className="h-4 w-4 mr-2" />
            Test Chat Widget
          </Button>
          <Button className="btn-modern">
            <Sparkles className="h-4 w-4 mr-2" />
            View Setup Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ChatHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [downloadingChats, setDownloadingChats] = useState<Set<string>>(new Set());

  // Mock notifications for chat history
  const notifications = [
    { id: 1, title: 'New Chat Session', message: 'A customer started a new chat conversation', time: '5 min ago', type: 'info' },
    { id: 2, title: 'Chat Resolved', message: 'Chat session #1234 was successfully resolved', time: '15 min ago', type: 'success' },
    { id: 3, title: 'High Rating', message: 'Received 5-star rating for chat session #1235', time: '1 hour ago', type: 'success' }
  ];

  useEffect(() => {
    const fetchChatHistory = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/chat-history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const data = await response.json();
        setChatHistory(data.conversations || []);

      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat history');
        setChatHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  const filteredChats = chatHistory.filter(chat => {
    const matchesSearch = chat.first_message?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         chat.session_token.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSentiment = !sentimentFilter || 
      (sentimentFilter === 'positive' && chat.rating && chat.rating >= 4) ||
      (sentimentFilter === 'negative' && chat.rating && chat.rating <= 2) ||
      (sentimentFilter === 'neutral' && chat.rating && chat.rating === 3);
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'resolved' && chat.resolved) ||
      (statusFilter === 'pending' && !chat.resolved);

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  const totalChats = chatHistory.length;
  const resolvedChats = chatHistory.filter(chat => chat.resolved).length;
  const averageRating = chatHistory.length > 0 
    ? chatHistory.filter(chat => chat.rating).reduce((sum, chat) => sum + (chat.rating || 0), 0) / 
      chatHistory.filter(chat => chat.rating).length
    : 0;

  const handleViewChat = (chatId: string) => {
    // Navigate to chat details view
    navigate(`/chat-history/${chatId}`);
  };

  const handleDownloadChat = async (chatId: string) => {
    setDownloadingChats(prev => new Set(prev).add(chatId));
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would trigger file download
      console.log(`Downloading chat transcript for session ${chatId}`);
      
      // Create mock download
      const element = document.createElement('a');
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Chat Session ${chatId} Transcript\n\nThis is a mock download of the chat transcript.`);
      element.download = `chat-session-${chatId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Failed to download chat:', error);
    } finally {
      setDownloadingChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-white via-green-50 to-blue-50 border-b border-gray-100 shadow-soft -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Chat History
                  </h1>
                  {chatHistory.length > 0 && (
                    <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full shadow-sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{totalChats} Conversations</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Review all customer conversations and AI assistant interactions to improve your support quality.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
                <Button 
                  onClick={handleSettings}
                  variant="outline" 
                  className="btn-secondary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>

                <div className="relative">
                  <Button
                    onClick={() => setShowNotifications(!showNotifications)}
                    variant="outline"
                    className="btn-secondary relative"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </div>
                    )}
                  </Button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-large z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Chat History Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-500' : 
                                notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Click outside to close notifications */}
            {showNotifications && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
            )}
          </div>

          <div className="px-6">
            {chatHistory.length === 0 ? (
              /* Empty State */
              <EmptyStateCard />
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <StatsCard
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="Total Conversations"
                    value={totalChats.toString()}
                    description="All time chat sessions"
                    gradient="from-blue-500 to-cyan-500"
                    trend="+12%"
                  />
                  <StatsCard
                    icon={<CheckCircle className="h-6 w-6" />}
                    title="Resolved Issues"
                    value={resolvedChats.toString()}
                    description="Successfully completed"
                    gradient="from-green-500 to-emerald-500"
                    trend="+8%"
                  />
                  <StatsCard
                    icon={<Users className="h-6 w-6" />}
                    title="Customer Satisfaction"
                    value={averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'N/A'}
                    description="Average rating"
                    gradient="from-purple-500 to-pink-500"
                    trend="+0.3"
                  />
                  <StatsCard
                    icon={<Bot className="h-6 w-6" />}
                    title="AI Performance"
                    value={`${Math.round((resolvedChats / totalChats) * 100)}%`}
                    description="Resolution rate"
                    gradient="from-orange-500 to-red-500"
                    trend="+5%"
                  />
                </div>
                
                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 mb-8">
                  <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none lg:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <select
                      value={sentimentFilter || ''}
                      onChange={(e) => setSentimentFilter(e.target.value || null)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">All Ratings</option>
                      <option value="positive">Positive (4-5)</option>
                      <option value="neutral">Neutral (3)</option>
                      <option value="negative">Negative (1-2)</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="resolved">Resolved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Chat History Grid */}
                <div className="grid gap-6">
                  {filteredChats.map((chat, index) => (
                    <ChatCard key={chat.id} chat={chat} index={index} onView={handleViewChat} onDownload={handleDownloadChat} />
                  ))}
                </div>

                {filteredChats.length === 0 && chatHistory.length > 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default ChatHistoryPage;