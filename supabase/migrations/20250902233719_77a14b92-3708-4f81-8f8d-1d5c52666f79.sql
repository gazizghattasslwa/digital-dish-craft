-- Create storage bucket for menu images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for menu images
CREATE POLICY "Users can upload menu images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'menu-items'
);

CREATE POLICY "Users can view menu images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-images');

CREATE POLICY "Users can update their menu images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their menu images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'menu-images' 
  AND auth.uid() IS NOT NULL
);