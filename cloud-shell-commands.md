# Cloud Shell Commands for Cloud SQL Migration

## Prerequisites
Make sure you're authenticated and have the necessary permissions to access the Cloud SQL instance.

## Option 1: Direct Connection with Inline SQL

```bash
# Set the project
gcloud config set project bilan-competence-449414

# Connect to Cloud SQL and run migration
# Note: You'll be prompted for the password for user 'modernapp'
gcloud sql connect bdc-db-prod --user=modernapp --database=modernwebapp
```

Once connected, paste the entire content of the `init-migration.sql` file into the psql prompt.

## Option 2: Using Cloud SQL Proxy (Recommended for larger migrations)

```bash
# Set the project
gcloud config set project bilan-competence-449414

# Download and install Cloud SQL Proxy if not already installed
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Start Cloud SQL Proxy
./cloud_sql_proxy -instances=bilan-competence-449414:REGION:bdc-db-prod=tcp:5432 &
# Note: Replace REGION with your Cloud SQL instance region (e.g., us-central1)

# Upload the SQL file to Cloud Shell
# Click the "Upload file" button in Cloud Shell and upload init-migration.sql

# Run the migration using psql
PGPASSWORD=YOUR_PASSWORD psql -h 127.0.0.1 -U modernapp -d modernwebapp -f init-migration.sql
```

## Option 3: Using gcloud sql import (If you have the file in Cloud Storage)

```bash
# First, upload your SQL file to Cloud Storage
gsutil cp init-migration.sql gs://YOUR_BUCKET_NAME/

# Import the SQL file
gcloud sql import sql bdc-db-prod gs://YOUR_BUCKET_NAME/init-migration.sql --database=modernwebapp
```

## Verification Commands

After running the migration, verify the tables were created:

```sql
-- List all tables
\dt

-- Check specific table structure
\d "User"
\d "Role"
\d "Permission"

-- Check enums
\dT+

-- Exit psql
\q
```

## Important Notes

1. **Password**: You'll need the password for the `modernapp` user
2. **Region**: If using Cloud SQL Proxy, replace REGION with your actual Cloud SQL instance region
3. **Permissions**: Ensure your Google Cloud account has the necessary permissions:
   - `cloudsql.client` role for connecting
   - `cloudsql.admin` role if importing SQL files

## Troubleshooting

If you encounter connection issues:

```bash
# Check if the Cloud SQL instance is running
gcloud sql instances describe bdc-db-prod

# Check your current project
gcloud config get-value project

# List available Cloud SQL instances
gcloud sql instances list
```