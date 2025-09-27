#!/bin/sh
set -e

# Check if using SQLite (for simplified deployment)
if echo "$DATABASE_URL" | grep -q "file:"; then
  echo "Using SQLite database..."
  # For SQLite, just start the app
else
  # For PostgreSQL, run migrations
  echo "Running database migrations..."
  node ./node_modules/prisma/build/index.js db push --accept-data-loss || echo "Migration failed, continuing..."
fi

# Start the application
echo "Starting the application on port ${PORT:-3000}..."
exec node server.js