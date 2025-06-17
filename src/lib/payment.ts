// Razorpay Payment Service
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

class PaymentService {
  private razorpayKeyId: string;
  private baseUrl: string;

  constructor() {
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://gemini-mcp-server-production.up.railway.app';
  }

  // Payment plans matching your pricing
  getPaymentPlans(): PaymentPlan[] {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'INR',
        interval: 'monthly',
        features: [
          '1 Chat Bot',
          '100 messages/month',
          'Basic Analytics',
          'Email Support'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        price: 3999, // ₹39.99 in paise
        currency: 'INR',
        interval: 'monthly',
        features: [
          '3 Chat Bots',
          '2,000 messages/month',
          'Advanced Analytics',
          'Knowledge Base (10MB)',
          'Priority Support'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 7999, // ₹79.99 in paise
        currency: 'INR',
        interval: 'monthly',
        features: [
          '10 Chat Bots',
          '10,000 messages/month',
          'Full Analytics Suite',
          'Knowledge Base (50MB)',
          'Custom Widget Branding',
          '24/7 Support'
        ]
      }
    ];
  }

  // Create order on backend
  async createOrder(planId: string, userId: string): Promise<RazorpayOrder> {
    const plan = this.getPaymentPlans().find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');

    try {
      const response = await fetch(`${this.baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          planId,
          userId,
          amount: plan.price,
          currency: plan.currency
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Verify payment on backend
  async verifyPayment(paymentData: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(
    planId: string, 
    userId: string, 
    userDetails: { name: string; email: string; contact: string }
  ): Promise<boolean> {
    try {
      // Create order
      const order = await this.createOrder(planId, userId);
      const plan = this.getPaymentPlans().find(p => p.id === planId)!;

      return new Promise((resolve, reject) => {
        const options: PaymentOptions = {
          key: this.razorpayKeyId,
          amount: order.amount,
          currency: order.currency,
          name: 'MCP Chat Support',
          description: `${plan.name} Plan Subscription`,
          order_id: order.id,
          prefill: userDetails,
          theme: {
            color: '#3B82F6' // Your primary color
          },
          handler: async (response: any) => {
            try {
              // Verify payment
              const verified = await this.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
                userId
              });

              if (verified) {
                resolve(true);
              } else {
                reject(new Error('Payment verification failed'));
              }
            } catch (error) {
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        // Load Razorpay script dynamically
        this.loadRazorpayScript().then(() => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }).catch(reject);
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  // Load Razorpay script
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  // Format price for display
  formatPrice(price: number, currency: string = 'INR'): string {
    if (price === 0) return 'Free';
    
    const amount = price / 100; // Convert paise to rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Get subscription status
  async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/subscription/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService(); 