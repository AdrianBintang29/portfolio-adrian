// Tes ujung ke ujung untuk CRUD project. Berjalan di database TERPISAH (portfolio_test).
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

async function resetProjects() {
  await db.query('delete from "Project"');
  await db.query(
    `insert into "Project"(id, title, slug, summary, stack, featured, published, "sortOrder", "updatedAt") values
     (gen_random_uuid(), 'Alpha Project', 'alpha', 'Ringkasan alpha.', '{Next.js,Docker}', true, true, 0, now()),
     (gen_random_uuid(), 'Beta Project', 'beta', 'Ringkasan beta.', '{React}', false, true, 1, now()),
     (gen_random_uuid(), 'Gamma Project', 'gamma', 'Ringkasan gamma.', '{Node.js}', false, true, 2, now())`,
  );
}

const projectBySlug = async (slug) =>
  (await db.query('select * from "Project" where slug = $1', [slug])).rows[0];

async function fillForm(page, data) {
  if (data.title !== undefined) await setField(page, '#title', data.title);
  if (data.slug !== undefined) await setField(page, '#slug', data.slug);
  if (data.summary !== undefined) await setField(page, '#summary', data.summary);
  if (data.stack !== undefined) await setField(page, '#stack', data.stack);
  if (data.liveUrl !== undefined) await setField(page, '#liveUrl', data.liveUrl);
  if (data.repoUrl !== undefined) await setField(page, '#repoUrl', data.repoUrl);
}

await resetAdmin(db);
await resetProjects();

const browser = await launch();

