#!/usr/bin/env bash
# Dijalankan DI VPS. Satu perintah untuk seluruh pembaruan:
#
#   ssh -t portfolio-vps 'bash /opt/portfolio/vps-deploy.sh'
#
# Tanda -t wajib supaya terminal tersedia saat password admin diminta.
#
# Yang dilakukan, berurutan:
#   1  memeriksa kiriman (segel sha256), ruang disk, dan file yang dibutuhkan
#   2  menyimpan cadangan (tag image lama, compose lama, .env)
#   3  membuka image dari kiriman
#   4  menambah POSTGRES_PASSWORD dan SESSION_SECRET ke .env HANYA kalau belum ada
#   5  memasang compose.prod.yaml baru
#   6  menyalakan database dan menunggu sehat
#   7  menjalankan migrasi, dan mengisi data awal HANYA kalau database masih kosong
#   8  mengganti container website (hanya container itu) dan menunggu sehat
#      Kalau tidak sehat, otomatis dikembalikan ke versi lama.
#   9  memeriksa halaman dari dalam VPS dan membuat akun admin kalau belum ada
#
# Aman dijalankan berulang kali. Tidak pernah menyentuh nginx-proxy-manager, cloudflared, portainer,
# dan tidak pernah menghapus volume.
set -uo pipefail

APP_DIR="${APP_DIR:-/opt/portfolio}"
COMPOSE_FILES="${COMPOSE_FILES:-compose.prod.yaml}"
BUNDLE="${BUNDLE:-portfolio-images.tar.gz}"
OLD_APP_IMAGE="${OLD_APP_IMAGE:-portfolio-adrian:1.0}"
HEALTH_WAIT="${HEALTH_WAIT:-150}"
MIN_FREE_MB="${MIN_FREE_MB:-3000}"
SKIP_NPM_CHECK="${SKIP_NPM_CHECK:-0}"
PUBLIC_HOST="${PUBLIC_HOST:-portfolio-adrian.web.id}"

TOTAL=9
n=0
step() { n=$((n + 1)); echo; echo "==> [$n/$TOTAL] $*"; }
die()  { echo; echo "BERHENTI: $*" >&2; exit 1; }
note() { echo "    $*"; }

dc() {
  local args=() f
  for f in $COMPOSE_FILES; do args+=(-f "$f"); done
  docker compose "${args[@]}" "$@"
}

wait_healthy() {
  # $1 = nama layanan compose, $2 = batas detik. Kembali 0 kalau sehat.
  local svc="$1" limit="$2" cid status waited=0
  while [ "$waited" -lt "$limit" ]; do
    cid="$(dc ps -q "$svc" 2>/dev/null | head -1)"
    if [ -n "$cid" ]; then
      status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid" 2>/dev/null || echo unknown)"
      [ "$status" = "healthy" ] && return 0
      if [ "$status" = "exited" ] || [ "$status" = "dead" ]; then return 1; fi
    fi
    sleep 3
    waited=$((waited + 3))
  done
  return 1
}

psql_scalar() {
  # Mengembalikan satu angka dari database. Gagal (kode 1) kalau database tidak bisa ditanyai.
  local out
  out="$(dc exec -T postgres psql -U portfolio -d portfolio -Atc "$1" 2>/dev/null | tr -d '[:space:]')" || return 1
  case "$out" in ''|*[!0-9]*) return 1 ;; esac
  echo "$out"
}

rollback() {
  echo
  echo "!!  Website baru tidak sehat. Mengembalikan ke versi lama..." >&2
  dc logs --tail 40 portfolio 2>&1 | sed 's/^/    log: /' >&2 || true
  [ -f compose.prod.yaml ] && cp -f compose.prod.yaml compose.prod.yaml.gagal
  if [ -f compose.prod.yaml.before-rebuild ]; then
    cp -f compose.prod.yaml.before-rebuild compose.prod.yaml
  else
    echo "!!  compose.prod.yaml.before-rebuild tidak ada, tidak bisa mengembalikan otomatis." >&2
    return 1
  fi
  docker image inspect portfolio-adrian:before-rebuild >/dev/null 2>&1 && docker tag portfolio-adrian:before-rebuild "$OLD_APP_IMAGE"
  dc up -d --no-build --no-deps --force-recreate portfolio
  if wait_healthy portfolio 90; then
    echo "!!  Versi lama berjalan lagi. Database dan unggahan tidak diubah." >&2
  else
    echo "!!  Versi lama pun belum sehat. Periksa: docker compose -f compose.prod.yaml logs portfolio" >&2
  fi
  return 0
}

