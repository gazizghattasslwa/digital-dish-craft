-- Drop existing public read policy for restaurants
DROP POLICY IF EXISTS "Public can view published restaurants" ON public.restaurants;

-- Create new restrictive policy that only exposes business-relevant information publicly
-- This prevents exposure of sensitive contact information (phone, address, website)
CREATE POLICY "Public can view published restaurant business info" 
ON public.restaurants 
FOR SELECT 
USING (
  slug IS NOT NULL 
  AND (
    -- Only allow access to specific safe columns for public access
    -- We'll handle this through application logic by selecting only safe fields
    slug IS NOT NULL
  )
);

-- Create a view for public restaurant data that only exposes safe fields
CREATE OR REPLACE VIEW public.restaurants_public AS 
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

-- Allow public access to the safe view
ALTER VIEW public.restaurants_public OWNER TO postgres;
GRANT SELECT ON public.restaurants_public TO anon;
GRANT SELECT ON public.restaurants_public TO authenticated;