try {
  // Tes 1: tanpa login, daftar project dan form tambah dialihkan ke login.
  {
    const { page, ctx } = await newSession(browser);
    await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
    report.check('1a. Tanpa login, /admin/projects dialihkan ke login', page.url().endsWith('/admin/login'));
    await page.goto(`${BASE}/admin/projects/new`, { waitUntil: 'networkidle0' });
    report.check('1b. Tanpa login, /admin/projects/new dialihkan ke login', page.url().endsWith('/admin/login'));
    await ctx.close();
  }

  const { page, ctx } = await newSession(browser);
  await login(page);

  // Tes 2: panel admin punya tautan ke project, daftar menampilkan semua project.
  report.check('2a. Panel admin punya tautan ke /admin/projects', Boolean(await page.$('a[href="/admin/projects"]')));
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  const listText = await pageText(page);
  report.check(
    '2b. Daftar admin menampilkan tiga project',
    ['Alpha Project', 'Beta Project', 'Gamma Project'].every((title) => listText.includes(title)),
  );

  // Tes 3: tambah project baru dan muncul di halaman publik.
  await page.goto(`${BASE}/admin/projects/new`, { waitUntil: 'networkidle0' });
  await fillForm(page, {
    title: 'Project Baru Dari Admin',
    slug: 'project-baru',
    summary: 'Ringkasan project baru yang dibuat lewat form.',
    stack: 'Next.js, Prisma, PostgreSQL',
    liveUrl: 'https://contoh.com',
    repoUrl: 'https://github.com/AdrianBintang29/contoh',
  });
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('button[type=submit]')]);
  report.check('3a. Setelah menambah, kembali ke daftar project', page.url().endsWith('/admin/projects'), page.url());
  const created = await projectBySlug('project-baru');
  report.check('3b. Project baru tersimpan di database', Boolean(created));
  report.check('3c. Teknologi dipecah menjadi daftar', JSON.stringify(created?.stack) === JSON.stringify(['Next.js', 'Prisma', 'PostgreSQL']), JSON.stringify(created?.stack));
  report.check('3d. Project baru ditaruh paling akhir (urutan terbesar)', created?.sortOrder === 3, String(created?.sortOrder));
  report.check('3e. Project baru tampil di halaman publik', (await publicText(ctx)).includes('Project Baru Dari Admin'));

  // Tes 4: slug kembar ditolak.
  await page.goto(`${BASE}/admin/projects/new`, { waitUntil: 'networkidle0' });
  await fillForm(page, { title: 'Kembar', slug: 'alpha', summary: 'Slug sudah dipakai.', stack: 'Docker' });
  await submitForm(page);
  report.check('4a. Slug kembar ditolak dengan pesan error', (await pageText(page)).includes('sudah dipakai'));
  report.check('4b. Slug kembar tidak membuat baris baru', (await db.query('select count(*)::int as n from "Project" where slug=$1', ['alpha'])).rows[0].n === 1);

  // Tes 5: tautan berbahaya dan isian wajib ditolak server.
  await page.goto(`${BASE}/admin/projects/new`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  await fillForm(page, { title: 'Berbahaya', slug: 'berbahaya', summary: 'Tes.', stack: 'X', liveUrl: 'javascript:alert(1)' });
  await submitForm(page);
  report.check('5a. Tautan "javascript:" ditolak', (await pageText(page)).includes('https://'));
  report.check('5b. Project berbahaya tidak tersimpan', !(await projectBySlug('berbahaya')));
  await fillForm(page, { title: '', liveUrl: '' });
  await submitForm(page);
  report.check('5c. Judul kosong ditolak', (await pageText(page)).includes('wajib diisi'));
  await fillForm(page, { title: 'Slug Aneh', slug: 'Slug Aneh!!', summary: 'Tes.', stack: 'X' });
  await submitForm(page);
  report.check('5d. Slug dengan spasi dan simbol ditolak', (await pageText(page)).toLowerCase().includes('slug'));
  report.check('5e. Slug aneh tidak tersimpan', (await db.query('select count(*)::int as n from "Project" where title=$1', ['Slug Aneh'])).rows[0].n === 0);

  // Tes 6: edit project, perubahan terlihat di halaman publik.
  const beta = await projectBySlug('beta');
  await page.goto(`${BASE}/admin/projects/${beta.id}`, { waitUntil: 'networkidle0' });
  const prefilled = await page.$eval('#title', (el) => el.value);
  report.check('6a. Form edit terisi data project', prefilled === 'Beta Project', prefilled);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    (async () => {
      await setField(page, '#title', 'Beta Diubah');
      await page.click('button[type=submit]');
    })(),
  ]);
  report.check('6b. Judul di database berubah', (await projectBySlug('beta')).title === 'Beta Diubah');
  report.check('6c. Halaman publik menampilkan judul baru', (await publicText(ctx)).includes('Beta Diubah'));

  // Tes 7: sembunyikan dan tampilkan project lewat published.
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="toggle-published"][data-id="${beta.id}"]`);
  await sleep(1500);
  report.check('7a. Project disembunyikan (published = false)', (await projectBySlug('beta')).published === false);
  report.check('7b. Project tersembunyi HILANG dari halaman publik', !(await publicText(ctx)).includes('Beta Diubah'));
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  report.check('7c. Project tersembunyi tetap terlihat di daftar admin', (await pageText(page)).includes('Beta Diubah'));
  await page.click(`button[data-action="toggle-published"][data-id="${beta.id}"]`);
  await sleep(1500);
  report.check('7d. Project ditampilkan lagi', (await projectBySlug('beta')).published === true);
  report.check('7e. Project muncul lagi di halaman publik', (await publicText(ctx)).includes('Beta Diubah'));

  // Tes 8: ubah urutan.
  const before = (await db.query('select slug from "Project" order by "sortOrder"')).rows.map((r) => r.slug);
  const gamma = await projectBySlug('gamma');
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="move-up"][data-id="${gamma.id}"]`);
  const after = await waitFor(
    async () => (await db.query('select slug from "Project" order by "sortOrder"')).rows.map((r) => r.slug),
    (slugs) => slugs.join(',') !== before.join(','),
  );
  report.check('8a. Tombol naik menukar posisi dengan project di atasnya', after.indexOf('gamma') === before.indexOf('gamma') - 1, `${before.join(',')} -> ${after.join(',')}`);
  const orders = (await db.query('select "sortOrder" from "Project" order by "sortOrder"')).rows.map((r) => r.sortOrder);
  report.check('8b. Nomor urutan tetap unik', new Set(orders).size === orders.length, orders.join(','));

  // Tes 9: hapus project.
  const victim = await projectBySlug('project-baru');
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  await page.click(`button[data-action="delete"][data-id="${victim.id}"]`);
  await sleep(1800);
  report.check('9a. Project terhapus dari database', !(await projectBySlug('project-baru')));
  report.check('9b. Project terhapus hilang dari halaman publik', !(await publicText(ctx)).includes('Project Baru Dari Admin'));

  // Tes 10: sesi dicabut, semua aksi ditolak di sisi server.
  await page.goto(`${BASE}/admin/projects`, { waitUntil: 'networkidle0' });
  const target = await projectBySlug('alpha');
  await db.query('delete from "Session"');
  await page.click(`button[data-action="delete"][data-id="${target.id}"]`);
  await sleep(2500);
  report.check('10a. Setelah sesi dicabut, penghapusan DITOLAK server', Boolean(await projectBySlug('alpha')));
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
