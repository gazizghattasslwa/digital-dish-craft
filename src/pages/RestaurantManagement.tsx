import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, QrCode, ExternalLink } from 'lucide-react';
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
        title="Loading..." 
        description="Loading restaurant data..."
        restaurantId={id}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Restaurant not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
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
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Menu
          </Button>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="menu" className="text-xs lg:text-sm">Menu</TabsTrigger>
          <TabsTrigger value="import" className="text-xs lg:text-sm">Import</TabsTrigger>
          <TabsTrigger value="branding" className="text-xs lg:text-sm">Branding</TabsTrigger>
          <TabsTrigger value="languages" className="text-xs lg:text-sm">Languages</TabsTrigger>
          <TabsTrigger value="currencies" className="text-xs lg:text-sm">Currencies</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs lg:text-sm">Preview</TabsTrigger>
        </TabsList>

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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Menu Preview</CardTitle>
                {restaurant.slug && (
                  <div className="text-sm text-muted-foreground">
                    Public URL: <code className="bg-muted px-2 py-1 rounded text-xs">
                      {generatePublicUrl()}
                    </code>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto">
                <div className="mb-4 text-center">
                  <p className="text-muted-foreground mb-2">Template: <strong className="capitalize">{restaurant.menu_template}</strong></p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(generatePublicUrl(), '_blank')}
                    disabled={!restaurant.slug}
                  >
                    View Full Menu Page
                  </Button>
                </div>
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