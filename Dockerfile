# Image dasar Linux kecil untuk semua tahap build dan runtime.
FROM node:22-alpine AS base

# Tahap 1 (deps): pasang dependency dari package-lock.json. Tahap ini di-cache oleh Docker,
# jadi selama package*.json tidak berubah, build berikutnya tidak mengunduh ulang apa pun.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --dns-result-order=ipv4first: sebagian jaringan (termasuk laptop pengembangan) punya IPv6 yang
# tidak berfungsi. Tanpa ini, npm menunggu IPv6 sampai habis waktu untuk setiap paket.
RUN NODE_OPTIONS=--dns-result-order=ipv4first npm ci --no-audit --no-fund

# Tahap 2 (builder): ubah source menjadi output production standalone.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Folder src/generated/prisma tidak ikut Git, jadi client Prisma harus dibuat di sini sebelum build.
# DATABASE_URL tidak dibutuhkan: generate hanya membaca schema, tidak menyentuh database.
RUN npx prisma generate
RUN npm run build

# Tahap 3 (migrator): image khusus pekerjaan database. Perintah bawaannya "prisma migrate deploy".
# Perintah sekali-jalan lain juga dijalankan dari sini (isi data awal, buat akun admin):
#   docker compose run --rm migrate npx tsx prisma/seed.ts
#   docker compose run --rm migrate npx tsx prisma/create-admin.ts   (tambahkan -it, butuh terminal)
# Dipisah dari image aplikasi supaya aplikasi tidak membawa alat migrasi dan tidak punya
# alasan untuk mengubah struktur database saat berjalan.
#
# Image ini memakai package.json SENDIRI (deploy/migrator), bukan milik aplikasi. Skrip database hanya
# butuh 6 paket, sedangkan aplikasi membawa Next.js, TypeScript, ESLint, dan lainnya yang tidak dipakai
# di sini. Hasilnya image migrator jauh lebih kecil, jadi kiriman ke VPS lebih ringan.
# Versi Prisma di deploy/migrator/package.json HARUS sama dengan versi di package.json aplikasi.
FROM base AS migrator
WORKDIR /app
ENV NODE_ENV=production
COPY deploy/migrator/package.json deploy/migrator/package-lock.json ./
RUN NODE_OPTIONS=--dns-result-order=ipv4first npm ci --no-audit --no-fund
COPY prisma ./prisma
COPY prisma.config.ts ./
# Skrip seed dan create-admin memakai client Prisma hasil generate dari tahap builder.
COPY --from=builder /app/src/generated ./src/generated
# User non-root hanya perlu MEMBACA file di atas, jadi tidak perlu memiliki seluruh node_modules.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs
USER nextjs
CMD ["npx", "prisma", "migrate", "deploy"]

# Tahap 4 (runner): hanya hasil build. Tidak membawa source, tool development, atau .env.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Gambar unggahan disimpan di sini. Di VPS folder ini adalah Docker volume, jadi tidak hilang
# saat container dibuat ulang.
ENV UPLOAD_DIR=/app/uploads

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs \
    && mkdir -p /app/uploads \
    && chown nextjs:nodejs /app/uploads

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Aplikasi tidak berjalan sebagai root di dalam container.
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
