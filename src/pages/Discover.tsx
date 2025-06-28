import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Video, MessageSquare, CheckCircle, DollarSign, Users, Award } from 'lucide-react';

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    'All', 'Software Development', 'Product Management', 'Marketing', 'Design', 
    'Data Science', 'Business Strategy', 'Leadership', 'Finance', 'Sales'
  ];

  const mentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Product Manager at Google',
      specialties: ['Product Strategy', 'User Research', 'Analytics'],
      rating: 4.9,
      reviewCount: 127,
      rate: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 500,
      responseTime: '< 2 hours',
      successRate: 98,
      sampleQuestions: [
        'How do I prioritize features for my product roadmap?',
        'What metrics should I track for a new product launch?'
      ],
      nextAvailable: 'Today 2:00 PM'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Tech Lead at Meta',
      specialties: ['System Design', 'React', 'Leadership'],
      rating: 4.8,
      reviewCount: 89,
      rate: 4,
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 320,
      responseTime: '< 1 hour',
      successRate: 96,
      sampleQuestions: [
        'How do I design scalable microservices architecture?',
        'What are React performance optimization best practices?'
      ],
      nextAvailable: 'Today 4:00 PM'
    },
    {
      id: 3,
      name: 'Emily Watson',
      title: 'Marketing Director at Spotify',
      specialties: ['Growth Marketing', 'Brand Strategy', 'Analytics'],
      rating: 5.0,
      reviewCount: 156,
      rate: 5,
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 600,
      responseTime: '< 3 hours',
      successRate: 99,
      sampleQuestions: [
        'How do I create a viral marketing campaign?',
        'What are the best growth hacking strategies for startups?'
      ],
      nextAvailable: 'Tomorrow 10:00 AM'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Principal Designer at Airbnb',
      specialties: ['UX Design', 'Design Systems', 'User Research'],
      rating: 4.9,
      reviewCount: 203,
      rate: 4,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 450,
      responseTime: '< 4 hours',
      successRate: 97,
      sampleQuestions: [
        'How do I conduct effective user interviews?',
        'What makes a good design system component?'
      ],
      nextAvailable: 'Today 6:00 PM'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Data Science Manager at Netflix',
      specialties: ['Machine Learning', 'Python', 'Data Analysis'],
      rating: 4.7,
      reviewCount: 98,
      rate: 5,
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 280,
      responseTime: '< 6 hours',
      successRate: 95,
      sampleQuestions: [
        'How do I build a recommendation system?',
        'What are the best practices for A/B testing?'
      ],
      nextAvailable: 'Tomorrow 2:00 PM'
    },
    {
      id: 6,
      name: 'James Wilson',
      title: 'VP of Engineering at Stripe',
      specialties: ['Leadership', 'Architecture', 'Team Building'],
      rating: 4.8,
      reviewCount: 145,
      rate: 5,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      totalSessions: 380,
      responseTime: '< 2 hours',
      successRate: 98,
      sampleQuestions: [
        'How do I scale an engineering team effectively?',
        'What are the key principles of technical leadership?'
      ],
      nextAvailable: 'Friday 11:00 AM'
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mentor.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           mentor.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && mentor.rate <= 3) ||
                        (priceRange === 'mid' && mentor.rate > 3 && mentor.rate <= 4) ||
                        (priceRange === 'high' && mentor.rate > 4);
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.rate - b.rate;
      case 'price-high':
        return b.rate - a.rate;
      case 'sessions':
        return b.totalSessions - a.totalSessions;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Expert
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with industry experts for focused 5-minute sessions that solve your specific challenges
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, expertise, or company..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="lg:w-40">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">$2-3</option>
                <option value="mid">$3-4</option>
                <option value="high">$4-5</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-40">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sessions">Most Sessions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMentors.length} expert{filteredMentors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredMentors.map(mentor => (
            <div 
              key={mentor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {mentor.verified && (
                    <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                    {mentor.verified && (
                      <Award className="h-5 w-5 text-primary-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{mentor.title}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{mentor.rating}</span>
                      <span className="text-gray-500">({mentor.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-600">{mentor.totalSessions} sessions</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${mentor.rate}</div>
                  <div className="text-gray-600 text-sm">per session</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Questions */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Sample questions I can help with:</h4>
                <div className="space-y-2">
                  {mentor.sampleQuestions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{question}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-600">{mentor.successRate}%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary-600">{mentor.responseTime}</div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{mentor.nextAvailable}</div>
                  <div className="text-xs text-gray-500">Next Available</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Link 
                  to={`/mentor/${mentor.id}`}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Book Session</span>
                </Link>
                <Link 
                  to={`/mentor/${mentor.id}`}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No experts found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all experts
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don't see the right expert?
          </h2>
          <p className="text-gray-600 mb-6">
            We're constantly adding new experts. Tell us what you're looking for!
          </p>
          <Link 
            to="/request-expert"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium"
          >
            <Users className="h-5 w-5" />
            <span>Request an Expert</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Discover;