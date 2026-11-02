#!/usr/bin/env bash
set -euo pipefail

base=/srv/eaapp
release=$(pwd -P)
[[ "$release" == "$base/releases/"* ]]
test -s "$base/shared/.env"
test "$(node -p 'process.versions.node.split(".")[0]')" = 24
exec 9>"$base/.deploy.lock"
flock -n 9

# Preserve user-uploaded logos; other public assets belong to each release.
mkdir -p "$base/shared/_images" public
if [[ -d public/_images ]]; then
  rsync -a --ignore-existing public/_images/ "$base/shared/_images/"
  mv public/_images public/_images.packaged
fi
ln -s "$base/shared/_images" public/_images
ln -s "$base/shared/.env" .env

npm ci --include=dev
npx --no-install prisma generate
npm run build

previous=$(readlink -f "$base/current" || true)
activate() {
  ln -s "$1" "$base/current.next"
  mv -Tf "$base/current.next" "$base/current"
}
healthy() {
  for attempt in {1..30}; do
    if curl --fail --silent --output /dev/null --max-time 2 http://127.0.0.1:3000/; then
      return 0
    fi
    sleep 2
  done
  return 1
}

activate "$release"
if sudo -n /usr/bin/systemctl restart eaapp.service && healthy; then
  echo "Deployment successful: $release"
else
  echo "Deployment failed; restoring previous release." >&2
  if [[ -n "$previous" && "$previous" != "$release" && -d "$previous" ]]; then
    activate "$previous"
    sudo -n /usr/bin/systemctl restart eaapp.service
    healthy || echo "Previous release is also unhealthy." >&2
  else
    sudo -n /usr/bin/systemctl stop eaapp.service
  fi
  exit 1
fi
