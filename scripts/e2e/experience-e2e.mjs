// Tes ujung ke ujung untuk CRUD pengalaman kerja. Berjalan di database TERPISAH (portfolio_test).
import {
  BASE,
  connectDb,
  createReporter,
  disableBrowserValidation,
  launch,
  login,
  newSession,
  pageText,
  publicText,
  resetAdmin,
  setField,
  sleep,
  submitForm,
  waitFor,
} from './helpers.mjs';

const report = createReporter();
const db = await connectDb();

async function resetExperience() {
  await db.query('delete from "Experience"');
  await db.query(
    `insert into "Experience"(id, company, role, type, period, location, summary, points, stack, "sortOrder", "updatedAt") values
     (gen_random_uuid(), 'Perusahaan Satu', 'Intern Satu', 'Internship', '2026', 'Surabaya', 'Ringkasan satu.', ARRAY['Poin satu A','Poin satu B'], ARRAY['Docker','Nginx'], 0, now()),
     (gen_random_uuid(), 'Perusahaan Dua', 'Developer Dua', 'Freelance', '2025', 'Jakarta', 'Ringkasan dua.', ARRAY['Poin dua A'], ARRAY['Next.js'], 1, now())`,
  );
}

const byCompany = async (name) =>
  (await db.query('select * from "Experience" where company = $1', [name])).rows[0];
const count = async () => (await db.query('select count(*)::int as n from "Experience"')).rows[0].n;
const order = async () =>
  (await db.query('select company from "Experience" order by "sortOrder"')).rows.map((r) => r.company);

await resetAdmin(db);
await resetExperience();

const browser = await launch();

async function fillForm(page, v) {
  for (const [name, value] of Object.entries(v)) await setField(page, `#${name}`, value);
}

