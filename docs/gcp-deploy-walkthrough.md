# GCP Deployment Walkthrough

This is the guided deployment path for moving this project from Render to GCP.

Target architecture:

- `happywecan-frontend`: full Next.js runtime on Cloud Run
- `happywecan-api`: FastAPI backend on Cloud Run
- MongoDB: keep the existing MongoDB Atlas database
- Secrets: Google Secret Manager
- Container images: Artifact Registry
- Build/deploy: Cloud Build
- Region: `asia-east1` because it is Taiwan

## 0. Cost guardrails first

Before deploying anything, create a billing budget in the Google Cloud Console:

1. Open Google Cloud Console.
2. Go to Billing.
3. Open Budgets & alerts.
4. Create a budget for this project.
5. Suggested first budget: NT$100 or NT$300.
6. Add alert thresholds such as 50%, 90%, and 100%.

Budget alerts do not stop services automatically. They warn you early so you can delete or scale down resources.

Keep these Cloud Run settings for the first version:

```txt
min instances: 0
max instances: 2
memory: 512Mi
cpu: 1
region: asia-east1
```

Do not enable these until there is a real need:

- Cloud SQL
- Kubernetes / GKE
- Load Balancer
- `min-instances=1`
- Large VM instances

## 1. Install Google Cloud CLI on Windows

This machine currently does not have `gcloud` installed.

Install it from the official Google Cloud CLI installer:

https://docs.cloud.google.com/sdk/docs/install

During installation:

- Keep bundled Python enabled.
- Allow the installer to add `gcloud` to PATH.
- Open a new PowerShell window after installation.

Verify:

```powershell
gcloud --version
```

## 2. Initialize gcloud

Run:

```powershell
gcloud init
```

This does three important things:

- Logs in to your Google account.
- Selects or creates a GCP project.
- Sets the default project for future commands.

Official reference:

https://docs.cloud.google.com/sdk/docs/initializing

After initialization, confirm the active project:

```powershell
gcloud config get-value project
```

## 3. Enable required APIs

From the repository root:

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
```

These APIs are needed for:

- Cloud Run: hosting frontend/backend containers
- Cloud Build: building and deploying
- Artifact Registry: storing Docker images
- Secret Manager: storing private environment variables

## 4. Create Artifact Registry repository

Create the Docker image repository:

```powershell
gcloud artifacts repositories create happywecan --repository-format=docker --location=asia-east1 --description="HappyWeCan containers"
```

If it already exists, that is fine. Continue.

## 5. Create secrets

These replace Render private environment variables.

Create each secret once:

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

After each command, paste the value, then press `Ctrl+Z` and Enter in PowerShell.

If a secret already exists, add a new version:

```powershell
gcloud secrets versions add MONGODB_URI --data-file=-
```

## 6. Grant Cloud Run permission to read secrets

Get your project ID:

```powershell
gcloud config get-value project
```

Get your project number:

```powershell
gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"
```

Grant the default Cloud Run service account access:

```powershell
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

Replace:

- `YOUR_PROJECT_ID`
- `PROJECT_NUMBER`

## 7. First deploy

Run from the repository root:

```powershell
gcloud builds submit --config gcp/cloudbuild.yaml --substitutions _REGION=asia-east1,_API_URL=https://api.happywecan.com,_FRONTEND_URL=https://angelo.happywecan.com
```

This command:

1. Builds the backend Docker image.
2. Builds the frontend Docker image.
3. Pushes both images to Artifact Registry.
4. Deploys both images to Cloud Run.

The repository has a `.gcloudignore` file so Cloud Build does not upload local dependencies such as `frontend/node_modules`, `frontend/.next`, `.venv`, screenshots, or local environment files.

## 8. Check generated Cloud Run URLs

Backend:

```powershell
gcloud run services describe happywecan-api --region asia-east1 --format="value(status.url)"
```

Frontend:

```powershell
gcloud run services describe happywecan-frontend --region asia-east1 --format="value(status.url)"
```

Health check:

```powershell
Invoke-RestMethod "$(gcloud run services describe happywecan-api --region asia-east1 --format='value(status.url)')/healthz"
```

Expected response:

```json
{"status":"ok"}
```

## 9. Custom domains

Map:

- `api.happywecan.com` to `happywecan-api`
- `angelo.happywecan.com` to `happywecan-frontend`

Commands:

```powershell
gcloud run domain-mappings create --service happywecan-api --domain api.happywecan.com --region asia-east1
gcloud run domain-mappings create --service happywecan-frontend --domain angelo.happywecan.com --region asia-east1
```

GCP will print DNS records. Add those records at your DNS provider.

Certificate provisioning can take minutes and sometimes longer.

Actual DNS records returned by Cloud Run:

```txt
api.happywecan.com     CNAME     ghs.googlehosted.com.
angelo.happywecan.com  CNAME     ghs.googlehosted.com.
```

If old Render DNS records exist for these subdomains, replace them with the records above.

## 10. Verify production

Check:

- `https://api.happywecan.com/healthz`
- `https://angelo.happywecan.com`
- Login page
- Admin page
- Blog list/detail
- Portfolio list/detail
- Contact form
- Existing images

## 11. Known follow-up

Admin uploads currently save files into `static/uploads` inside the container. Cloud Run local disk is not durable.

Committed images are fine, but new production uploads should be moved to Google Cloud Storage later.

## 12. Cleanup habits

To avoid wasting credits:

- Keep Cloud Run `min-instances=0`.
- Keep `max-instances=2` until traffic grows.
- Delete old Artifact Registry images periodically.
- Watch Billing reports during the first week.
- Do not create Cloud SQL or VM instances unless needed.

## 13. Current migration handoff

For the exact current state of the Render to GCP migration, continue from:

```txt
docs/gcp-migration-handoff.md
```
