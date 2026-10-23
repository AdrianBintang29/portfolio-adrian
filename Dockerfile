# Image dasar Linux kecil untuk semua tahap build dan runtime.
FROM node:22-alpine AS base

# Tahap ini hanya memasang dependency yang dibutuhkan saat build.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Tahap ini mengubah source Next.js menjadi output production standalone.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Tahap runtime hanya membawa hasil build, bukan seluruh source dan tool development.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Aplikasi tidak berjalan sebagai root di dalam container.
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
