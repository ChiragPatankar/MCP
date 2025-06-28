import React, { useState } from 'react';
import { X, CreditCard, Clock, Shield, Star, CheckCircle } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';

interface SessionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    rating: number;
    rate: number;
  };
  selectedTime: string;
}

const SessionPaymentModal: React.FC<SessionPaymentModalProps> = ({
  isOpen,
  onClose,
  mentor,
  selectedTime
}) => {
  const { purchaseSession, loading, subscriptionTier, canBookSession, getRemainingCredits } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<'subscription' | 'individual'>('individual');
  
  if (!isOpen) return null;

  const remainingCredits = getRemainingCredits();
  const hasCredits = canBookSession();

  const handlePayment = async () => {
    if (paymentMethod === 'subscription' && hasCredits) {
      // Use subscription credit
      // In a real app, you'd call your backend to deduct a credit
      console.log('Using subscription credit');
      onClose();
      // Show success message
    } else {
      // Individual payment
      const success = await purchaseSession(mentor.id, mentor.rate);
      if (success) {
        onClose();
      }
    }
  };

  const getSubscriptionBadge = () => {
    switch (subscriptionTier) {
      case 'basic':
        return { label: 'Basic', color: 'bg-blue-100 text-blue-700' };
      case 'pro':
        return { label: 'Pro', color: 'bg-purple-100 text-purple-700' };
      case 'expert':
        return { label: 'Expert', color: 'bg-gold-100 text-gold-700' };
      default:
        return null;
    }
  };

  const subscriptionBadge = getSubscriptionBadge();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirm Your Session
          </h2>
          <p className="text-gray-600">
            You're about to book a 5-minute session
          </p>
        </div>

        {/* Session Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={mentor.avatar} 
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
              <p className="text-gray-600 text-sm">{mentor.title}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{mentor.rating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Session Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">5 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session Rate:</span>
              <span className="font-medium">${mentor.rate}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-6">
          {/* Subscription Status */}
          {subscriptionBadge && (
            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriptionBadge.color}`}>
                    {subscriptionBadge.label} Member
                  </span>
                  {remainingCredits === -1 ? (
                    <span className="text-green-600 text-sm font-medium">Unlimited Sessions</span>
                  ) : (
                    <span className="text-gray-600 text-sm">
                      {remainingCredits} credits remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3 mb-6">
            {hasCredits && subscriptionTier !== 'free' && (
              <label className="flex items-center space-x-3 p-4 border-2 border-green-200 bg-green-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="subscription"
                  checked={paymentMethod === 'subscription'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'subscription')}
                  className="text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-gray-900">Use Subscription Credit</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {remainingCredits === -1 
                      ? 'Unlimited sessions included in your plan'
                      : `${remainingCredits} credits remaining this month`
                    }
                  </p>
                </div>
                <span className="text-green-600 font-bold">FREE</span>
              </label>
            )}

            <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
              <input
                type="radio"
                name="paymentMethod"
                value="individual"
                checked={paymentMethod === 'individual'}
                onChange={(e) => setPaymentMethod(e.target.value as 'individual')}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Pay Per Session</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  One-time payment for this session
                </p>
              </div>
              <span className="text-gray-900 font-bold">${mentor.rate}</span>
            </label>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {paymentMethod === 'subscription' && hasCredits ? 'FREE' : `$${mentor.rate}`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'subscription' && hasCredits ? 'Book Session' : 'Pay & Book'}
                  </span>
                  <Clock className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Cancel up to 1hr before</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPaymentModal;