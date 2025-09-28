#!/bin/bash

# Cloud SQL Migration Script
# This script connects to Cloud SQL via proxy and runs Prisma migrations

set -e  # Exit on error

echo "🚀 Starting Cloud SQL migration process..."

# Configuration
INSTANCE_CONNECTION_NAME="bilan-competence-449414:us-central1:bdc-db-prod"
DATABASE_NAME="modernwebapp"
DATABASE_USER="modernapp"
CLOUD_SQL_PROXY_PORT=5432

# Check if cloud-sql-proxy is installed
if ! command -v cloud-sql-proxy &> /dev/null; then
    echo "❌ cloud-sql-proxy is not installed. Please install it first:"
    echo "   For macOS: brew install cloud-sql-proxy"
    echo "   Or download from: https://cloud.google.com/sql/docs/mysql/sql-proxy"
    exit 1
fi

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Please authenticate with gcloud first:"
    echo "   gcloud auth login"
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
export DATABASE_URL="postgresql://$DATABASE_USER@localhost:$CLOUD_SQL_PROXY_PORT/$DATABASE_NAME?schema=public"

echo "📊 Database URL: $DATABASE_URL (password hidden)"

# Prompt for database password
echo -n "Enter database password for $DATABASE_USER: "
read -s DATABASE_PASSWORD
echo ""

# Update DATABASE_URL with password
export DATABASE_URL="postgresql://$DATABASE_USER:$DATABASE_PASSWORD@localhost:$CLOUD_SQL_PROXY_PORT/$DATABASE_NAME?schema=public"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Create initial migration if needed
echo "🏗️ Creating migrations..."
npx prisma migrate deploy

# Check if we should seed the database
echo -n "Do you want to seed the database with initial data? (y/N): "
read SEED_RESPONSE

if [[ "$SEED_RESPONSE" =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    echo "✅ Database seeded successfully!"
fi

echo "✅ Migration completed successfully!"
echo ""
echo "📝 Summary:"
echo "   - Database: $DATABASE_NAME"
echo "   - Instance: $INSTANCE_CONNECTION_NAME"
echo "   - User: $DATABASE_USER"
echo ""
echo "🔍 You can verify the migration by running:"
echo "   npx prisma studio"