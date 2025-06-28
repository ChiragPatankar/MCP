import React from 'react';
import { ArrowLeft, Target, TrendingUp, Code, Users, Zap, Globe, DollarSign, Clock, Star, Award, ExternalLink, Heart, Lightbulb, Rocket, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const techStack = [
    {
      category: 'Frontend',
      technologies: [
        { name: 'React 18', description: 'Modern UI library with hooks and concurrent features' },
        { name: 'TypeScript', description: 'Type-safe JavaScript for better development experience' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid styling' },
        { name: 'Vite', description: 'Lightning-fast build tool and dev server' }
      ]
    },
    {
      category: 'Real-time Communication',
      technologies: [
        { name: 'WebRTC', description: 'Peer-to-peer video calling technology' },
        { name: 'Socket.io', description: 'Real-time bidirectional communication' },
        { name: 'Simple Peer', description: 'WebRTC wrapper for easy video calls' }
      ]
    },
    {
      category: 'Payments & Subscriptions',
      technologies: [
        { name: 'Stripe', description: 'Secure payment processing and billing' },
        { name: 'RevenueCat', description: 'Subscription management and analytics' }
      ]
    },
    {
      category: 'Development & Deployment',
      technologies: [
        { name: 'Bolt.new', description: 'AI-powered development platform' },
        { name: 'PWA', description: 'Progressive Web App capabilities' },
        { name: 'Service Workers', description: 'Offline functionality and caching' }
      ]
    }
  ];

  const marketData = [
    { metric: 'Global Consulting Market', value: '$132B', growth: '+5.5% CAGR', description: 'Total addressable market size' },
    { metric: 'Online Education', value: '$350B', growth: '+9.1% CAGR', description: 'Digital learning market growth' },
    { metric: 'Gig Economy', value: '$400B', growth: '+17% CAGR', description: 'Freelance and consulting services' },
    { metric: 'Video Conferencing', value: '$50B', growth: '+13.9% CAGR', description: 'Remote communication tools' }
  ];

  const revenueProjections = [
    { year: '2024', users: '10K', revenue: '$500K', sessions: '50K' },
    { year: '2025', users: '100K', revenue: '$5M', sessions: '500K' },
    { year: '2026', users: '500K', revenue: '$25M', sessions: '2.5M' },
    { year: '2027', users: '1M', revenue: '$50M', sessions: '5M' },
    { year: '2028', users: '2M', revenue: '$100M', sessions: '10M' }
  ];

  const problemPoints = [
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: 'Expensive Traditional Consulting',
      description: 'Traditional consulting costs $200-500/hour, making expert advice inaccessible to most professionals.',
      stat: '$300/hr average'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Slow Response Times',
      description: 'Booking consultations takes weeks, and sessions often last hours when you need quick answers.',
      stat: '2-4 weeks wait'
    },
    {
      icon: <Target className="h-8 w-8 text-yellow-500" />,
      title: 'Lack of Specificity',
      description: 'Generic advice that doesn\'t address your specific situation or immediate challenges.',
      stat: '70% irrelevant'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Limited Expert Access',
      description: 'Top industry experts are hard to find and even harder to book for quick consultations.',
      stat: '5% accessible'
    }
  ];

  const solutionFeatures = [
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      title: '5-Minute Sessions',
      description: 'Quick, focused conversations that respect everyone\'s time and get straight to the point.',
      benefit: '12x faster than traditional consulting'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      title: 'Affordable Pricing',
      description: 'Sessions cost $2-5, making expert advice accessible to everyone, not just Fortune 500 companies.',
      benefit: '100x more affordable'
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: 'AI-Powered Matching',
      description: 'Our AI analyzes your question and matches you with the perfect expert for your specific need.',
      benefit: '95% match accuracy'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-500" />,
      title: 'Global Expert Network',
      description: 'Access to 1000+ verified experts from top companies worldwide, available 24/7.',
      benefit: '24/7 availability'
    }
  ];

  const teamMember = {
    name: 'AI Development Team',
    role: 'Built with Bolt.new',
    avatar: '/bolt-logo.png',
    bio: 'This entire platform was built using Bolt.new, an AI-powered development environment that enables rapid prototyping and deployment of full-stack applications.',
    achievements: [
      'Built complete platform in record time',
      'AI-assisted code generation and optimization',
      'Seamless integration of complex features',
      'Production-ready code from day one'
    ],
    skills: ['AI-Assisted Development', 'Rapid Prototyping', 'Full-Stack Architecture', 'Modern Web Technologies']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Democratizing Expert Advice
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              We're building the future of professional mentoring - making expert advice accessible, affordable, and instant for everyone.
            </p>
            
            {/* Built with Bolt.new Badge - Prominent */}
            <div className="flex justify-center mb-8">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Heart className="h-6 w-6" />
                <span>Built with Bolt.new</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">$132B</div>
                <div className="text-primary-200">Market Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">1000+</div>
                <div className="text-primary-200">Expert Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50K+</div>
                <div className="text-primary-200">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">4.9/5</div>
                <div className="text-primary-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Problem Statement */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Problem We're Solving
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional advice is broken. It's too expensive, too slow, and too generic for today's fast-paced world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problemPoints.map((problem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="mb-4 flex justify-center">
                  {problem.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {problem.description}
                </p>
                <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-bold text-sm">
                  {problem.stat}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Solution */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Revolutionary Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Micro-Mentor transforms how professionals get expert advice through AI-powered matching and micro-sessions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutionFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg font-bold text-sm">
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market Opportunity */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Massive Market Opportunity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're positioned at the intersection of multiple high-growth markets worth over $900B combined.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {marketData.map((data, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 text-center border border-primary-200">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {data.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {data.metric}
                </div>
                <div className="text-green-600 font-medium mb-2">
                  {data.growth}
                </div>
                <p className="text-gray-600 text-sm">
                  {data.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Total Addressable Market (TAM)
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$20B+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Serviceable Addressable Market</div>
                <p className="text-gray-600 text-sm">Online professional consulting and mentoring services</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$2B+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Serviceable Obtainable Market</div>
                <p className="text-gray-600 text-sm">Micro-consulting and quick professional advice</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$100M+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Initial Target Market</div>
                <p className="text-gray-600 text-sm">Tech professionals seeking quick expert advice</p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Projections */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Revenue Projections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conservative growth projections based on market analysis and comparable platforms.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {revenueProjections.map((projection, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {projection.year}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {projection.revenue}
                          </div>
                          <div className="text-xs text-gray-600">Revenue</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {projection.users}
                          </div>
                          <div className="text-xs text-gray-600">Users</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {projection.sessions}
                          </div>
                          <div className="text-xs text-gray-600">Sessions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">25%</div>
                  <div className="text-gray-600">Platform Commission</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">$4.50</div>
                  <div className="text-gray-600">Average Session Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">85%</div>
                  <div className="text-gray-600">Gross Margin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies for scalability, performance, and user experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="h-6 w-6 text-primary-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="border-l-4 border-primary-200 pl-4">
                      <div className="font-medium text-gray-900 mb-1">
                        {tech.name}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bolt.new Highlight */}
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Rocket className="h-8 w-8 text-orange-500" />
                <h3 className="text-2xl font-bold text-gray-900">Powered by Bolt.new</h3>
              </div>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                This entire platform was built using Bolt.new, an AI-powered development environment that enabled us to rapidly prototype, develop, and deploy a production-ready application with complex features like real-time video calling, payment processing, and AI matching.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">AI-Assisted Development</div>
                  <p className="text-gray-600 text-sm">Intelligent code generation and optimization</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Rapid Prototyping</div>
                  <p className="text-gray-600 text-sm">From concept to production in record time</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Production Ready</div>
                  <p className="text-gray-600 text-sm">Enterprise-grade code quality and security</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built by AI, Powered by Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This platform represents the future of software development - where AI and human creativity combine to build amazing products.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Rocket className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {teamMember.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {teamMember.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {teamMember.bio}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {teamMember.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Award className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Core Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {teamMember.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Join the Future of Professional Mentoring
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Whether you're seeking expert advice or want to share your expertise, Micro-Mentor is the platform that connects professionals worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Get Started Today</span>
              </Link>
              <Link 
                to="/register?type=mentor" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Become a Mentor</span>
              </Link>
            </div>

            {/* Final Bolt.new Attribution */}
            <div className="mt-8 pt-8 border-t border-primary-400">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-200 hover:text-white transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span>Proudly built with Bolt.new</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;