import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, MessageSquare, BarChart, Shield, DollarSign, Star, ArrowRight, Rocket, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/lib/payment';
import PricingCard from '@/components/PricingCard';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out our platform',
    features: [
      '1 Chat Bot',
      '100 messages/month',
      'Basic Analytics',
      'Email Support',
      'Knowledge Base (5MB)'
    ],
    highlight: false
  },
  {
    name: 'Pro',
    price: '$29/mo',
    description: 'Best for growing businesses',
    features: [
      '5 Chat Bots',
      '2,000 messages/month',
      'Advanced Analytics',
      'Priority Support',
      'Knowledge Base (50MB)',
      'Custom Branding',
      'API Access'
    ],
    highlight: true
  },
  {
    name: 'Enterprise',
    price: '$99/mo',
    description: 'For large-scale operations',
    features: [
      'Unlimited Chat Bots',
      'Unlimited messages',
      'Full Analytics Suite',
      '24/7 Phone Support',
      'Unlimited Knowledge Base',
      'White-label Solution',
      'Custom Integrations',
      'Dedicated Account Manager'
    ],
    highlight: false
  }
];

const testimonial = {
  name: 'Marcus Rodriguez',
  role: 'CTO',
  company: 'DataVault',
  image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  content: 'Setup was seamless, and the multi-tenant architecture is exactly what we needed for our various product lines.',
  rating: 5
};

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "AI-Powered Responses",
      description: "Train your bot with custom knowledge base"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Multi-Tenant Support",
      description: "Manage multiple businesses from one dashboard"
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: "Advanced Analytics",
      description: "Detailed insights and performance metrics"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Enterprise Security",
      description: "Bank-grade security and data protection"
    }
  ];

  useEffect(() => {
    if (user) {
      // Get user's current subscription
      paymentService.getSubscriptionStatus(user.id)
        .then(subscription => {
          setCurrentPlan(subscription.planId || 'free');
        })
        .catch(() => {
          setCurrentPlan('free');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
            <DollarSign className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Pricing</h1>
        </div>
        {/* Hero Section */}
        <div className="mb-12">
          <p className="text-xl text-gray-700 max-w-2xl">
            Simple, transparent pricing for every business size. Start free, upgrade as you grow.
          </p>
        </div>
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl shadow-lg p-8 bg-white flex flex-col items-start border-2 ${plan.highlight ? 'border-primary-500' : 'border-transparent'}`}>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 flex items-center">
                {plan.name}
                {plan.highlight && <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full font-bold">Most Popular</span>}
              </h2>
              <div className="text-3xl font-bold text-primary-600 mb-2">{plan.price}</div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-gray-700"><Check className="h-4 w-4 text-green-500 mr-2" />{f}</li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg font-semibold transition-all ${plan.highlight ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 text-primary-600 hover:bg-gray-200'}`}>{plan.highlight ? 'Start 14-Day Trial' : plan.name === 'Starter' ? 'Get Started Free' : 'Contact Sales'}</button>
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
              <Rocket className="h-6 w-6 mr-2" /> Ready to get started?
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

export default PricingPage; 