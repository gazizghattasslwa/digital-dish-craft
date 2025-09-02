-- Create storage policies for restaurant-files bucket
CREATE POLICY "Users can upload files for their restaurants" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'restaurant-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view files for their restaurants" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'restaurant-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update files for their restaurants" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'restaurant-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete files for their restaurants" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'restaurant-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid()
  )
);