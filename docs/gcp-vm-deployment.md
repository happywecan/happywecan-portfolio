# GCP VM Deployment

This is the current production deployment path for the site.

## Current production architecture

```txt
User
  -> Cloudflare DNS / HTTPS proxy
  -> GCP Compute Engine VM
  -> Nginx container
  -> Next.js frontend container
  -> Spring Boot backend container
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
backend   Spring Boot image from Artifact Registry
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

## Updating code manually

The old manual path can still build new images with Cloud Build:

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
4. Copies `docker-compose.vm-pull.yml` to `/tmp` on the VM.
5. Copies `scripts/deploy-vm-pull.sh` to `/tmp` on the VM.
6. Uses `sudo cp` to place the compose file in `/home/Angelo/angelo20011016.github.io`.
7. Runs `/tmp/deploy-vm-pull.sh` with `sudo`.
8. Verifies `/healthz` with retries.

Typical deployment duration:

```txt
4-6 minutes
```

Most of the time is spent on:

```txt
Next.js Docker build on the GitHub Actions runner
Docker image push to Artifact Registry
Docker image pull/extract on the e2-micro VM
```

The VM does not build the application. It only pulls and runs prebuilt images. However, `e2-micro` is still slow at pulling and extracting larger Docker image layers.

Required GitHub Actions secret:

```txt
GCP_SA_KEY
```

This contains the JSON key for:

```txt
github-actions-deployer@focal-freedom-473403-f8.iam.gserviceaccount.com
```

The key was created locally, stored with GitHub CLI, and then deleted from disk:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" iam service-accounts keys create github-actions-deployer-key.json --iam-account=github-actions-deployer@focal-freedom-473403-f8.iam.gserviceaccount.com
Get-Content -Raw github-actions-deployer-key.json | & "$env:ProgramFiles\GitHub CLI\gh.exe" secret set GCP_SA_KEY --repo angelo20011016/angelo20011016.github.io
Remove-Item -LiteralPath github-actions-deployer-key.json -Force
```

The service account needs permission to:

```txt
compute.instances.get
compute.instances.setMetadata
artifactregistry repositories upload/read
```

Current practical roles:

```txt
Cloud Build Editor
Compute Admin
Artifact Registry Writer
Service Account User
Service Usage Consumer
Service Usage Admin
Storage Object Admin
```

The active GitHub Actions CD path no longer uses `gcloud builds submit`; it builds images directly on the GitHub runner. Cloud Build permissions remain because Cloud Build configs are still available for manual builds and historical deployment work.

Use narrower custom permissions later.

### CD setup history

GitHub CLI was installed locally:

```powershell
winget install --id GitHub.cli --exact --accept-package-agreements --accept-source-agreements
```

GitHub CLI was authenticated as:

```txt
angelo20011016
```

The first CD attempt used `gcloud builds submit`, but GitHub Actions failed to access the Cloud Build source bucket:

```txt
focal-freedom-473403-f8_cloudbuild
```

The workflow was changed to build Docker images directly in GitHub Actions, then push to Artifact Registry. This avoids Cloud Build source bucket friction.

The first VM copy attempt failed because the GitHub Actions SSH user could not write directly into:

```txt
/home/Angelo/angelo20011016.github.io
```

The workflow now copies files to `/tmp`, then uses `sudo`.

The first health check failed with a temporary `502` immediately after container restart. The workflow now retries `/healthz` up to 12 times.

Successful CD run:

```txt
workflow: Deploy VM
run id: 26327437425
duration: 4m31s
result: success
```

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

## Network reliability notes

The production VM uses Docker bridge networking. Containers need kernel IP
forwarding enabled to reach MongoDB Atlas and other external services through
NAT.

The VM also needs a larger connection tracking table than the default tiny VM
setting. If `nf_conntrack` fills up, the kernel drops packets before they reach
Nginx or SSH, which appears externally as intermittent downtime.

Current persistent startup tuning is stored in:

```txt
scripts/vm-conntrack-startup.sh
```

It sets:

```txt
net.netfilter.nf_conntrack_max = 131072
net.netfilter.nf_conntrack_tcp_timeout_established = 600
net.netfilter.nf_conntrack_tcp_timeout_time_wait = 30
net.netfilter.nf_conntrack_tcp_timeout_close_wait = 60
net.netfilter.nf_conntrack_tcp_timeout_fin_wait = 30
net.ipv4.tcp_fin_timeout = 15
net.ipv4.ip_forward = 1
```

If the VM is recreated or metadata is lost, reattach it with:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" compute instances add-metadata happywecan-vm --zone=us-central1-a --metadata-from-file startup-script=scripts/vm-conntrack-startup.sh
```

Useful checks:

```bash
sysctl net.ipv4.ip_forward
sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max
sudo journalctl -k --since "2 hours ago" | grep -i nf_conntrack
sudo docker exec angelo20011016githubio-backend-1 python -c "import socket; s=socket.create_connection(('ac-ezvwlxk-shard-00-00.nq4f2rc.mongodb.net', 27017), timeout=8); print('ok'); s.close()"
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
