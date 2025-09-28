#!/bin/bash

# Direct migration script without Cloud SQL Proxy
set -e

echo "Running Prisma migrations on Cloud SQL..."

# Get the password from secret
DB_PASSWORD=$(gcloud secrets versions access latest --secret=modernapp-db-password --project=bilan-competence-449414 2>/dev/null || echo "modernapp2025secure")

# Create a temporary .env file for Prisma
cat > .env.migrate <<EOF
DATABASE_URL="postgresql://modernapp:${DB_PASSWORD}@127.0.0.1:5432/modernwebapp?host=/cloudsql/bilan-competence-449414:us-central1:bdc-db-prod"
EOF

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Clean up
rm -f .env.migrate

echo "Migrations completed successfully!"