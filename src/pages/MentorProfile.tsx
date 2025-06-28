import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Video, Calendar, MessageSquare, Shield, Award, CheckCircle, ArrowRight, DollarSign, Users, TrendingUp } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import SessionPaymentModal from '../components/SessionPaymentModal';
import PaywallModal from '../components/PaywallModal';

const MentorProfile: React.FC = () => {
  const { id } = useParams();
  const { canBookSession, subscriptionTier } = usePayment();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Mock mentor data (in real app, would fetch based on ID)
  const mentor = {
    id: id || '1',
    name: 'Sarah Chen',
    title: 'Senior Product Manager at Google',
    bio: 'I\'m a product manager with 8+ years of experience building consumer and enterprise products that serve millions of users. I\'ve led cross-functional teams at Google, launched 5 major product features, and helped dozens of professionals transition into product management. I specialize in product strategy, user research, data-driven decision making, and career growth in tech.',
    specialties: ['Product Strategy', 'User Research', 'Analytics', 'Team Leadership', 'Career Growth', 'Product Roadmaps'],
    rating: 4.9,
    reviewCount: 127,
    totalSessions: 500,
    responseTime: '< 2 hours',
    rate: 5,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    joinedDate: 'January 2023',
    experience: '8+ years in Product Management',
    education: 'MBA Stanford, BS Computer Science MIT',
    languages: ['English', 'Mandarin'],
    timezone: 'PST (UTC-8)',
    successRate: 98,
    repeatClients: 45
  };

  const availableSlots = [
    { time: '9:00 AM', date: 'Today', available: true },
    { time: '10:30 AM', date: 'Today', available: true },
    { time: '2:00 PM', date: 'Today', available: false },
    { time: '3:30 PM', date: 'Today', available: true },
    { time: '9:00 AM', date: 'Tomorrow', available: true },
    { time: '10:00 AM', date: 'Tomorrow', available: true },
    { time: '2:00 PM', date: 'Tomorrow', available: true },
    { time: '4:00 PM', date: 'Tomorrow', available: true },
    { time: '9:00 AM', date: 'Friday', available: true },
    { time: '11:00 AM', date: 'Friday', available: true },
    { time: '1:00 PM', date: 'Friday', available: false },
    { time: '3:00 PM', date: 'Friday', available: true }
  ];

  const handleBooking = () => {
    if (!selectedTimeSlot) return;

    // Check if user can book (has subscription credits or is paying individually)
    if (!canBookSession() && subscriptionTier !== 'free') {
      setShowPaywall(true);
      return;
    }

    setShowPaymentModal(true);
  };

  const sampleQuestions = [
    {
      category: 'Product Strategy',
      questions: [
        'How do I prioritize features for my product roadmap?',
        'What metrics should I track for a new product launch?',
        'How do I conduct effective user research interviews?'
      ]
    },
    {
      category: 'Career Growth',
      questions: [
        'How do I transition from engineering to product management?',
        'What skills do I need to become a senior PM?',
        'How do I prepare for product management interviews?'
      ]
    },
    {
      category: 'Team Leadership',
      questions: [
        'How do I manage stakeholder expectations effectively?',
        'What\'s the best way to run product planning meetings?',
        'How do I resolve conflicts between engineering and design?'
      ]
    }
  ];

  const reviews = [
    {
      id: 1,
      userName: 'Alex Johnson',
      userRole: 'Product Manager at Stripe',
      rating: 5,
      date: '2 days ago',
      comment: 'Sarah provided incredible insights into product strategy. Her advice was actionable and helped me immediately improve my roadmap approach. She understood my specific situation and gave me a clear framework to follow.',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      sessionTopic: 'Product Roadmap Planning'
    },
    {
      id: 2,
      userName: 'Maria Garcia',
      userRole: 'Senior Designer at Airbnb',
      rating: 5,
      date: '1 week ago',
      comment: 'Amazing session! Sarah broke down complex user research concepts in just 5 minutes. I learned more than I expected and got specific templates I could use immediately.',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      sessionTopic: 'User Research Methods'
    },
    {
      id: 3,
      userName: 'David Lee',
      userRole: 'Engineering Manager at Meta',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Perfect session timing and incredibly valuable advice on transitioning to product management. Sarah gave me a clear action plan and recommended specific resources.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      sessionTopic: 'Career Transition'
    },
    {
      id: 4,
      userName: 'Jennifer Wu',
      userRole: 'Product Analyst at Netflix',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Sarah helped me understand how to present data insights to executives. Her communication framework was exactly what I needed for my upcoming presentation.',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
      sessionTopic: 'Executive Communication'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                  {mentor.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-3 shadow-lg">
                      <Shield className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{mentor.name}</h1>
                    {mentor.verified && (
                      <Award className="h-6 w-6 text-primary-500" />
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{mentor.title}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <div>
                        <span className="font-bold text-gray-900">{mentor.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({mentor.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-primary-500" />
                      <span className="text-gray-700">{mentor.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{mentor.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{mentor.successRate}% success</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>🌍 {mentor.timezone}</span>
                    <span>💬 {mentor.languages.join(', ')}</span>
                    <span>🔄 {mentor.repeatClients}% repeat clients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About {mentor.name.split(' ')[0]}</h2>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">{mentor.bio}</p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-900">Experience:</span>
                    <p className="text-gray-600">{mentor.experience}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Education:</span>
                    <p className="text-gray-600">{mentor.education}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-900">Member since:</span>
                    <p className="text-gray-600">{mentor.joinedDate}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Response time:</span>
                    <p className="text-gray-600">{mentor.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Areas of Expertise</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {mentor.specialties.map((specialty, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-lg border border-primary-200"
                  >
                    <CheckCircle className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Questions I Can Help With</h2>
              <div className="space-y-6">
                {sampleQuestions.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm mr-3">
                        {category.category}
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {category.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <MessageSquare className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Don't see your question?</strong> I can help with any product management or career-related challenge. Just describe your situation when booking!
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Client Reviews</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{mentor.rating}</span>
                  <span className="text-gray-500">({mentor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={review.avatar} 
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{review.userName}</span>
                          {review.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-600 text-sm">{review.userRole}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-primary-600 text-sm font-medium">{review.sessionTopic}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View all {mentor.reviewCount} reviews
                </button>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              {/* Pricing */}
              <div className="text-center mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                  <span className="text-3xl font-bold text-gray-900">${mentor.rate}</span>
                </div>
                <p className="text-gray-600 font-medium">per 5-minute session</p>
                <p className="text-sm text-gray-500 mt-1">Quick, focused advice</p>
              </div>

              {/* Subscription Benefits */}
              {subscriptionTier !== 'free' && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {canBookSession() ? 'Use subscription credit' : 'Subscription limit reached'}
                    </span>
                  </div>
                </div>
              )}

              {/* Available Times */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                  Available Times
                </h3>
                <div className="space-y-3">
                  {['Today', 'Tomorrow', 'Friday'].map(day => (
                    <div key={day}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{day}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots
                          .filter(slot => slot.date === day)
                          .map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => slot.available && setSelectedTimeSlot(`${slot.date} at ${slot.time}`)}
                              disabled={!slot.available}
                              className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                                selectedTimeSlot === `${slot.date} at ${slot.time}`
                                  ? 'bg-primary-500 text-white'
                                  : slot.available
                                  ? 'border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                                  : 'border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBooking}
                disabled={!selectedTimeSlot}
                className={`w-full py-4 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 mb-4 transition-all duration-200 ${
                  selectedTimeSlot
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>{selectedTimeSlot ? 'Book Session' : 'Select a Time'}</span>
              </button>

              {selectedTimeSlot && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Selected:</strong> {selectedTimeSlot}
                  </p>
                </div>
              )}

              {/* Alternative Actions */}
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <span>Send Message</span>
              </button>

              {/* Trust Indicators */}
              <div className="space-y-3 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>100% secure booking</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Cancel up to 1 hour before</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary-500" />
                  <span>Instant calendar invite</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">{mentor.successRate}%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-600">{mentor.repeatClients}%</div>
                    <div className="text-xs text-gray-500">Repeat Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <SessionPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        mentor={{
          id: mentor.id,
          name: mentor.name,
          title: mentor.title,
          avatar: mentor.avatar,
          rating: mentor.rating,
          rate: mentor.rate
        }}
        selectedTime={selectedTimeSlot || ''}
      />

      {/* Paywall Modal */}
      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="session_limit"
      />
    </div>
  );
};

export default MentorProfile;