import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: 'free' | 'premium' | 'agency';
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (plan: 'premium' | 'agency') => Promise<string>;
  openCustomerPortal: () => Promise<string>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscribed: false,
  subscriptionTier: 'free',
  subscriptionEnd: null,
  loading: false,
  checkSubscription: async () => {},
  createCheckout: async () => '',
  openCustomerPortal: async () => '',
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'agency'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    if (!session?.access_token) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) throw error;
      
      setSubscribed(data.subscribed || false);
      setSubscriptionTier(data.subscription_tier || 'free');
      setSubscriptionEnd(data.subscription_end);
    } catch (error) {
      toast.error("Error checking subscription: " + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (plan: 'premium' | 'agency'): Promise<string> => {
    if (!session?.access_token) throw new Error('Not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { plan }
      });
      
      if (error) throw error;
      return data.url;
    } catch (error) {
      toast.error("Error creating checkout: " + getErrorMessage(error));
      return '';
    }
  };

  const openCustomerPortal = async (): Promise<string> => {
    if (!session?.access_token) throw new Error('Not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) throw error;
      return data.url;
    } catch (error) {
      toast.error("Error opening customer portal: " + getErrorMessage(error));
      return '';
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscribed(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
    }
  }, [user, session]);

  return (
    <SubscriptionContext.Provider value={{
      subscribed,
      subscriptionTier,
      subscriptionEnd,
      loading,
      checkSubscription,
      createCheckout,
      openCustomerPortal,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};