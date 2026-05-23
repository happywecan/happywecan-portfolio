# Render to GCP Checklist

## Target architecture

- Frontend: full Next.js runtime on Cloud Run.
- Backend: FastAPI on Cloud Run.
- Database: keep the existing MongoDB Atlas database.
- Upload storage: keep committed images for now; migrate future admin uploads to Cloud Storage.

This favors learning and future Next.js growth over a static-only frontend deployment.

## Before deploy

- Create or select a GCP project with billing enabled.
- Install and authenticate `gcloud`.
- Enable Cloud Run, Cloud Build, Artifact Registry, and Secret Manager APIs.
- Create the `happywecan` Artifact Registry Docker repository in `asia-east1`.
- Create Secret Manager secrets for every private Render environment variable.
- Create a budget alert, for example 5 USD/month.
- Confirm MongoDB Atlas allows connections from GCP. If IP allowlisting is strict, use temporary `0.0.0.0/0` or configure a stable egress path later.

## Deploy order

1. Deploy backend and frontend with `gcp/cloudbuild.yaml`.
2. Confirm `/healthz` on the backend.
3. Map `api.happywecan.com` to `happywecan-api`.
4. Map `angelo.happywecan.com` to `happywecan-frontend`.
5. Redeploy with `_API_URL=https://api.happywecan.com` and `_FRONTEND_URL=https://angelo.happywecan.com`.
6. Test login, admin CRUD, contact mail, blog/portfolio detail pages, and image rendering.

## After cutover

- Disable Render auto deploy or delete the Render services after GCP is verified.
- Move admin uploads from container disk to Cloud Storage before relying on uploads in production.
- Add a GitHub Actions deploy workflow later if you want automatic deploys from `main`.

## Cost guardrails

- Keep both Cloud Run services at `min-instances=0`.
- Keep `max-instances=2` until traffic proves it needs more.
- Keep Cloud Run memory at 512 MiB unless the frontend build/runtime shows memory pressure.
- Delete old Artifact Registry images periodically.
- Watch billing reports during the first week after cutover.
