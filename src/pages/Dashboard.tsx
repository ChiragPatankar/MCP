import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, Video, TrendingUp, MessageSquare, Crown, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useDemo } from '../contexts/DemoContext';
import SubscriptionStatus from '../components/SubscriptionStatus';
import DemoRevenueDashboard from '../components/DemoRevenueDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionTier, getRemainingCredits, getSubscriptionBenefits } = usePayment();
  const { isDemoMode, demoUser, demoSessions } = useDemo();

  // Use demo data if in demo mode
  const currentUser = isDemoMode ? demoUser : user;
  const remainingCredits = getRemainingCredits();
  const benefits = getSubscriptionBenefits();

  // If demo mode and user is mentor, show revenue dashboard
  if (isDemoMode && currentUser?.type === 'mentor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoRevenueDashboard />
        </div>
      </div>
    );
  }

  const upcomingSessions = isDemoMode ? demoSessions.filter(s => s.status === 'scheduled').slice(0, 2) : [
    {
      id: 1,
      mentorName: 'Sarah Chen',
      mentorRole: 'Senior Product Manager',
      topic: 'Product Strategy Review',
      time: '2:30 PM Today',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      mentorName: 'Marcus Rodriguez',
      mentorRole: 'Tech Lead',
      topic: 'Code Review Best Practices',
      time: '4:00 PM Today',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const recentSessions = isDemoMode ? demoSessions.filter(s => s.status === 'completed').slice(0, 2) : [
    {
      id: 1,
      name: 'Emily Watson',
      role: 'Marketing Director',
      topic: 'Growth Strategy',
      rating: 5,
      date: 'Yesterday',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'David Kim',
      role: 'UX Designer',
      topic: 'Design System Implementation',
      rating: 5,
      date: '2 days ago',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const stats = currentUser?.type === 'mentor' ? [
    { label: 'Total Sessions', value: '127', icon: <Video className="h-6 w-6 text-primary-500" /> },
    { label: 'Average Rating', value: '4.9', icon: <Star className="h-6 w-6 text-yellow-500" /> },
    { label: 'This Month', value: '23', icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
    { label: 'Active Mentees', value: '45', icon: <Users className="h-6 w-6 text-blue-500" /> }
  ] : [
    { 
      label: 'Sessions Available', 
      value: remainingCredits === -1 ? '∞' : remainingCredits.toString(), 
      icon: <Video className="h-6 w-6 text-primary-500" /> 
    },
    { label: 'Hours Mentored', value: '1.5', icon: <Clock className="h-6 w-6 text-blue-500" /> },
    { label: 'This Month', value: '4', icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
    { label: 'Favorite Topics', value: '3', icon: <MessageSquare className="h-6 w-6 text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {currentUser?.name}!
            </h1>
            {isDemoMode && (
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {currentUser?.type === 'mentor' 
              ? 'Here\'s how your mentoring is going this week' 
              : 'Continue your learning journey with expert guidance'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demo Mode Quick Actions */}
            {isDemoMode && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Play className="h-5 w-5 mr-2 text-purple-500" />
                  Demo Mode Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/demo/experts" 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">View Demo Experts</span>
                  </Link>
                  <button 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Video className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Try Demo Call</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              {currentUser?.type === 'mentor' ? (
                <>
                  <Link 
                    to="/profile-setup" 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-900">Manage Availability</span>
                  </Link>
                  <Link 
                    to="/earnings" 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">View Earnings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/smart-match" 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center space-x-3"
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Smart Match</span>
                  </Link>
                  <Link 
                    to="/discover" 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Find Mentors</span>
                  </Link>
                  {subscriptionTier === 'free' && (
                    <Link 
                      to="/subscription" 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                    >
                      <div className="bg-accent-100 p-2 rounded-lg">
                        <Crown className="h-5 w-5 text-accent-600" />
                      </div>
                      <span className="font-medium text-gray-900">Upgrade to Premium</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <div className="opacity-75">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentUser?.type === 'mentor' ? 'Upcoming Sessions' : 'Your Next Sessions'}
                </h2>
                <Link to="/calendar" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={session.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={isDemoMode ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' : session.avatar} 
                      alt={isDemoMode ? 'Demo Mentor' : session.mentorName} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {isDemoMode ? 'Sarah Chen' : session.mentorName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isDemoMode ? 'Senior Product Manager' : session.mentorRole}
                      </p>
                      <p className="text-sm text-primary-600">
                        {isDemoMode ? 'Product Strategy' : session.topic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {isDemoMode ? 'Today 2:00 PM' : session.time}
                      </p>
                      <button className="text-xs text-primary-600 hover:text-primary-700">
                        Join Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <Link 
                    to="/discover" 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Book a session
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
                <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={session.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={isDemoMode ? 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' : session.avatar} 
                      alt={isDemoMode ? 'Demo Expert' : session.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {isDemoMode ? 'Emily Watson' : session.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isDemoMode ? 'Marketing Director' : session.role}
                      </p>
                      <p className="text-sm text-primary-600">
                        {isDemoMode ? 'Growth Strategy' : session.topic}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(session.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {isDemoMode ? 'Yesterday' : session.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Subscription Status */}
              {currentUser?.type === 'mentee' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Plan
                  </h2>
                  <SubscriptionStatus />
                </div>
              )}

              {/* Quick Tips */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Pro tip:</strong> Prepare specific questions before your session to maximize value.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      <strong>Did you know?</strong> You can book sessions up to 2 weeks in advance.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-purple-800">
                      <strong>Reminder:</strong> Sessions can be cancelled up to 1 hour before start time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Popular Mentors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">🔥 Trending Mentors</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', specialty: 'Product Strategy', rating: 4.9 },
                    { name: 'Marcus Rodriguez', specialty: 'Tech Leadership', rating: 4.8 },
                    { name: 'Emily Watson', specialty: 'Growth Marketing', rating: 5.0 }
                  ].map((mentor, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {mentor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{mentor.name}</p>
                        <p className="text-xs text-gray-600">{mentor.specialty}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{mentor.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;