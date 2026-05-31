# HappyWeCan Portfolio

Personal portfolio and content management system built with Next.js, FastAPI,
MongoDB, and Docker. The site is used as a public career portfolio while the
admin area supports editing portfolio projects, blog posts, skills, hobbies,
homepage copy, uploaded images, and contact messages.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP
- Backend: FastAPI, Python, MongoDB, JWT authentication
- Infrastructure: Docker Compose for local development, GitHub Actions and VM
  deployment files for production-oriented deployment

## Main Features

- Responsive portfolio homepage with configurable sections
- Admin panel for portfolio, blog, skill, hobby, hero, and site settings
- Image upload and static asset serving through the FastAPI backend
- Contact form and mail integration settings
- Docker-based local development flow for frontend and backend
- Shared test database workflow documented for multi-machine development

## Local Development

Copy the environment template and fill in local secrets:

```bash
cp .env.example .env
```

Start the app:

```bash
docker compose up -d --build
```

Local URLs:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- Health check: http://localhost:8001/healthz

View logs:

```bash
docker compose logs -f
```

Stop services:

```bash
docker compose down
```

## Environment Notes

The app expects `MONGODB_URI` in `.env`. For development, this can point to a
local MongoDB, MongoDB Atlas, or the shared Mac mini test database described in
[docs/development.md](docs/development.md).

Do not commit real `.env` files, passwords, API keys, service-account keys, or
database dumps.

## Project Structure

```text
frontend/     Next.js application
app.py        FastAPI app entry point
routes/       API routers
services/     database, auth, mail, and content services
models/       Pydantic models
static/       uploaded and served assets
docs/         development, deployment, and archived notes
scripts/      maintenance and deployment helper scripts
```

## Documentation

- [Architecture](docs/architecture.md)
- [Development guide](docs/development.md)
- [Mac mini MongoDB test server](docs/mongodb-test-server.md)
- [VM deployment](docs/gcp-vm-deployment.md)

## Current Status

This repository is being cleaned up for public portfolio use. The active
application path is the Dockerized Next.js + FastAPI stack.
