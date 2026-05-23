# GCP Cloud Run Deployment

This project can move from Render to GCP with two Cloud Run services. This keeps the full Next.js runtime instead of flattening the frontend into a static-only deployment:

- `happywecan-api`: FastAPI backend, built from `Dockerfile.backend`
- `happywecan-frontend`: Next.js frontend, built from `frontend/Dockerfile`

The current production MongoDB connection can stay on MongoDB Atlas. Cloud Run only hosts the containers.

## Why Cloud Run for the frontend

Firebase Hosting can be cheaper for purely static sites, but this project should keep a complete Next.js deployment so the frontend can grow into server rendering, route handlers, middleware, image behavior, and other Next.js runtime features.

The cost controls are:

- `--min-instances 0`: services scale to zero when idle.
- `--max-instances 2`: accidental traffic cannot scale without limit.
- 512 MiB memory and 1 CPU per service for the first production version.
- MongoDB stays on Atlas, avoiding always-on Cloud SQL cost.
- Billing alerts should be configured before cutover.

This is the best learning path if the goal is to understand production Next.js deployment while still keeping low monthly cost.

## One-time GCP setup

Install the Google Cloud CLI, then authenticate:

```powershell
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

Enable the required APIs:

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
```

Create a small budget alert before deploying:

```powershell
gcloud billing budgets create --billing-account=YOUR_BILLING_ACCOUNT_ID --display-name="HappyWeCan monthly budget" --budget-amount=5USD
```

You can find the billing account ID with:

```powershell
gcloud billing accounts list
```

Create an Artifact Registry Docker repository. `asia-east1` is Taiwan:

```powershell
gcloud artifacts repositories create happywecan --repository-format=docker --location=asia-east1 --description="HappyWeCan containers"
```

## Secrets

Create the same secrets that Render currently stores as private environment variables:

```powershell
gcloud secrets create MONGODB_URI --data-file=-
gcloud secrets create SECRET_KEY --data-file=-
gcloud secrets create ADMIN_USER --data-file=-
gcloud secrets create ADMIN_PASSWORD --data-file=-
gcloud secrets create MAIL_USERNAME --data-file=-
gcloud secrets create MAIL_PASSWORD --data-file=-
gcloud secrets create AZURE_SPEECH_KEY --data-file=-
gcloud secrets create AZURE_SPEECH_REGION --data-file=-
gcloud secrets create GEMINI_API_KEY --data-file=-
```

Paste the value after each command, then press `Ctrl+Z` and Enter in PowerShell.

If a secret already exists, add a new version instead:

```powershell
gcloud secrets versions add MONGODB_URI --data-file=-
```

Grant Cloud Run access to secrets. Replace `PROJECT_NUMBER`:

```powershell
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

Get `PROJECT_NUMBER` with:

```powershell
gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"
```

## Deploy

From the repository root:

```powershell
gcloud builds submit --config gcp/cloudbuild.yaml --substitutions _REGION=asia-east1,_API_URL=https://api.happywecan.com,_FRONTEND_URL=https://angelo.happywecan.com
```

For a first deploy before custom domains are mapped, use the generated Cloud Run frontend URL as `_FRONTEND_URL`, then redeploy once DNS is ready.

## Cost notes

Cloud Run request-based billing has a monthly free tier for requests, CPU, and memory. With low personal-site traffic and `min-instances=0`, the backend and frontend should usually be inexpensive. The main charges to watch are:

- Cloud Run CPU and memory beyond the free tier.
- Internet egress from frontend pages, images, and API responses.
- Artifact Registry image storage after the first free 0.5 GB.
- Secret Manager active secret versions. The current setup uses more than the 6-version free tier, but the overage is small. If desired, combine low-risk app config into fewer secrets later.
- Cloud Build minutes when building images.

Avoid these until there is a clear reason:

- Cloud SQL for this app; it is usually not cost-effective for a low-traffic MongoDB-backed site.
- A load balancer in front of Cloud Run; use Cloud Run domain mappings first.
- `min-instances=1`; it improves cold starts but creates always-on cost.

## Custom domains

Map the existing domains to Cloud Run:

```powershell
gcloud run domain-mappings create --service happywecan-api --domain api.happywecan.com --region asia-east1
gcloud run domain-mappings create --service happywecan-frontend --domain angelo.happywecan.com --region asia-east1
```

GCP will print the DNS records to add at the domain DNS provider. After DNS is verified, redeploy with:

```powershell
gcloud builds submit --config gcp/cloudbuild.yaml --substitutions _REGION=asia-east1,_API_URL=https://api.happywecan.com,_FRONTEND_URL=https://angelo.happywecan.com
```

## Verify

Check service URLs:

```powershell
gcloud run services describe happywecan-api --region asia-east1 --format="value(status.url)"
gcloud run services describe happywecan-frontend --region asia-east1 --format="value(status.url)"
```

Check backend health:

```powershell
Invoke-RestMethod https://api.happywecan.com/healthz
```

## Important upload note

The backend currently saves admin image uploads to `static/uploads` inside the container. Cloud Run containers have ephemeral local filesystems, so new uploads may disappear after a container restart or scale-out.

Images already committed under `static/uploads` are included in the backend image. For durable production uploads, migrate `routes/upload.py` to Google Cloud Storage and store returned public URLs in MongoDB.
