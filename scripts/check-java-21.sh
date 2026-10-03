#!/usr/bin/env sh
# Keep the runtime check separate so orchestration can fail before starting any service.
set -eu

# Prefer a dedicated Java 21 installation for this project. This avoids changing
# the user's global Java 26 default and works even when Homebrew's keg-only JDK
# is not registered with macOS's `java_home` command.
for candidate in "${JAVA_HOME:-}" /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21; do
  if [ -n "$candidate" ] && [ -x "$candidate/bin/java" ]; then
    candidate_major="$($candidate/bin/java -version 2>&1 | sed -n '1s/.*version "\([0-9][0-9]*\).*/\1/p')"
    if [ "$candidate_major" = "21" ]; then
      export JAVA_HOME="$candidate"
      export PATH="$JAVA_HOME/bin:$PATH"
      break
    fi
  fi
done

JAVA_MAJOR="$(java -version 2>&1 | sed -n '1s/.*version "\([0-9][0-9]*\).*/\1/p')"
if [ "$JAVA_MAJOR" != "21" ]; then
  echo "Java 21 is required. Current major version: ${JAVA_MAJOR:-not found}." >&2
  echo "Install/select a Java 21 JDK, then retry." >&2
  exit 1
fi
