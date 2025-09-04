import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUsageRestrictions } from '@/hooks/useUsageRestrictions';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/SearchInput';
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
  Activity,
  Eye,
  Filter
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  restaurant_id: string;
  restaurant?: {
    name: string;
    slug: string;
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export const MinimalDashboard = () => {
  const { user } = useAuth();
  const { subscriptionTier, subscribed } = useSubscription();
  const { usageStats, restrictions, canCreateRestaurant } = useUsageRestrictions();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch restaurants
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (restaurantError) throw restaurantError;
      setRestaurants(restaurantData || []);

      // Fetch menu items with restaurant info
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          description,
          price,
          restaurant_id,
          restaurants!inner (
            name,
            slug,
            user_id
          )
        `)
        .eq('restaurants.user_id', user.id)
        .order('created_at', { ascending: false });

      if (menuError) throw menuError;
      
      const processedMenuItems = menuData?.map(item => ({
        ...item,
        restaurant: {
          name: (item.restaurants as any).name,
          slug: (item.restaurants as any).slug
        }
      })) || [];
      
      setMenuItems(processedMenuItems);
    } catch (error) {
      toast.error('Error loading data: ' + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants and menu items based on search
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return { restaurants, menuItems: [] };
    }

    const filteredRestaurants = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query) ||
      (restaurant.description || '').toLowerCase().includes(query)
    );

    const filteredMenuItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.restaurant?.name || '').toLowerCase().includes(query)
    );

    return { 
      restaurants: filteredRestaurants, 
      menuItems: filteredMenuItems 
    };
  }, [restaurants, menuItems, searchQuery]);

  const handleCreateRestaurant = () => {
    if (!canCreateRestaurant) {
      toast.error(`You've reached the limit of ${restrictions.maxRestaurants} restaurant${restrictions.maxRestaurants > 1 ? 's' : ''} for your plan.`);
      return;
    }
    setShowCreateDialog(true);
  };

  const handleRestaurantCreated = () => {
    setShowCreateDialog(false);
    fetchData();
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
      case 'premium': return <Zap className="w-4 h-4" />;
      case 'agency': return <Crown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" description="Loading your restaurants...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      description="Manage your restaurants and menus"
      headerActions={
        <Button 
          onClick={handleCreateRestaurant} 
          className="btn-clean" 
          disabled={!canCreateRestaurant}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Restaurant
        </Button>
      }
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Restaurants",
            value: usageStats.restaurantCount,
            limit: restrictions.maxRestaurants === Infinity ? '∞' : restrictions.maxRestaurants,
            icon: <Store className="w-5 h-5" />,
            color: "text-primary"
          },
          {
            title: "Menu Items",
            value: usageStats.menuItemCount,
            limit: restrictions.maxMenuItems === Infinity ? '∞' : restrictions.maxMenuItems,
            icon: <MenuIcon className="w-5 h-5" />,
            color: "text-accent"
          },
          {
            title: "Subscription",
            value: subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1),
            limit: null,
            icon: getSubscriptionIcon(),
            color: "text-primary"
          },
          {
            title: "Member Since",
            value: user?.created_at ? formatDate(user.created_at) : 'Today',
            limit: null,
            icon: <Clock className="w-5 h-5" />,
            color: "text-muted-foreground"
          }
        ].map((stat, index) => (
          <Card key={index} className="clean-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-foreground">
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                  </p>
                  {stat.limit && (
                    <span className="text-sm text-muted-foreground">
                      / {stat.limit}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search restaurants and menu items..."
          className="flex-1"
        />
        
        {restaurants.length > 0 && !searchQuery && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="transition-base"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="transition-base"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-6 mb-8">
          {filteredData.restaurants.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Restaurants ({filteredData.restaurants.length})</h3>
              <div className="grid gap-4">
                {filteredData.restaurants.map((restaurant) => (
                  <Card 
                    key={restaurant.id} 
                    className="hover-card cursor-pointer"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: restaurant.primary_color }}
                          >
                            {restaurant.logo_url ? (
                              <img 
                                src={restaurant.logo_url} 
                                alt={`${restaurant.name} logo`}
                                className="w-6 h-6 object-cover rounded"
                              />
                            ) : (
                              <Store className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{restaurant.name}</h4>
                            {restaurant.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {restaurant.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredData.menuItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Menu Items ({filteredData.menuItems.length})</h3>
              <div className="grid gap-4">
                {filteredData.menuItems.map((item) => (
                  <Card key={item.id} className="hover-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            from {item.restaurant?.name}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.price}</p>
                          {item.restaurant?.slug && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/menu/${item.restaurant?.slug}`, '_blank')}
                              className="text-xs p-1 h-auto"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredData.restaurants.length === 0 && filteredData.menuItems.length === 0 && (
            <Card className="clean-card">
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or create a new restaurant.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Restaurants Section (when not searching) */}
      {!searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your Restaurants</h2>
              <p className="text-muted-foreground">Manage your digital dining experiences</p>
            </div>
          </div>

          {restaurants.length === 0 ? (
            <Card className="clean-card">
              <CardContent className="text-center py-20">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Create your first restaurant and start building beautiful digital menus.
                </p>
                <Button 
                  onClick={handleCreateRestaurant} 
                  className="btn-clean" 
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
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-2"
            }>
              {restaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className={viewMode === 'grid' 
                    ? "bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                    : "bg-white rounded-lg shadow-sm cursor-pointer"
                  }
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <CardHeader className="p-0">
                        <div className="h-40 bg-gray-200 flex items-center justify-center" style={{ backgroundColor: restaurant.primary_color }}>
                          {restaurant.logo_url ? (
                            <img src={restaurant.logo_url} alt={`${restaurant.name} logo`} className="h-20 w-20 object-contain rounded-full bg-white p-2 shadow-md" />
                          ) : (
                            <Store className="h-16 w-16 text-white" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold truncate">{restaurant.name}</h3>
                          {restaurant.slug && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Live</Badge>
                          )}
                        </div>
                        {restaurant.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDate(restaurant.created_at)}
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: restaurant.primary_color }}
                          >
                            {restaurant.logo_url ? (
                              <img 
                                src={restaurant.logo_url} 
                                alt={`${restaurant.name} logo`}
                                className="w-6 h-6 object-cover rounded"
                              />
                            ) : (
                              <Store className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{restaurant.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(restaurant.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {restaurant.slug && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Live</Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <CreateRestaurantDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onRestaurantCreated={handleRestaurantCreated}
      />
    </DashboardLayout>
  );
};