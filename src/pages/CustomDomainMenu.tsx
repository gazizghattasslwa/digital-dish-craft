import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MenuPreview } from '@/components/MenuPreview';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  menu_template: string;
  description?: string;
  address?: string;
  phone?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_available: boolean;
  is_special: boolean;
}

export default function CustomDomainMenu() {
  const [searchParams] = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomDomainMenu = async () => {
      try {
        const domain = searchParams.get('domain') || window.location.hostname;
        
        console.log('Loading menu for custom domain:', domain);

        // Resolve custom domain to restaurant
        const { data: domainData, error: domainError } = await supabase.functions.invoke('resolve-custom-domain', {
          body: { domain }
        });

        if (domainError || !domainData?.success) {
          throw new Error(domainData?.error || 'Domain not found or not configured');
        }

        const restaurantData = domainData.restaurant;
        setRestaurant(restaurantData);

        // Fetch menu items for this restaurant
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select(`
            id,
            name,
            description,
            price,
            image_url,
            is_available,
            is_special,
            menu_categories (
              name
            )
          `)
          .eq('restaurant_id', restaurantData.id)
          .eq('is_available', true);

        if (menuError) {
          throw new Error('Failed to load menu items');
        }

        const formattedMenuItems: MenuItem[] = (menuData || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: parseFloat(item.price?.toString() || '0'),
          category: item.menu_categories?.name || 'Other',
          image: item.image_url || '',
          is_available: item.is_available,
          is_special: item.is_special
        }));

        setMenuItems(formattedMenuItems);

      } catch (err: any) {
        console.error('Error loading custom domain menu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomDomainMenu();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Domain Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'This domain is not configured or the restaurant is not available.'}
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you own this domain:
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li>• Check that your DNS records are configured correctly</li>
                <li>• Ensure the domain is added to your restaurant settings</li>
                <li>• Wait up to 48 hours for DNS propagation</li>
              </ul>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                <Globe className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{restaurant.name} - Digital Menu</title>
        <meta name="description" content={restaurant.description || `View the digital menu for ${restaurant.name}`} />
        <meta property="og:title" content={`${restaurant.name} - Digital Menu`} />
        <meta property="og:description" content={restaurant.description || `View the digital menu for ${restaurant.name}`} />
        {restaurant.logo_url && <meta property="og:image" content={restaurant.logo_url} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Custom branding styles */}
        <style>{`
          :root {
            --primary-hue: ${hexToHsl(restaurant.primary_color).h};
            --primary-saturation: ${hexToHsl(restaurant.primary_color).s}%;
            --primary-lightness: ${hexToHsl(restaurant.primary_color).l}%;
            --secondary-hue: ${hexToHsl(restaurant.secondary_color).h};
            --secondary-saturation: ${hexToHsl(restaurant.secondary_color).s}%;
            --secondary-lightness: ${hexToHsl(restaurant.secondary_color).l}%;
          }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-background">
        <MenuPreview
          menuItems={menuItems}
          restaurantName={restaurant.name}
          colors={{
            primary: restaurant.primary_color,
            secondary: restaurant.secondary_color
          }}
        />
      </div>
    </>
  );
}

// Helper function to convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}