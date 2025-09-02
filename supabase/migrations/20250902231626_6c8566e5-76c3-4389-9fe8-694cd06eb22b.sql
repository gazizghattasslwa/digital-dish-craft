-- Drop the incorrect policies and recreate them properly
DROP POLICY IF EXISTS "Users can upload files to their restaurant folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files in their restaurant folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files in their restaurant folder" ON storage.objects;

-- Create correct policies for restaurant-files bucket
CREATE POLICY "Users can upload files to their restaurant folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid() 
    AND r.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete files in their restaurant folder" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid() 
    AND r.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can update files in their restaurant folder" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid() 
    AND r.id::text = (storage.foldername(name))[1]
  )
);