#!/usr/bin/env sh
# Run the Next.js development server directly on the host.
set -eu

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8001}"

echo "Starting Next.js at http://localhost:3000 (API: ${NEXT_PUBLIC_API_URL})"
exec npm --prefix frontend run dev -- --hostname 0.0.0.0 --port 3000
