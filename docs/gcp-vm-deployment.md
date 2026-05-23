# GCP VM Deployment

This is the current production deployment path for the site.

## Current production architecture

```txt
User
  -> Cloudflare DNS / HTTPS proxy
  -> GCP Compute Engine VM
  -> Nginx container
  -> Next.js frontend container
  -> FastAPI backend container
  -> MongoDB Atlas
```

## GCP resources

```txt
project id: focal-freedom-473403-f8
project number: 193468143671

VM name: happywecan-vm
zone: us-central1-a
machine type: e2-micro
external IP: 136.113.215.22
boot disk: 30GB standard persistent disk
OS: Ubuntu 24.04 LTS
```

The VM has 2GB swap configured because `e2-micro` only has 1GB RAM.

## DNS

Cloudflare DNS records:

```txt
api     A     136.113.215.22     Proxied
angelo  A     136.113.215.22     Proxied
```

Cloudflare SSL/TLS mode is currently:

```txt
Flexible
```

The VM only listens on HTTP port 80. Cloudflare terminates public HTTPS and forwards HTTP to the VM.

## Runtime containers

The VM runs Docker Compose from:

```txt
docker-compose.vm-pull.yml
```

Services:

```txt
backend   FastAPI image from Artifact Registry
frontend  Next.js image from Artifact Registry
nginx     public reverse proxy on port 80
```

The VM does not build Next.js locally. `e2-micro` is too small for reliable production builds.

## Deploy command

Run from the VM:

```bash
cd /home/Angelo/angelo20011016.github.io
/home/Angelo/deploy-vm-pull.sh
```

Or run from local PowerShell:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" compute ssh happywecan-vm --zone=us-central1-a --command="chmod +x /home/Angelo/deploy-vm-pull.sh && /home/Angelo/deploy-vm-pull.sh"
```

The script:

1. Uses the VM service account metadata token.
2. Logs Docker into `asia-east1-docker.pkg.dev`.
3. Pulls the configured backend/frontend images.
4. Starts the containers with Docker Compose.

## Updating code

Build new images with Cloud Build:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" builds submit --config gcp/cloudbuild-vm.yaml --substitutions _REGION=asia-east1,_IMAGE_TAG=main,_API_URL=https://api.happywecan.com
```

Then rerun the deploy script:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" compute ssh happywecan-vm --zone=us-central1-a --command="/home/Angelo/deploy-vm-pull.sh"
```

## CD

GitHub Actions workflow:

```txt
.github/workflows/deploy-vm.yml
```

On push to `main`, it:

1. Authenticates to Google Cloud.
2. Builds backend/frontend Docker images on the GitHub Actions runner.
3. Pushes backend/frontend images tagged `main` to Artifact Registry.
4. Copies `docker-compose.vm-pull.yml` to the VM.
5. Runs `/home/Angelo/deploy-vm-pull.sh`.
6. Verifies `/healthz`.

Required GitHub Actions secret:

```txt
GCP_SA_KEY
```

This should contain the JSON key for a GCP service account with permission to:

```txt
compute.instances.get
compute.instances.setMetadata
artifactregistry repositories upload/read
```

The current simpler setup can use a project-level service account with:

```txt
Cloud Build Editor
Compute Admin
Artifact Registry Writer
Service Account User
```

Use narrower custom permissions later.

## Secrets

The VM reads runtime secrets from:

```txt
/home/Angelo/angelo20011016.github.io/.env
```

Do not commit this file.

Important secrets:

```txt
MONGODB_URI
SECRET_KEY
ADMIN_USER
ADMIN_PASSWORD
MAIL_USERNAME
MAIL_PASSWORD
```

MongoDB production data stays on MongoDB Atlas.

## Verification

Check from any machine:

```txt
https://api.happywecan.com/healthz
https://api.happywecan.com/api/settings/site
https://api.happywecan.com/api/skills
https://angelo.happywecan.com
```

Check on the VM:

```bash
cd /home/Angelo/angelo20011016.github.io
sudo docker compose -f docker-compose.vm-pull.yml ps
sudo docker compose -f docker-compose.vm-pull.yml logs --tail=100
curl -i -H 'Host: api.happywecan.com' http://127.0.0.1/healthz
curl -i -H 'Host: api.happywecan.com' http://127.0.0.1/api/skills
```

## Cost notes

This VM is in `us-central1`, which is one of the Compute Engine Always Free regions for `e2-micro`.

Expected low-cost/free-tier components:

```txt
e2-micro VM usage
30GB standard persistent disk
Cloudflare free plan
MongoDB Atlas free/shared tier, if the Atlas cluster is on a free/shared plan
```

Costs can still appear from:

```txt
network egress beyond free allowance
disk usage over 30GB
static external IP if reserved while the VM is stopped
Artifact Registry image storage over the free allowance
Cloud Build minutes
old Cloud Run or other unused resources left active
```

Keep the VM running if the external IP must stay attached. Stopping the VM while keeping the external IP can cause IP charges.

## Security notes

- Rotate the Atlas database password because connection strings were pasted during setup.
- Keep Cloudflare proxy enabled for `api` and `angelo`.
- Move from Cloudflare `Flexible` to `Full` later by installing an origin certificate or Let's Encrypt certificate on the VM.
- Admin uploads still write to `static/uploads` on the VM disk. They are more durable than Cloud Run ephemeral disk, but still need backups.
