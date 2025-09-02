import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, QrCode, ExternalLink } from 'lucide-react';
import { RestaurantDetails } from '@/components/restaurant/RestaurantDetails';
import { RestaurantBranding } from '@/components/restaurant/RestaurantBranding';
import { MenuManagement } from '@/components/restaurant/MenuManagement';
import { MenuPreview } from '@/components/MenuPreview';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';

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
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Restaurant not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/40 shadow-warm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-muted flex-shrink-0"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{restaurant.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Restaurant Management</p>
              </div>
            </div>
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
                    className="text-xs sm:text-sm"
                    onClick={() => window.open(generatePublicUrl(), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">View Public Menu</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => setActiveTab('preview')}>
                <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
                <span className="sm:hidden">Preview</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs sm:text-sm">Branding</TabsTrigger>
            <TabsTrigger value="menu" className="text-xs sm:text-sm">Menu</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <RestaurantDetails 
              restaurant={restaurant}
              onUpdate={handleRestaurantUpdate}
            />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <RestaurantBranding 
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
      </main>
    </div>
  );
}