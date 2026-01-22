import React, { useState } from 'react';
import { Check, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { paymentService, PaymentPlan } from '@/lib/payment';

interface PricingCardProps {
  plan: PaymentPlan;
  highlighted?: boolean;
  currentPlan?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, highlighted = false, currentPlan }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;

  const handleSubscribe = async () => {
    if (!user || isCurrentPlan || isFree) return;

    setIsLoading(true);
    try {
      const success = await paymentService.initiatePayment(
        plan.id,
        user.id,
        {
          name: user.name,
          email: user.email,
          contact: (user as any).phone || user.email.split('@')[0] || '9999999999'
        }
      );

      if (success) {
        setIsSuccess(true);
        // Refresh page or update user subscription status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isSuccess) return 'Payment Successful!';
    if (isLoading) return 'Processing...';
    if (isCurrentPlan) return 'Current Plan';
    if (isFree) return 'Get Started';
    return `Subscribe for ${paymentService.formatPrice(plan.price)}`;
  };

  const getButtonVariant = () => {
    if (isSuccess) return 'default';
    if (isCurrentPlan) return 'outline';
    if (highlighted) return 'default';
    return 'outline';
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      highlighted ? 'ring-2 ring-primary ring-opacity-50 transform scale-105' : ''
    }`}>
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 py-2">
          <div className="flex items-center justify-center">
            <Crown className="h-4 w-4 text-white mr-1" />
            <span className="text-white text-sm font-semibold">Most Popular</span>
          </div>
        </div>
      )}

      <div className={`p-6 ${highlighted ? 'pt-12' : ''}`}>
        {/* Plan Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-gray-900">
              {paymentService.formatPrice(plan.price)}
            </span>
            {plan.price > 0 && (
              <span className="text-base font-medium text-gray-500">/month</span>
            )}
          </div>
        </div>

        {/* Features List */}
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-base text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <div className="mt-8">
          <Button
            onClick={handleSubscribe}
            disabled={isLoading || isCurrentPlan || isSuccess}
            variant={getButtonVariant()}
            className={`w-full py-3 ${
              highlighted ? 'bg-primary hover:bg-primary/90' : ''
            } ${isSuccess ? 'bg-green-600 hover:bg-green-600' : ''}`}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSuccess && <Check className="mr-2 h-4 w-4" />}
            {getButtonText()}
          </Button>
        </div>

        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Active Subscription
            </span>
          </div>
        )}

        {/* Free Plan Notice */}
        {isFree && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 text-center">
              No credit card required
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard; 