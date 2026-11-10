// Tes ujung ke ujung untuk unggah gambar. Berjalan di database dan folder unggahan TERPISAH.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  BASE,
  connectDb,
  createReporter,
  launch,
  login,
  newSession,
  pageText,
  publicText,
  resetAdmin,
  sleep,
} from './helpers.mjs';

const report = createReporter();
const db = await connectDb();
const UPLOAD_DIR = process.env.UPLOAD_DIR;

if (!UPLOAD_DIR || !UPLOAD_DIR.toLowerCase().includes('e2e')) {
  throw new Error('UPLOAD_DIR wajib menunjuk ke folder sementara untuk tes.');
}

const work = path.join(tmpdir(), 'portfolio-e2e-files');
const { mkdirSync } = await import('node:fs');
mkdirSync(work, { recursive: true });

// PNG 1x1 yang valid.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

function segment(marker, payload) {
  const length = payload.length + 2;
  return Buffer.concat([Buffer.from([0xff, marker, length >> 8, length & 0xff]), payload]);
}

// JPEG minimal yang membawa EXIF berisi "lokasi" rahasia.
const JPEG_WITH_GPS = Buffer.concat([
  Buffer.from([0xff, 0xd8]),
  segment(0xe0, Buffer.from('JFIF\0\x01\x01\0\0\x01\0\x01\0\0')),
  segment(0xe1, Buffer.from('Exif\0\0RAHASIA-LOKASI-GPS-12345')),
  segment(0xda, Buffer.from([0x00, 0x01, 0x02])),
  Buffer.from([0x11, 0x22, 0x33, 0xff, 0xd9]),
]);

const file = (name, data) => {
  const target = path.join(work, name);
  writeFileSync(target, data);
  return target;
};

const files = {
  png: file('gambar-valid.png', PNG),
  jpg: file('foto-ponsel.jpg', JPEG_WITH_GPS),
  fakePng: file('palsu.png', Buffer.from('<?php echo "berbahaya"; ?> ini bukan gambar')),
  svg: file('logo.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')),
  html: file('halaman.png', Buffer.from('<html><script>alert(1)</script></html>')),
  big: file('besar.png', Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024 + 4096, 1)])),
};

const uploaded = () => (existsSync(UPLOAD_DIR) ? readdirSync(UPLOAD_DIR) : []);
const avatar = async () => (await db.query('select "avatarUrl" from "Profile" limit 1')).rows[0].avatarUrl;
const projectImage = async (slug) =>
  (await db.query('select "imageUrl" from "Project" where slug = $1', [slug])).rows[0]?.imageUrl;

async function selectFile(page, filePath) {
  const input = await page.$('input[type=file]');
  await input.uploadFile(filePath);
}

async function save(page) {
  await page.click('button[type=submit]');
  await page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled, { timeout: 20000 });
  await sleep(900);
}

await resetAdmin(db);
await db.query('update "Profile" set "avatarUrl" = null');
await db.query('delete from "Project"');
await db.query(
  `insert into "Project"(id, title, slug, summary, stack, "sortOrder", "updatedAt")
   values (gen_random_uuid(), 'Project Gambar', 'project-gambar', 'Untuk tes gambar.', '{X}', 0, now())`,
);

const browser = await launch();

