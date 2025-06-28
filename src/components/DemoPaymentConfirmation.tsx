import React, { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Calendar, User, DollarSign, Sparkles } from 'lucide-react';
import SuccessAnimation from './SuccessAnimation';

interface DemoPaymentConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    amount: number;
    mentorName: string;
    sessionTime: string;
    paymentMethod: 'subscription' | 'individual';
  };
}

const DemoPaymentConfirmation: React.FC<DemoPaymentConfirmationProps> = ({
  isOpen,
  onClose,
  paymentData
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  const processingStages = [
    'Validating payment method...',
    'Processing payment...',
    'Confirming session booking...',
    'Sending confirmation...',
    'Complete!'
  ];

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setProcessingStage(0);
      
      // Simulate payment processing
      const interval = setInterval(() => {
        setProcessingStage(prev => {
          if (prev >= processingStages.length - 1) {
            clearInterval(interval);
            setTimeout(() => setShowSuccess(true), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <SuccessAnimation
        type="payment"
        title="Payment Successful!"
        message={`Your session with ${paymentData.mentorName} is confirmed for ${paymentData.sessionTime}`}
        onComplete={onClose}
        duration={4000}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
        {/* Processing Animation */}
        <div className="mb-6">
          <div className="relative">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              {processingStage === processingStages.length - 1 ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : (
                <CreditCard className="h-10 w-10 text-white" />
              )}
            </div>
            {processingStage < processingStages.length - 1 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-ping opacity-20"></div>
            )}
          </div>
        </div>

        {/* Processing Status */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {processingStage === processingStages.length - 1 ? 'Payment Complete!' : 'Processing Payment'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {processingStages[processingStage]}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((processingStage + 1) / processingStages.length) * 100}%` }}
          ></div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${paymentData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mentor:</span>
              <span className="font-medium">{paymentData.mentorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session Time:</span>
              <span className="font-medium">{paymentData.sessionTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">
                {paymentData.paymentMethod === 'subscription' ? 'Subscription Credit' : 'Credit Card'}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Badge */}
        <div className="flex items-center justify-center space-x-2 text-purple-600 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Demo Mode - No actual payment processed</span>
        </div>
      </div>
    </div>
  );
};

export default DemoPaymentConfirmation;