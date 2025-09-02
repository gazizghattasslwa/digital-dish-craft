-- Add support for multiple languages and currencies

-- Create table for restaurant languages
CREATE TABLE public.restaurant_languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  language_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, language_code)
);

-- Create table for restaurant currencies
CREATE TABLE public.restaurant_currencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL,
  currency_code TEXT NOT NULL,
  currency_name TEXT NOT NULL,
  exchange_rate DECIMAL(10,6) DEFAULT 1.0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, currency_code)
);

-- Create table for menu item translations
CREATE TABLE public.menu_item_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(menu_item_id, language_code)
);

-- Create table for menu category translations
CREATE TABLE public.menu_category_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, language_code)
);

-- Enable RLS on all new tables
ALTER TABLE public.restaurant_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_category_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for restaurant_languages
CREATE POLICY "Users can manage languages for their restaurants" 
ON public.restaurant_languages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM restaurants 
  WHERE restaurants.id = restaurant_languages.restaurant_id 
  AND restaurants.user_id = auth.uid()
));

CREATE POLICY "Public can view languages for published restaurants" 
ON public.restaurant_languages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM restaurants 
  WHERE restaurants.id = restaurant_languages.restaurant_id 
  AND restaurants.slug IS NOT NULL
));

-- Create RLS policies for restaurant_currencies
CREATE POLICY "Users can manage currencies for their restaurants" 
ON public.restaurant_currencies 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM restaurants 
  WHERE restaurants.id = restaurant_currencies.restaurant_id 
  AND restaurants.user_id = auth.uid()
));

CREATE POLICY "Public can view currencies for published restaurants" 
ON public.restaurant_currencies 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM restaurants 
  WHERE restaurants.id = restaurant_currencies.restaurant_id 
  AND restaurants.slug IS NOT NULL
));

-- Create RLS policies for menu_item_translations
CREATE POLICY "Users can manage item translations for their restaurants" 
ON public.menu_item_translations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM menu_items 
  JOIN restaurants ON restaurants.id = menu_items.restaurant_id 
  WHERE menu_items.id = menu_item_translations.menu_item_id 
  AND restaurants.user_id = auth.uid()
));

CREATE POLICY "Public can view item translations for published restaurants" 
ON public.menu_item_translations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM menu_items 
  JOIN restaurants ON restaurants.id = menu_items.restaurant_id 
  WHERE menu_items.id = menu_item_translations.menu_item_id 
  AND restaurants.slug IS NOT NULL
));

-- Create RLS policies for menu_category_translations
CREATE POLICY "Users can manage category translations for their restaurants" 
ON public.menu_category_translations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM menu_categories 
  JOIN restaurants ON restaurants.id = menu_categories.restaurant_id 
  WHERE menu_categories.id = menu_category_translations.category_id 
  AND restaurants.user_id = auth.uid()
));

CREATE POLICY "Public can view category translations for published restaurants" 
ON public.menu_category_translations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM menu_categories 
  JOIN restaurants ON restaurants.id = menu_categories.restaurant_id 
  WHERE menu_categories.id = menu_category_translations.category_id 
  AND restaurants.slug IS NOT NULL
));

-- Add triggers for updated_at columns
CREATE TRIGGER update_restaurant_languages_updated_at
  BEFORE UPDATE ON public.restaurant_languages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_currencies_updated_at
  BEFORE UPDATE ON public.restaurant_currencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_item_translations_updated_at
  BEFORE UPDATE ON public.menu_item_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_category_translations_updated_at
  BEFORE UPDATE ON public.menu_category_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default languages and currencies for existing restaurants
INSERT INTO public.restaurant_languages (restaurant_id, language_code, language_name, is_default)
SELECT id, default_language, 
  CASE default_language
    WHEN 'en' THEN 'English'
    WHEN 'es' THEN 'Spanish'
    WHEN 'fr' THEN 'French'
    WHEN 'de' THEN 'German'
    WHEN 'it' THEN 'Italian'
    WHEN 'pt' THEN 'Portuguese'
    ELSE 'English'
  END,
  true
FROM restaurants
WHERE default_language IS NOT NULL;

INSERT INTO public.restaurant_currencies (restaurant_id, currency_code, currency_name, is_default)
SELECT id, default_currency,
  CASE default_currency
    WHEN 'USD' THEN 'US Dollar'
    WHEN 'EUR' THEN 'Euro'
    WHEN 'GBP' THEN 'British Pound'
    WHEN 'CAD' THEN 'Canadian Dollar'
    WHEN 'AUD' THEN 'Australian Dollar'
    ELSE 'US Dollar'
  END,
  true
FROM restaurants
WHERE default_currency IS NOT NULL;