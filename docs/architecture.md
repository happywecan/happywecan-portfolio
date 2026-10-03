# Architecture

## Overview

The project is split into a frontend web app and a backend API.

```text
Browser
  -> Next.js frontend on port 3000
  -> Spring Boot backend on port 8001
  -> MongoDB from MONGODB_URI
```

## Frontend

The `frontend/` app renders the public portfolio, project pages, blog pages,
login page, and admin interface.

Important paths:

- `frontend/app/`: Next.js app routes
- `frontend/components/sections/`: route-level public section composition
- `frontend/features/`: feature-owned page content, hooks, and visual sections
- `frontend/components/admin/`: admin CRUD screens
- `frontend/services/apiClient.ts`: shared HTTP/error boundary
- `frontend/services/`: endpoint-specific browser-side API clients

The browser API base URL is controlled by `NEXT_PUBLIC_API_URL`.

The homepage follows a deliberately small feature structure:

```text
app/page.tsx                         route behaviour
components/sections/EditorialLanding composition root
features/landing/useLandingSettings  editable public-content request
features/landing/landingContent      static portfolio copy
features/landing/*.tsx               visual sections
```

This keeps one rendering path for the visible homepage. The old unused
section-order renderer was removed rather than retained as misleading
"compatibility" code.

## Backend

The `backend-java/` service is a Java 21 Spring Boot application. It connects
to MongoDB, serves uploaded files, exposes health endpoints, and applies JWT
authentication and request-level protections to the API.

Important paths:

- `backend-java/src/main/java/`: API modules, services, repositories, and security
- `backend-java/src/test/java/`: controller, service, and security tests
- `static/uploads/`: uploaded image files mounted into the Java service

## Data

MongoDB is configured through `MONGODB_URI`. Development can use the shared test
database described in `docs/development.md`; production must use a separate
database.

Core content collections include portfolio items, blog posts, skills, hobbies,
hero settings, site settings, contacts, and users.

## Local Runtime

Docker Compose is the preferred development path:

```bash
docker compose up -d --build
```

This starts:

- `backend`: Spring Boot container, exposed as `localhost:8001`
- `frontend`: Next.js container, exposed as `localhost:3000`

## Deployment

The repository contains VM-oriented deployment files. Current deployment notes
are in:

- `.github/workflows/deploy-vm.yml`
- `docker-compose.vm-pull.yml`
- `docs/gcp-vm-deployment.md`
