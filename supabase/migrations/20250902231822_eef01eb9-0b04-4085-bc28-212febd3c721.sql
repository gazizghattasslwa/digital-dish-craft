-- Drop all problematic policies for restaurant-files bucket
DROP POLICY IF EXISTS "Users can upload files for their restaurants" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files to their restaurant folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own restaurant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files in their restaurant folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files in their restaurant folder" ON storage.objects;

-- Create clean, correct policies for restaurant-files bucket
CREATE POLICY "Users can upload restaurant files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE user_id = auth.uid() 
    AND id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can view restaurant files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE user_id = auth.uid() 
    AND id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can update restaurant files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE user_id = auth.uid() 
    AND id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete restaurant files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'restaurant-files' 
  AND EXISTS (
    SELECT 1 FROM restaurants 
    WHERE user_id = auth.uid() 
    AND id::text = (storage.foldername(name))[1]
  )
);