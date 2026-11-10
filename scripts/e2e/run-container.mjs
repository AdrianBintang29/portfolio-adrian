// Menjalankan tes browser terhadap stack Docker (compose.test.yaml) yang SUDAH berjalan.
// Persiapan, dijalankan dari Ubuntu/WSL di folder project:
//   docker compose -f compose.test.yaml --env-file /tmp/portfolio-test.env up -d --build
//   docker compose -f compose.test.yaml --env-file /tmp/portfolio-test.env run --rm migrate npx tsx prisma/seed.ts
// Lalu jalankan dari Windows: node scripts/e2e/run-container.mjs <TEST_DB_PASSWORD>
//
// Aplikasi yang diuji adalah image Docker yang sebenarnya akan dikirim ke VPS, bukan "next start" lokal.
import { spawnSync } from 'node:child_process';
import pg from 'pg';

const password = process.argv[2] ?? process.env.TEST_DB_PASSWORD;

if (!password) {
  console.error('Berikan password database tes sebagai argumen pertama.');
  process.exit(2);
}

const BASE = 'http://127.0.0.1:3300';
const DATABASE_URL = `postgresql://portfolio:${password}@127.0.0.1:5434/portfolio`;

const childEnv = {
  ...process.env,
  E2E_BASE_URL: BASE,
  E2E_DATABASE_URL: DATABASE_URL,
  E2E_ALLOW_DB_NAME: 'portfolio',
};

const health = await fetch(`${BASE}/api/health`).then((r) => r.json()).catch(() => null);

if (health?.status !== 'ok') {
  console.error('Aplikasi di container belum sehat. Naikkan stack-nya dulu.');
  process.exit(2);
}

const db = new pg.Client({ connectionString: DATABASE_URL });
await db.connect();
const { rows } = await db.query('select current_database() as name');
await db.end();

if (rows[0].name !== 'portfolio') {
  console.error(`Database tak terduga: ${rows[0].name}`);
  process.exit(2);
}

let failed = false;
const retried = [];

// Koneksi Windows ke port di dalam WSL kadang berkedip pada navigasi pertama browser baru.
// Satu file tes diulang SEKALI, hanya kalau kegagalannya murni timeout navigasi dan tidak ada
// satu pun pemeriksaan yang gagal. Kegagalan pemeriksaan tidak pernah diulang, dan setiap
// pengulangan dilaporkan di akhir.
function runFile(file) {
  const result = spawnSync('node', [`scripts/e2e/${file}`], { env: childEnv, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  return result;
}

for (const file of ['api-e2e.mjs', 'admin-e2e.mjs', 'content-e2e.mjs', 'projects-e2e.mjs', 'skills-e2e.mjs']) {
  console.log(`\n>>> ${file} (terhadap container)`);
  let result = runFile(file);

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const assertionFailed = /^GAGAL\s+(?!\s*Tes selesai)/m.test(output);
  const navigationTimeout = /Navigation timeout/.test(output);

  if (result.status !== 0 && navigationTimeout && !assertionFailed) {
    retried.push(file);
    console.log(`\n(${file}: timeout navigasi tanpa pemeriksaan yang gagal, mengulang sekali)`);
    result = runFile(file);
  }

  if (result.status !== 0) failed = true;
}

if (retried.length) console.log(`\nCatatan: file diulang karena timeout navigasi: ${retried.join(', ')}`);

console.log(failed ? '\nADA TES YANG GAGAL' : '\nSEMUA TES LOLOS TERHADAP CONTAINER');
process.exitCode = failed ? 1 : 0;
