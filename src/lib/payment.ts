// Payment Service - Minimal implementation for pricing display

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: PaymentPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    features: [
      '1 Chat Bot',
      '100 messages/month',
      'Basic Analytics',
      'Email Support',
      'Knowledge Base (5MB)'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2900, // in cents
    popular: true,
    features: [
      '5 Chat Bots',
      '2,000 messages/month',
      'Advanced Analytics',
      'Priority Support',
      'Knowledge Base (50MB)',
      'Custom Branding',
      'API Access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9900, // in cents
    features: [
      'Unlimited Chat Bots',
      'Unlimited messages',
      'Full Analytics Suite',
      '24/7 Phone Support',
      'Unlimited Knowledge Base',
      'White-label Solution',
      'Custom Integrations',
      'Dedicated Account Manager'
    ]
  }
];

class PaymentService {
  formatPrice(priceInCents: number): string {
    if (priceInCents === 0) return 'Free';
    return `$${(priceInCents / 100).toFixed(0)}`;
  }

  async initiatePayment(planId: string, userId: string, userInfo: any): Promise<boolean> {
    console.log('Payment initiated for plan:', planId, 'user:', userId);
    // TODO: Implement actual payment integration (Stripe/Razorpay)
    alert('Payment integration not yet implemented. Contact support for enterprise plans.');
    return false;
  }

  async getSubscriptionStatus(userId: string): Promise<any> {
    return {
      plan: 'starter',
      status: 'active',
      expiresAt: null
    };
  }

  getPlans(): PaymentPlan[] {
    return PLANS;
  }
}

export const paymentService = new PaymentService();




