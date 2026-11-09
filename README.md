# Portfolio Adrian Bintang

Website portfolio dengan admin panel. Dibangun dengan Next.js (App Router), TypeScript,
Tailwind CSS, Prisma, dan PostgreSQL. Dijalankan di VPS lewat Docker.

## Peta folder

```text
src/
├── proxy.ts                  Satpam: mengarahkan /admin ke login bila tidak ada cookie sesi
├── app/
│   ├── page.tsx              Halaman publik (merangkai komponen)
│   ├── layout.tsx            Kerangka HTML semua halaman
│   ├── globals.css           Warna dan gaya dasar
│   └── admin/
│       ├── page.tsx          Panel admin (wajib login)
│       ├── logout-actions.ts Keluar dan keluar dari semua perangkat
│       └── login/
│           ├── page.tsx      Halaman /admin/login
│           ├── login-form.tsx  Tampilan form
│           └── login-action.ts Pemeriksaan password
├── components/portfolio/     Bagian halaman publik: Header, Hero, Projects, About, Skills, Contact, Footer
└── lib/
    ├── db/
    │   ├── prisma.ts         Koneksi ke PostgreSQL
    │   └── queries.ts        Pertanyaan ke database untuk halaman publik
    └── auth/
        ├── session.ts        Karcis sesi di database (buat, periksa, hapus)
        └── session-token.ts  Segel cookie (tanpa database)

prisma/
├── schema.prisma             Bentuk tabel
├── migrations/               Riwayat perubahan tabel
├── seed.ts                   Mengisi data awal
├── seed-data.ts              Isi data awal (project dan skill contoh)
└── create-admin.ts           Membuat atau mengganti password admin

scripts/                      Skrip bantu untuk VPS
public/                       File statis (CV, foto)
```

## Menjalankan di laptop

Database PostgreSQL berjalan di Docker dalam Ubuntu WSL (port 5433).

```powershell
npm install
npx prisma generate
npm run dev
```

Buka http://localhost:3000. Admin ada di http://localhost:3000/admin.

## Perintah database

| Perintah | Fungsi |
| --- | --- |
| `npx prisma migrate dev --name nama_perubahan` | Terapkan perubahan `schema.prisma` ke database |
| `npx prisma generate` | Buat ulang client Prisma setelah schema berubah |
| `npx prisma studio` | Lihat dan ubah isi tabel di browser |
| `npm run db:seed` | Isi project dan skill contoh (aman dijalankan berulang) |
| `npm run db:create-admin` | Buat akun admin atau ganti passwordnya |

## Variabel lingkungan (`.env`, tidak masuk Git)

| Nama | Isi |
| --- | --- |
| `DATABASE_URL` | Alamat koneksi PostgreSQL |
| `SESSION_SECRET` | Rahasia penanda tangan cookie, minimal 32 karakter. Di VPS buat yang berbeda |

## Deployment

Lihat `DEPLOYMENT.md`.
