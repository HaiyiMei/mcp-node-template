#!/bin/bash
set -e

# Set default values for environment variables if not provided
: ${PORT:="3000"}
: ${TENANT_ID:="default"}

echo "Starting server with TENANT_ID: $TENANT_ID"

# Run the server
exec npx -y supergateway \
  --stdio "node dist/index.js" \
  --port "$PORT" \
  --ssePath "/$TENANT_ID/mcp" \
  --messagePath "/$TENANT_ID/message" \
  --healthEndpoint "/$TENANT_ID/health"
