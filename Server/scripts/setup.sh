#!/bin/bash
set -e

echo "🚀 Setting up ChamaTrust backend..."

# Create database (assumes PostgreSQL is running)
echo "Creating database..."
createdb chamatrust || echo "Database already exists"

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Seed database
echo "Seeding database..."
node scripts/seed.js

echo "✅ Setup complete. Run 'npm start' to start the server."