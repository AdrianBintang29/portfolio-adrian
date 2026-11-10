#!/usr/bin/env bash
# Mengirim kiriman ke VPS, mencoba lagi sendiri kalau koneksi macet atau putus, lalu memeriksa
# keutuhannya di VPS dengan sha256. Dijalankan di Ubuntu laptop:  bash deploy/send.sh
#
# Koneksi ke VPS ini lambat dan sering macet di tengah jalan. rsync dengan --partial menyimpan bagian
# yang sudah sampai, dan --append-verify melanjutkan dari sana setelah memeriksa bagian itu,
# jadi setiap percobaan ulang MELANJUTKAN, tidak mengulang dari nol.
set -uo pipefail

FILE="${1:-/tmp/portfolio-images.tar.gz}"
HOST="${VPS_HOST:-portfolio-vps}"
DEST="${VPS_DEST:-/opt/portfolio/}"
MAX_TRIES="${MAX_TRIES:-60}"
STALL_SECONDS="${STALL_SECONDS:-45}"
SSH_BIN="${SSH_BIN:-ssh}"

NAME="$(basename "$FILE")"
SUMFILE="$FILE.sha256"

if [ ! -f "$FILE" ]; then
  echo "BERHENTI: $FILE tidak ada. Jalankan dulu: bash deploy/pack.sh" >&2
  exit 1
fi

# Kunci SSH harus sudah dimuat di ssh-agent supaya tidak ada permintaan passphrase di tengah perulangan.
if ! ssh-add -l >/dev/null 2>&1; then
  echo "BERHENTI: kunci SSH belum dimuat. Jalankan dulu:" >&2
  echo '  eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519' >&2
  exit 1
fi

# Segel dibuat di laptop dan diperiksa di VPS. Dibuat ulang kalau belum ada.
if [ ! -f "$SUMFILE" ]; then
  ( cd "$(dirname "$FILE")" && sha256sum "$NAME" > "$NAME.sha256" )
fi

push() {
  rsync -a --partial --append-verify --info=progress2 --timeout="$STALL_SECONDS" \
    -e "$SSH_BIN -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -o ConnectTimeout=20" \
    "$@" "$HOST:$DEST"
}

transfer() {
  for try in $(seq 1 "$MAX_TRIES"); do
    echo "---- percobaan $try ----"
    # --timeout: menyerah kalau tidak ada kemajuan selama STALL_SECONDS detik, bukan menggantung selamanya.
    if push "$FILE" "$SUMFILE"; then
      echo "Pengiriman selesai pada percobaan ke-$try."
      return 0
    fi
    echo "Terputus atau macet. Mencoba melanjutkan dalam 3 detik..."
    sleep 3
  done
  return 1
}

verify() {
  # Hanya membaca di VPS. Kalau file rusak tapi ukurannya sama, rsync tidak akan memperbaikinya sendiri,
  # jadi pemeriksaan isi ini yang menjadi penjaga terakhir.
  "$SSH_BIN" -o ConnectTimeout=20 "$HOST" "cd '$DEST' && sha256sum -c '$NAME.sha256'"
}

total=$(stat -c %s "$FILE")
echo "Mengirim $NAME ($(( total / 1024 / 1024 )) MB) ke $HOST:$DEST"
echo "Tidak perlu menekan Ctrl+C. Kalau macet, skrip ini mencoba lagi sendiri (maksimal $MAX_TRIES kali)."
echo

if ! transfer; then
  echo "GAGAL setelah $MAX_TRIES percobaan. Jalankan skrip ini lagi, ia akan melanjutkan." >&2
  exit 1
fi

echo
echo "==> Memeriksa keutuhan di VPS (sha256)"
if verify; then
  echo
  echo "SELESAI: file di VPS identik dengan yang di laptop."
  exit 0
fi

# File lengkap tapi isinya berbeda: buang salinan di VPS lalu kirim sekali lagi dari awal.
echo
echo "Segel TIDAK cocok. Membuang salinan rusak di VPS dan mengirim ulang dari awal..." >&2
"$SSH_BIN" -o ConnectTimeout=20 "$HOST" "rm -f -- '${DEST%/}/$NAME'"

if transfer && verify; then
  echo
  echo "SELESAI: file di VPS identik dengan yang di laptop (setelah kirim ulang)."
  exit 0
fi

echo "GAGAL: segel masih tidak cocok setelah kirim ulang. Jangan lanjut, beri tahu pembimbingmu." >&2
exit 1
