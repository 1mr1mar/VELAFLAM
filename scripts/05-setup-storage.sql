-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public read access
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Create storage policy to allow anonymous uploads (for admin interface)
CREATE POLICY "Anonymous uploads for product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Create storage policy to allow anonymous updates
CREATE POLICY "Anonymous updates for product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

-- Create storage policy to allow anonymous deletes
CREATE POLICY "Anonymous deletes for product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images'); 