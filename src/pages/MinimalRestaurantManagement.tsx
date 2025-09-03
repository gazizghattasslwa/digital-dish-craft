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
  Settings, 
  Menu as MenuIcon,
  Palette,
  Globe,
  DollarSign,
  Upload,
  Star,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RestaurantDetails } from '@/components/restaurant/RestaurantDetails';
import { RestaurantBranding } from '@/components/restaurant/RestaurantBranding';
import { LanguageManagement } from '@/components/restaurant/LanguageManagement';
import { CurrencyManagement } from '@/components/restaurant/CurrencyManagement';
import { MenuManagement } from '@/components/restaurant/MenuManagement';
import { MenuPreview } from '@/components/MenuPreview';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { CustomDomainManagement } from '@/components/restaurant/CustomDomainManagement';
import { MinimalMenuManagement } from '@/components/restaurant/MinimalMenuManagement';
import QuickMenuImport from '@/components/restaurant/QuickMenuImport';

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

export default function MinimalRestaurantManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  useEffect(() => {
    // Update URL when tab changes
    if (activeTab !== 'overview') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);

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
        description="Loading restaurant data..."
        restaurantId={id}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading restaurant...</p>
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
        <Card className="clean-card max-w-md mx-auto mt-20">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Restaurant Not Found</h2>
            <p className="text-muted-foreground mb-8">
              This restaurant doesn't exist or you don't have access to it.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="btn-clean"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
        <div className="flex gap-2 flex-wrap">
          {restaurant.slug && (
            <>
              <div className="flex items-center">
                <QRCodeGenerator 
                  url={generatePublicUrl() || ''}
                  restaurantName={restaurant.name}
                  primaryColor={restaurant.primary_color}
                  secondaryColor={restaurant.secondary_color}
                  logoUrl={restaurant.logo_url}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(generatePublicUrl(), '_blank')}
                className="transition-base"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Menu
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('preview')}
            className="transition-base"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      }
    >
      {/* Restaurant Header */}
      <div className="mb-8">
        <Card className="clean-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: restaurant.primary_color }}
                >
                  {restaurant.logo_url ? (
                    <img 
                      src={restaurant.logo_url} 
                      alt={`${restaurant.name} logo`}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  ) : (
                    <Store className="w-8 h-8" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">
                      {restaurant.name}
                    </h1>
                    {restaurant.slug && (
                      <Badge className="status-active text-xs">Live</Badge>
                    )}
                  </div>
                  {restaurant.description && (
                    <p className="text-muted-foreground">
                      {restaurant.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-border">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Settings className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="menu" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <MenuIcon className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="import" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Palette className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger 
              value="languages" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Globe className="w-4 h-4 mr-2" />
              Languages
            </TabsTrigger>
            <TabsTrigger 
              value="currencies" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Currencies
            </TabsTrigger>
            <TabsTrigger 
              value="domain" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Globe className="w-4 h-4 mr-2" />
              Domain
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3 transition-base"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
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
          <MinimalMenuManagement
            restaurant={restaurant}
            menuItems={menuItems}
            categories={categories}
            onMenuItemsUpdate={handleMenuItemsUpdate}
            onCategoriesUpdate={handleCategoriesUpdate}
          />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <QuickMenuImport 
            restaurantId={restaurant.id}
            onImportComplete={() => {
              // Refresh data after import
              fetchRestaurantData();
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

        <TabsContent value="domain" className="space-y-6">
          <CustomDomainManagement 
            restaurantId={id!}
            restaurantName={restaurant.name}
            restaurantSlug={restaurant.slug}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="clean-card">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Menu Preview</CardTitle>
              </div>
              {restaurant.slug && (
                <div className="bg-muted p-4 rounded-lg">
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
                  <Badge variant="outline">
                    Template: {restaurant.menu_template}
                  </Badge>
                  <Badge variant="outline">
                    Items: {menuItems.length}
                  </Badge>
                  <Badge variant="outline">
                    Categories: {categories.length}
                  </Badge>
                </div>
              </div>

              {previewMenuItems.length > 0 ? (
                <div className="border border-border rounded-lg p-4 bg-muted/50">
                  <MenuPreview
                    menuItems={previewMenuItems}
                    restaurantName={restaurant.name}
                    colors={{
                      primary: restaurant.primary_color,
                      secondary: restaurant.secondary_color
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MenuIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Menu Items</h3>
                  <p className="text-muted-foreground mb-6">
                    Add some menu items to see the preview.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('menu')}
                    className="btn-clean"
                  >
                    Add Menu Items
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}