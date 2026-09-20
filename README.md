# Portfolio Website

Website portfolio minimalis, bersih, dan profesional untuk Full-Stack Web Developer.
Dibuat menggunakan Next.js (App Router), TypeScript, Tailwind CSS, dan Lucide Icons.

## Fitur Utama
- **Estetika Modern & Dark Mode Monokrom:** Mengadopsi palet warna gelap profesional (`#0b0f19`) dengan aksen teal brand (`#2FA69A`).
- **Bilingual Instan:** Tombol toggle ID / EN instan di navbar tanpa perlu reload halaman.
- **One-Click Salin Email:** Salin email kontak langsung ke clipboard dengan status visual instan.
- **Showcase Ringkas considrAI:** Hanya menyorot 4 poin kapabilitas krusial (kontrak data API, DCF engine/charts, multi-API orchestration, resilient error handling).
- **Matrix Tech Stack & Layanan:** Pengelompokan stack rapi dan daftar kapabilitas teknis.
- **Siap Deploy ke Vercel:** Zero-config static output.

---

## Menjalankan di Lokal

1. Masuk ke folder proyek:
   ```bash
   cd portfolio
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## Cara Deploy Gratis ke Vercel (2 Metode)

### Metode 1: Lewat Dashboard Vercel (Direkomendasikan)
1. Buat repository baru di [GitHub](https://github.com/new) (misal: `my-portfolio`).
2. Masukkan folder `portfolio` ke repository GitHub tersebut:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "feat: initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/my-portfolio.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) dan login pakai akun GitHub kamu.
4. Klik **"Add New Project"** -> pilih repository `my-portfolio`.
5. Biarkan semua setting default (Next.js terdeteksi otomatis) -> Klik **"Deploy"**.
6. Website langsung live dengan domain gratis: `https://<nama-proyek>.vercel.app`.

### Metode 2: Lewat Vercel CLI Langsung dari Terminal
1. Buka terminal di folder `portfolio`:
   ```bash
   npx vercel
   ```
2. Ikuti instruksi login di terminal.
3. Saat ditanya *Set up and deploy?*, pilih `Y`.
4. Website langsung ter-deploy dalam hitungan detik.

---

## Konfigurasi Profil & Link
Untuk mengganti nama, email, atau link GitHub & LinkedIn:
- Buka file `src/lib/content.ts` untuk teks ID & EN.
- Buka file `src/app/page.tsx` untuk mengubah alamat email dan link sosial.
