# Deployment ke VPS

## Arsitektur

```text
Browser -> Cloudflare HTTPS -> Cloudflare Tunnel -> Nginx Proxy Manager -> portfolio:3000 -> postgres:5432
```

1. Browser meminta domain lewat HTTPS dan diterima Cloudflare.
2. Cloudflare meneruskan ke Tunnel. `cloudflared` di VPS meneruskan ke `nginx-proxy-manager:80`.
3. Nginx Proxy Manager membaca hostname lalu meneruskan ke `portfolio:3000` lewat Docker network.
4. Aplikasi Next.js membaca dan menulis data ke `postgres:5432`, juga di dalam Docker network.

- Port `80` dan `443` dibuka untuk trafik web publik.
- Port `3000` (aplikasi) dan `5432` (database) hanya ada di Docker network. Database tidak punya `ports:` sama sekali.
- Dashboard Nginx Proxy Manager `81` dan Portainer `9443` hanya bind ke loopback VPS, diakses lewat SSH tunnel.
- Semua rahasia hanya ada di `/opt/portfolio/.env` di VPS dan tidak masuk Git atau image.

## Aturan emas untuk VPS 1 GB

1. **VPS tidak pernah membangun image.** Image dibangun di laptop dan dikirim dengan `docker save`.
2. **Semua perintah `docker compose up` di VPS memakai `--no-build`.**
3. **Jangan menyentuh volume.** Jangan pernah menjalankan `docker volume prune` atau `docker system prune --volumes`.
4. **Update hanya service yang berubah**, dengan `--no-deps --force-recreate <nama-service>`.

## File `.env` di VPS

```text
CLOUDFLARE_TUNNEL_TOKEN=...   (sudah ada)
POSTGRES_PASSWORD=...         (dibuat di VPS)
SESSION_SECRET=...            (dibuat di VPS)
```

Buat nilai baru langsung di VPS, jangan salin dari laptop dan jangan tampilkan:

```bash
printf 'POSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 24)" >> .env
printf 'SESSION_SECRET=%s\n'    "$(openssl rand -hex 32)" >> .env
chmod 600 .env
```

`compose.prod.yaml` berhenti dengan pesan jelas kalau salah satu dari tiga nilai ini kosong.
Jangan menjalankan `cat .env`.

## Mengirim image dari laptop

Dijalankan di Ubuntu laptop, dari folder project, setelah semua perubahan di-commit:

```bash
bash deploy/pack.sh      # membangun image dari commit aktif, membungkusnya, dan membuat segel sha256
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519
bash deploy/send.sh      # mengirim ke VPS, mengulang sendiri kalau macet, lalu mencocokkan segel di VPS
```

Koneksi ke VPS ini lambat (sekitar 195 ms) dan kadang macet di tengah jalan. `send.sh` memakai
`rsync --partial --append-verify`, jadi setiap percobaan ulang melanjutkan dari bagian yang sudah sampai.
Tidak perlu menekan Ctrl+C. Di akhir ia menjalankan `sha256sum -c` di VPS, dan kalau segel tidak cocok ia
membuang salinan itu lalu mengirim ulang dari awal.

Image yang dibangun: `portfolio-adrian:1.1` (aplikasi), `portfolio-adrian-migrator:1.2` (migrasi, seed, dan
create-admin, memakai dependency minimalnya sendiri di `deploy/migrator/`), dan `postgres:16-alpine`.

Versi Prisma di `deploy/migrator/package.json` harus sama dengan versi di `package.json` aplikasi. Kalau salah
satunya dinaikkan, naikkan yang lain lalu jalankan `npm install --package-lock-only` di folder migrator.

Di VPS, buka kirimannya setelah `send.sh` melaporkan `SELESAI`:

```bash
cd /opt/portfolio
gunzip -c portfolio-images.tar.gz | docker load
```

## Menjalankan dan memperbarui

```bash
docker compose -f compose.prod.yaml config --quiet
docker compose -f compose.prod.yaml up -d --no-build postgres
docker compose -f compose.prod.yaml --profile tools run --rm migrate
docker compose -f compose.prod.yaml up -d --no-build --no-deps --force-recreate portfolio
docker compose -f compose.prod.yaml ps
```

Setelah database pertama kali dibuat, isi data awal dan buat akun admin (password diketik sendiri):

```bash
docker compose -f compose.prod.yaml --profile tools run --rm migrate npx tsx prisma/seed.ts
docker compose -f compose.prod.yaml --profile tools run --rm -it migrate npx tsx prisma/create-admin.ts
```

Lihat log:

```bash
docker compose -f compose.prod.yaml logs --tail 100 portfolio
docker compose -f compose.prod.yaml logs --tail 100 postgres
```

## SSH tunnel dashboard admin

Dijalankan dari laptop:

```bash
ssh -L 8181:127.0.0.1:81 portfolio-vps      # Nginx Proxy Manager: http://localhost:8181
ssh -L 9443:127.0.0.1:9443 portfolio-vps    # Portainer: https://localhost:9443
```

## Proxy Host

Aturan di Nginx Proxy Manager tidak perlu diubah selama nama container dan port tetap:

```text
Domain Names: portfolio-adrian.web.id
Scheme: http
Forward Hostname: portfolio
Forward Port: 3000
```

Karena itu `container_name: portfolio` dan `expose: 3000` di `compose.prod.yaml` tidak boleh berubah.

## DNS dan Cloudflare Tunnel

- `A`: domain/subdomain ke IPv4 VPS.
- `AAAA`: domain/subdomain ke IPv6 VPS, hanya jika IPv6 sudah diuji.
- `CNAME`: satu nama domain menjadi alias nama domain lain.
- Untuk VPS NAT ini, Cloudflare Tunnel dipakai agar trafik publik tidak bergantung pada inbound port forwarding.
- Public hostname tunnel meneruskan `portfolio-adrian.web.id` ke `http://nginx-proxy-manager:80`.

## Backup

Volume yang harus dijaga:

```text
portainer_data
npm_data
npm_letsencrypt
portfolio_postgres_data     (database)
portfolio_uploads           (gambar unggahan)
```

Sebelum perubahan besar:

```bash
docker tag portfolio-adrian:1.0 portfolio-adrian:before-rebuild
cp compose.prod.yaml compose.prod.yaml.before-rebuild
cp -p .env .env.before-rebuild
mkdir -p backups && chmod 700 backups
for v in npm_data npm_letsencrypt portainer_data; do
  docker run --rm -v $v:/source:ro -v "$PWD/backups:/backup" node:22-alpine \
    tar czf /backup/$v.tar.gz -C /source .
done
```

Backup database sebaiknya memakai dump, bukan menyalin folder datanya:

```bash
docker compose -f compose.prod.yaml exec -T postgres pg_dump -U portfolio portfolio | gzip > backups/portfolio-db-$(date +%F).sql.gz
```

Folder `backups/` berisi data sensitif dan tidak boleh masuk Git.

## Rollback

Kalau versi baru bermasalah:

```bash
cp compose.prod.yaml compose.prod.yaml.gagal
cp compose.prod.yaml.before-rebuild compose.prod.yaml
docker tag portfolio-adrian:before-rebuild portfolio-adrian:1.0
docker compose -f compose.prod.yaml up -d --no-build --no-deps --force-recreate portfolio
```

Volume database dan unggahan tidak dihapus oleh rollback, jadi data tetap aman. Jangan menghapus image
`before-rebuild` sebelum versi baru terbukti stabil.
