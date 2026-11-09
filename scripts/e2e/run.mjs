// Menjalankan semua tes ujung ke ujung dalam satu perintah.
// Aman: memakai database terpisah "portfolio_test", tidak pernah menyentuh portfolio_db.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import pg from 'pg';

const PORT = 3200;
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^"|"$/g, '')];
    }),
);

if (!env.DATABASE_URL || !env.SESSION_SECRET) {
  throw new Error('.env harus berisi DATABASE_URL dan SESSION_SECRET.');
}

const testUrl = new URL(env.DATABASE_URL);
const adminUrl = new URL(env.DATABASE_URL);
adminUrl.pathname = '/postgres';
testUrl.pathname = '/portfolio_test';
const TEST_DATABASE_URL = testUrl.toString();

const childEnv = {
  ...process.env,
  DATABASE_URL: TEST_DATABASE_URL,
  E2E_DATABASE_URL: TEST_DATABASE_URL,
  SESSION_SECRET: env.SESSION_SECRET,
  E2E_BASE_URL: `http://127.0.0.1:${PORT}`,
};

function run(label, command, args) {
  console.log(`\n>>> ${label}`);
  const result = spawnSync(command, args, { env: childEnv, stdio: 'inherit', shell: true });
  if (result.status !== 0) throw new Error(`${label} gagal (kode ${result.status}).`);
}

async function recreateTestDatabase() {
  const admin = new pg.Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  await admin.query('drop database if exists portfolio_test with (force)');
  await admin.query('create database portfolio_test');
  await admin.end();
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/admin/login`);
      if (response.ok) return;
    } catch {
      // server belum siap
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Server tes tidak kunjung siap.');
}

let server;
let exitCode = 1;

try {
  console.log('>>> Menyiapkan database tes (portfolio_test), database aslimu tidak disentuh');
  await recreateTestDatabase();
  run('Menerapkan migrasi', 'npx', ['prisma', 'migrate', 'deploy']);
  run('Mengisi data awal', 'npx', ['tsx', 'prisma/seed.ts']);
  run('Membangun aplikasi', 'npm', ['run', 'build']);

  console.log(`\n>>> Menjalankan server tes di port ${PORT}`);
  server = spawn('npx', ['next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    env: childEnv,
    stdio: 'ignore',
    shell: true,
  });
  await waitForServer();

  let allPassed = true;

  for (const file of ['admin-e2e.mjs', 'projects-e2e.mjs']) {
    console.log(`\n>>> ${file}`);
    const result = spawnSync('node', [`scripts/e2e/${file}`], { env: childEnv, stdio: 'inherit' });
    if (result.status !== 0) allPassed = false;
  }

  exitCode = allPassed ? 0 : 1;
  console.log(allPassed ? '\nSEMUA TES LOLOS' : '\nADA TES YANG GAGAL');
} catch (error) {
  console.error(`\nPelari tes berhenti: ${error.message}`);
} finally {
  if (server) {
    spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  }
  const check = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
  for (const line of check.stdout.split(/\r?\n/)) {
    if (line.includes(`:${PORT} `) && line.includes('LISTENING')) {
      const pid = line.trim().split(/\s+/).pop();
      spawnSync('taskkill', ['/PID', pid, '/T', '/F'], { stdio: 'ignore' });
    }
  }
}

process.exit(exitCode);
