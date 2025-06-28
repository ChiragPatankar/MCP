import React, { createContext, useContext, useState, useEffect } from 'react';

// RevenueCat types - simplified for web implementation
interface CustomerInfo {
  entitlements: {
    active: Record<string, any>;
  };
  originalPurchaseDate?: string;
  requestDate: string;
}

interface PurchasesPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
}

interface PurchasesOffering {
  identifier: string;
  description: string;
  availablePackages: PurchasesPackage[];
}

interface PaymentContextType {
  // RevenueCat
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering[] | null;
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'expert';
  
  // Session Payments
  purchaseSession: (mentorId: string, sessionPrice: number) => Promise<boolean>;
  purchaseSubscription: (packageId: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  
  // Payment State
  loading: boolean;
  error: string | null;
  
  // Subscription Benefits
  getSubscriptionBenefits: () => SubscriptionBenefits;
  canBookSession: () => boolean;
  getRemainingCredits: () => number;
}

interface SubscriptionBenefits {
  sessionsPerMonth: number;
  prioritySupport: boolean;
  advancedMatching: boolean;
  sessionRecordings: boolean;
  expertAccess: boolean;
  groupSessions: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize RevenueCat (simplified for web)
  useEffect(() => {
    const initializePaymentSystem = async () => {
      try {
        // Simulate RevenueCat initialization
        // In a real implementation, you would use the actual RevenueCat Web SDK
        console.log('Initializing payment system...');
        
        // Mock customer info for development
        const mockCustomerInfo: CustomerInfo = {
          entitlements: {
            active: {}
          },
          requestDate: new Date().toISOString()
        };
        
        setCustomerInfo(mockCustomerInfo);

        // Mock offerings
        const mockOfferings: PurchasesOffering[] = [
          {
            identifier: 'default',
            description: 'Default offering',
            availablePackages: [
              {
                identifier: 'basic_monthly',
                packageType: 'monthly',
                product: {
                  identifier: 'basic_monthly',
                  description: 'Basic Plan - Monthly',
                  title: 'Basic Monthly',
                  price: 9.99,
                  priceString: '$9.99',
                  currencyCode: 'USD'
                }
              },
              {
                identifier: 'pro_monthly',
                packageType: 'monthly',
                product: {
                  identifier: 'pro_monthly',
                  description: 'Pro Plan - Monthly',
                  title: 'Pro Monthly',
                  price: 29.99,
                  priceString: '$29.99',
                  currencyCode: 'USD'
                }
              },
              {
                identifier: 'expert_monthly',
                packageType: 'monthly',
                product: {
                  identifier: 'expert_monthly',
                  description: 'Expert Plan - Monthly',
                  title: 'Expert Monthly',
                  price: 99.99,
                  priceString: '$99.99',
                  currencyCode: 'USD'
                }
              }
            ]
          }
        ];
        
        setOfferings(mockOfferings);
        setLoading(false);
      } catch (err) {
        console.error('Payment system initialization error:', err);
        setError('Failed to initialize payment system');
        setLoading(false);
      }
    };

    initializePaymentSystem();
  }, []);

  // Determine subscription status and tier
  const isSubscribed = customerInfo?.entitlements.active ? 
    Object.keys(customerInfo.entitlements.active).length > 0 : false;

  const subscriptionTier: 'free' | 'basic' | 'pro' | 'expert' = (() => {
    if (!customerInfo?.entitlements.active) return 'free';
    
    if (customerInfo.entitlements.active['expert_access']) return 'expert';
    if (customerInfo.entitlements.active['pro_access']) return 'pro';
    if (customerInfo.entitlements.active['basic_access']) return 'basic';
    
    return 'free';
  })();

  // Purchase individual session
  const purchaseSession = async (mentorId: string, sessionPrice: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // For individual sessions, we'll use Stripe for one-time payments
      const response = await fetch('/api/create-session-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId,
          amount: sessionPrice * 100, // Convert to cents
          currency: 'usd',
        }),
      });

      // Check if the response is successful before parsing JSON
      if (!response.ok) {
        throw new Error(`Payment request failed with status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js').then(m => 
        m.loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')
      );
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error('Session purchase error:', err);
      setError('Failed to process payment');
      setLoading(false);
      return false;
    }
  };

  // Purchase subscription
  const purchaseSubscription = async (packageId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Find the package
      const targetPackage = offerings?.flatMap(offering => offering.availablePackages)
        .find(pkg => pkg.identifier === packageId);

      if (!targetPackage) {
        throw new Error('Package not found');
      }

      // Simulate subscription purchase
      // In a real implementation, this would integrate with RevenueCat and Stripe
      console.log('Purchasing subscription:', packageId);
      
      // Mock successful purchase by updating customer info
      const updatedCustomerInfo: CustomerInfo = {
        ...customerInfo!,
        entitlements: {
          active: {
            [packageId.includes('basic') ? 'basic_access' : 
             packageId.includes('pro') ? 'pro_access' : 
             'expert_access']: {
              identifier: packageId,
              isActive: true,
              willRenew: true,
              periodType: 'monthly',
              latestPurchaseDate: new Date().toISOString(),
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        }
      };
      
      setCustomerInfo(updatedCustomerInfo);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Subscription purchase error:', err);
      setError('Failed to purchase subscription');
      setLoading(false);
      return false;
    }
  };

  // Restore purchases
  const restorePurchases = async (): Promise<void> => {
    try {
      setLoading(true);
      // In a real implementation, this would call RevenueCat's restore method
      console.log('Restoring purchases...');
      setLoading(false);
    } catch (err) {
      console.error('Restore purchases error:', err);
      setError('Failed to restore purchases');
      setLoading(false);
    }
  };

  // Get subscription benefits
  const getSubscriptionBenefits = (): SubscriptionBenefits => {
    switch (subscriptionTier) {
      case 'basic':
        return {
          sessionsPerMonth: 10,
          prioritySupport: false,
          advancedMatching: true,
          sessionRecordings: false,
          expertAccess: false,
          groupSessions: false,
        };
      case 'pro':
        return {
          sessionsPerMonth: 50,
          prioritySupport: true,
          advancedMatching: true,
          sessionRecordings: true,
          expertAccess: false,
          groupSessions: true,
        };
      case 'expert':
        return {
          sessionsPerMonth: -1, // Unlimited
          prioritySupport: true,
          advancedMatching: true,
          sessionRecordings: true,
          expertAccess: true,
          groupSessions: true,
        };
      default:
        return {
          sessionsPerMonth: 2,
          prioritySupport: false,
          advancedMatching: false,
          sessionRecordings: false,
          expertAccess: false,
          groupSessions: false,
        };
    }
  };

  // Check if user can book session
  const canBookSession = (): boolean => {
    const benefits = getSubscriptionBenefits();
    if (benefits.sessionsPerMonth === -1) return true; // Unlimited
    
    // In a real app, you'd track usage from your backend
    const usedSessions = 0; // This would come from your API
    return usedSessions < benefits.sessionsPerMonth;
  };

  // Get remaining credits
  const getRemainingCredits = (): number => {
    const benefits = getSubscriptionBenefits();
    if (benefits.sessionsPerMonth === -1) return -1; // Unlimited
    
    // In a real app, you'd track usage from your backend
    const usedSessions = 0; // This would come from your API
    return Math.max(0, benefits.sessionsPerMonth - usedSessions);
  };

  const value = {
    customerInfo,
    offerings,
    isSubscribed,
    subscriptionTier,
    purchaseSession,
    purchaseSubscription,
    restorePurchases,
    loading,
    error,
    getSubscriptionBenefits,
    canBookSession,
    getRemainingCredits,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};