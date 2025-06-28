import React, { useState } from 'react';
import { X, Check, Crown, Zap, Star, Shield, Users, Video, Clock, Sparkles } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'session_limit' | 'premium_feature' | 'upgrade_prompt';
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, trigger = 'upgrade_prompt' }) => {
  const { purchaseSubscription, loading, subscriptionTier, offerings } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'expert'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const plans = {
    basic: {
      name: 'Basic',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      color: 'blue',
      features: [
        '10 sessions per month',
        'AI-powered matching',
        'Basic support',
        'Session history',
        'Mobile app access'
      ],
      packageId: billingCycle === 'monthly' ? 'basic_monthly' : 'basic_yearly'
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      icon: <Star className="h-8 w-8 text-purple-500" />,
      color: 'purple',
      popular: true,
      features: [
        '50 sessions per month',
        'Advanced AI matching',
        'Priority support',
        'Session recordings',
        'Group sessions',
        'Calendar integration',
        'Custom scheduling'
      ],
      packageId: billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly'
    },
    expert: {
      name: 'Expert',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      icon: <Crown className="h-8 w-8 text-gold-500" />,
      color: 'gold',
      features: [
        'Unlimited sessions',
        'Premium expert access',
        'White-glove support',
        'Session recordings',
        'Group sessions',
        'API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      packageId: billingCycle === 'monthly' ? 'expert_monthly' : 'expert_yearly'
    }
  };

  const handlePurchase = async () => {
    const plan = plans[selectedPlan];
    const success = await purchaseSubscription(plan.packageId);
    
    if (success) {
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (trigger) {
      case 'session_limit':
        return 'Session Limit Reached';
      case 'premium_feature':
        return 'Premium Feature';
      default:
        return 'Unlock Your Full Potential';
    }
  };

  const getModalDescription = () => {
    switch (trigger) {
      case 'session_limit':
        return "You've used all your free sessions this month. Upgrade to continue getting expert advice.";
      case 'premium_feature':
        return 'This feature is available for Pro and Expert subscribers. Upgrade to unlock advanced capabilities.';
      default:
        return 'Choose the perfect plan to accelerate your growth with unlimited expert access.';
    }
  };

  const yearlyDiscount = (plan: typeof plans.basic) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {getModalTitle()}
            </h2>
            <p className="text-gray-600 text-lg">
              {getModalDescription()}
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => {
              const planKey = key as keyof typeof plans;
              const isSelected = selectedPlan === planKey;
              const discount = yearlyDiscount(plan);
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const priceLabel = billingCycle === 'monthly' ? '/month' : '/year';

              return (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${price}
                      </span>
                      <span className="text-gray-600">{priceLabel}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 font-medium">
                        Save ${discount.savings.toFixed(2)} ({discount.percentage}% off)
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Plan Info */}
        {subscriptionTier !== 'free' && (
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700">
              <Shield className="h-5 w-5" />
              <span className="font-medium">
                Current Plan: {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Upgrade to {plans[selectedPlan].name}</span>
                  <Crown className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;