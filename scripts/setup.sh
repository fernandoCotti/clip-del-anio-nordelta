#!/bin/bash
# Setup script for the tournament application

echo "Setting up Clip del Año Tournament..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Setting up database..."
npx prisma db push

# Seed database
echo "Seeding database..."
npm run db:seed

echo "Setup complete! Don't forget to:"
echo "1. Create a .env file with your configuration"
echo "2. Set ADMIN_PASSWORD in .env"
echo "3. Run 'npm run dev' to start the development server"
