#!/bin/sh
set -e

# Skip migrations for now - handle manually
echo "Skipping automatic migrations..."

# Start the application
PORT=${PORT:-8080}
echo "Starting the application on port $PORT..."
exec node server.js