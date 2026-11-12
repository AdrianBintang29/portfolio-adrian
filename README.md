# Portfolio Adrian Bintang

Website portfolio dengan admin panel. Dibangun dengan Next.js (App Router), TypeScript,
Tailwind CSS, Prisma, dan PostgreSQL. Dijalankan di VPS lewat Docker.

Live: https://portfolio-adrian.web.id (admin: `/admin/login`)

## Tampilan

- **Tema:** Warm Light (`#FAF8F5`) dengan aksen Burnt Orange (`#EA580C`). Font HarmonyOS Sans (lokal, `src/app/fonts/`).
- **Hero:** tipografi asimetris "Hello, I am Adrian,", judul dan teks diambil dari database, kanvas bintang interaktif yang menolak kursor.
- **Projects:** jalur geser horizontal, kartu setinggi sama, gambar tidak ter-zoom.
- **Experience:** rekam jejak magang di Nyanhosting (data statis di `src/lib/data/experience.ts`).
- **About:** narasi dan foto profil rasio 4:5, keduanya diedit dari admin.
- **Skills:** dua baris geser dengan logo SVG teknologi.
- **Contact:** tombol kontak, salin email dengan notifikasi, dan tautan GitHub.
- **Navbar:** ScrollSpy, menu menyala oranye mengikuti bagian yang sedang dilihat.

## Peta folder

```text
src/
├── proxy.ts                   Satpam: mengarahkan /admin ke login bila tidak ada cookie sesi
├── app/
│   ├── page.tsx               Halaman publik (merangkai komponen)
│   ├── layout.tsx             Kerangka HTML semua halaman dan pemuatan font
│   ├── globals.css            Warna dan gaya dasar
│   ├── fonts/                 File font HarmonyOS Sans
│   ├── uploads/[name]/route.ts  Menyajikan gambar unggahan (hanya nama buatan server)
│   └── admin/
│       ├── layout.tsx         Kerangka halaman admin
│       ├── page.tsx           Panel admin (wajib login)
│       ├── logout-actions.ts  Keluar dan keluar dari semua perangkat
│       ├── login/             Halaman, form, dan pemeriksaan password
│       ├── profile/           Edit profil dan foto profil
│       ├── projects/          Tambah, edit, urutkan, sembunyikan, hapus project
│       └── skills/            Kelola skill dan kategorinya
├── components/
│   ├── portfolio/             Bagian halaman publik:
│   │                          Header, HeaderNav (ScrollSpy), Hero, HeroStarsCanvas, Projects, ProjectCard,
│   │                          Experience, About, Skills, TechIcon, Contact, CopyEmailButton, Reveal, Footer
│   └── admin/                 Komponen bersama form admin (TextField, ImageField)
└── lib/
    ├── data/                  Data statis (experience.ts)
    ├── db/                    prisma.ts (koneksi), queries.ts (data untuk halaman publik)
    ├── auth/                  session.ts (karcis di database), session-token.ts (segel cookie)
    ├── validation.ts          Pemeriksaan isian bersama
    ├── text.ts                Bantuan teks
    ├── image-type.ts          Deteksi jenis gambar, nama file aman, pembuangan EXIF (tanpa efek samping)
    └── uploads.ts             Menyimpan, membaca, dan menghapus file di disk

prisma/
├── schema.prisma              Bentuk tabel
├── migrations/                Riwayat perubahan tabel
├── seed.ts, seed-data.ts      Data awal
└── create-admin.ts            Membuat atau mengganti password admin

scripts/
├── unit/                      Tes unit (logika murni)
├── e2e/                       Tes ujung ke ujung di browser sungguhan
└── vps-audit-now.sh           Skrip bantu untuk VPS

deploy/
├── pack.sh, send.sh           Bungkus dan kirim semua image (penerapan pertama)
├── send-windows.ps1           Pengirim bertahap dari Windows
├── vps-deploy.sh              Penerapan lengkap di VPS
├── pack-app.sh                Bungkus HANYA image aplikasi (sekitar 90 MB) untuk pembaruan tampilan
└── vps-update-app.sh          Di VPS: ganti container portfolio saja, tanpa menyentuh database, rollback otomatis jika tidak sehat
```

## Menjalankan di laptop

Database PostgreSQL berjalan di Docker dalam Ubuntu WSL (port 5433).

```powershell
npm install
npx prisma generate
npm run dev
```

Buka http://localhost:3000. Admin ada di http://localhost:3000/admin.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build production |
| `npm run lint` | Periksa gaya kode |
| `npm run test:unit` | Tes unit logika gambar |
| `npm run test:e2e` | Tes di browser sungguhan (memakai database `portfolio_test`, tidak menyentuh data aslimu) |
| `npm test` | Keduanya |
| `npx prisma migrate dev --name nama` | Terapkan perubahan `schema.prisma` |
| `npx prisma generate` | Buat ulang client Prisma setelah schema berubah |
| `npx prisma studio` | Lihat isi tabel di browser |
| `npm run db:seed` | Isi data contoh (aman dijalankan berulang) |
| `npm run db:create-admin` | Buat akun admin atau ganti passwordnya |

`npm run test:e2e` butuh Google Chrome di `C:\Program Files\Google\Chrome`. Lokasi lain bisa diatur
lewat variabel `CHROME_PATH`.

## Variabel lingkungan (`.env`, tidak masuk Git)

| Nama | Isi |
| --- | --- |
| `DATABASE_URL` | Alamat koneksi PostgreSQL |
| `SESSION_SECRET` | Rahasia penanda tangan cookie, minimal 32 karakter. Di VPS buat yang berbeda |
| `UPLOAD_DIR` | (opsional) Folder gambar unggahan. Bawaan: `public/uploads`. Di VPS arahkan ke Docker volume |

## Keamanan gambar unggahan

- Jenis file ditentukan dari isinya, bukan nama atau Content-Type. Hanya JPEG, PNG, WebP. SVG ditolak karena bisa memuat skrip.
- Maksimal 2 MB. Nama file diganti UUID acak. Alamat yang disajikan hanya yang berbentuk `<uuid>.jpg|png|webp`.
- EXIF pada JPEG (lokasi GPS, model perangkat) dibuang saat unggah.
- Mengganti atau menghapus data ikut menghapus file lamanya.

## Deployment

Alur: `Browser -> Cloudflare HTTPS -> Cloudflare Tunnel -> Nginx Proxy Manager -> portfolio:3000 -> postgres:5432`.

Memperbarui tampilan saja (database dan upload tidak tersentuh):

```bash
bash deploy/pack-app.sh                 # laptop (Ubuntu WSL): bangun image portfolio-adrian:1.1
bash /opt/portfolio/vps-update-app.sh   # VPS: ganti container portfolio, rollback otomatis bila gagal
```

Detail lengkap, termasuk aturan emas VPS 1 GB, ada di `DEPLOYMENT.md`.
