import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUsageRestrictions } from '@/hooks/useUsageRestrictions';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Store, 
  Menu as MenuIcon, 
  Users, 
  LogOut, 
  Settings, 
  Crown, 
  Zap,
  BarChart3,
  Clock,
  TrendingUp,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';
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

export const EnhancedDashboard = () => {
  const { user, signOut } = useAuth();
  const { subscriptionTier, subscribed } = useSubscription();
  const { usageStats, restrictions, canCreateRestaurant } = useUsageRestrictions();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Enhanced Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/40 shadow-soft sticky top-0 z-50">
        <div className="container-fluid py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-soft">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">MenuCraft</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Welcome back, {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant={subscriptionTier === 'free' ? 'secondary' : 'default'} 
                className="hidden sm:flex items-center gap-1 shadow-soft"
              >
                {subscriptionTier === 'agency' && <Crown className="w-3 h-3" />}
                {subscriptionTier === 'premium' && <Zap className="w-3 h-3" />}
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Badge>
              
              <Button variant="ghost" size={isMobile ? "sm" : "default"} asChild className="hover-lift">
                <Link to="/subscription">
                  <Settings className="w-4 h-4 sm:mr-2" />
                  {!isMobile && "Subscription"}
                </Link>
              </Button>
              
              <Button variant="ghost" size={isMobile ? "sm" : "default"} onClick={handleSignOut} className="hover-lift">
                <LogOut className="w-4 h-4 sm:mr-2" />
                {!isMobile && "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[
            {
              title: "Restaurants",
              value: `${usageStats.restaurantCount}/${restrictions.maxRestaurants === Infinity ? '∞' : restrictions.maxRestaurants}`,
              icon: <Store className="w-5 h-5" />,
              color: "text-primary"
            },
            {
              title: "Menu Items",
              value: `${usageStats.menuItemCount}/${restrictions.maxMenuItems === Infinity ? '∞' : restrictions.maxMenuItems}`,
              icon: <MenuIcon className="w-5 h-5" />,
              color: "text-accent"
            },
            {
              title: "Plan",
              value: subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1),
              icon: subscriptionTier === 'free' ? <BarChart3 className="w-5 h-5" /> : 
                    subscriptionTier === 'premium' ? <Zap className="w-5 h-5" /> : <Crown className="w-5 h-5" />,
              color: "text-purple-600"
            },
            {
              title: "Active Since",
              value: user?.created_at ? formatDate(user.created_at) : 'Today',
              icon: <Clock className="w-5 h-5" />,
              color: "text-green-600"
            }
          ].map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-warm transition-all duration-200 hover-lift">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} opacity-75`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your Restaurants</h2>
            <p className="text-muted-foreground">
              Manage your digital menus and restaurant information
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            {restaurants.length > 0 && (
              <div className="flex items-center bg-muted/50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <Button 
              onClick={handleCreateRestaurant} 
              className="shadow-warm hover-lift btn-primary" 
              disabled={!canCreateRestaurant}
              size={isMobile ? "default" : "lg"}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </div>

        {/* Restaurants Grid/List */}
        {restaurants.length === 0 ? (
          <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No restaurants yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Get started by creating your first restaurant. You can add multiple restaurants and manage their menus independently.
              </p>
              <Button 
                onClick={handleCreateRestaurant} 
                size="lg" 
                className="shadow-warm hover-lift btn-primary" 
                disabled={!canCreateRestaurant}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Restaurant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className={`
                  group shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer 
                  border-0 bg-card/80 backdrop-blur-sm hover-lift
                  ${viewMode === 'list' ? 'flex-row' : ''}
                `}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className={viewMode === 'list' ? 'flex items-center w-full' : ''}>
                  <CardHeader className={viewMode === 'list' ? 'flex-row items-center space-y-0 space-x-4' : 'pb-4'}>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-white shadow-soft"
                        style={{ backgroundColor: restaurant.primary_color }}
                      >
                        {restaurant.logo_url ? (
                          <img 
                            src={restaurant.logo_url} 
                            alt={`${restaurant.name} logo`}
                            className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <Store className="w-6 h-6 lg:w-8 lg:h-8" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg lg:text-xl truncate group-hover:text-primary transition-colors">
                          {restaurant.name}
                        </CardTitle>
                        {restaurant.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {restaurant.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {viewMode === 'list' && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    )}
                  </CardHeader>
                  
                  {viewMode === 'grid' && (
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span className="flex items-center">
                            <MenuIcon className="w-4 h-4 mr-1" />
                            Menu
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {restaurant.slug ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(restaurant.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  )}
                </div>
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
};