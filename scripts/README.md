# Cloud SQL Migration Scripts

This directory contains scripts for managing database migrations on Google Cloud SQL.

## Prerequisites

1. **Install Cloud SQL Proxy**:
   ```bash
   # macOS
   brew install cloud-sql-proxy
   
   # Or download directly
   # https://cloud.google.com/sql/docs/mysql/sql-proxy
   ```

2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   gcloud config set project bilan-competence-449414
   ```

3. **Install Node dependencies**:
   ```bash
   npm install
   ```

## Scripts

### `migrate-cloud-sql.sh` (Interactive)
Use this script for manual migrations with interactive prompts:

```bash
./scripts/migrate-cloud-sql.sh
```

This script will:
1. Start Cloud SQL Proxy
2. Prompt for database password
3. Run Prisma migrations
4. Optionally seed the database

### `migrate-cloud-sql-ci.sh` (CI/CD)
Use this script for automated migrations in CI/CD pipelines:

```bash
# Set environment variables
export DATABASE_PASSWORD="your-password-here"
export SEED_DATABASE=true  # Optional, set to true to seed

# Run migrations
./scripts/migrate-cloud-sql-ci.sh
```

## Database Connection Details

- **Instance**: `bilan-competence-449414:us-central1:bdc-db-prod`
- **Database**: `modernwebapp`
- **User**: `modernapp`
- **Port**: `5432` (PostgreSQL)

## Manual Migration Steps

If you prefer to run migrations manually:

1. **Start Cloud SQL Proxy**:
   ```bash
   cloud-sql-proxy --port=5432 "bilan-competence-449414:us-central1:bdc-db-prod"
   ```

2. **Set DATABASE_URL**:
   ```bash
   export DATABASE_URL="postgresql://modernapp:YOUR_PASSWORD@localhost:5432/modernwebapp?schema=public"
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed database** (optional):
   ```bash
   npx prisma db seed
   ```

## Troubleshooting

### "User table doesn't exist" error
This means the database hasn't been initialized with the schema. Run the migration script to create all tables.

### Cloud SQL Proxy connection failed
1. Ensure you're authenticated with gcloud
2. Check that you have the necessary IAM permissions
3. Verify the instance connection name is correct

### Migration failed
1. Check the database password is correct
2. Ensure the database user has necessary permissions
3. Review the migration SQL in `prisma/migrations/`

## Security Notes

- Never commit passwords to version control
- Use environment variables for sensitive data
- Restrict database user permissions to minimum required
- Use Cloud IAM for access control