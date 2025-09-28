#!/bin/bash

# Cloud SQL Migration Script for CI/CD
# This script connects to Cloud SQL via proxy and runs Prisma migrations
# Requires DATABASE_PASSWORD environment variable to be set

set -e  # Exit on error

echo "🚀 Starting Cloud SQL migration process (CI/CD mode)..."

# Configuration
INSTANCE_CONNECTION_NAME="bilan-competence-449414:us-central1:bdc-db-prod"
DATABASE_NAME="modernwebapp"
DATABASE_USER="modernapp"
CLOUD_SQL_PROXY_PORT=5432

# Check if DATABASE_PASSWORD is set
if [ -z "$DATABASE_PASSWORD" ]; then
    echo "❌ DATABASE_PASSWORD environment variable is not set"
    exit 1
fi

# Check if cloud-sql-proxy is installed
if ! command -v cloud-sql-proxy &> /dev/null; then
    echo "❌ cloud-sql-proxy is not installed"
    exit 1
fi

# Start Cloud SQL Proxy in the background
echo "🔌 Starting Cloud SQL Proxy..."
cloud-sql-proxy --port=$CLOUD_SQL_PROXY_PORT "$INSTANCE_CONNECTION_NAME" &
PROXY_PID=$!

# Give the proxy time to start
sleep 5

# Check if proxy is running
if ! ps -p $PROXY_PID > /dev/null; then
    echo "❌ Cloud SQL Proxy failed to start"
    exit 1
fi

echo "✅ Cloud SQL Proxy started successfully (PID: $PROXY_PID)"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$PROXY_PID" ]; then
        kill $PROXY_PID 2>/dev/null || true
    fi
}
trap cleanup EXIT

# Set DATABASE_URL for Prisma
export DATABASE_URL="postgresql://$DATABASE_USER:$DATABASE_PASSWORD@localhost:$CLOUD_SQL_PROXY_PORT/$DATABASE_NAME?schema=public"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🏗️ Running migrations..."
npx prisma migrate deploy

# Optionally seed if SEED_DATABASE is set
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    echo "✅ Database seeded successfully!"
fi

echo "✅ Migration completed successfully!"