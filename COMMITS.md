# Git Commits Guide

Due to OneDrive sync conflicts, you may need to initialize Git manually. Here are the recommended commits:

## Initial Setup
```bash
git init
git add .
git commit -m "Initial project scaffold: Next.js app with TypeScript, TailwindCSS, and Framer Motion"
```

## Database Schema
```bash
git add prisma/
git commit -m "Add Prisma schema with Tournament, Video, Match, and Vote models"
```

## Core API Routes
```bash
git add app/api/
git commit -m "Implement API routes for voting, admin authentication, and tournament management"
```

## Voting UI Components
```bash
git add components/MatchupView.tsx components/VideoCard.tsx components/VoteButton.tsx
git add app/match/
git commit -m "Build matchup page with inline video embeds and voting UI"
```

## Admin Interface
```bash
git add components/AdminPanel.tsx components/TournamentManager.tsx components/VideoManager.tsx components/MatchManager.tsx
git add app/admin/
git commit -m "Create admin interface for tournament and video management"
```

## Bracket Visualization
```bash
git add components/BracketView.tsx app/bracket/
git commit -m "Implement bracket visualization component"
```

## Winner Page
```bash
git add components/WinnerDisplay.tsx app/winner/
git commit -m "Create winner page with celebratory animations"
```

## Final Polish
```bash
git add components/Navigation.tsx app/layout.tsx
git commit -m "Add navigation and final UI polish with responsive design"
```

## All at Once (Alternative)
If you prefer a single commit:
```bash
git init
git add .
git commit -m "Complete tournament application: voting system, admin panel, bracket view, and winner page"
```
