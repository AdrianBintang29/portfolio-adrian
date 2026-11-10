# Portfolio Adrian Bintang

Website portfolio dengan admin panel. Dibangun dengan Next.js (App Router), TypeScript,
Tailwind CSS, Prisma, dan PostgreSQL. Dijalankan di VPS lewat Docker.

## Peta folder

```text
src/
├── proxy.ts                   Satpam: mengarahkan /admin ke login bila tidak ada cookie sesi
├── app/
│   ├── page.tsx               Halaman publik (merangkai komponen)
│   ├── layout.tsx             Kerangka HTML semua halaman
│   ├── globals.css            Warna dan gaya dasar
│   ├── uploads/[name]/route.ts  Menyajikan gambar unggahan (hanya nama buatan server)
│   └── admin/
│       ├── page.tsx           Panel admin (wajib login)
│       ├── logout-actions.ts  Keluar dan keluar dari semua perangkat
│       ├── login/             Halaman, form, dan pemeriksaan password
│       ├── profile/           Edit profil dan foto
│       ├── projects/          Tambah, edit, urutkan, sembunyikan, hapus project
│       └── skills/            Kelola skill dan kategorinya
├── components/
│   ├── portfolio/             Bagian halaman publik (Header, Hero, Projects, About, Skills, Contact, Footer)
│   └── admin/                 Komponen bersama form admin (TextField, ImageField)
└── lib/
    ├── db/                    prisma.ts (koneksi), queries.ts (data untuk halaman publik)
    ├── auth/                  session.ts (karcis di database), session-token.ts (segel cookie)
    ├── validation.ts          Pemeriksaan isian bersama
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

Lihat `DEPLOYMENT.md`.
