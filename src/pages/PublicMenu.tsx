import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Clock, Star, Coffee, Utensils } from 'lucide-react';

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

const MenuTemplateClassic = ({ restaurant, menuItems, categories }: {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
}) => (
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mb-12">
      {restaurant.logo_url && (
        <div className="mb-6">
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            className="w-24 h-24 mx-auto rounded-full object-cover"
          />
        </div>
      )}
      <h1 
        className="text-4xl md:text-6xl font-bold mb-4"
        style={{ color: restaurant.primary_color }}
      >
        {restaurant.name}
      </h1>
      {restaurant.description && (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {restaurant.description}
        </p>
      )}
    </div>

    {/* Restaurant Info */}
    {(restaurant.address || restaurant.phone || restaurant.website) && (
      <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm">
        {restaurant.address && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: restaurant.primary_color }} />
            <span>{restaurant.address}</span>
          </div>
        )}
        {restaurant.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: restaurant.primary_color }} />
            <span>{restaurant.phone}</span>
          </div>
        )}
        {restaurant.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" style={{ color: restaurant.primary_color }} />
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Website
            </a>
          </div>
        )}
      </div>
    )}

    {/* Menu Categories */}
    <div className="space-y-12">
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category_id === category.id && item.is_available);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <div className="text-center mb-8">
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: restaurant.primary_color }}
              >
                {category.name}
              </h2>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {categoryItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b border-border pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      {item.is_special && (
                        <Badge style={{ backgroundColor: restaurant.secondary_color }}>
                          <Star className="w-3 h-3 mr-1" />
                          Special
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <div 
                    className="text-xl font-bold flex-shrink-0"
                    style={{ color: restaurant.primary_color }}
                  >
                    {item.currency === 'USD' ? '$' : item.currency}{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const MenuTemplateModern = ({ restaurant, menuItems, categories }: {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
}) => (
  <div className="max-w-6xl mx-auto">
    {/* Header with gradient */}
    <div 
      className="text-center mb-12 p-12 rounded-2xl text-white"
      style={{ 
        background: `linear-gradient(135deg, ${restaurant.primary_color}, ${restaurant.secondary_color})` 
      }}
    >
      {restaurant.logo_url && (
        <div className="mb-6">
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white/20"
          />
        </div>
      )}
      <h1 className="text-5xl md:text-7xl font-bold mb-4">
        {restaurant.name}
      </h1>
      {restaurant.description && (
        <p className="text-xl opacity-90 max-w-3xl mx-auto">
          {restaurant.description}
        </p>
      )}
    </div>

    {/* Menu Grid */}
    <div className="space-y-16">
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category_id === category.id && item.is_available);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <div className="text-center mb-8">
              <h2 
                className="text-4xl font-bold mb-2"
                style={{ color: restaurant.primary_color }}
              >
                {category.name}
              </h2>
              {category.description && (
                <p className="text-muted-foreground text-lg">{category.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image_url && (
                    <div className="aspect-video bg-muted">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      {item.is_special && (
                        <Badge style={{ backgroundColor: restaurant.secondary_color }}>
                          <Star className="w-3 h-3 mr-1" />
                          Special
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                    )}
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: restaurant.primary_color }}
                    >
                      {item.currency === 'USD' ? '$' : item.currency}{item.price.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const MenuTemplateElegant = ({ restaurant, menuItems, categories }: {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
}) => (
  <div className="max-w-5xl mx-auto">
    {/* Elegant Header */}
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-transparent opacity-50"></div>
      {restaurant.logo_url && (
        <div className="mb-8 relative z-10">
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            className="w-28 h-28 mx-auto rounded-full object-cover"
          />
        </div>
      )}
      <h1 
        className="text-5xl md:text-7xl font-serif font-light mb-6 relative z-10"
        style={{ color: restaurant.primary_color }}
      >
        {restaurant.name}
      </h1>
      <div className="w-24 h-px bg-current mx-auto mb-6 opacity-30"></div>
      {restaurant.description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light relative z-10">
          {restaurant.description}
        </p>
      )}
    </div>

    {/* Two Column Layout */}
    <div className="space-y-16">
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category_id === category.id && item.is_available);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-serif font-light mb-3"
                style={{ color: restaurant.primary_color }}
              >
                {category.name}
              </h2>
              <div className="w-16 h-px bg-current mx-auto mb-4 opacity-30"></div>
              {category.description && (
                <p className="text-muted-foreground font-light italic">{category.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              {categoryItems.map((item) => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        {item.is_special && (
                          <Badge 
                            variant="outline" 
                            className="border-current text-xs"
                            style={{ color: restaurant.secondary_color }}
                          >
                            Chef's Special
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div 
                      className="text-lg font-medium ml-4 flex-shrink-0"
                      style={{ color: restaurant.primary_color }}
                    >
                      {item.currency === 'USD' ? '$' : item.currency}{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const MenuTemplateCasual = ({ restaurant, menuItems, categories }: {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
}) => (
  <div className="max-w-6xl mx-auto">
    {/* Fun Header */}
    <div className="text-center mb-12">
      <div className="flex justify-center items-center gap-4 mb-6">
        {restaurant.logo_url && (
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name}
            className="w-20 h-20 rounded-2xl object-cover transform rotate-3"
          />
        )}
        <div>
          <h1 
            className="text-4xl md:text-6xl font-bold"
            style={{ color: restaurant.primary_color }}
          >
            {restaurant.name}
          </h1>
          <div className="flex justify-center gap-2 mt-2">
            <Coffee className="w-6 h-6" style={{ color: restaurant.secondary_color }} />
            <Utensils className="w-6 h-6" style={{ color: restaurant.primary_color }} />
            <Coffee className="w-6 h-6" style={{ color: restaurant.secondary_color }} />
          </div>
        </div>
      </div>
      {restaurant.description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {restaurant.description}
        </p>
      )}
    </div>

    {/* Card Layout */}
    <div className="space-y-12">
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category_id === category.id && item.is_available);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <Card 
              className="p-6 mb-8"
              style={{ borderColor: restaurant.primary_color, borderWidth: '2px' }}
            >
              <div className="text-center">
                <h2 
                  className="text-3xl font-bold mb-2"
                  style={{ color: restaurant.primary_color }}
                >
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-muted-foreground">{category.description}</p>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        {item.is_special && (
                          <Badge 
                            className="text-white"
                            style={{ backgroundColor: restaurant.secondary_color }}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Fave!
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                      )}
                    </div>
                    <div 
                      className="text-2xl font-bold p-3 rounded-full text-white"
                      style={{ backgroundColor: restaurant.primary_color }}
                    >
                      {item.currency === 'USD' ? '$' : item.currency}{item.price.toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function PublicMenu() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!slug) return;

      try {
        // Fetch restaurant by slug
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', slug)
          .single();

        if (restaurantError) {
          if (restaurantError.code === 'PGRST116') {
            setError('Menu not found');
          } else {
            throw restaurantError;
          }
          return;
        }

        setRestaurant(restaurantData);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch menu items
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .eq('is_available', true)
          .order('display_order', { ascending: true });

        if (itemsError) throw itemsError;
        setMenuItems(itemsData || []);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Menu Not Found</h1>
          <p className="text-muted-foreground">
            {error || 'The menu you\'re looking for doesn\'t exist or is not available.'}
          </p>
        </div>
      </div>
    );
  }

  // Apply restaurant colors to CSS variables
  useEffect(() => {
    if (restaurant) {
      document.documentElement.style.setProperty('--menu-primary', restaurant.primary_color);
      document.documentElement.style.setProperty('--menu-secondary', restaurant.secondary_color);
    }
  }, [restaurant]);

  const renderTemplate = () => {
    const props = { restaurant, menuItems, categories };
    
    switch (restaurant.menu_template) {
      case 'modern':
        return <MenuTemplateModern {...props} />;
      case 'elegant':
        return <MenuTemplateElegant {...props} />;
      case 'casual':
        return <MenuTemplateCasual {...props} />;
      default:
        return <MenuTemplateClassic {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {renderTemplate()}
      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 mt-16 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by MenuCraft
        </p>
      </footer>
    </div>
  );
}