#!/bin/bash

# Check if URL parameter is provided
if [ -z "$1" ]; then
  echo "❌ Error: No URL provided."
  echo "Usage: $0 <url>"
  exit 1
fi

URL=$1
MAX_RETRIES=10
DELAY=5

echo "🔍 Checking API at $URL..."

# Retry loop
for ((i=1; i<=MAX_RETRIES; i++)); do
  if curl --silent --fail "$URL"; then
    echo ""
    echo "⭐️ API is alive on attempt $i!"
    exit 0
  else
    echo "⏱️ Attempt $i/$MAX_RETRIES: Waiting for API to be alive..."
    sleep $DELAY
  fi
done

# If we reach this point, all attempts failed
echo "❌ API failed to respond after $MAX_RETRIES attempts."
exit 1