# GCP Migration Handoff

Last updated: 2026-05-23

## Current status

The production site is now running on a GCP Compute Engine VM, not Cloud Run.

Current production URLs:

```txt
https://angelo.happywecan.com
https://api.happywecan.com
```

Current production architecture:

```txt
Cloudflare -> GCP e2-micro VM -> Nginx -> Next.js / FastAPI -> MongoDB Atlas
```

For the current VM deployment workflow, use:

```txt
docs/gcp-vm-deployment.md
```

Cloud Run cleanup completed on 2026-05-23:

```txt
Deleted Cloud Run services:
- happywecan-api
- happywecan-frontend

Deleted Cloud Run domain mappings:
- api.happywecan.com
- angelo.happywecan.com
```

Artifact Registry was intentionally kept because the VM deployment pulls the built backend/frontend images from it.

The older Cloud Run migration notes below are kept as history.

## Historical Cloud Run deployment

GCP project:

```txt
project id: focal-freedom-473403-f8
project number: 193468143671
region: asia-east1
billing: enabled
billing account: 016C7E-0512B9-3506FF
```

Cloud Run services:

```txt
happywecan-api
https://happywecan-api-re42hsfbqa-de.a.run.app

happywecan-frontend
https://happywecan-frontend-re42hsfbqa-de.a.run.app
```

Both services reached `Ready=True`.

Public unauthenticated access was granted to both services with `roles/run.invoker` for `allUsers`.

Cloud Build deployment succeeded:

```txt
build id: 734512f4-5174-4886-bf84-435a4586ca21
status: SUCCESS
duration: 5M45S
```

## GCP resources created

APIs enabled:

```txt
run.googleapis.com
cloudbuild.googleapis.com
artifactregistry.googleapis.com
secretmanager.googleapis.com
```

Artifact Registry:

```txt
repository: happywecan
location: asia-east1
format: docker
```

Secret Manager secrets created:

```txt
MONGODB_URI
SECRET_KEY
ADMIN_USER
ADMIN_PASSWORD
MAIL_USERNAME
MAIL_PASSWORD
```

Optional secrets not created yet:

```txt
AZURE_SPEECH_KEY
AZURE_SPEECH_REGION
GEMINI_API_KEY
```

IAM granted:

```txt
193468143671-compute@developer.gserviceaccount.com
  roles/secretmanager.secretAccessor

193468143671@cloudbuild.gserviceaccount.com
  roles/run.admin
  roles/iam.serviceAccountUser
```

## Repo changes made

Files added:

```txt
.gcloudignore
gcp/cloudbuild.yaml
docs/gcp-cloud-run.md
docs/gcp-deploy-walkthrough.md
docs/render-to-gcp-checklist.md
docs/gcp-migration-handoff.md
```

Important implementation notes:

- `.gcloudignore` was added because the first Cloud Build upload sent about 1.1 GiB and 47k files.
- `gcp/cloudbuild.yaml` uses `$BUILD_ID` for image tags because `$SHORT_SHA` is empty for manual `gcloud builds submit`.
- Optional Azure/Gemini secrets were removed from Cloud Run deploy config because they were not present in local `.env`.
- Secrets were rewritten without UTF-8 BOM after `MONGODB_URI` initially failed with `Invalid URI scheme`.

## Current blocker

Custom domain mappings were created, but DNS records still need to be configured at the DNS provider.

Cloud Run returned these DNS records:

```txt
api     CNAME     ghs.googlehosted.com.
angelo  CNAME     ghs.googlehosted.com.
```

Meaning:

```txt
api.happywecan.com      CNAME     ghs.googlehosted.com.
angelo.happywecan.com   CNAME     ghs.googlehosted.com.
```

Domain ownership verification is complete:

```txt
gcloud domains list-user-verified
ID
happywecan.com
```

Cloud Run is waiting for DNS propagation and certificate provisioning.

## Next steps after reboot

Open PowerShell in the repo:

```powershell
cd D:\projects\angelo20011016.github.io
```

Set a shorter alias for gcloud if desired:

```powershell
$gcloud = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
```

Confirm project:

```powershell
& $gcloud config get-value project
```

Expected:

```txt
focal-freedom-473403-f8
```

Check Cloud Run services:

```powershell
& $gcloud run services describe happywecan-api --region asia-east1 --format="yaml(status.conditions,status.url)"
& $gcloud run services describe happywecan-frontend --region asia-east1 --format="yaml(status.conditions,status.url)"
```

Check domain mappings:

```powershell
& $gcloud beta run domain-mappings describe --domain api.happywecan.com --region asia-east1
& $gcloud beta run domain-mappings describe --domain angelo.happywecan.com --region asia-east1
```

## Cloudflare DNS setup

If using Cloudflare, do this manually or through the Cloudflare API.

Manual records:

```txt
Type: CNAME
Name: api
Target: ghs.googlehosted.com
Proxy status: DNS only

Type: CNAME
Name: angelo
Target: ghs.googlehosted.com
Proxy status: DNS only
```

Use DNS only first. After Google certificate provisioning succeeds, Cloudflare proxy can be evaluated separately.

If using Cloudflare API next time, create an API token with:

```txt
Zone - DNS - Edit
Zone - Zone - Read
Zone resource: happywecan.com
```

Then set it only in the local PowerShell session:

```powershell
$env:CLOUDFLARE_API_TOKEN="TOKEN_VALUE"
```

Do not commit or paste the token.

## Verify after DNS

After DNS is updated and certificates finish provisioning:

```powershell
curl.exe -i https://api.happywecan.com/healthz
curl.exe -I https://angelo.happywecan.com
```

Expected backend response:

```json
{"status":"ok"}
```

Then test:

```txt
https://angelo.happywecan.com
https://angelo.happywecan.com/login
admin login
blog list/detail
portfolio list/detail
contact form
existing images
```

## Important caveat

Admin uploads still write to container-local `static/uploads`. Cloud Run local disk is ephemeral.

Committed images are included in the container image. New production uploads should be migrated to Google Cloud Storage before relying on uploads seriously.

## Useful redeploy command

Use this after code changes:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" builds submit --config gcp/cloudbuild.yaml --substitutions _REGION=asia-east1,_API_URL=https://api.happywecan.com,_FRONTEND_URL=https://angelo.happywecan.com
```

Temporary test deploy against raw Cloud Run URLs:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" builds submit --config gcp/cloudbuild.yaml --substitutions _REGION=asia-east1,_API_URL=https://happywecan-api-re42hsfbqa-de.a.run.app,_FRONTEND_URL=https://happywecan-frontend-re42hsfbqa-de.a.run.app
```
