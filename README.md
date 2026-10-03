# Angelo Portfolio

A personal portfolio and lightweight content-management system built to present
production-minded AI, manufacturing DX, and full-stack engineering work.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Java 21, Spring Boot, MongoDB, JWT authentication
- Delivery: Docker Compose, GitHub Actions, VM deployment workflow

## Features

- Responsive portfolio and case-study landing page
- Admin management for portfolio items, posts, skills, hobbies, and site copy
- JWT-protected admin APIs, request IDs, rate limiting, health endpoints
- Image upload and static asset serving
- Contact inbox and newsletter subscriptions

## Local development

Copy the environment template and fill in local secrets:

```bash
cp .env.example .env
```

Start the Java API, frontend, and their shared Docker volumes:

```bash
docker compose up -d --build
```

Local URLs:

- Frontend: http://localhost:3000
- API: http://localhost:8001
- API health: http://localhost:8001/actuator/health

Run the application checks directly when dependencies are installed:

```bash
(cd frontend && npm run lint && npm run build)
(cd backend-java && ./mvnw test)
```

For a lower-resource local workflow without Docker, use:

```bash
sh scripts/dev-local.sh
```

See [Development guide](docs/development.md) for Java 21 and environment setup.

## Repository layout

```text
frontend/       Next.js application
backend-java/   Spring Boot API
static/         public images and locally mounted uploads
docs/           architecture and deployment notes
scripts/        deployment and operational helpers
gcp/            Cloud Build configurations
```

## Documentation

- [Architecture](docs/architecture.md)
- [Java backend architecture](docs/java-backend-architecture.md)
- [Frontend learning guide](docs/frontend-learning-guide.md)
- [Docker runtime guide](docs/docker-runtime.md)
- [Development guide](docs/development.md)
- [VM deployment](docs/gcp-vm-deployment.md)

Never commit real `.env` files, passwords, API keys, service-account keys, or
database dumps.
