-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "points" TEXT[],
    "stack" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- Pertahankan pengalaman yang sebelumnya tertulis di kode (src/lib/data/experience.ts).
-- Tabel baru dibuat kosong di langkah di atas, jadi baris ini hanya masuk satu kali.
INSERT INTO "Experience" ("id", "company", "role", "type", "period", "location", "summary", "points", "stack", "featured", "published", "sortOrder", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'Nyanhosting',
    'Web Developer & Infrastructure Intern',
    'Internship',
    '2026 - Sekarang',
    'Surabaya, Indonesia',
    'Terlibat aktif dalam pengembangan aplikasi web dan pemeliharaan infrastruktur hosting, memastikan sistem transisi aman dari lingkungan lokal ke lingkungan produksi.',
    ARRAY[
        'Membantu pemeliharaan container Docker dan deployment aplikasi web pada server Linux Ubuntu.',
        'Mengeksplorasi pembuatan endpoint REST API performa tinggi menggunakan Go (Fiber) dan Next.js App Router.',
        'Mempelajari konfigurasi reverse proxy Nginx, pengelolaan sertifikat SSL, dan integrasi Cloudflare Tunnel.',
        'Mengelola skema database relasional dan persistensi volume data secara mandiri.'
    ],
    ARRAY['Next.js', 'Go (Fiber)', 'Docker', 'Relational DB', 'Ubuntu Linux', 'Nginx'],
    true,
    true,
    0,
    CURRENT_TIMESTAMP
);
