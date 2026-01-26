# Setup script for the tournament application (PowerShell)

Write-Host "Setting up Clip del Año Tournament..." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Push database schema
Write-Host "Setting up database..." -ForegroundColor Yellow
npx prisma db push

# Seed database
Write-Host "Seeding database..." -ForegroundColor Yellow
npm run db:seed

Write-Host "Setup complete! Don't forget to:" -ForegroundColor Green
Write-Host "1. Create a .env file with your configuration" -ForegroundColor Cyan
Write-Host "2. Set ADMIN_PASSWORD in .env" -ForegroundColor Cyan
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor Cyan