cd "$APP_DIR" || die "Folder $APP_DIR tidak ada."

# ---------------------------------------------------------------------------------------------------------
step "Memeriksa kiriman dan kondisi VPS"
command -v docker >/dev/null || die "docker tidak ditemukan."
docker compose version >/dev/null 2>&1 || die "docker compose tidak ditemukan."
[ -f "$BUNDLE" ] && [ -f "$BUNDLE.sha256" ] || die "$BUNDLE atau $BUNDLE.sha256 tidak ada di $APP_DIR. Kirim dulu dari laptop."
sha256sum -c "$BUNDLE.sha256" >/dev/null 2>&1 || die "Segel $BUNDLE tidak cocok. Kirim ulang dari laptop."
note "kiriman utuh (segel cocok)"

if [ -f compose.prod.yaml.new ]; then
  note "compose.prod.yaml.new ditemukan, akan dipasang di langkah 5"
elif grep -q '^  postgres:' compose.prod.yaml 2>/dev/null; then
  note "compose.prod.yaml sudah versi baru (menjalankan ulang)"
else
  die "compose.prod.yaml.new tidak ada dan compose.prod.yaml masih versi lama. Kirim ulang dari laptop."
fi

[ -f .env ] || die ".env tidak ada di $APP_DIR."
grep -q '^CLOUDFLARE_TUNNEL_TOKEN=.\+' .env || die ".env tidak berisi CLOUDFLARE_TUNNEL_TOKEN."

free_mb="$(df -Pm "$APP_DIR" | awk 'NR==2 {print $4}')"
[ "${free_mb:-0}" -ge "$MIN_FREE_MB" ] || die "Ruang disk bebas hanya ${free_mb} MB (butuh minimal $MIN_FREE_MB MB)."
note "disk bebas ${free_mb} MB"
note "memori: $(free -m | awk 'NR==2 {print $7 " MB tersedia dari " $2 " MB"}')"

# ---------------------------------------------------------------------------------------------------------
step "Menyimpan cadangan (tidak menimpa cadangan yang sudah ada)"
if docker image inspect portfolio-adrian:before-rebuild >/dev/null 2>&1; then
  note "tag before-rebuild sudah ada, dibiarkan"
elif docker image inspect "$OLD_APP_IMAGE" >/dev/null 2>&1; then
  docker tag "$OLD_APP_IMAGE" portfolio-adrian:before-rebuild
  note "image lama diberi tag before-rebuild"
else
  die "Image lama $OLD_APP_IMAGE tidak ditemukan, tidak ada yang bisa dijadikan cadangan."
fi
[ -f compose.prod.yaml.before-rebuild ] || cp -p compose.prod.yaml compose.prod.yaml.before-rebuild
[ -f .env.before-rebuild ] || cp -p .env .env.before-rebuild
note "compose.prod.yaml.before-rebuild dan .env.before-rebuild siap"

# ---------------------------------------------------------------------------------------------------------
step "Membuka image dari kiriman"
gunzip -c "$BUNDLE" | docker load || die "docker load gagal."
for img in portfolio-adrian:1.1 portfolio-adrian-migrator:1.2 postgres:16-alpine; do
  docker image inspect "$img" >/dev/null 2>&1 || die "Image $img tidak ada setelah dibuka."
done
note "tiga image siap"

# ---------------------------------------------------------------------------------------------------------
step "Menyiapkan rahasia di .env (hanya yang belum ada)"
[ -n "$(tail -c1 .env)" ] && echo >> .env
ensure_secret() {
  if grep -q "^$1=.\+" .env; then
    note "$1 sudah ada, DIBIARKAN (tidak pernah ditimpa)"
  else
    printf '%s=%s\n' "$1" "$(openssl rand -hex "$2")" >> .env
    note "$1 dibuat baru"
  fi
}
ensure_secret POSTGRES_PASSWORD 24
ensure_secret SESSION_SECRET 32
chmod 600 .env
note "izin .env: $(stat -c %a .env)"

