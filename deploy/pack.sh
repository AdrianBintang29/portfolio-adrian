#!/usr/bin/env bash
# Membangun image dari commit yang sedang aktif dan membungkusnya menjadi satu file untuk dikirim ke VPS.
# Dijalankan di Ubuntu laptop (WSL), dari folder project:  bash deploy/pack.sh
#
# Hasil:
#   /tmp/portfolio-images.tar.gz         kiriman (aplikasi, migrator, PostgreSQL)
#   /tmp/portfolio-images.tar.gz.sha256  segel untuk dicocokkan di VPS
set -euo pipefail

APP_TAG="portfolio-adrian:1.1"
MIGRATOR_TAG="portfolio-adrian-migrator:1.2"
POSTGRES_TAG="postgres:16-alpine"
OUT="/tmp/portfolio-images.tar.gz"

cd "$(dirname "$0")/.."

# Kiriman harus berasal dari commit yang tersimpan, bukan dari perubahan setengah jadi di laptop.
#
# Folder project ada di drive Windows (/mnt/c), dan Git di Windows memakai core.autocrlf=true sedangkan
# Git di Ubuntu tidak. Tanpa penyesuaian, Git di Ubuntu mengira SETIAP file berubah hanya karena akhir
# barisnya (CRLF di Windows, LF di Git). Kita meniru pengaturan Windows untuk satu perintah ini saja,
# tanpa mengubah konfigurasi apa pun.
dirty="$(git -c core.autocrlf=true status --porcelain)"

if [ -n "$dirty" ]; then
  echo "BERHENTI: ada perubahan yang belum di-commit. Commit dulu supaya kiriman bisa dilacak." >&2
  echo "$dirty" >&2
  exit 1
fi

COMMIT="$(git rev-parse --short HEAD)"
echo "Commit yang dibungkus: $COMMIT"

echo "==> Membangun image aplikasi ($APP_TAG)"
docker build --target runner --label "org.opencontainers.image.revision=$COMMIT" -t "$APP_TAG" .

echo "==> Membangun image migrator ($MIGRATOR_TAG)"
docker build --target migrator --label "org.opencontainers.image.revision=$COMMIT" -t "$MIGRATOR_TAG" .

echo "==> Mengambil image database ($POSTGRES_TAG)"
docker pull "$POSTGRES_TAG"

echo "==> Membungkus menjadi satu file"
docker save "$APP_TAG" "$MIGRATOR_TAG" "$POSTGRES_TAG" | gzip > "$OUT"

# Pastikan file bisa dibuka kembali sebelum dikirim.
gzip -t "$OUT"
( cd "$(dirname "$OUT")" && sha256sum "$(basename "$OUT")" > "$(basename "$OUT").sha256" )

echo
echo "Selesai."
ls -lh "$OUT"
echo "Segel:"
cat "$OUT.sha256"
echo
echo "Langkah berikutnya: bash deploy/send.sh"
