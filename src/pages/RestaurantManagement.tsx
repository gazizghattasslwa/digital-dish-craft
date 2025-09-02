import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  QrCode, 
  ExternalLink, 
  Store, 
  Sparkles, 
  Settings, 
  Menu as MenuIcon,
  Palette,
  Globe,
  DollarSign,
  Upload,
  Star,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RestaurantDetails } from '@/components/restaurant/RestaurantDetails';
import { RestaurantBranding } from '@/components/restaurant/RestaurantBranding';
import { LanguageManagement } from '@/components/restaurant/LanguageManagement';
import { CurrencyManagement } from '@/components/restaurant/CurrencyManagement';
import { MenuManagement } from '@/components/restaurant/MenuManagement';
import { MenuPreview } from '@/components/MenuPreview';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { QuickMenuImport } from '@/components/restaurant/QuickMenuImport';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  address: string;
  phone: string;
  website: string;
  default_currency: string;
  default_language: string;
  slug: string;
  menu_template: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  image_url?: string;
  is_special: boolean;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

export default function RestaurantManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    if (id && user) {
      fetchRestaurantData();
    }
  }, [id, user]);

  const fetchRestaurantData = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);

      // Fetch restaurant details
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (restaurantError) {
        if (restaurantError.code === 'PGRST116') {
          toast({
            title: "Restaurant not found",
            description: "This restaurant doesn't exist or you don't have access to it.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }
        throw restaurantError;
      }

      setRestaurant(restaurantData);

      // Fetch menu categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', id)
        .order('display_order', { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id)
        .order('display_order', { ascending: true });

      if (itemsError) throw itemsError;
      setMenuItems(itemsData || []);

    } catch (error: any) {
      toast({
        title: "Error loading restaurant",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantUpdate = (updatedRestaurant: Restaurant) => {
    setRestaurant(updatedRestaurant);
  };

  const handleMenuItemsUpdate = (updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems);
  };

  const handleCategoriesUpdate = (updatedCategories: MenuCategory[]) => {
    setCategories(updatedCategories);
  };

  const generatePublicUrl = () => {
    if (!restaurant?.slug) return null;
    return `${window.location.origin}/menu/${restaurant.slug}`;
  };

  const getBreadcrumbs = () => [
    { label: 'Dashboard', href: '/dashboard' },
    { label: restaurant?.name || 'Restaurant' }
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Restaurant Overview';
      case 'menu': return 'Menu Management';
      case 'import': return 'Quick Import';
      case 'branding': return 'Branding & Colors';
      case 'languages': return 'Language Management';
      case 'currencies': return 'Currency Management';
      case 'preview': return 'Menu Preview';
      default: return 'Restaurant Management';
    }
  };

  // Transform data for MenuPreview component
  const previewMenuItems = menuItems.map(item => {
    const category = categories.find(cat => cat.id === item.category_id);
    return {
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: category?.name || 'Uncategorized',
      image: item.image_url
    };
  });

  if (loading) {
    return (
      <DashboardLayout 
        title="Loading Restaurant..." 
        description="Preparing your restaurant management interface..."
        restaurantId={id}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 gradient-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gradient">Loading Restaurant</h3>
              <p className="text-muted-foreground">Setting up your management interface...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!restaurant) {
    return (
      <DashboardLayout 
        title="Restaurant Not Found" 
        description="This restaurant doesn't exist or you don't have access to it."
        restaurantId={id}
      >
        <Card className="premium-card max-w-md mx-auto mt-20">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-primary">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient mb-4">Restaurant Not Found</h2>
            <p className="text-muted-foreground mb-8">
              This restaurant doesn't exist or you don't have access to it.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="btn-primary"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={getTabTitle()}
      description={`Manage ${restaurant.name}`}
      breadcrumbs={getBreadcrumbs()}
      restaurantId={id}
      headerActions={
        <div className="flex gap-3 flex-wrap">
          {restaurant.slug && (
            <>
              <QRCodeGenerator 
                url={generatePublicUrl() || ''}
                restaurantName={restaurant.name}
                primaryColor={restaurant.primary_color}
                secondaryColor={restaurant.secondary_color}
                logoUrl={restaurant.logo_url}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(generatePublicUrl(), '_blank')}
                className="glass-card hover:shadow-accent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Menu
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('preview')}
            className="glass-card hover:shadow-primary"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Menu
          </Button>
        </div>
      }
    >
      {/* Restaurant Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-8 shadow-premium">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${restaurant.primary_color} 0%, ${restaurant.secondary_color} 100%)`
          }}
        />
        <div className="absolute inset-0 gradient-aurora opacity-30"></div>
        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 lg:w-24 lg:h-24 glass-card rounded-3xl flex items-center justify-center shadow-glass">
                  {restaurant.logo_url ? (
                    <img 
                      src={restaurant.logo_url} 
                      alt={`${restaurant.name} logo`}
                      className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-2xl"
                    />
                  ) : (
                    <Store className="w-12 h-12 lg:w-14 lg:h-14 text-white" />
                  )}
                </div>
                {restaurant.slug && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 gradient-accent rounded-full flex items-center justify-center shadow-accent">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">
                    {restaurant.name}
                  </h1>
                  {restaurant.slug && (
                    <Badge className="badge-accent text-white">Live</Badge>
                  )}
                </div>
                {restaurant.description && (
                  <p className="text-white/80 text-lg max-w-2xl">
                    {restaurant.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center">
                    <MenuIcon className="w-4 h-4 mr-1" />
                    {menuItems.length} Items
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {categories.length} Categories
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {restaurant.default_currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="glass-card p-2 rounded-2xl shadow-glass">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-transparent gap-1">
            <TabsTrigger 
              value="overview" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <Settings className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="menu" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <MenuIcon className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger 
              value="import" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <Upload className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Import</span>
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <Palette className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger 
              value="languages" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <Globe className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Languages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="currencies" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <DollarSign className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Currencies</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="text-xs lg:text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary rounded-xl"
            >
              <Eye className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <RestaurantDetails 
            restaurant={restaurant}
            onUpdate={handleRestaurantUpdate}
          />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <MenuManagement
            restaurant={restaurant}
            menuItems={menuItems}
            categories={categories}
            onMenuItemsUpdate={handleMenuItemsUpdate}
            onCategoriesUpdate={handleCategoriesUpdate}
          />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <QuickMenuImport 
            restaurant={restaurant}
            onImportComplete={(newCategories, newItems) => {
              setCategories([...categories, ...newCategories]);
              setMenuItems([...menuItems, ...newItems]);
            }}
          />
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <RestaurantBranding 
            restaurant={restaurant}
            onUpdate={handleRestaurantUpdate}
          />
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <LanguageManagement restaurantId={id!} />
        </TabsContent>

        <TabsContent value="currencies" className="space-y-6">
          <CurrencyManagement restaurantId={id!} />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="premium-card border-0">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gradient">Menu Preview</CardTitle>
              </div>
              {restaurant.slug && (
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Public URL:</p>
                  <code className="text-primary font-mono text-sm break-all">
                    {generatePublicUrl()}
                  </code>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <Badge className="badge-secondary">
                    Template: {restaurant.menu_template}
                  </Badge>
                  <Badge className="badge-accent">
                    {menuItems.length} Menu Items
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open(generatePublicUrl(), '_blank')}
                  disabled={!restaurant.slug}
                  className="btn-glass"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Menu Page
                </Button>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <MenuPreview
                  menuItems={previewMenuItems}
                  restaurantName={restaurant.name}
                  colors={{
                    primary: restaurant.primary_color,
                    secondary: restaurant.secondary_color
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}