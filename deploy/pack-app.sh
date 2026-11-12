#!/usr/bin/env bash
# Membungkus HANYA image aplikasi (sekitar 90 MB) untuk pembaruan tampilan. Database, migrator, dan PostgreSQL
# tidak ikut, karena tidak berubah.
# Dijalankan di Ubuntu laptop dari folder project:  bash deploy/pack-app.sh
set -euo pipefail

APP_TAG="portfolio-adrian:1.1"
OUT="/tmp/portfolio-app.tar.gz"
SHIP="${SHIP_DIR:-/mnt/c/Users/Adrian/Downloads/portfolio-ship}"

cd "$(dirname "$0")/.."

# Folder project ada di drive Windows; tiru pengaturan Git Windows agar akhir baris tidak dianggap perubahan.
dirty="$(git -c core.autocrlf=true status --porcelain)"
if [ -n "$dirty" ]; then
  echo "BERHENTI: ada perubahan yang belum di-commit." >&2
  echo "$dirty" >&2
  exit 1
fi

COMMIT="$(git rev-parse --short HEAD)"
echo "Commit yang dibungkus: $COMMIT"

docker build --target runner --label "org.opencontainers.image.revision=$COMMIT" -t "$APP_TAG" .

docker save "$APP_TAG" | gzip > "$OUT"
gzip -t "$OUT"
( cd /tmp && sha256sum "$(basename "$OUT")" > "$(basename "$OUT").sha256" )

# Folder prisma (migrasi database) dibungkus dari isi commit, bukan dari folder kerja, supaya akhir baris
# tetap LF dan checksum migrasi yang sudah terpasang di VPS tidak berubah. Ukurannya hanya beberapa KB.
# Dipakai oleh deploy/vps-update-with-migration.sh bersama image migrator yang sudah ada di VPS.
PRISMA_OUT="/tmp/portfolio-prisma.tar.gz"
git archive --format=tar.gz -o "$PRISMA_OUT" HEAD prisma prisma.config.ts
( cd /tmp && sha256sum "$(basename "$PRISMA_OUT")" > "$(basename "$PRISMA_OUT").sha256" )

mkdir -p "$SHIP"
cp "$OUT" "$OUT.sha256" "$PRISMA_OUT" "$PRISMA_OUT.sha256" "$SHIP/"

echo
echo "Selesai. Siap dikirim dari PowerShell (folder portfolio-ship):"
ls -lh "$SHIP/portfolio-app.tar.gz" "$SHIP/portfolio-app.tar.gz.sha256" \
       "$SHIP/portfolio-prisma.tar.gz" "$SHIP/portfolio-prisma.tar.gz.sha256"
