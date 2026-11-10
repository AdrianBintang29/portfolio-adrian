#!/usr/bin/env bash
# Dijalankan DI VPS untuk memperbarui HANYA container website (tampilan baru).
#
#   ssh -i <kunci> -p 22333 root@<ip> "bash /opt/portfolio/vps-update-app.sh"
#
# Tidak menyentuh database, volume, nginx-proxy-manager, cloudflared, atau portainer.
# Kalau website baru tidak sehat, otomatis dikembalikan ke versi sebelumnya.
set -uo pipefail

APP_DIR="${APP_DIR:-/opt/portfolio}"
BUNDLE="${BUNDLE:-portfolio-app.tar.gz}"
APP_IMAGE="portfolio-adrian:1.1"
PREV_IMAGE="portfolio-adrian:previous"
HEALTH_WAIT="${HEALTH_WAIT:-120}"
COMPOSE="docker compose -f compose.prod.yaml"

die() { echo; echo "BERHENTI: $*" >&2; exit 1; }

cd "$APP_DIR" || die "Folder $APP_DIR tidak ada."
[ -f "$BUNDLE" ] && [ -f "$BUNDLE.sha256" ] || die "$BUNDLE atau $BUNDLE.sha256 tidak ada. Kirim dulu dari laptop."
sha256sum -c "$BUNDLE.sha256" >/dev/null 2>&1 || die "Segel $BUNDLE tidak cocok. Kirim ulang."
echo "==> kiriman utuh"

wait_healthy() {
  local cid status waited=0
  while [ "$waited" -lt "$1" ]; do
    cid="$($COMPOSE ps -q portfolio 2>/dev/null | head -1)"
    status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid" 2>/dev/null || echo unknown)"
    [ "$status" = "healthy" ] && return 0
    [ "$status" = "exited" ] && return 1
    sleep 3; waited=$((waited + 3))
  done
  return 1
}

# Simpan versi yang sedang berjalan sebagai cadangan cepat sebelum diganti.
if docker image inspect "$APP_IMAGE" >/dev/null 2>&1; then
  docker tag "$APP_IMAGE" "$PREV_IMAGE"
  echo "==> versi sekarang disimpan sebagai $PREV_IMAGE"
fi

echo "==> membuka image baru"
gunzip -c "$BUNDLE" | docker load || die "docker load gagal."

echo "==> mengganti container portfolio saja"
$COMPOSE up -d --no-build --no-deps --force-recreate portfolio || die "Container gagal dibuat."

if wait_healthy "$HEALTH_WAIT"; then
  echo "==> website baru sehat"
else
  echo "!!  Website baru tidak sehat. Mengembalikan versi sebelumnya..." >&2
  $COMPOSE logs --tail 30 portfolio 2>&1 | sed 's/^/    log: /' >&2
  if docker image inspect "$PREV_IMAGE" >/dev/null 2>&1; then
    docker tag "$PREV_IMAGE" "$APP_IMAGE"
    $COMPOSE up -d --no-build --no-deps --force-recreate portfolio
    wait_healthy 90 && echo "!!  Versi sebelumnya berjalan lagi." >&2
  fi
  die "Pembaruan dibatalkan."
fi

code="$(curl -s -m 8 -o /dev/null -w '%{http_code}' -H "Host: portfolio-adrian.web.id" http://127.0.0.1/ 2>/dev/null || echo 000)"
echo "==> lewat Nginx Proxy Manager: $code"
echo
docker ps --format '    {{.Names}}\t{{.Status}}'
echo
echo "Kembali ke versi sebelumnya kapan saja:"
echo "    docker tag $PREV_IMAGE $APP_IMAGE && $COMPOSE up -d --no-build --no-deps --force-recreate portfolio"
