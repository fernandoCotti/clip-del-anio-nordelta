# Deployment Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set ADMIN_PASSWORD
   ```

3. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

### Prerequisites
- Vercel account
- Postgres database (Vercel Postgres, Supabase, or other provider)

### Steps

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure environment variables in Vercel:**
   - `DATABASE_URL`: Your Postgres connection string
   - `ADMIN_PASSWORD`: Your admin password
   - `NEXT_PUBLIC_TOURNAMENT_NAME`: Tournament display name (optional)

4. **Update Prisma schema for Postgres:**
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Commit and push the change

5. **Deploy:**
   - Vercel will automatically detect Next.js and deploy
   - After deployment, run migrations:
     ```bash
     npx prisma migrate deploy
     ```
   - Or use Vercel's CLI:
     ```bash
     vercel env pull
     npx prisma migrate deploy
     ```

6. **Seed initial data (optional):**
   ```bash
   npm run db:seed
   ```

## Database Migration (SQLite → Postgres)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Create and run migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. For production:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### OneDrive Git Issues
If you're working in a OneDrive synced folder and Git has issues:
- Initialize Git in a non-synced location, or
- Use Git from command line outside OneDrive sync conflicts

### Database Connection Issues
- Ensure your `DATABASE_URL` is correctly formatted
- For Postgres: `postgresql://user:password@host:port/database?schema=public`
- Test connection with: `npx prisma db pull`

### Build Errors
- Ensure all environment variables are set
- Check that Prisma client is generated: `npx prisma generate`
- Verify Node.js version (18+ recommended)
