#!/usr/bin/env bash
set -euo pipefail

cd /home/Angelo/angelo20011016.github.io

TOKEN="$(curl -fs -H 'Metadata-Flavor: Google' \
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')"

echo "$TOKEN" | sudo docker login -u oauth2accesstoken --password-stdin https://asia-east1-docker.pkg.dev

sudo docker compose -f docker-compose.vm-pull.yml pull
sudo docker compose -f docker-compose.vm-pull.yml up -d
sudo docker compose -f docker-compose.vm-pull.yml ps
