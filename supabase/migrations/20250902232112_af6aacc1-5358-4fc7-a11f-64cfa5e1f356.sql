-- Replace restaurant-files policies to correctly reference storage.objects.name
DROP POLICY IF EXISTS "Users can upload restaurant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view restaurant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update restaurant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete restaurant files" ON storage.objects;

CREATE POLICY "Users can upload restaurant files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Users can view restaurant files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Users can update restaurant files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Users can delete restaurant files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(storage.objects.name))[1]
  )
);