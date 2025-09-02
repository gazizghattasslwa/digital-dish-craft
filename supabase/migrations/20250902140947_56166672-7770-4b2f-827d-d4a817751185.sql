-- Storage RLS policies to allow authenticated restaurant owners to upload files into their own folder
-- Bucket: restaurant-files

-- Allow INSERT (uploads) when the first folder segment matches a restaurant the user owns
CREATE POLICY "Users can upload files to their restaurant folder"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);

-- Allow UPDATE (e.g., overwrite or move) under the same condition
CREATE POLICY "Users can update files in their restaurant folder"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
)
WITH CHECK (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);

-- Allow DELETE under the same condition
CREATE POLICY "Users can delete files in their restaurant folder"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'restaurant-files'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);

-- Bucket: menu-images (used for logos) - mirror the same pattern
CREATE POLICY "Users can upload menu images to their restaurant folder"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can update menu images in their restaurant folder"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
)
WITH CHECK (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete menu images in their restaurant folder"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.user_id = auth.uid()
      AND r.id::text = (storage.foldername(name))[1]
  )
);
