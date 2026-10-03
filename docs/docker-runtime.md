# Docker runtime guide

## Development

If Docker Desktop is too heavy for the machine, prefer the host-native scripts
documented in `docs/development.md`. Docker is optional for application
development; only the configured MongoDB URI is required.

Start the local stack with:

```bash
docker compose up -d --build
```

The frontend runs Next.js development mode. Its `node_modules` and `.next`
directories use named volumes, so package installation and the development cache
survive container recreation. `WATCHPACK_POLLING=true` makes file watching work
reliably through a bind mount; it trades some idle CPU use for reliable hot reload.

The Java image is structured for Docker BuildKit caching:

1. Maven wrapper and `pom.xml` are copied first.
2. `dependency:go-offline` populates a persistent BuildKit `/root/.m2` cache.
3. Source code is copied and packaged afterwards.

Changing only `src/` should therefore reuse downloaded Maven dependencies. A
change to `pom.xml` intentionally invalidates that dependency layer.

## Readiness and startup order

The backend reports readiness through Spring Boot Actuator at:

```text
/actuator/health/readiness
```

Compose waits for that endpoint, including MongoDB connectivity, before starting
the frontend. In VM deployment configurations, Nginx also waits for the frontend
HTTP endpoint. This avoids a proxy accepting traffic while its upstream is still
booting.

Inspect current readiness with:

```bash
docker compose ps
docker compose logs -f backend
```

`healthy` means the service passed its own HTTP health check. It does not replace
application monitoring or external uptime checks.
