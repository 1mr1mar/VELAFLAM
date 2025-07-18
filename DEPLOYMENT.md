# Vercel Deployment Guide

## Environment Variables Setup

To deploy your VELAFLAME project to Vercel, you need to configure the following environment variables:

### 1. Go to Your Vercel Dashboard

1. Visit [vercel.com](https://vercel.com) and sign in
2. Select your VELAFLAME project
3. Go to **Settings** → **Environment Variables**

### 2. Add the Required Environment Variables

Add these three environment variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 3. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Set Environment Variables in Vercel

1. In your Vercel project settings, click **Add New**
2. Enter each variable name and value
3. Make sure to select **Production**, **Preview**, and **Development** environments
4. Click **Save**

### 5. Redeploy Your Project

1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a new deployment

## Database Setup

Before deploying, make sure your Supabase database is set up:

1. Run the SQL scripts in the `scripts/` folder in your Supabase SQL Editor:
   - `01-create-tables.sql`
   - `02-seed-data.sql`
   - `03-add-functions.sql`
   - `04-add-reviews.sql`

## Troubleshooting

### Build Errors
- **"supabaseUrl is required"**: Make sure all environment variables are set correctly
- **"Database not configured"**: Check that your Supabase credentials are correct

### Runtime Errors
- **API 503 errors**: Verify your Supabase project is active and accessible
- **Database connection issues**: Check your Supabase project status

### Environment Variable Issues
- Make sure variable names are exactly as shown (case-sensitive)
- Ensure all three variables are set
- Check that you've selected all environments (Production, Preview, Development)

## Support

If you're still having issues:
1. Check the Vercel deployment logs for specific error messages
2. Verify your Supabase project is working by testing the API directly
3. Ensure your database tables are created and seeded with data 