import React, { useState } from 'react';
import { Crown, Star, Zap, Check, ArrowRight, Users, Clock, Shield, Sparkles } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import SubscriptionStatus from '../components/SubscriptionStatus';
import PaywallModal from '../components/PaywallModal';

const Subscription: React.FC = () => {
  const { subscriptionTier, getSubscriptionBenefits } = usePayment();
  const [showPaywall, setShowPaywall] = useState(false);

  const benefits = getSubscriptionBenefits();

  const comparisonFeatures = [
    {
      name: 'Monthly Sessions',
      free: '2',
      basic: '10',
      pro: '50',
      expert: 'Unlimited'
    },
    {
      name: 'AI-Powered Matching',
      free: 'Basic',
      basic: '✓',
      pro: 'Advanced',
      expert: 'Premium'
    },
    {
      name: 'Session Recordings',
      free: '✗',
      basic: '✗',
      pro: '✓',
      expert: '✓'
    },
    {
      name: 'Priority Support',
      free: '✗',
      basic: '✗',
      pro: '✓',
      expert: 'White-glove'
    },
    {
      name: 'Group Sessions',
      free: '✗',
      basic: '✗',
      pro: '✓',
      expert: '✓'
    },
    {
      name: 'Expert Access',
      free: 'Standard',
      basic: 'Standard',
      pro: 'Standard',
      expert: 'Premium Only'
    },
    {
      name: 'API Access',
      free: '✗',
      basic: '✗',
      pro: '✗',
      expert: '✓'
    },
    {
      name: 'Custom Integrations',
      free: '✗',
      basic: '✗',
      pro: '✗',
      expert: '✓'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      plan: 'Pro',
      content: 'The Pro plan transformed my career. Having 50 sessions per month means I can get expert advice whenever I need it. The session recordings are invaluable for reviewing key insights.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      plan: 'Expert',
      content: 'The Expert plan is worth every penny. Access to premium mentors and unlimited sessions helped me navigate critical business decisions. The dedicated account manager is amazing.',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Software Engineer',
      plan: 'Basic',
      content: 'Perfect for someone just starting their career. 10 sessions per month is plenty for getting unstuck on technical challenges. Great value for the price.',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock unlimited access to expert advice and accelerate your professional growth
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Subscription Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Current Plan
              </h2>
              <SubscriptionStatus />
              
              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Usage</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions this month:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorite topics:</span>
                    <span className="font-medium">Product, Tech</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. session rating:</span>
                    <span className="font-medium">4.9 ⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Compare Plans
                </h2>
                <p className="text-gray-600">
                  Find the perfect plan for your growth needs
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-900">Features</th>
                      <th className="text-center p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">Free</div>
                          <div className="text-gray-600">$0/month</div>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Zap className="h-5 w-5 text-blue-500" />
                            <span className="text-lg font-bold text-gray-900">Basic</span>
                          </div>
                          <div className="text-gray-600">$9.99/month</div>
                        </div>
                      </th>
                      <th className="text-center p-4 bg-purple-50">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-5 w-5 text-purple-500" />
                            <span className="text-lg font-bold text-gray-900">Pro</span>
                          </div>
                          <div className="text-gray-600">$29.99/month</div>
                          <div className="text-xs text-purple-600 font-medium mt-1">Most Popular</div>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Crown className="h-5 w-5 text-yellow-500" />
                            <span className="text-lg font-bold text-gray-900">Expert</span>
                          </div>
                          <div className="text-gray-600">$49.99/month</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-4 font-medium text-gray-900">{feature.name}</td>
                        <td className="p-4 text-center text-gray-600">{feature.free}</td>
                        <td className="p-4 text-center text-gray-600">{feature.basic}</td>
                        <td className="p-4 text-center text-gray-600 bg-purple-50">{feature.pro}</td>
                        <td className="p-4 text-center text-gray-600">{feature.expert}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div></div>
                  <div className="text-center">
                    {subscriptionTier === 'free' ? (
                      <span className="text-green-600 font-medium">Current Plan</span>
                    ) : (
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Downgrade
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    {subscriptionTier === 'basic' ? (
                      <span className="text-green-600 font-medium">Current Plan</span>
                    ) : subscriptionTier === 'free' ? (
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Change Plan
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    {subscriptionTier === 'pro' ? (
                      <span className="text-green-600 font-medium">Current Plan</span>
                    ) : (
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                      >
                        {subscriptionTier === 'expert' ? 'Downgrade' : 'Upgrade'}
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    {subscriptionTier === 'expert' ? (
                      <span className="text-green-600 font-medium">Current Plan</span>
                    ) : (
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600">
              See how different plans have helped professionals grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {testimonial.plan}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens to unused sessions?
                </h3>
                <p className="text-gray-600 text-sm">
                  Unused sessions don't roll over to the next month, but you can always book multiple sessions in advance to make the most of your plan.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600 text-sm">
                  Every new user gets 2 free sessions to try our platform. No credit card required to get started!
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How do session recordings work?
                </h3>
                <p className="text-gray-600 text-sm">
                  Pro and Expert members get automatic session recordings that are available for 30 days. Perfect for reviewing key insights and action items.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What's included in priority support?
                </h3>
                <p className="text-gray-600 text-sm">
                  Priority support includes faster response times, dedicated support channels, and help with booking and technical issues.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! Cancel anytime with no penalties. You'll continue to have access until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-xl mb-6 text-primary-100">
            Join thousands of professionals who are getting expert advice on demand
          </p>
          <button
            onClick={() => setShowPaywall(true)}
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto"
          >
            <span>Choose Your Plan</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="upgrade_prompt"
      />
    </div>
  );
};

export default Subscription;