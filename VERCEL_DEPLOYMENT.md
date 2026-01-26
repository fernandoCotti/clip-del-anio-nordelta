# 🚀 Vercel Deployment Guide

Your repository is ready! Follow these steps to deploy to Vercel.

## Step 1: Update Prisma Schema for PostgreSQL

Your schema currently uses SQLite. Vercel requires PostgreSQL. The schema has been updated - commit and push the change:

```powershell
git add prisma/schema.prisma
git commit -m "Update Prisma schema for PostgreSQL production"
git push
```

## Step 2: Create Vercel Account & Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Log In"** if you have an account)
3. Sign in with **GitHub** (recommended - it will connect to your repo automatically)
4. Click **"Add New..."** → **"Project"**
5. Find and select **`fernandoCotti/clip-del-anio-nordelta`**
6. Click **"Import"**

## Step 3: Configure Project Settings

Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

## Step 4: Set Up Database (Choose One)

### Option A: Vercel Postgres (Easiest - Recommended) ⭐

1. In your Vercel project dashboard, go to the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a name (e.g., `clip-del-anio-nordelta-db`)
5. Select a region (closest to your users)
6. Click **"Create"**
7. Copy the **`POSTGRES_PRISMA_URL`** - you'll need this in Step 5

### Option B: Supabase (Free Alternative)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Option C: Neon (Another Free Option)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from the dashboard

## Step 5: Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

   **DATABASE_URL**
   ```
   (Use the connection string from Step 4)
   ```
   - For Vercel Postgres: Use `POSTGRES_PRISMA_URL`
   - For Supabase/Neon: Use the connection string you copied
   - Format: `postgresql://user:password@host:port/database?schema=public`

   **ADMIN_PASSWORD**
   ```
   (Choose a strong password for admin access)
   ```
   Example: `MySecurePassword123!`

   **NEXT_PUBLIC_TOURNAMENT_NAME** (Optional)
   ```
   Nordelta 2025
   ```

3. Make sure to select **"Production"**, **"Preview"**, and **"Development"** for each variable
4. Click **"Save"**

## Step 6: Deploy!

1. Go back to the **"Deployments"** tab
2. Click **"Deploy"** (or it may auto-deploy when you save environment variables)
3. Wait 2-3 minutes for the build to complete
4. ✅ Your app will be live at `https://your-project-name.vercel.app`

## Step 7: Run Database Migrations

After the first deployment, you need to set up the database tables:

### Option A: Using Vercel CLI (Recommended)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project (from your project directory)
cd C:\Projects\clip-del-anio-nordelta
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard

1. Go to your project on Vercel
2. Open the latest deployment
3. Go to **"Functions"** tab
4. Use the terminal to run: `npx prisma migrate deploy`

### Option C: Manual (Temporary)

1. Temporarily set `DATABASE_URL` in your local `.env` to your production database
2. Run: `npx prisma migrate deploy`
3. ⚠️ **Be careful** - make sure you're pointing to production, not your local dev database!

## Step 8: Access Your Live App

1. Visit your deployment URL: `https://your-project-name.vercel.app`
2. Access admin at: `https://your-project-name.vercel.app/admin`
3. Login with the `ADMIN_PASSWORD` you set

## Step 9: Seed Initial Data (Optional)

If you want to add initial tournament data:

```powershell
# Make sure DATABASE_URL points to production (temporarily)
npm run db:seed
```

Or add data through the admin interface after deployment.

## 🎉 You're Done!

Your app is now live and ready to share with friends!

---

## Troubleshooting

### Build Fails
- ✅ Check that `DATABASE_URL` is set correctly
- ✅ Ensure Prisma schema uses `postgresql` provider
- ✅ Check build logs in Vercel dashboard for specific errors

### Database Connection Errors
- ✅ Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database?schema=public`
- ✅ Check that your database allows connections from Vercel's IPs
- ✅ For Supabase: Check connection pooling settings

### Migration Errors
- ✅ Make sure you've updated the schema to use `postgresql`
- ✅ Run `npx prisma generate` before deploying
- ✅ Check that migrations ran successfully

### Can't Access Admin
- ✅ Verify `ADMIN_PASSWORD` is set correctly
- ✅ Check the admin route: `/admin/login`

---

## Quick Reference

**Your Repository:**
- GitHub: https://github.com/fernandoCotti/clip-del-anio-nordelta

**After Deployment:**
- Production URL: `https://your-project-name.vercel.app`
- Admin URL: `https://your-project-name.vercel.app/admin`

**Useful Commands:**
```powershell
# Local development
npm run dev

# Build for production
npm run build

# Database operations
npx prisma generate
npx prisma migrate deploy   # For production
npx prisma db push           # For local dev (if using SQLite)
```

---

Need help? Check Vercel docs: https://vercel.com/docs
