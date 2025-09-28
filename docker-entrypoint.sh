#!/bin/sh
set -e

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy || echo "Migration failed or already applied"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
PORT=${PORT:-8080}
echo "Starting the application on port $PORT..."
exec node server.js