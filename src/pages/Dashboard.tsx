import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUsageRestrictions } from '@/hooks/useUsageRestrictions';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Menu as MenuIcon, Users, LogOut, Settings, Crown, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { CreateRestaurantDialog } from '@/components/CreateRestaurantDialog';
import { toast } from 'sonner';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  slug: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { subscriptionTier, subscribed } = useSubscription();
  const { usageStats, restrictions, canCreateRestaurant } = useUsageRestrictions();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, [user]);

  const fetchRestaurants = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error: any) {
      toast.error('Error loading restaurants: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateRestaurant = () => {
    if (!canCreateRestaurant) {
      toast.error(`You've reached the limit of ${restrictions.maxRestaurants} restaurant${restrictions.maxRestaurants > 1 ? 's' : ''} for your plan.`);
      return;
    }
    setShowCreateDialog(true);
  };

  const handleRestaurantCreated = () => {
    setShowCreateDialog(false);
    fetchRestaurants();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/40 shadow-warm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MenuCraft Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={subscriptionTier === 'free' ? 'secondary' : 'default'} className="flex items-center gap-1">
                {subscriptionTier === 'agency' && <Crown className="w-3 h-3" />}
                {subscriptionTier === 'premium' && <Zap className="w-3 h-3" />}
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/subscription">
                  <Settings className="w-4 h-4 mr-2" />
                  Subscription
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Restaurants</h2>
            <p className="text-muted-foreground">
              Manage your digital menus and restaurant information 
              ({usageStats.restaurantCount}/{restrictions.maxRestaurants === Infinity ? '∞' : restrictions.maxRestaurants} restaurants, {usageStats.menuItemCount}/{restrictions.maxMenuItems === Infinity ? '∞' : restrictions.maxMenuItems} menu items)
            </p>
          </div>
          <Button onClick={handleCreateRestaurant} className="shadow-warm" disabled={!canCreateRestaurant}>
            <Plus className="w-4 h-4 mr-2" />
            Add Restaurant
          </Button>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No restaurants yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first restaurant. You can add multiple restaurants and manage their menus independently.
            </p>
            <Button onClick={handleCreateRestaurant} size="lg" className="shadow-warm" disabled={!canCreateRestaurant}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Restaurant
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: restaurant.primary_color }}
                    >
                      {restaurant.logo_url ? (
                        <img 
                          src={restaurant.logo_url} 
                          alt={restaurant.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <Store className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                      {restaurant.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {restaurant.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <MenuIcon className="w-4 h-4 mr-1" />
                        Menu
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {restaurant.slug ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <span className="text-xs">
                      {new Date(restaurant.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateRestaurantDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onRestaurantCreated={handleRestaurantCreated}
      />
    </div>
  );
}