# Portfolio Adrian Bintang

Website portfolio personal & profesional untuk **Full-Stack Web Developer**.
Dibangun dengan arsitektur murni frontend (tanpa dependensi backend server eksternal), responsif di semua ukuran layar (mobile & desktop), dan siap di-deploy langsung ke Vercel.

## Fitur & Kapabilitas
- **Purely Frontend & Zero Backend Dependency:** Konten statis teroptimasi penuh, load instan, tidak ada risiko gagal koneksi API eksternal.
- **Mobile-Adaptive Design:** Layout dirancang fluid dari layar 320px (smartphone) hingga layar desktop ultra-wide, tanpa horizontal scroll bug.
- **Bilingual Interface (ID / EN):** Tombol alih bahasa instan tanpa refresh halaman.
- **Showcase Ringkas Proyek Utama (considrAI):** Menyorot 4 kapabilitas rekayasa data & API krusial.
- **Katalog Layanan & Tech Stack:** Pemetaan keahlian Frontend, Backend (Go/Python), PostgreSQL, dan Integrasi API.
- **Aksi Cepat:** Salin alamat email langsung ke clipboard dengan visual feedback.

---

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Menjalankan di Lingkungan Lokal

1. Masuk ke folder proyek:
   ```bash
   cd portfolio-adrian
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Akses via browser di: `http://localhost:3000`

---

## Deploy ke Vercel

1. Push commit terbaru ke GitHub:
   ```bash
   git add .
   git commit -m "feat: modernize portfolio with pure frontend and full mobile responsiveness"
   git push origin main
   ```

2. Vercel akan otomatis mendeteksi perubahan branch `main` dan menjalankan build secara instan tanpa perlu setting environment variable backend lagi.
