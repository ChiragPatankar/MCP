import React from 'react';
import { ArrowLeft, Target, TrendingUp, Code, Users, Zap, Globe, DollarSign, Clock, Star, Award, ExternalLink, Heart, Lightbulb, Rocket, Shield, ArrowRight } from 'lucide-react';
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

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Customer First',
      description: 'We put our users at the center of every decision and design.'
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Global Impact',
      description: 'Empowering businesses and customers worldwide with AI-driven support.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Trust & Security',
      description: 'Your data and privacy are protected with industry-leading security.'
    }
  ];

  const testimonial = {
    name: 'Priya Singh',
    role: 'CEO',
    company: 'Micro-Mentor Inc.',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: 'Our mission is to make world-class support accessible to every business, everywhere. MCP Chat Support is the realization of that vision.',
    rating: 5
  };

  return (
    <div className="relative min-h-screen py-12 overflow-hidden">
      {/* Decorative Background Gradient */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-200 via-purple-100 to-cyan-100 rounded-full blur-3xl opacity-60 z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100 via-cyan-100 to-purple-100 rounded-full blur-2xl opacity-50 z-0" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium bg-white/80 hover:bg-white px-3 py-2 rounded-lg shadow transition-all">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>
        </div>
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-xl shadow-lg">
            <Users className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        </div>
        {/* Hero Section */}
        <div className="mb-12">
          <p className="text-xl text-gray-700 max-w-2xl">
            We are passionate about transforming customer support with AI. Our team is dedicated to building tools that empower businesses and delight customers.
          </p>
        </div>
        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl shadow-lg p-8 bg-white flex flex-col items-start">
              <div className="mb-4">{v.icon}</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">{v.title}</h2>
              <p className="text-base text-gray-700 opacity-90">{v.description}</p>
            </div>
          ))}
        </div>
        {/* Testimonial Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary-100 to-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center shadow">
            <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary-200 mb-4 md:mb-0 md:mr-8" />
            <div>
              <div className="flex items-center mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-gray-800 mb-2">“{testimonial.content}”</p>
              <div className="text-gray-600 text-sm">
                <span className="font-semibold">{testimonial.name}</span> — {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="mt-20 flex justify-center">
          <div className="bg-gradient-to-r from-primary-500 to-blue-500 rounded-2xl shadow-lg px-10 py-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <Rocket className="h-6 w-6 mr-2" /> Join us on our mission
            </h2>
            <p className="text-white/90 mb-6">Start your free trial today and experience the future of customer support.</p>
            <Link to="/signup" className="inline-flex items-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-50 transition-all">
              Get Started Free <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;