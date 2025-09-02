-- Make restaurant-files bucket public so images can be accessed by OpenAI
UPDATE storage.buckets 
SET public = true 
WHERE id = 'restaurant-files';