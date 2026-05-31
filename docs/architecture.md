# Architecture

## Overview

The project is split into a frontend web app and a backend API.

```text
Browser
  -> Next.js frontend on port 3000
  -> FastAPI backend on port 8001
  -> MongoDB from MONGODB_URI
```

## Frontend

The `frontend/` app renders the public portfolio, project pages, blog pages,
login page, and admin interface.

Important paths:

- `frontend/app/`: Next.js app routes
- `frontend/components/sections/`: public homepage sections
- `frontend/components/admin/`: admin CRUD screens
- `frontend/services/`: browser-side API clients

The browser API base URL is controlled by `NEXT_PUBLIC_API_URL`.

## Backend

The backend entry point is `app.py`, which creates the FastAPI app, loads
environment variables, connects to MongoDB during application lifespan, mounts
static files, and registers routers.

Important paths:

- `routes/`: API routers
- `services/`: database, auth, mail, and static content services
- `models/`: request and response models
- `static/uploads/`: uploaded image files served by FastAPI

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

- `backend`: FastAPI container, exposed as `localhost:8001`
- `frontend`: Next.js container, exposed as `localhost:3000`

## Deployment

The repository contains both Render and VM-oriented deployment files. Current
deployment notes are in:

- `render.yaml`
- `.github/workflows/deploy-vm.yml`
- `docker-compose.vm-pull.yml`
- `docs/gcp-vm-deployment.md`
