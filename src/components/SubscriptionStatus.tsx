import React, { useState } from 'react';
import { Crown, Star, Zap, Calendar, CreditCard, Settings, Gift } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import PaywallModal from './PaywallModal';

const SubscriptionStatus: React.FC = () => {
  const { 
    subscriptionTier, 
    getSubscriptionBenefits, 
    getRemainingCredits, 
    customerInfo,
    restorePurchases,
    loading 
  } = usePayment();
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [showManageSubscription, setShowManageSubscription] = useState(false);

  const benefits = getSubscriptionBenefits();
  const remainingCredits = getRemainingCredits();

  const getTierInfo = () => {
    switch (subscriptionTier) {
      case 'basic':
        return {
          name: 'Basic',
          icon: <Zap className="h-6 w-6 text-blue-500" />,
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'pro':
        return {
          name: 'Pro',
          icon: <Star className="h-6 w-6 text-purple-500" />,
          color: 'purple',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'expert':
        return {
          name: 'Expert',
          icon: <Crown className="h-6 w-6 text-yellow-500" />,
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          name: 'Free',
          icon: <Gift className="h-6 w-6 text-gray-500" />,
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const tierInfo = getTierInfo();

  if (subscriptionTier === 'free') {
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Free Plan
            </h3>
            <p className="text-gray-600 mb-4">
              You have {benefits.sessionsPerMonth} free sessions per month
            </p>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {remainingCredits}
              </div>
              <div className="text-gray-600">sessions remaining</div>
            </div>

            <button
              onClick={() => setShowPaywall(true)}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium flex items-center justify-center space-x-2"
            >
              <Crown className="h-5 w-5" />
              <span>Upgrade for Unlimited Access</span>
            </button>
          </div>
        </div>

        <PaywallModal 
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          trigger="upgrade_prompt"
        />
      </>
    );
  }

  return (
    <>
      <div className={`${tierInfo.bgColor} rounded-xl border ${tierInfo.borderColor} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {tierInfo.icon}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {tierInfo.name} Plan
              </h3>
              <p className="text-gray-600">Active subscription</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowManageSubscription(true)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {remainingCredits === -1 ? '∞' : remainingCredits}
            </div>
            <div className="text-gray-600 text-sm">
              {remainingCredits === -1 ? 'Unlimited' : 'Sessions Left'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {benefits.sessionsPerMonth === -1 ? '∞' : benefits.sessionsPerMonth}
            </div>
            <div className="text-gray-600 text-sm">Monthly Limit</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Your Benefits:</h4>
          
          {benefits.prioritySupport && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Priority support</span>
            </div>
          )}
          
          {benefits.advancedMatching && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Advanced AI matching</span>
            </div>
          )}
          
          {benefits.sessionRecordings && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Session recordings</span>
            </div>
          )}
          
          {benefits.groupSessions && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Group sessions</span>
            </div>
          )}
          
          {benefits.expertAccess && (
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Premium expert access</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {subscriptionTier !== 'expert' && (
            <button
              onClick={() => setShowPaywall(true)}
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium text-sm"
            >
              Upgrade Plan
            </button>
          )}
          
          <button
            onClick={restorePurchases}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium text-sm disabled:opacity-50"
          >
            {loading ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      </div>

      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="upgrade_prompt"
      />

      {/* Manage Subscription Modal */}
      {showManageSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Manage Subscription
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Plan:</span>
                <span className="font-medium">{tierInfo.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              
              {customerInfo?.latestExpirationDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Renews:</span>
                  <span className="font-medium">
                    {new Date(customerInfo.latestExpirationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowManageSubscription(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // In a real app, this would open the RevenueCat customer portal
                  window.open('https://app.revenuecat.com/customer-portal', '_blank');
                }}
                className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Manage Billing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionStatus;