import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, MessageSquare, BarChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/lib/payment';
import PricingCard from '@/components/PricingCard';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  const plans = paymentService.getPaymentPlans();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-primary">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with our free plan or upgrade to unlock powerful features for your growing business
          </p>
          
          {user && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 mb-8">
              <CheckCircle className="h-5 w-5 mr-2" />
              Welcome back, {user.name}! Current plan: <span className="font-semibold ml-1 capitalize">{currentPlan}</span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              highlighted={index === 1} // Highlight middle plan (Starter)
              currentPlan={currentPlan}
            />
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h2>
            <p className="text-lg text-gray-600">
              Core features available across all subscription tiers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure Razorpay integration.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start the free plan.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my message limit?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional message packs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-primary rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of businesses using AI to transform their customer support
            </p>
            {!user ? (
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 