# ---------------------------------------------------------------------------------------------------------
step "Memasang compose.prod.yaml baru dan menyalakan database"
if [ -f compose.prod.yaml.new ]; then mv -f compose.prod.yaml.new compose.prod.yaml; note "compose.prod.yaml diganti"; fi
dc config --quiet || die "compose.prod.yaml tidak valid atau .env belum lengkap."
dc up -d --no-build postgres || die "Database gagal dinyalakan."
wait_healthy postgres 90 || { dc logs --tail 30 postgres >&2; die "Database tidak sehat dalam 90 detik."; }
note "database sehat"

# ---------------------------------------------------------------------------------------------------------
step "Menjalankan migrasi dan mengisi data awal bila perlu"
dc --profile tools run --rm migrate || die "Migrasi gagal. Website lama belum disentuh."
profiles="$(psql_scalar 'select count(*) from "Profile"')" || die "Tidak bisa membaca tabel Profile setelah migrasi."
if [ "$profiles" = "0" ]; then
  note "database masih kosong, mengisi data awal"
  dc --profile tools run --rm migrate npx tsx prisma/seed.ts || die "Pengisian data awal gagal."
else
  note "database sudah berisi ($profiles profil), seed DILEWATI supaya perubahanmu tidak tertimpa"
fi

# ---------------------------------------------------------------------------------------------------------
step "Mengganti container website (hanya portfolio)"
dc up -d --no-build --no-deps --force-recreate portfolio || { rollback; die "Container portfolio gagal dibuat."; }
if wait_healthy portfolio "$HEALTH_WAIT"; then
  note "portfolio sehat"
else
  rollback
  die "Website baru tidak sehat dalam $HEALTH_WAIT detik, sudah dikembalikan ke versi lama."
fi

# ---------------------------------------------------------------------------------------------------------
step "Memeriksa halaman dan membuat akun admin bila belum ada"
cid="$(dc ps -q portfolio | head -1)"
page="$(docker exec "$cid" node -e "fetch('http://127.0.0.1:3000/').then(async r=>{const t=await r.text();console.log(r.status, t.includes('<h1')?'ada-judul':'TANPA-JUDUL')}).catch(()=>console.log('gagal'))" 2>&1 | tail -1)"
note "halaman utama dari dalam container: $page"
case "$page" in 200*ada-judul) ;; *) rollback; die "Halaman utama tidak sesuai ($page), dikembalikan ke versi lama." ;; esac

if [ "$SKIP_NPM_CHECK" != "1" ]; then
  ok=0
  for i in 1 2 3 4 5 6; do
    code="$(curl -s -m 8 -o /dev/null -w '%{http_code}' -H "Host: $PUBLIC_HOST" http://127.0.0.1/ 2>/dev/null || echo 000)"
    [ "$code" = "200" ] && { ok=1; break; }
    sleep 5
  done
  if [ "$ok" = "1" ]; then
    note "lewat Nginx Proxy Manager ($PUBLIC_HOST): 200"
  else
    echo "    PERINGATAN: Nginx Proxy Manager belum menjawab 200 untuk $PUBLIC_HOST (terakhir: $code)." >&2
    echo "    Container website sehat, jadi kemungkinan NPM masih memakai alamat lama. Tunggu 30 detik lalu coba lagi." >&2
    echo "    Kalau tetap gagal: docker compose -f compose.prod.yaml restart nginx-proxy-manager" >&2
  fi
fi

admins="$(psql_scalar 'select count(*) from "Admin"')" || admins="?"
if [ "$admins" = "0" ]; then
  if [ -t 0 ] && [ -t 1 ]; then
    echo
    echo "    Belum ada akun admin. Ketik password baru (minimal 12 karakter, tidak terlihat saat diketik)."
    dc --profile tools run --rm -it migrate npx tsx prisma/create-admin.ts || echo "    Akun admin belum dibuat. Ulangi dengan menjalankan skrip ini lagi." >&2
  else
    echo "    Belum ada akun admin dan tidak ada terminal. Jalankan lagi dengan: ssh -t portfolio-vps 'bash $APP_DIR/vps-deploy.sh'" >&2
  fi
else
  note "akun admin sudah ada ($admins), dibiarkan"
fi

echo
echo "SELESAI. Status container:"
docker ps --format '    {{.Names}}\t{{.Status}}'
echo
echo "Kalau perlu kembali ke versi lama (database dan unggahan tidak ikut berubah):"
echo "    cd $APP_DIR && cp compose.prod.yaml.before-rebuild compose.prod.yaml && docker tag portfolio-adrian:before-rebuild $OLD_APP_IMAGE && docker compose -f compose.prod.yaml up -d --no-build --no-deps --force-recreate portfolio"
