# Vercel Routing Fix Guide

## Issue Description
When visiting product detail pages on Vercel (e.g., https://velaflam.vercel.app/products/bf23ec68-e69f-4ffa-9fc1-8ca2a0893617), the page shows the landing page instead of the product details.

## Root Cause
The `vercel.json` file contained a problematic rewrite rule that redirected ALL routes to the home page:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Solution Applied

### 1. Removed Problematic vercel.json
- ✅ Deleted the `vercel.json` file entirely
- ✅ Let Next.js handle routing automatically
- ✅ No custom rewrite rules interfering with dynamic routes

### 2. Updated Next.js Configuration
- ✅ Removed `output: 'standalone'` which can cause issues
- ✅ Kept `trailingSlash: false` for proper URL handling
- ✅ Maintained `experimental.appDir: true` for App Router support

### 3. Verified Local Functionality
- ✅ Product detail pages work correctly locally (200 status)
- ✅ API routes are functioning properly
- ✅ Dynamic routing is working as expected

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel routing: Remove problematic vercel.json"
git push origin main
```

### 2. Redeploy on Vercel
- Go to your Vercel dashboard
- The deployment should trigger automatically
- Wait for the build to complete

### 3. Test the Fix
After deployment, test these URLs:
- ✅ https://velaflam.vercel.app/products/bf23ec68-e69f-4ffa-9fc1-8ca2a0893617
- ✅ https://velaflam.vercel.app/shop
- ✅ https://velaflam.vercel.app/admin/products
- ✅ https://velaflam.vercel.app/api/products

## Alternative Solutions (if needed)

### Option 1: Minimal vercel.json
If you need a vercel.json file, use this minimal configuration:
```json
{
  "framework": "nextjs"
}
```

### Option 2: Specific Rewrites
If you need specific rewrites, use this structure:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### Option 3: Vercel Dashboard Configuration
- Go to Vercel Dashboard → Project Settings → Functions
- Ensure "Include source files outside of the root directory" is enabled
- Check that the build command is `npm run build`

## Troubleshooting

### If the issue persists:

1. **Check Vercel Build Logs**:
   - Go to Vercel Dashboard → Deployments
   - Check the latest deployment logs
   - Look for any build errors

2. **Verify Environment Variables**:
   - Ensure all Supabase environment variables are set in Vercel
   - Check that they match your local `.env.local`

3. **Clear Vercel Cache**:
   - Go to Project Settings → General
   - Click "Clear Build Cache"

4. **Force Redeploy**:
   - Go to Deployments
   - Click "Redeploy" on the latest deployment

## Expected Behavior After Fix

- ✅ Product detail pages show actual product content
- ✅ Dynamic routes work correctly
- ✅ API routes function properly
- ✅ Admin pages are accessible
- ✅ No more redirects to landing page

## Files Modified

- ❌ `vercel.json` - **DELETED** (was causing routing conflicts)
- ✅ `next.config.mjs` - Simplified configuration
- ✅ `app/products/[id]/page.tsx` - Enhanced error handling (already done)

## Testing Checklist

After deployment, verify:
- [ ] Product detail pages load correctly
- [ ] Shop page works
- [ ] Admin pages are accessible
- [ ] API endpoints respond properly
- [ ] Cart and checkout work
- [ ] Order creation functions

## Support

If the issue persists after these changes:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test with a simple Next.js app first
4. Contact Vercel support if needed 