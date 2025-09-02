import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
  Crown, 
  Zap,
  BarChart3,
  Clock,
  TrendingUp,
  ChevronRight,
  Grid3X3,
  List,
  Star,
  Sparkles,
  Activity,
  Eye
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
  const { user } = useAuth();
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

  const getSubscriptionIcon = () => {
    switch (subscriptionTier) {
      case 'premium': return <Zap className="w-5 h-5" />;
      case 'agency': return <Crown className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" description="Loading your restaurants...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 gradient-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gradient">Loading Dashboard</h3>
              <p className="text-muted-foreground">Preparing your premium experience...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      description="Welcome to your premium restaurant management hub"
      headerActions={
        <Button 
          onClick={handleCreateRestaurant} 
          className="btn-primary shadow-primary" 
          disabled={!canCreateRestaurant}
          size={isMobile ? "default" : "lg"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Restaurant
        </Button>
      }
    >
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 lg:p-12 mb-8 shadow-premium">
        <div className="absolute inset-0 gradient-aurora opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-glass rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Welcome back{user?.email && `, ${user.email.split('@')[0]}`}!
                  </h1>
                  <p className="text-white/80 text-lg">
                    Ready to create amazing dining experiences?
                  </p>
                </div>
              </div>
            </div>
            {!isMobile && (
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center space-x-3">
                  {getSubscriptionIcon()}
                  <div>
                    <p className="text-white/60 text-sm">Current Plan</p>
                    <p className="text-white font-semibold capitalize">
                      {subscriptionTier}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
        {[
          {
            title: "Restaurants",
            value: usageStats.restaurantCount,
            limit: restrictions.maxRestaurants === Infinity ? '∞' : restrictions.maxRestaurants,
            icon: <Store className="w-6 h-6" />,
            gradient: "gradient-primary",
            shadowClass: "shadow-primary"
          },
          {
            title: "Menu Items",
            value: usageStats.menuItemCount,
            limit: restrictions.maxMenuItems === Infinity ? '∞' : restrictions.maxMenuItems,
            icon: <MenuIcon className="w-6 h-6" />,
            gradient: "gradient-secondary",
            shadowClass: "shadow-secondary"
          },
          {
            title: "Subscription",
            value: subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1),
            limit: null,
            icon: getSubscriptionIcon(),
            gradient: "gradient-accent",
            shadowClass: "shadow-accent"
          },
          {
            title: "Member Since",
            value: user?.created_at ? formatDate(user.created_at) : 'Today',
            limit: null,
            icon: <Clock className="w-6 h-6" />,
            gradient: "gradient-glass",
            shadowClass: "shadow-glass"
          }
        ].map((stat, index) => (
          <Card key={index} className={`stats-card group ${stat.shadowClass} border-0 overflow-hidden`}>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="opacity-60">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                  </p>
                  {stat.limit && (
                    <span className="text-muted-foreground text-sm">
                      / {stat.limit}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurants Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Your Restaurants
            </h2>
            <p className="text-muted-foreground text-lg">
              Manage your digital dining experiences
            </p>
          </div>
          
          {restaurants.length > 0 && (
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="glass-card p-1 rounded-xl">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'btn-primary' : 'hover:bg-primary/10'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'btn-primary' : 'hover:bg-primary/10'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Cards */}
        {restaurants.length === 0 ? (
          <Card className="premium-card border-0 overflow-hidden">
            <CardContent className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-primary">
                  <Store className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 gradient-secondary rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gradient mb-4">
                Ready to Start?
              </h3>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Create your first restaurant and start building beautiful digital menus that your customers will love.
              </p>
              <Button 
                onClick={handleCreateRestaurant} 
                size="lg" 
                className="btn-primary shadow-primary px-8 py-4 text-lg" 
                disabled={!canCreateRestaurant}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Restaurant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" 
              : "space-y-6"
          }>
            {restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className={`
                  floating-card border-0 overflow-hidden cursor-pointer group
                  ${viewMode === 'list' ? 'flex-row' : ''}
                `}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className={viewMode === 'list' ? 'flex items-center w-full p-6' : 'p-6'}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div 
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-elastic"
                        style={{ 
                          background: `linear-gradient(135deg, ${restaurant.primary_color} 0%, ${restaurant.secondary_color} 100%)` 
                        }}
                      >
                        {restaurant.logo_url ? (
                          <img 
                            src={restaurant.logo_url} 
                            alt={`${restaurant.name} logo`}
                            className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-2xl"
                          />
                        ) : (
                          <Store className="w-8 h-8 lg:w-10 lg:h-10" />
                        )}
                      </div>
                      {restaurant.slug && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 gradient-accent rounded-full flex items-center justify-center shadow-accent">
                          <Eye className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-gradient transition-smooth truncate">
                          {restaurant.name}
                        </h3>
                        {restaurant.slug && (
                          <Badge className="badge-accent">Live</Badge>
                        )}
                      </div>
                      {restaurant.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {restaurant.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          Active
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(restaurant.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-spring flex-shrink-0 ml-4" />
                  )}
                </div>
                
                {viewMode === 'grid' && (
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 hover:bg-primary/10 hover:text-primary transition-smooth"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/restaurant/${restaurant.id}`);
                          }}
                        >
                          <MenuIcon className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                        {restaurant.slug && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 hover:bg-accent/10 hover:text-accent transition-smooth"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/menu/${restaurant.slug}`, '_blank');
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-spring" />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateRestaurantDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onRestaurantCreated={handleRestaurantCreated}
      />
    </DashboardLayout>
  );
};