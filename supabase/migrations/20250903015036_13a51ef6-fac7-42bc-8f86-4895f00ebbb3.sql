-- Fix overly permissive RLS policies on subscribers table
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create more restrictive policies for subscribers table
CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "service_role_can_insert_subscription" ON public.subscribers
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Make restaurant-files storage bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'restaurant-files';

-- Update storage policies for restaurant-files to use signed URLs
DROP POLICY IF EXISTS "Allow public read access to restaurant files" ON storage.objects;

CREATE POLICY "Users can upload their own restaurant files" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'restaurant-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own restaurant files" ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'restaurant-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own restaurant files" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'restaurant-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own restaurant files" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'restaurant-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);