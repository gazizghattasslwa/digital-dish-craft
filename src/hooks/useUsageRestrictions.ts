import { useState, useEffect } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UsageRestrictions {
  maxRestaurants: number;
  maxMenuItems: number;
  canCustomizeBranding: boolean;
  canUseAllTemplates: boolean;
}

export interface UsageStats {
  restaurantCount: number;
  menuItemCount: number;
}

export const useUsageRestrictions = () => {
  const { subscriptionTier } = useSubscription();
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState<UsageStats>({
    restaurantCount: 0,
    menuItemCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const getRestrictions = (): UsageRestrictions => {
    switch (subscriptionTier) {
      case 'free':
        return {
          maxRestaurants: 1,
          maxMenuItems: 20,
          canCustomizeBranding: false,
          canUseAllTemplates: false,
        };
      case 'premium':
        return {
          maxRestaurants: 2,
          maxMenuItems: Infinity,
          canCustomizeBranding: false,
          canUseAllTemplates: true,
        };
      case 'agency':
        return {
          maxRestaurants: 100,
          maxMenuItems: Infinity,
          canCustomizeBranding: true,
          canUseAllTemplates: true,
        };
      default:
        return {
          maxRestaurants: 1,
          maxMenuItems: 20,
          canCustomizeBranding: false,
          canUseAllTemplates: false,
        };
    }
  };

  const fetchUsageStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get restaurant count
      const { count: restaurantCount } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get user's restaurant IDs first
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id);

      const restaurantIds = restaurants?.map(r => r.id) || [];

      // Get total menu items count across all user's restaurants
      let menuItemCount = 0;
      if (restaurantIds.length > 0) {
        const { count } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .in('restaurant_id', restaurantIds);
        menuItemCount = count || 0;
      }

      setUsageStats({
        restaurantCount: restaurantCount || 0,
        menuItemCount,
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageStats();
  }, [user]);

  const restrictions = getRestrictions();

  const canCreateRestaurant = usageStats.restaurantCount < restrictions.maxRestaurants;
  const canCreateMenuItem = usageStats.menuItemCount < restrictions.maxMenuItems;

  return {
    restrictions,
    usageStats,
    loading,
    canCreateRestaurant,
    canCreateMenuItem,
    fetchUsageStats,
  };
};