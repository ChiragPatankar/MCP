import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Star, Video, Shield, Zap, Search, CheckCircle, MessageSquare, Calendar, DollarSign } from 'lucide-react';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger AI matching
      console.log('Searching for:', searchQuery);
      // For now, redirect to discover page
      window.location.href = '/discover';
    }
  };

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary-500" />,
      title: "5-Minute Sessions",
      description: "Quick, focused conversations that fit into your busy schedule"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      title: "Affordable Pricing",
      description: "Get expert advice for just $2-5 per session - no long commitments"
    },
    {
      icon: <Zap className="h-8 w-8 text-accent-500" />,
      title: "Instant Matching",
      description: "AI-powered matching connects you with the right mentor instantly"
    },
    {
      icon: <Shield className="h-8 w-8 text-success-500" />,
      title: "Verified Experts",
      description: "All mentors are verified professionals with proven expertise"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at Google",
      content: "I got the exact advice I needed to solve my product roadmap challenge in just 5 minutes. The mentor understood my problem immediately and gave me actionable steps.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      problem: "Product Strategy"
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer at Meta",
      content: "Amazing value for money! I was stuck on a complex algorithm problem for hours. One 5-minute session and I had three different approaches to try.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150",
      problem: "Technical Problem"
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      content: "The convenience is unmatched. I can get expert marketing advice between meetings. It's like having a senior advisor on speed dial.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
      problem: "Marketing Strategy"
    }
  ];

  const popularQuestions = [
    "How do I negotiate my salary?",
    "What's the best way to structure my startup pitch?",
    "How can I improve my team's productivity?",
    "What coding framework should I learn next?"
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Get Expert Advice in
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Just 5 Minutes
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-primary-100 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Connect with industry experts for quick, focused mentoring sessions.
            </p>
            <p className="text-lg mb-8 text-primary-200 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <span className="font-semibold text-yellow-300">$2-5 per session</span> • No subscriptions • Instant booking
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you need help with? e.g., 'How to negotiate salary'"
                    className="w-full pl-12 pr-32 py-4 text-lg rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/20 shadow-2xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium"
                  >
                    Find Expert
                  </button>
                </div>
              </form>
              
              {/* Popular Questions */}
              <div className="mt-4 text-center">
                <p className="text-primary-200 text-sm mb-2">Popular questions:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(question)}
                      className="text-xs bg-white/10 text-white px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Link 
                to="/register" 
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Start Your First Session</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/register?type=mentor" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Video className="h-5 w-5" />
                <span>Become a Mentor</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-primary-200 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>1000+ Verified Experts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <span>50,000+ Sessions Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Micro-Mentor?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the exact help you need, when you need it, without the commitment
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get expert advice in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-primary-500 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ask Your Question
                </h3>
                <p className="text-gray-600">
                  Describe what you need help with. Our AI instantly matches you with the perfect expert based on your specific question.
                </p>
              </div>
              {/* Fixed Connector Line - Properly contained */}
              <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300"></div>
            </div>
            
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                  <Calendar className="h-12 w-12 text-secondary-500 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Book Instantly
                </h3>
                <p className="text-gray-600">
                  Choose an available time slot and pay securely. Sessions start in minutes, not days. Cancel up to 1 hour before.
                </p>
              </div>
              {/* Fixed Connector Line - Properly contained */}
              <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-secondary-300 to-accent-300"></div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-accent-500 to-primary-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                  <Video className="h-12 w-12 text-accent-500 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Get Expert Advice
                </h3>
                <p className="text-gray-600">
                  Connect via video call and get focused, actionable advice. Every session is exactly 5 minutes - no fluff, just results.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why 5 Minutes Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Focused Solutions</h4>
                    <p className="text-gray-600 text-sm">Experts get straight to the point with actionable advice</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fits Your Schedule</h4>
                    <p className="text-gray-600 text-sm">Quick sessions that fit between meetings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Affordable Access</h4>
                    <p className="text-gray-600 text-sm">Get expert help without breaking the bank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600">
              See how 5-minute sessions are transforming careers and solving problems
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {testimonial.role}
                    </p>
                    <p className="text-primary-600 text-sm font-medium">
                      Problem: {testimonial.problem}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary-600">50K+</div>
                  <div className="text-gray-600">Sessions Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-600">1000+</div>
                  <div className="text-gray-600">Expert Mentors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-600">4.9/5</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">95%</div>
                  <div className="text-gray-600">Problem Solved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Expert Advice?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of professionals who get unstuck in just 5 minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Ask Your First Question</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="text-primary-200 text-sm">
              No subscription required • Pay per session • Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;