import React, { useState } from 'react';
import { Star, Video, MessageSquare, Award, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoExpertProfiles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const demoExperts = [
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      title: 'Senior Product Manager at Google',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      reviewCount: 247,
      totalSessions: 1200,
      rate: 5,
      specialties: ['Product Strategy', 'User Research', 'Analytics', 'Team Leadership'],
      bio: 'Product leader with 8+ years at Google, launched 5 major features serving 100M+ users. Expert in data-driven product decisions and cross-functional team leadership.',
      achievements: ['Google PM of the Year 2023', 'Led $50M revenue product', '95% session success rate'],
      responseTime: '< 1 hour',
      nextAvailable: 'Today 2:00 PM',
      languages: ['English', 'Mandarin'],
      category: 'product',
      verified: true,
      topMentor: true
    },
    {
      id: 'marcus-rodriguez',
      name: 'Marcus Rodriguez',
      title: 'Principal Engineer at Meta',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      reviewCount: 189,
      totalSessions: 890,
      rate: 4,
      specialties: ['System Design', 'React', 'Node.js', 'Architecture'],
      bio: 'Full-stack engineer with 10+ years at FAANG companies. Built systems serving billions of users. Passionate about mentoring the next generation of engineers.',
      achievements: ['Meta Tech Lead Excellence Award', 'Open source contributor', '1M+ downloads on NPM'],
      responseTime: '< 2 hours',
      nextAvailable: 'Tomorrow 10:00 AM',
      languages: ['English', 'Spanish'],
      category: 'engineering',
      verified: true,
      topMentor: false
    },
    {
      id: 'emily-watson',
      name: 'Emily Watson',
      title: 'VP of Marketing at Stripe',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5.0,
      reviewCount: 156,
      totalSessions: 650,
      rate: 5,
      specialties: ['Growth Marketing', 'Brand Strategy', 'Content Marketing', 'Analytics'],
      bio: 'Marketing executive who scaled 3 startups from seed to IPO. Expert in growth hacking, brand building, and data-driven marketing strategies.',
      achievements: ['Built $100M marketing engine', 'Forbes 30 Under 30', '300% growth in 2 years'],
      responseTime: '< 3 hours',
      nextAvailable: 'Today 4:00 PM',
      languages: ['English', 'French'],
      category: 'marketing',
      verified: true,
      topMentor: true
    },
    {
      id: 'david-kim',
      name: 'David Kim',
      title: 'Design Director at Airbnb',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      reviewCount: 203,
      totalSessions: 780,
      rate: 4,
      specialties: ['UX Design', 'Design Systems', 'User Research', 'Prototyping'],
      bio: 'Design leader with 12+ years creating user-centered experiences. Led design for products used by 500M+ people. Expert in design thinking and team building.',
      achievements: ['Airbnb Design Excellence Award', 'Design Systems pioneer', 'Speaker at 20+ conferences'],
      responseTime: '< 4 hours',
      nextAvailable: 'Friday 11:00 AM',
      languages: ['English', 'Korean'],
      category: 'design',
      verified: true,
      topMentor: false
    },
    {
      id: 'lisa-thompson',
      name: 'Lisa Thompson',
      title: 'Data Science Manager at Netflix',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      reviewCount: 134,
      totalSessions: 520,
      rate: 5,
      specialties: ['Machine Learning', 'Python', 'Data Analysis', 'AI Strategy'],
      bio: 'Data science leader building ML systems that power Netflix recommendations. PhD in Computer Science, published researcher, and passionate educator.',
      achievements: ['Netflix Innovation Award', '15+ ML patents', 'Published 30+ papers'],
      responseTime: '< 6 hours',
      nextAvailable: 'Monday 9:00 AM',
      languages: ['English'],
      category: 'data',
      verified: true,
      topMentor: false
    },
    {
      id: 'james-wilson',
      name: 'James Wilson',
      title: 'CEO & Founder at TechStart',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      reviewCount: 167,
      totalSessions: 690,
      rate: 5,
      specialties: ['Entrepreneurship', 'Fundraising', 'Business Strategy', 'Leadership'],
      bio: 'Serial entrepreneur with 3 successful exits. Raised $50M+ in funding. Now helping the next generation of founders build and scale their companies.',
      achievements: ['3 successful exits', '$50M+ raised', 'Forbes Entrepreneur of the Year'],
      responseTime: '< 2 hours',
      nextAvailable: 'Today 6:00 PM',
      languages: ['English'],
      category: 'business',
      verified: true,
      topMentor: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Experts', count: demoExperts.length },
    { id: 'product', name: 'Product', count: demoExperts.filter(e => e.category === 'product').length },
    { id: 'engineering', name: 'Engineering', count: demoExperts.filter(e => e.category === 'engineering').length },
    { id: 'marketing', name: 'Marketing', count: demoExperts.filter(e => e.category === 'marketing').length },
    { id: 'design', name: 'Design', count: demoExperts.filter(e => e.category === 'design').length },
    { id: 'data', name: 'Data Science', count: demoExperts.filter(e => e.category === 'data').length },
    { id: 'business', name: 'Business', count: demoExperts.filter(e => e.category === 'business').length }
  ];

  const filteredExperts = selectedCategory === 'all' 
    ? demoExperts 
    : demoExperts.filter(expert => expert.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Demo Expert Profiles</h1>
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Demo Mode
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our curated selection of industry experts with realistic profiles and data
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredExperts.map((expert) => (
            <div 
              key={expert.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <img 
                    src={expert.avatar} 
                    alt={expert.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {expert.verified && (
                    <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  {expert.topMentor && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                      <Award className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
                    {expert.topMentor && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        Top Mentor
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{expert.title}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{expert.rating}</span>
                      <span className="text-gray-500">({expert.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-600">{expert.totalSessions} sessions</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${expert.rate}</div>
                  <div className="text-gray-600 text-sm">per session</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 leading-relaxed mb-6">{expert.bio}</p>

              {/* Specialties */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                <div className="space-y-2">
                  {expert.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-600">{expert.responseTime}</div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary-600">{expert.nextAvailable}</div>
                  <div className="text-xs text-gray-500">Next Available</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{expert.languages.join(', ')}</div>
                  <div className="text-xs text-gray-500">Languages</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Link 
                  to={`/mentor/${expert.id}`}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Book Demo Session</span>
                </Link>
                <Link 
                  to={`/mentor/${expert.id}`}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Features */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Demo Mode Features
            </h2>
            <p className="text-gray-600">
              These profiles showcase realistic expert data and interactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Realistic Profiles</h3>
              <p className="text-gray-600 text-sm">Complete expert profiles with authentic backgrounds and achievements</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Booking</h3>
              <p className="text-gray-600 text-sm">Experience the full booking flow with simulated payments</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Video className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Demo Sessions</h3>
              <p className="text-gray-600 text-sm">Try simulated video calls with realistic conversation flows</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoExpertProfiles;