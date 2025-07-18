# VELAFLAME Setup Guide

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings → API
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the following scripts in order:

#### Script 1: Create Tables
```sql
-- Copy and paste the content of scripts/01-create-tables.sql
```

#### Script 2: Seed Data
```sql
-- Copy and paste the content of scripts/02-seed-data.sql
```

#### Script 3: Add Functions
```sql
-- Copy and paste the content of scripts/03-add-functions.sql
```

#### Script 4: Add Reviews
```sql
-- Copy and paste the content of scripts/04-add-reviews.sql
```

### 4. Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart it
pnpm dev
```

## Troubleshooting

### "Database not configured" Error
This means your environment variables are not set up correctly. Check that:
- Your `.env.local` file exists in the project root
- All three environment variables are set
- You've restarted your development server after adding the environment variables

### "Failed to fetch" Error
This usually means:
- Supabase credentials are incorrect
- Database tables haven't been created
- Network connectivity issues

### Still Having Issues?
1. Check the browser console for detailed error messages
2. Verify your Supabase project is active and accessible
3. Ensure all SQL scripts have been executed successfully
4. Try accessing your Supabase dashboard to confirm the project is working

## Next Steps

Once everything is set up:
1. Visit `http://localhost:3000` to see your e-commerce site
2. Browse the product catalog at `/shop`
3. Test the shopping cart functionality
4. Access the admin panel at `/admin` (you'll need to set up admin authentication)

## Support

If you're still experiencing issues, check:
- The browser's Network tab for API request details
- The browser's Console for JavaScript errors
- Your Supabase dashboard for database errors 