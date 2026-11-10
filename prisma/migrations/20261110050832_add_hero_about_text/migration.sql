-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "aboutBody" TEXT NOT NULL DEFAULT 'Ceritakan tentang dirimu di sini.',
ADD COLUMN     "aboutTitle" TEXT NOT NULL DEFAULT 'Belajar dengan membangun project nyata.',
ADD COLUMN     "heroHeadline" TEXT NOT NULL DEFAULT 'Saya membangun website yang sederhana dan berguna.';


-- Pertahankan teks yang sebelumnya tertulis di kode (Hero dan About) untuk baris yang sudah ada.
-- Hanya menyentuh baris yang masih memakai nilai bawaan, jadi aman dijalankan di database mana pun.
UPDATE "Profile"
SET "aboutTitle" = 'Gaming & Coding',
    "aboutBody" = 'Saya adalah pengembang web yang fokus memahami siklus utuh software: mulai dari interface yang responsif, logika backend API, persistensi database, hingga proses orkestrasi container dan deployment server.' || E'\n\n' ||
                  'Alih-alih sekadar memakai framework atau library instan tanpa tahu cara kerjanya, saya lebih suka mengeksplorasi alasan teknis di balik setiap konfigurasi, seperti bagaimana Docker mengisolasi aplikasi, bagaimana reverse proxy meneruskan request, atau bagaimana schema database dimigrasi secara aman.' || E'\n\n' ||
                  'Portfolio ini dan seluruh infrastruktur di belakangnya dibangun sebagai media belajar langsung dan dokumentasi progres rekayasa perangkat lunak saya.'
WHERE "aboutTitle" = 'Belajar dengan membangun project nyata.'
  AND "aboutBody" = 'Ceritakan tentang dirimu di sini.';