try {
  const { page, ctx } = await newSession(browser);
  await login(page);

  // Tes 1: unggah foto profil PNG yang valid.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await selectFile(page, files.png);
  await save(page);
  const url1 = await avatar();
  report.check('1a. Foto profil tersimpan di database sebagai /uploads/<uuid>.png', /^\/uploads\/[0-9a-f-]{36}\.png$/.test(url1 ?? ''), String(url1));
  report.check('1b. File benar-benar ada di folder unggahan', uploaded().length === 1, uploaded().join(','));
  const served = await ctx.newPage();
  const response = await served.goto(`${BASE}${url1}`, { waitUntil: 'networkidle0' });
  report.check('1c. Gambar bisa dibuka lewat alamatnya', response.status() === 200, String(response.status()));
  report.check('1d. Jenis konten image/png', response.headers()['content-type'] === 'image/png', response.headers()['content-type']);
  report.check('1e. Header nosniff terpasang', response.headers()['x-content-type-options'] === 'nosniff');
  await served.close();
  report.check('1f. Foto tampil di halaman publik', (await (async () => {
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const has = await p.$(`img[src*="${url1}"], img[src*="${encodeURIComponent(url1)}"]`);
    await p.close();
    return Boolean(has);
  })()));

  // Tes 2: mengganti foto menghapus file lama.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await selectFile(page, files.jpg);
  await save(page);
  const url2 = await avatar();
  report.check('2a. Foto diganti, alamat berubah', url2 !== url1 && /\.jpg$/.test(url2 ?? ''), String(url2));
  report.check('2b. File lama terhapus dari disk (tidak ada sampah)', uploaded().length === 1 && !uploaded().includes(path.basename(url1)), uploaded().join(','));

  // Tes 3: EXIF/GPS dibuang dari JPEG.
  const stored = readFileSync(path.join(UPLOAD_DIR, path.basename(url2)));
  report.check('3a. JPEG tersimpan tidak lagi memuat lokasi GPS', !stored.includes('RAHASIA-LOKASI-GPS'));
  report.check('3b. JPEG tersimpan tetap JPEG yang utuh', stored[0] === 0xff && stored[1] === 0xd8 && stored.at(-1) === 0xd9);

  // Tes 4: file berbahaya ditolak, termasuk yang menyamar sebagai gambar.
  for (const [label, key] of [
    ['4a. File teks/PHP yang diberi nama .png', 'fakePng'],
    ['4b. SVG berisi skrip', 'svg'],
    ['4c. HTML yang diberi nama .png', 'html'],
  ]) {
    await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
    const before = uploaded().length;
    await selectFile(page, files[key]);
    await save(page);
    const text = await pageText(page);
    report.check(`${label} ditolak`, text.includes('Format gambar tidak didukung'));
    report.check(`${label} tidak tersimpan di disk`, uploaded().length === before);
  }

  // Tes 5: file terlalu besar ditolak.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  const beforeBig = uploaded().length;
  await selectFile(page, files.big);
  await save(page);
  const bigText = await pageText(page);
  report.check('5a. Gambar di atas 2 MB ditolak dengan pesan yang jelas', bigText.includes('terlalu besar') || bigText.includes('maksimal'));
  report.check('5b. Gambar besar tidak tersimpan', uploaded().length === beforeBig);

  // Tes 6: hapus foto lewat centang.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await page.click('input[name=removeImage]');
  await save(page);
  report.check('6a. Setelah dihapus, avatarUrl kembali kosong', (await avatar()) === null);
  report.check('6b. File fisik ikut terhapus', uploaded().length === 0, uploaded().join(','));

  // Tes 7: gambar project (tambah, ganti, hapus project ikut menghapus file).
  const row = (await db.query('select id from "Project" where slug = $1', ['project-gambar'])).rows[0];
  await page.goto(`${BASE}/admin/projects/${row.id}`, { waitUntil: 'networkidle0' });
  await selectFile(page, files.png);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('button[type=submit]')]);
  const projectUrl = await projectImage('project-gambar');
  report.check('7a. Gambar project tersimpan', /^\/uploads\/.+\.png$/.test(projectUrl ?? ''), String(projectUrl));
  const pubText = await publicText(ctx);
  const pubPage = await ctx.newPage();
  await pubPage.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const hasImg = await pubPage.$(`img[alt="Tampilan project Project Gambar"]`);
  await pubPage.close();
  report.check('7b. Gambar project tampil di kartu publik', Boolean(hasImg) && pubText.includes('Project Gambar'));

  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="delete"][data-id="${row.id}"]`);
  await sleep(2000);
  report.check('7c. Menghapus project ikut menghapus file gambarnya', uploaded().length === 0, uploaded().join(','));

  // Tes 8: penyajian file hanya untuk nama buatan server.
  const probes = [
    '/uploads/..%2f..%2fpackage.json',
    '/uploads/..%5c..%5c.env',
    '/uploads/.env',
    '/uploads/foto.png',
    '/uploads/0b8f1c52-6d4e-4c6a-9f3a-2e7d1a4b5c60.svg',
    '/uploads/0b8f1c52-6d4e-4c6a-9f3a-2e7d1a4b5c60.png',
  ];
  let allBlocked = true;
  for (const probe of probes) {
    const res = await fetch(`${BASE}${probe}`);
    const body = await res.text();
    const leaked = body.includes('"name"') || body.includes('DATABASE_URL') || body.includes('SESSION_SECRET');
    if (res.status === 200 || leaked) allBlocked = false;
    console.log(`        ${probe} -> ${res.status}`);
  }
  report.check('8. Alamat sembarang dan path traversal tidak menyajikan file apa pun', allBlocked);

  // Tes 9: tanpa login, tidak bisa mengunggah lewat server action.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  const filesBefore = uploaded().length;
  await selectFile(page, files.png);
  await db.query('delete from "Session"');
  await page.click('button[type=submit]');
  await sleep(2500);
  report.check('9a. Setelah sesi dicabut, unggahan DITOLAK server', uploaded().length === filesBefore && (await avatar()) === null);
  report.check('9b. Pengguna dialihkan ke login', page.url().includes('/admin/login'), page.url());

  await ctx.close();
} catch (error) {
  console.log(`\nTES BERHENTI: ${error.message}`);
  report.check('Tes selesai tanpa pengecualian', false, error.message);
} finally {
  await browser.close();
  await db.end();
}

process.exit(report.finish() ? 0 : 1);
