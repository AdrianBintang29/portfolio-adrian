-- AlterTable
-- Hanya MENAMBAH kolom. Baris Profile yang sudah ada (termasuk di VPS) otomatis mendapat nilai bawaan,
-- yaitu teks yang selama ini tampil di halaman. Tidak ada data yang diubah atau dihapus.
ALTER TABLE "Profile" ADD COLUMN     "projectsTitle" TEXT NOT NULL DEFAULT 'Take a look at what I''ve created and be inspired by',
ADD COLUMN     "projectsDescription" TEXT NOT NULL DEFAULT 'Koleksi sistem dan aplikasi yang saya bangun secara mandiri. Geser ke kanan untuk menjelajahi proyek lainnya.',
ADD COLUMN     "experienceDescription" TEXT NOT NULL DEFAULT 'Rekam jejak pengalaman kerja nyata dalam rekayasa perangkat lunak, integrasi backend API, dan pemeliharaan infrastruktur hosting.',
ADD COLUMN     "contactDescription" TEXT NOT NULL DEFAULT 'Saya selalu terbuka untuk peluang magang, kolaborasi software engineering, maupun diskusi teknis seputar arsitektur web dan server mandiri.';
