#!/bin/bash
# Cloud Run provides PORT environment variable
export PORT=${PORT:-8080}
node server.js