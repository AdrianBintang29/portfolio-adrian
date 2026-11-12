// Tes ujung ke ujung untuk admin panel. Berjalan di database TERPISAH (portfolio_test),
// bukan database asli. Jalankan lewat: npm run test:e2e
import { hash } from 'bcryptjs';
import { BASE, PASSWORD, connectDb, launch } from './helpers.mjs';

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'LOLOS' : 'GAGAL'}  ${name}${detail ? ` -> ${detail}` : ''}`);
}

const db = await connectDb();

async function resetData() {
  await db.query('delete from "Session"');
  await db.query('delete from "Admin"');
  const passwordHash = await hash(PASSWORD, 10);
  await db.query(
    'insert into "Admin"(id, username, "passwordHash", "updatedAt") values (gen_random_uuid(), $1, $2, now())',
    ['adrian', passwordHash],
  );
  await db.query(
    `update "Profile" set name='Adrian Bintang', "fullName"='Muhammad Adrian Bintang Hariyanto',
     bio='Bio awal untuk tes.', email='adrianbintang29@gmail.com',
     "githubUrl"='https://github.com/AdrianBintang29'`,
  );
}

async function dbProfile() {
  const r = await db.query('select * from "Profile" limit 1');
  return r.rows[0];
}

await resetData();

const browser = await launch();

async function newPage() {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  return { page, ctx };
}

async function login(page) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle0' });
  await page.type('#username', 'adrian');
  await page.type('#password', PASSWORD);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('button[type=submit]')]);
}

async function setField(page, selector, value) {
  await page.$eval(selector, (el) => {
    el.value = '';
  });
  if (value) await page.type(selector, value);
}

async function submitProfile(page) {
  await page.click('button[type=submit]');
  await page.waitForFunction(
    () => !document.querySelector('button[type=submit]')?.disabled,
    { timeout: 15000 },
  );
  await new Promise((r) => setTimeout(r, 400));
}

try {
  // Tes 1: tanpa login, /admin/profile dialihkan ke login.
  {
    const { page, ctx } = await newPage();
    await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
    check('1. Tanpa login, /admin/profile dialihkan ke /admin/login', page.url().endsWith('/admin/login'), page.url());
    await ctx.close();
  }

  // Tes 2: login lalu klik tombol Edit profil, form terisi data dari database.
  const { page, ctx } = await newPage();
  await login(page);
  const adminText = await page.$eval('body', (b) => b.innerText);
  check('2a. Setelah login, panel admin tampil', adminText.includes('Panel admin'));
  const hasLink = await page.$('a[href="/admin/profile"]');
  check('2b. Tombol "Edit profil" ada di panel admin', Boolean(hasLink));
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('a[href="/admin/profile"]')]);
  const filled = await page.evaluate(() => ({
    fullName: document.querySelector('#fullName')?.value,
    email: document.querySelector('#email')?.value,
    bio: document.querySelector('#bio')?.value,
  }));
  check(
    '2c. Form terisi data profil dari database',
    filled.fullName === 'Muhammad Adrian Bintang Hariyanto' && filled.email === 'adrianbintang29@gmail.com',
    JSON.stringify(filled),
  );

  // Tes 3: ubah judul Hero, simpan, halaman publik ikut berubah, database ikut berubah.
  await setField(page, '#heroHeadline', 'Tes Judul Hero');
  await submitProfile(page);
  const savedText = await page.$eval('body', (b) => b.innerText);
  check('3a. Muncul tulisan "Tersimpan"', savedText.includes('Tersimpan'));
  check('3b. Kolom heroHeadline di database berubah', (await dbProfile()).heroHeadline === 'Tes Judul Hero');
  const pub = await ctx.newPage();
  await pub.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const pubText = await pub.$eval('body', (b) => b.innerText);
  check('3c. Halaman publik menampilkan judul Hero baru', pubText.toUpperCase().includes('TES JUDUL HERO'));
  await pub.close();

  // Tes 4: tautan GitHub berbahaya ditolak server (browser dilewati dengan menghapus tipe url).
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await page.$eval('#githubUrl', (el) => el.setAttribute('type', 'text'));
  await setField(page, '#githubUrl', 'javascript:alert(1)');
  await submitProfile(page);
  const xssText = await page.$eval('body', (b) => b.innerText);
  check('4a. Tautan "javascript:" ditolak dengan pesan error', xssText.includes('https://'));
  check('4b. Tautan berbahaya TIDAK tersimpan di database', !(await dbProfile()).githubUrl?.startsWith('javascript:'), String((await dbProfile()).githubUrl));

  // Tes 5: email kosong ditolak server.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await page.$eval('form', (f) => f.setAttribute('novalidate', 'true'));
  await page.$$eval('input[required], textarea[required]', (els) => els.forEach((e) => e.removeAttribute('required')));
  await setField(page, '#email', '');
  await submitProfile(page);
  const emptyText = await page.$eval('body', (b) => b.innerText);
  check('5a. Email kosong ditolak dengan pesan error', emptyText.includes('wajib diisi'));
  check('5b. Email di database tidak berubah', (await dbProfile()).email === 'adrianbintang29@gmail.com');

  // Tes 6: isian tidak hilang saat ditolak.
  const bioBaru = 'Bio panjang buatan tes yang tidak boleh hilang saat form ditolak server.';
  await setField(page, '#bio', bioBaru);
  await submitProfile(page);
  const bioSetelahDitolak = await page.$eval('#bio', (el) => el.value);
  check('6. Bio yang diketik tetap ada setelah form ditolak', bioSetelahDitolak === bioBaru, bioSetelahDitolak);

  // Tes 7: kembalikan judul Hero lewat form yang sama.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await setField(page, '#heroHeadline', 'Saya membangun website yang sederhana dan berguna.');
  await submitProfile(page);
  check('7. Judul Hero dikembalikan lewat form, database ikut kembali', (await dbProfile()).heroHeadline === 'Saya membangun website yang sederhana dan berguna.');

  // Tes 8: GitHub kosong menyimpan NULL dan tombol GitHub hilang di halaman publik.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await setField(page, '#githubUrl', '');
  await submitProfile(page);
  check('8a. GitHub dikosongkan, database menyimpan NULL', (await dbProfile()).githubUrl === null, String((await dbProfile()).githubUrl));
  const pub2 = await ctx.newPage();
  await pub2.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const pub2Text = await pub2.$eval('body', (b) => b.innerText);
  check('8b. Tombol GitHub hilang dari halaman publik', !pub2Text.includes('Lihat GitHub'));
  await pub2.close();

  // Tes 9: sesi dicabut dari server, form tidak bisa lagi dipakai menyimpan.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await db.query('delete from "Session"');
  await setField(page, '#heroHeadline', 'DIRETAS TANPA LOGIN');
  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 2500));
  check('9a. Setelah sesi dicabut, penyimpanan DITOLAK di sisi server', (await dbProfile()).heroHeadline !== 'DIRETAS TANPA LOGIN', (await dbProfile()).heroHeadline);
  check('9b. Pengguna dialihkan ke halaman login', page.url().includes('/admin/login'), page.url());
  await ctx.close();
} finally {
  await browser.close();
  await db.end();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} lolos`);
process.exit(failed ? 1 : 0);
