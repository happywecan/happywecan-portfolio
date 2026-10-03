#!/usr/bin/env sh
# Run the Spring Boot API directly on the host. This avoids Docker's CPU and RAM cost.
set -eu

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

. scripts/check-java-21.sh

export PORT="${PORT:-8001}"
export CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:3000,http://127.0.0.1:3000}"

echo "Starting Spring Boot API at http://localhost:${PORT}"
cd backend-java
exec sh ./mvnw spring-boot:run
