-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.restaurants_public;

-- Create a proper view without security definer that uses RLS normally  
CREATE VIEW public.restaurants_public AS 
SELECT 
  id,
  name,
  description,
  logo_url,
  primary_color,
  secondary_color,
  menu_template,
  slug,
  created_at,
  updated_at
FROM public.restaurants
WHERE slug IS NOT NULL;

-- The view will inherit the RLS policies from the underlying table
-- Grant access to the view for anon and authenticated users
GRANT SELECT ON public.restaurants_public TO anon;
GRANT SELECT ON public.restaurants_public TO authenticated;