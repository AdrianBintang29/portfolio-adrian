// Tes ujung ke ujung untuk CRUD skill. Berjalan di database TERPISAH (portfolio_test).
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
} from './helpers.mjs';

const report = createReporter();
const db = await connectDb();

async function resetSkills() {
  await db.query('delete from "Skill"');
  await db.query(
    `insert into "Skill"(id, name, category, "sortOrder") values
     (gen_random_uuid(), 'React', 'Frontend', 0),
     (gen_random_uuid(), 'Next.js', 'Frontend', 1),
     (gen_random_uuid(), 'Docker', 'DevOps', 2)`,
  );
}

const skillByName = async (name) =>
  (await db.query('select * from "Skill" where name = $1', [name])).rows[0];
const count = async () => (await db.query('select count(*)::int as n from "Skill"')).rows[0].n;

await resetAdmin(db);
await resetSkills();

const browser = await launch();

try {
  // Tes 1: tanpa login dialihkan ke login.
  {
    const { page, ctx } = await newSession(browser);
    await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
    report.check('1. Tanpa login, /admin/skills dialihkan ke login', page.url().endsWith('/admin/login'));
    await ctx.close();
  }

  const { page, ctx } = await newSession(browser);
  await login(page);

  // Tes 2: tautan dan daftar.
  report.check('2a. Panel admin punya tautan ke /admin/skills', Boolean(await page.$('a[href="/admin/skills"]')));
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  const listText = await pageText(page);
  report.check('2b. Daftar admin menampilkan semua skill', ['React', 'Next.js', 'Docker'].every((n) => listText.includes(n)));

  // Tes 3: tambah skill baru.
  await setField(page, '#name', 'PostgreSQL');
  await setField(page, '#category', 'Backend');
  await submitForm(page);
  const created = await skillByName('PostgreSQL');
  report.check('3a. Skill baru tersimpan di database', Boolean(created));
  report.check('3b. Kategori tersimpan', created?.category === 'Backend', created?.category);
  report.check('3c. Skill baru ditaruh paling akhir', created?.sortOrder === 3, String(created?.sortOrder));
  const pub = await publicText(ctx);
  report.check('3d. Skill dan kategori baru tampil di halaman publik', pub.includes('PostgreSQL') && pub.includes('Backend'));

  // Tes 4: isian tidak valid ditolak.
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  const before = await count();
  await setField(page, '#name', '');
  await setField(page, '#category', 'Backend');
  await submitForm(page);
  report.check('4a. Nama kosong ditolak', (await pageText(page)).includes('wajib diisi') && (await count()) === before);
  await setField(page, '#name', 'x'.repeat(61));
  await setField(page, '#category', 'Backend');
  await submitForm(page);
  report.check('4b. Nama terlalu panjang ditolak', (await count()) === before);
  await setField(page, '#name', 'React');
  await setField(page, '#category', 'Frontend');
  await submitForm(page);
  report.check('4c. Skill kembar di kategori yang sama ditolak', (await pageText(page)).includes('sudah ada') && (await count()) === before);

  // Tes 5: ganti nama dan kategori.
  const nextjs = await skillByName('Next.js');
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="edit"][data-id="${nextjs.id}"]`);
  await sleep(400);
  await setField(page, `#edit-name-${nextjs.id}`, 'Next.js 16');
  await setField(page, `#edit-category-${nextjs.id}`, 'Framework');
  await page.click(`button[data-action="save"][data-id="${nextjs.id}"]`);
  await sleep(1800);
  const edited = await skillByName('Next.js 16');
  report.check('5a. Nama skill berubah di database', Boolean(edited));
  report.check('5b. Kategori skill berubah di database', edited?.category === 'Framework', edited?.category);
  report.check('5c. Halaman publik memakai nama dan kategori baru', (await publicText(ctx)).includes('Next.js 16'));

  // Tes 6: ubah urutan.
  const docker = await skillByName('Docker');
  const orderBefore = (await db.query('select name from "Skill" order by "sortOrder"')).rows.map((r) => r.name);
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="move-up"][data-id="${docker.id}"]`);
  await sleep(1500);
  const orderAfter = (await db.query('select name from "Skill" order by "sortOrder"')).rows.map((r) => r.name);
  report.check('6a. Tombol naik menukar posisi', orderAfter.indexOf('Docker') === orderBefore.indexOf('Docker') - 1, `${orderBefore.join(',')} -> ${orderAfter.join(',')}`);
  const orders = (await db.query('select "sortOrder" from "Skill" order by "sortOrder"')).rows.map((r) => r.sortOrder);
  report.check('6b. Nomor urutan tetap unik', new Set(orders).size === orders.length, orders.join(','));

  // Tes 7: hapus skill, kategori yang kosong ikut hilang dari publik.
  const lone = await skillByName('PostgreSQL');
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="delete"][data-id="${lone.id}"]`);
  await sleep(1800);
  report.check('7a. Skill terhapus dari database', !(await skillByName('PostgreSQL')));
  const pubAfter = await publicText(ctx);
  report.check('7b. Skill terhapus hilang dari halaman publik', !pubAfter.includes('PostgreSQL'));
  report.check('7c. Kategori yang kosong ikut hilang dari halaman publik', !pubAfter.includes('Backend'));

  // Tes 8: sesi dicabut, aksi ditolak server.
  await page.goto(`${BASE}/admin/skills`, { waitUntil: 'networkidle0' });
  const target = await skillByName('React');
  await db.query('delete from "Session"');
  await page.click(`button[data-action="delete"][data-id="${target.id}"]`);
  await sleep(2500);
  report.check('8a. Setelah sesi dicabut, penghapusan DITOLAK server', Boolean(await skillByName('React')));
  report.check('8b. Pengguna dialihkan ke halaman login', page.url().includes('/admin/login'), page.url());

  await ctx.close();
} catch (error) {
  console.log(`\nTES BERHENTI: ${error.message}`);
  report.check('Tes selesai tanpa pengecualian', false, error.message);
} finally {
  await browser.close();
  await db.end();
}

process.exit(report.finish() ? 0 : 1);
