# VPS Deployment

Dokumen ini dipakai setelah akses VPS portfolio dikonfirmasi.

## Arsitektur

```text
Browser -> DNS -> VPS:80/443 -> Nginx Proxy Manager -> portfolio:3000
```

- Port `80` dan `443` dibuka untuk trafik web publik.
- Port portfolio `3000` hanya tersedia di Docker network.
- Dashboard Nginx Proxy Manager `81` dan Portainer `9443` hanya bind ke loopback VPS.
- Dashboard admin diakses dari laptop melalui SSH tunnel.

## Audit Awal VPS

Jalankan perintah baca-saja sebelum memasang atau mengubah apa pun:

```bash
whoami
hostname
cat /etc/os-release
uptime
free -h
df -h
ss -tuln
docker --version
docker compose version
```

Pastikan VPS memang ditujukan untuk portfolio dan port `80`/`443` tidak dipakai layanan lain.

## Menjalankan Stack

Dari direktori repository:

```bash
docker compose -f compose.prod.yaml config
docker compose -f compose.prod.yaml up -d --build
docker compose -f compose.prod.yaml ps
```

Lihat log:

```bash
docker compose -f compose.prod.yaml logs --tail 100 portfolio
docker compose -f compose.prod.yaml logs --tail 100 nginx-proxy-manager
docker compose -f compose.prod.yaml logs --tail 100 portainer
```

## SSH Tunnel Dashboard Admin

Jalankan dari laptop. Ganti `USER` dan `IP_VPS` dengan data VPS yang sah.

Nginx Proxy Manager:

```bash
ssh -L 8181:127.0.0.1:81 USER@IP_VPS
```

Buka `http://localhost:8181`.

Portainer:

```bash
ssh -L 9443:127.0.0.1:9443 USER@IP_VPS
```

Buka `https://localhost:9443`.

## Proxy Host

Setelah domain mengarah ke IP VPS, buat Proxy Host:

```text
Domain Names: domain yang diberikan
Scheme: http
Forward Hostname: portfolio
Forward Port: 3000
Block Common Exploits: aktif
Websockets Support: aktif
```

Setelah DNS selesai propagasi, minta sertifikat Let's Encrypt dan aktifkan Force SSL.

## DNS

- `A`: domain/subdomain ke IPv4 VPS.
- `AAAA`: domain/subdomain ke IPv6 VPS, hanya jika IPv6 sudah diuji.
- `CNAME`: satu nama domain menjadi alias nama domain lain.

## Backup Volume

Jangan menghapus volume saat melakukan update. Volume persisten:

```text
portainer_data
npm_data
npm_letsencrypt
```

Sebelum perubahan besar, hentikan stack dan buat arsip backup:

```bash
docker compose -f compose.prod.yaml stop
mkdir -p backups
docker run --rm -v portainer_data:/source:ro -v "$PWD/backups:/backup" alpine tar czf /backup/portainer_data.tar.gz -C /source .
docker run --rm -v npm_data:/source:ro -v "$PWD/backups:/backup" alpine tar czf /backup/npm_data.tar.gz -C /source .
docker run --rm -v npm_letsencrypt:/source:ro -v "$PWD/backups:/backup" alpine tar czf /backup/npm_letsencrypt.tar.gz -C /source .
docker compose -f compose.prod.yaml start
```

Folder `backups/` dapat berisi data sensitif dan tidak boleh dikomit ke Git.

## Update dan Rollback

Update source dan image:

```bash
git pull
docker compose -f compose.prod.yaml up -d --build
```

Periksa status dan log setelah update. Jika build baru bermasalah, kembali ke commit yang sebelumnya telah diuji, lalu build ulang. Jangan memakai perintah destruktif seperti `docker system prune --volumes` pada server produksi.