try {
  // Tes 1: tanpa login dialihkan ke login.
  {
    const { page, ctx } = await newSession(browser);
    await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
    report.check('1. Tanpa login, /admin/experience dialihkan ke login', page.url().endsWith('/admin/login'));
    await ctx.close();
  }

  const { page, ctx } = await newSession(browser);
  await login(page);

  // Tes 2: tautan dan daftar.
  report.check('2a. Panel admin punya tautan ke /admin/experience', Boolean(await page.$('a[href="/admin/experience"]')));
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  const listText = await pageText(page);
  report.check('2b. Daftar admin menampilkan semua pengalaman', ['Perusahaan Satu', 'Perusahaan Dua'].every((n) => listText.includes(n)));
  const pub0 = await publicText(ctx);
  report.check('2c. Halaman publik menampilkan kedua pengalaman', pub0.includes('Perusahaan Satu') && pub0.includes('Perusahaan Dua'));
  report.check('2d. Poin tugas tampil di halaman publik', pub0.includes('Poin satu A') && pub0.includes('Poin satu B'));

  // Tes 3: tambah pengalaman baru.
  await page.goto(`${BASE}/admin/experience/new`, { waitUntil: 'networkidle0' });
  await fillForm(page, {
    company: 'Perusahaan Tiga',
    role: 'Engineer Tiga',
    type: 'Full-time',
    period: '2024 - 2025',
    location: 'Bandung',
    summary: 'Ringkasan tiga.',
    points: 'Poin tiga A\nPoin tiga B\n\nPoin tiga C',
    stack: 'Go, Docker, Go',
  });
  await submitForm(page);
  const created = await byCompany('Perusahaan Tiga');
  report.check('3a. Pengalaman baru tersimpan di database', Boolean(created));
  report.check('3b. Satu baris menjadi satu poin, baris kosong dibuang', created?.points?.length === 3, JSON.stringify(created?.points));
  report.check('3c. Teknologi kembar digabung', created?.stack?.length === 2, JSON.stringify(created?.stack));
  report.check('3d. Pengalaman baru ditaruh paling akhir', created?.sortOrder === 2, String(created?.sortOrder));
  const pub1 = await publicText(ctx);
  report.check('3e. Pengalaman baru tampil di halaman publik', pub1.includes('Perusahaan Tiga') && pub1.includes('Poin tiga C'));

  // Tes 4: isian tidak valid ditolak server.
  await page.goto(`${BASE}/admin/experience/new`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  const before = await count();
  await fillForm(page, { company: '', role: 'X', type: 'X', period: 'X', location: 'X', summary: 'X', points: '', stack: '' });
  await submitForm(page);
  report.check('4a. Perusahaan kosong ditolak', (await pageText(page)).includes('wajib diisi') && (await count()) === before);
  await fillForm(page, { company: 'x'.repeat(81), role: 'X', type: 'X', period: 'X', location: 'X', summary: 'X', points: '', stack: '' });
  await submitForm(page);
  report.check('4b. Perusahaan terlalu panjang ditolak', (await count()) === before);
  await fillForm(page, { company: 'Valid', role: 'X', type: 'X', period: 'X', location: 'X', summary: 'X', points: Array.from({ length: 11 }, (_, i) => `p${i}`).join('\n'), stack: '' });
  await submitForm(page);
  report.check('4c. Lebih dari 10 poin ditolak', (await pageText(page)).includes('maksimal 10') && (await count()) === before);
  const kept = await page.$eval('#company', (el) => el.value);
  report.check('4d. Isian tidak hilang setelah ditolak', kept === 'Valid', kept);

  // Tes 5: edit pengalaman.
  const one = await byCompany('Perusahaan Satu');
  await page.goto(`${BASE}/admin/experience/${one.id}`, { waitUntil: 'networkidle0' });
  const prefilled = await page.evaluate(() => ({
    company: document.querySelector('#company')?.value,
    points: document.querySelector('#points')?.value,
    stack: document.querySelector('#stack')?.value,
  }));
  report.check(
    '5a. Form edit terisi data dari database',
    prefilled.company === 'Perusahaan Satu' && prefilled.points === 'Poin satu A\nPoin satu B' && prefilled.stack === 'Docker, Nginx',
    JSON.stringify(prefilled),
  );
  await setField(page, '#company', 'Perusahaan Satu Baru');
  await setField(page, '#points', 'Poin baru');
  await submitForm(page);
  const edited = await byCompany('Perusahaan Satu Baru');
  report.check('5b. Perubahan tersimpan di database', Boolean(edited) && edited.points.length === 1 && edited.points[0] === 'Poin baru');
  const pub2 = await publicText(ctx);
  report.check('5c. Halaman publik memakai data baru', pub2.includes('Perusahaan Satu Baru') && pub2.includes('Poin baru') && !pub2.includes('Poin satu A'));

  // Tes 6: ubah urutan.
  const dua = await byCompany('Perusahaan Dua');
  const orderBefore = await order();
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="move-up"][data-id="${dua.id}"]`);
  const orderAfter = await waitFor(order, (names) => names.join(',') !== orderBefore.join(','));
  report.check('6a. Tombol naik menukar posisi', orderAfter.indexOf('Perusahaan Dua') === orderBefore.indexOf('Perusahaan Dua') - 1, `${orderBefore.join(',')} -> ${orderAfter.join(',')}`);
  const orders = (await db.query('select "sortOrder" from "Experience" order by "sortOrder"')).rows.map((r) => r.sortOrder);
  report.check('6b. Nomor urutan tetap unik', new Set(orders).size === orders.length, orders.join(','));

  // Tes 7: sembunyikan lalu tampilkan lagi.
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="toggle-published"][data-id="${dua.id}"]`);
  await waitFor(async () => (await byCompany('Perusahaan Dua')).published, (p) => p === false);
  report.check('7a. Pengalaman disembunyikan dari publik', !(await publicText(ctx)).includes('Perusahaan Dua'));
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="toggle-published"][data-id="${dua.id}"]`);
  await waitFor(async () => (await byCompany('Perusahaan Dua')).published, (p) => p === true);
  report.check('7b. Pengalaman tampil lagi di publik', (await publicText(ctx)).includes('Perusahaan Dua'));

  // Tes 8: hapus pengalaman.
  const tiga = await byCompany('Perusahaan Tiga');
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="delete"][data-id="${tiga.id}"]`);
  await sleep(1800);
  report.check('8a. Pengalaman terhapus dari database', !(await byCompany('Perusahaan Tiga')));
  report.check('8b. Pengalaman terhapus hilang dari publik', !(await publicText(ctx)).includes('Perusahaan Tiga'));

  // Tes 9: semua disembunyikan, section Experience hilang dari halaman publik.
  await db.query('update "Experience" set published = false');
  const pubEmpty = await ctx.newPage();
  await pubEmpty.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  report.check('9. Tanpa pengalaman tampil, section #experience hilang', !(await pubEmpty.$('#experience')));
  await pubEmpty.close();
  await db.query('update "Experience" set published = true');

  // Tes 10: sesi dicabut, aksi ditolak server.
  await page.goto(`${BASE}/admin/experience`, { waitUntil: 'networkidle0' });
  const target = await byCompany('Perusahaan Dua');
  await db.query('delete from "Session"');
  await page.click(`button[data-action="delete"][data-id="${target.id}"]`);
  await sleep(2500);
  report.check('10a. Setelah sesi dicabut, penghapusan DITOLAK server', Boolean(await byCompany('Perusahaan Dua')));
  report.check('10b. Pengguna dialihkan ke halaman login', page.url().includes('/admin/login'), page.url());

  await ctx.close();
} catch (error) {
  console.log(`\nTES BERHENTI: ${error.message}`);
  report.check('Tes selesai tanpa pengecualian', false, error.message);
} finally {
  await browser.close();
  await db.end();
}

process.exit(report.finish() ? 0 : 1);
