# Clip del Año - Nordelta Tournament

Annual video tournament application with voting system. Supports 64-video single-elimination tournaments.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Backend**: Next.js API routes
- **Database**: SQLite (dev) / Postgres (production) with Prisma ORM
- **Auth**: Anonymous session via cookies

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

3. Create a `.env` file:
```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-admin-password"
NEXT_PUBLIC_TOURNAMENT_NAME="Nordelta 2025"
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features

- Single-elimination tournament (64 → 32 → 16 → 8 → 4 → 2 → 1)
- Inline video viewing (YouTube/Vimeo embeds)
- Cookie-based anonymous voting
- Admin interface for tournament management
- Bracket visualization
- Animated winner page
- Mobile-responsive design

## Admin Access

Access the admin interface at `/admin` using the password set in `ADMIN_PASSWORD` environment variable.

## Tournament Workflow

### Admin Setup (First Time)
1. Go to `/admin/login` and enter your admin password
2. Create a new tournament (e.g., "Nordelta 2025")
3. Add exactly 64 videos with their embed URLs (YouTube or Vimeo)
4. Activate the tournament
5. Generate matches for Round 1
6. Open matches for voting

### Running a Round
1. Open all matches for the current round (or open them individually)
2. Users vote on matchups at `/match/[matchId]`
3. Close matches when voting period ends (winners are automatically determined)
4. Once all matches in a round are complete, click "Avanzar a la Siguiente Ronda"
5. Generate and open matches for the next round
6. Repeat until the final

### Final Winner
When the final match is completed, users are automatically redirected to `/winner/[videoId]` with celebratory animations.

## Reusing for Next Year

1. Update `NEXT_PUBLIC_TOURNAMENT_NAME` in `.env` (optional, can also set in admin)
2. Create a new tournament in the admin interface
3. Add 64 videos for the new tournament
4. Follow the tournament workflow above

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin interface
│   ├── api/                # API routes
│   ├── match/              # Matchup voting pages
│   ├── bracket/            # Bracket visualization
│   └── winner/             # Winner celebration page
├── components/             # React components
├── lib/                    # Utilities and Prisma client
├── prisma/                 # Database schema and seed
└── scripts/                # Setup scripts
```

## Environment Variables

- `DATABASE_URL`: Prisma database connection string (SQLite for dev, Postgres for production)
- `ADMIN_PASSWORD`: Password for admin access
- `NEXT_PUBLIC_TOURNAMENT_NAME`: Display name for the tournament (optional, can be set per tournament)

## Production Deployment

1. Set up a Postgres database
2. Update `DATABASE_URL` to your Postgres connection string
3. Run migrations: `npx prisma migrate deploy`
4. Deploy to Vercel (or your preferred platform)
5. Set environment variables in your hosting platform

## Git Commits

See `COMMITS.md` for recommended commit structure. Note: If you encounter OneDrive sync issues with Git, you may need to initialize the repository manually.
