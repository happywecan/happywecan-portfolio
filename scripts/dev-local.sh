#!/usr/bin/env sh
# Start both host-native development processes and stop both on Ctrl+C.
set -eu

# Check prerequisites before starting either background process. Without this,
# a Java mismatch would briefly start Next.js and leave a confusing lock error.
. scripts/check-java-21.sh

cleanup() {
  trap - INT TERM EXIT
  if [ -n "${BACKEND_PID:-}" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID:-}" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

sh scripts/dev-backend-local.sh &
BACKEND_PID=$!

echo "Waiting for backend readiness..."
ready=false
for attempt in $(seq 1 30); do
  if curl --fail --silent http://localhost:8001/actuator/health/readiness >/dev/null 2>&1; then
    ready=true
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Backend stopped before becoming ready." >&2
    exit 1
  fi
  sleep 1
done

if [ "$ready" != "true" ]; then
  echo "Backend did not become ready within 30 seconds." >&2
  exit 1
fi

sh scripts/dev-frontend-local.sh &
FRONTEND_PID=$!

wait "$BACKEND_PID" "$FRONTEND_PID"
