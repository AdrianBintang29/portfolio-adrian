#!/usr/bin/env bash
# Dijalankan DI VPS untuk pembaruan yang MENGUBAH struktur database (ada migrasi baru).
#
#   ssh portfolio-vps "bash /opt/portfolio/vps-update-with-migration.sh"
#
# Urutan, dan alasannya:
#   1. Periksa kiriman (segel sha256).   Kiriman rusak ditolak sebelum menyentuh apa pun.
#   2. Cadangkan database (pg_dump).     Satu-satunya jalan kembali kalau migrasi bermasalah.
#   3. Jalankan migrasi.                 Memakai image migrator yang sudah ada + folder prisma baru lewat volume.
#   4. Ganti container website.          Dikerjakan oleh vps-update-app.sh (healthcheck + rollback otomatis).
#
# Tidak menyentuh volume upload, nginx-proxy-manager, cloudflared, atau portainer.
set -uo pipefail

APP_DIR="${APP_DIR:-/opt/portfolio}"
PRISMA_BUNDLE="portfolio-prisma.tar.gz"
COMPOSE="docker compose -f compose.prod.yaml"

die() { echo; echo "BERHENTI: $*" >&2; exit 1; }

cd "$APP_DIR" || die "Folder $APP_DIR tidak ada."
[ -f "$PRISMA_BUNDLE" ] && [ -f "$PRISMA_BUNDLE.sha256" ] || die "$PRISMA_BUNDLE atau segelnya tidak ada. Kirim dulu dari laptop."
sha256sum -c "$PRISMA_BUNDLE.sha256" >/dev/null 2>&1 || die "Segel $PRISMA_BUNDLE tidak cocok. Kirim ulang."
[ -f vps-update-app.sh ] || die "vps-update-app.sh tidak ada di $APP_DIR."
echo "==> kiriman prisma utuh"

# Folder prisma baru dibuka ke folder terpisah, tidak menimpa apa pun yang sedang dipakai.
rm -rf prisma-new && mkdir prisma-new
tar -xzf "$PRISMA_BUNDLE" -C prisma-new || die "Gagal membuka $PRISMA_BUNDLE."
[ -d prisma-new/prisma/migrations ] || die "Isi $PRISMA_BUNDLE tidak berisi prisma/migrations."

echo "==> memastikan database menyala"
$COMPOSE up -d --no-build postgres || die "Database gagal dinyalakan."

mkdir -p backups && chmod 700 backups
DUMP="backups/db-before-migration-$(date +%Y%m%d-%H%M%S).dump"
echo "==> mencadangkan database ke $DUMP"
docker exec portfolio-postgres pg_dump -U portfolio -d portfolio -Fc > "$DUMP" || { rm -f "$DUMP"; die "Backup gagal. Migrasi TIDAK dijalankan."; }
[ -s "$DUMP" ] || { rm -f "$DUMP"; die "File backup kosong. Migrasi TIDAK dijalankan."; }
chmod 600 "$DUMP"
echo "    ukuran backup: $(du -h "$DUMP" | cut -f1)"

echo "==> menerapkan migrasi"
$COMPOSE --profile tools run --rm -v "$APP_DIR/prisma-new/prisma:/app/prisma:ro" migrate \
  || die "Migrasi gagal. Website lama belum disentuh. Backup ada di $DUMP."

# Segera ganti container: aplikasi lama tidak mengenal skema baru, jadi jeda ini sengaja dibuat sesingkat mungkin.
echo "==> mengganti container website"
bash "$APP_DIR/vps-update-app.sh" || die "Pembaruan website gagal. Lihat pesan di atas. Backup database: $DUMP"

rm -rf prisma-new
echo
echo "Selesai. Backup sebelum migrasi: $DUMP"
echo "PERHATIAN: setelah migrasi ini, versi website LAMA tidak bisa dipakai lagi (kolom Profile.role sudah dihapus)."
echo "Kalau perlu kembali ke kondisi sebelum migrasi, pulihkan database dari backup di atas bersama versi website lama."
