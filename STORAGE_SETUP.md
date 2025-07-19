# Supabase Storage Setup Guide

## Issue Description
File uploads work locally but fail on Vercel hosting because:
- Vercel has a read-only filesystem
- Local file storage doesn't persist on hosting
- Files are temporary and get deleted after function execution

## Solution: Supabase Storage

### 1. Enable Storage in Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Enable Storage**
   - Go to **Storage** in the left sidebar
   - Click **Enable Storage** if not already enabled

### 2. Create Storage Bucket

1. **Create Bucket**
   - Click **Create a new bucket**
   - Name: `product-images`
   - Public bucket: **Yes** (checked)
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

2. **Or use SQL (recommended)**
   - Go to **SQL Editor**
   - Run the script: `scripts/05-setup-storage.sql`

### 3. Configure Storage Policies

The storage policies are already set up in the SQL script:

```sql
-- Public read access
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Anonymous uploads
CREATE POLICY "Anonymous uploads for product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Anonymous updates
CREATE POLICY "Anonymous updates for product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

-- Anonymous deletes
CREATE POLICY "Anonymous deletes for product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

### 4. Environment Variables

Ensure these are set in both local and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Test the Setup

1. **Local Testing**
   ```bash
   npm run dev
   ```
   - Go to admin panel
   - Try uploading an image
   - Check if it appears in Supabase Storage

2. **Hosting Testing**
   - Deploy to Vercel
   - Test image upload on hosted version
   - Verify images are stored in Supabase Storage

## How It Works

### Before (Local Filesystem)
```
File Upload → Save to public/images → Local path reference
```

### After (Supabase Storage)
```
File Upload → Supabase Storage → Public URL reference
```

### Benefits

✅ **Works on hosting** - No filesystem dependencies
✅ **Persistent storage** - Files survive deployments
✅ **CDN delivery** - Fast global access
✅ **Scalable** - No server storage limits
✅ **Secure** - Built-in access controls

## Troubleshooting

### Common Issues

1. **"Bucket not found"**
   - Ensure bucket `product-images` exists
   - Check bucket name spelling

2. **"Permission denied"**
   - Verify storage policies are applied
   - Check if bucket is public

3. **"File too large"**
   - Check file size limit (5MB)
   - Verify MIME type is allowed

4. **"Upload failed"**
   - Check environment variables
   - Verify Supabase client configuration

### Debug Steps

1. **Check Supabase Dashboard**
   - Go to Storage → product-images
   - Verify files are being uploaded

2. **Check Network Tab**
   - Open browser dev tools
   - Look for upload requests
   - Check response status

3. **Check Console Logs**
   - Look for error messages
   - Verify API responses

## Migration from Local Storage

If you have existing local images:

1. **Upload to Supabase Storage**
   - Manually upload via Supabase Dashboard
   - Or create migration script

2. **Update Database**
   - Update `image_url` fields in products table
   - Replace local paths with Supabase URLs

3. **Test**
   - Verify all images load correctly
   - Check both local and hosted versions

## Security Considerations

- **Public bucket** - Images are publicly accessible
- **File validation** - Only image types allowed
- **Size limits** - 5MB maximum per file
- **Unique filenames** - Prevents conflicts

## Performance

- **CDN delivery** - Fast global access
- **Image optimization** - Consider adding image transformations
- **Caching** - Built-in cache control headers 