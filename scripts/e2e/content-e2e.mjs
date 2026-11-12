// Tes ujung ke ujung untuk teks Hero dan About yang bisa diedit. Berjalan di database TERPISAH.
import {
  BASE,
  connectDb,
  createReporter,
  disableBrowserValidation,
  launch,
  login,
  newSession,
  pageText,
  resetAdmin,
  setField,
  sleep,
  submitForm,
} from './helpers.mjs';

const report = createReporter();
const db = await connectDb();

const DEFAULT_HEADLINE = 'Saya membangun website yang sederhana dan berguna.';
const DEFAULT_ABOUT_TITLE = 'Gaming & Coding';

async function resetProfile() {
  await db.query(
    `update "Profile" set "heroHeadline" = $1, "aboutTitle" = $2, "aboutBody" = $3,
     name='Adrian Bintang', "fullName"='Muhammad Adrian Bintang Hariyanto',
     bio='Bio awal.', email='adrianbintang29@gmail.com', "githubUrl"='https://github.com/AdrianBintang29'`,
    [DEFAULT_HEADLINE, DEFAULT_ABOUT_TITLE, 'Paragraf awal satu.\n\nParagraf awal dua.'],
  );
}

const profile = async () => (await db.query('select * from "Profile" limit 1')).rows[0];

async function publicInfo(ctx) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const info = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent ?? '',
    aboutTitle: document.querySelector('#about h2')?.textContent ?? '',
    aboutParagraphs: [...document.querySelectorAll('#about .about-body p')].map((p) => p.textContent),
    injectedImages: document.querySelectorAll('img[src="x"]').length,
    // Skrip yang benar-benar tersuntik berarti tag <script> yang isinya persis kata itu.
    // Data halaman milik Next.js (self.__next_f) juga memuat teks tersebut, tapi sebagai data mati.
    injectedScripts: [...document.querySelectorAll('script')].filter((s) => s.textContent?.trim() === 'HACKED').length,
    h1Children: document.querySelector('h1')?.children.length ?? -1,
  }));
  await page.close();
  return info;
}

await resetAdmin(db);
await resetProfile();

const browser = await launch();

try {
  const { page, ctx } = await newSession(browser);
  await login(page);

  // Tes 1: form profil punya tiga kolom baru yang terisi data dari database.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  const filled = await page.evaluate(() => ({
    headline: document.querySelector('#heroHeadline')?.value,
    aboutTitle: document.querySelector('#aboutTitle')?.value,
    aboutBody: document.querySelector('#aboutBody')?.value,
  }));
  report.must('1a. Kolom judul Hero, judul About, dan isi About ada di form', filled.headline !== undefined && filled.aboutTitle !== undefined && filled.aboutBody !== undefined);
  report.check('1b. Kolom terisi data dari database', filled.headline === DEFAULT_HEADLINE && filled.aboutTitle === DEFAULT_ABOUT_TITLE && filled.aboutBody.includes('Paragraf awal satu.'));

  // Tes 2: ubah ketiganya dan lihat di halaman publik.
  await setField(page, '#heroHeadline', 'Headline Baru Dari Admin');
  await setField(page, '#aboutTitle', 'Judul About Baru');
  await setField(page, '#aboutBody', 'Paragraf satu.\n\nParagraf dua.\n\nParagraf tiga.');
  await submitForm(page);
  const saved = await profile();
  report.check('2a. Tiga kolom tersimpan di database', saved.heroHeadline === 'Headline Baru Dari Admin' && saved.aboutTitle === 'Judul About Baru' && saved.aboutBody.includes('Paragraf tiga.'));
  const pub = await publicInfo(ctx);
  report.check('2b. Judul besar Hero di halaman publik berubah', pub.h1 === 'Headline Baru Dari Admin', pub.h1);
  report.check('2c. Judul About di halaman publik berubah', pub.aboutTitle === 'Judul About Baru', pub.aboutTitle);
  report.check('2d. Isi About dipecah menjadi tiga paragraf', JSON.stringify(pub.aboutParagraphs) === JSON.stringify(['Paragraf satu.', 'Paragraf dua.', 'Paragraf tiga.']), JSON.stringify(pub.aboutParagraphs));

  // Tes 3: baris kosong berlebih tidak menghasilkan paragraf kosong.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await setField(page, '#aboutBody', 'Satu.\n\n\n\n\n\nDua.\n\n\n');
  await submitForm(page);
  const pub3 = await publicInfo(ctx);
  report.check('3. Baris kosong berlebih menghasilkan tepat dua paragraf, tanpa paragraf kosong', JSON.stringify(pub3.aboutParagraphs) === JSON.stringify(['Satu.', 'Dua.']), JSON.stringify(pub3.aboutParagraphs));

  // Tes 4: validasi server.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  const before = await profile();
  await setField(page, '#heroHeadline', '');
  await submitForm(page);
  report.check('4a. Judul Hero kosong ditolak', (await pageText(page)).includes('wajib diisi') && (await profile()).heroHeadline === before.heroHeadline);
  await setField(page, '#heroHeadline', 'x'.repeat(121));
  await submitForm(page);
  report.check('4b. Judul Hero terlalu panjang ditolak', (await profile()).heroHeadline === before.heroHeadline);
  await setField(page, '#heroHeadline', 'Judul sah');
  await setField(page, '#aboutBody', '');
  await submitForm(page);
  report.check('4c. Isi About kosong ditolak', (await profile()).aboutBody === before.aboutBody);
  await setField(page, '#aboutBody', 'a'.repeat(2001));
  await submitForm(page);
  report.check('4d. Isi About lebih dari 2000 karakter ditolak', (await profile()).aboutBody === before.aboutBody);

  // Tes 5: HTML dan skrip yang diketik ditampilkan sebagai teks biasa, tidak dijalankan.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  const attack = '<img src=x onerror=alert(1)><script>HACKED</script>';
  await setField(page, '#heroHeadline', attack);
  await setField(page, '#aboutTitle', 'Judul biasa');
  await setField(page, '#aboutBody', 'Isi biasa.');
  await submitForm(page);
  const pub5 = await publicInfo(ctx);
  report.check('5a. Teks berbahaya ditampilkan apa adanya sebagai teks', pub5.h1 === attack, pub5.h1);
  report.check(
    '5b. Tidak ada elemen gambar atau skrip yang tersuntik ke halaman',
    pub5.injectedImages === 0 && pub5.injectedScripts === 0 && pub5.h1Children === 0,
    JSON.stringify({ gambar: pub5.injectedImages, skrip: pub5.injectedScripts, anakH1: pub5.h1Children }),
  );

  // Tes 6: teks section Projects, Experience, dan Contact.
  const sectionText = async () => {
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const info = await p.evaluate(() => ({
      projectsTitle: document.querySelector('#projects h2')?.textContent ?? '',
      projectsDesc: document.querySelector('#projects h2')?.parentElement?.parentElement?.querySelector('p')?.textContent ?? '',
      experienceDesc: document.querySelector('#experience h2 + p')?.textContent ?? '',
      contactDesc: document.querySelector('#contact h2 + p')?.textContent ?? '',
      repoLink: [...document.querySelectorAll('#projects a')].find((a) => a.textContent.includes('Jelajahi Repositori'))?.getAttribute('href') ?? null,
      labels: ['#experience', '#contact', '#skills', '#about'].map((id) => document.querySelector(`${id} span`)?.textContent?.trim() ?? ''),
    }));
    await p.close();
    return info;
  };

  const DEFAULT_PROJECTS_TITLE = "Take a look at what I've created and be inspired by";
  const def = await sectionText();
  report.check('6a. Bawaan: judul Projects tampil seperti sebelumnya', def.projectsTitle === DEFAULT_PROJECTS_TITLE, def.projectsTitle);
  report.check('6b. Bawaan: deskripsi Projects, Experience, Contact terisi', Boolean(def.projectsDesc) && Boolean(def.experienceDesc) && Boolean(def.contactDesc));
  report.check('6c. Label kecil berupa satu kata', JSON.stringify(def.labels) === JSON.stringify(['Experience', 'Contact', 'Skills', 'About']), JSON.stringify(def.labels));

  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  const formDefaults = await page.evaluate(() => ({
    t: document.querySelector('#projectsTitle')?.value,
    pd: document.querySelector('#projectsDescription')?.value,
    ed: document.querySelector('#experienceDescription')?.value,
    cd: document.querySelector('#contactDescription')?.value,
  }));
  report.check('6d. Form admin punya empat kolom teks section dan terisi', Object.values(formDefaults).every((v) => typeof v === 'string' && v.length > 0), JSON.stringify(formDefaults));

  await disableBrowserValidation(page);
  await setField(page, '#heroHeadline', 'Judul sah');
  await setField(page, '#aboutTitle', 'Judul biasa');
  await setField(page, '#aboutBody', 'Isi biasa.');
  await setField(page, '#projectsTitle', 'Karya saya');
  await setField(page, '#projectsDescription', 'Beberapa project yang pernah saya kerjakan.');
  await setField(page, '#experienceDescription', 'Tempat saya pernah bekerja.');
  await setField(page, '#contactDescription', 'Hubungi saya lewat email.');
  await submitForm(page);
  const savedSec = await profile();
  report.check(
    '6e. Empat teks section tersimpan di database',
    savedSec.projectsTitle === 'Karya saya' && savedSec.projectsDescription === 'Beberapa project yang pernah saya kerjakan.' && savedSec.experienceDescription === 'Tempat saya pernah bekerja.' && savedSec.contactDescription === 'Hubungi saya lewat email.',
  );
  const edited = await sectionText();
  report.check('6f. Judul Projects di halaman publik berubah', edited.projectsTitle === 'Karya saya', edited.projectsTitle);
  report.check('6g. Deskripsi Projects di halaman publik berubah', edited.projectsDesc === 'Beberapa project yang pernah saya kerjakan.', edited.projectsDesc);
  report.check('6h. Deskripsi Experience di halaman publik berubah', edited.experienceDesc === 'Tempat saya pernah bekerja.', edited.experienceDesc);
  report.check('6i. Deskripsi Contact di halaman publik berubah', edited.contactDesc === 'Hubungi saya lewat email.', edited.contactDesc);
  report.check('6j. Tombol repositori memakai tautan GitHub dari profil', edited.repoLink === 'https://github.com/AdrianBintang29', String(edited.repoLink));

  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  await setField(page, '#projectsTitle', 'x'.repeat(121));
  await submitForm(page);
  report.check('6k. Judul Projects terlalu panjang ditolak', (await profile()).projectsTitle === 'Karya saya');
  await setField(page, '#projectsTitle', 'Karya saya');
  await setField(page, '#contactDescription', 'y'.repeat(301));
  await submitForm(page);
  report.check('6l. Deskripsi Contact terlalu panjang ditolak', (await profile()).contactDescription === 'Hubungi saya lewat email.');
  await setField(page, '#contactDescription', 'Hubungi saya lewat email.');
  await setField(page, '#experienceDescription', '');
  await submitForm(page);
  report.check('6m. Deskripsi Experience kosong ditolak', (await profile()).experienceDescription === 'Tempat saya pernah bekerja.');

  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await disableBrowserValidation(page);
  await setField(page, '#githubUrl', '');
  await submitForm(page);
  const noGit = await sectionText();
  report.check('6n. GitHub dikosongkan, tombol repositori hilang', noGit.repoLink === null, String(noGit.repoLink));

  // Tes 7: sesi dicabut, penyimpanan ditolak server.
  await page.goto(`${BASE}/admin/profile`, { waitUntil: 'networkidle0' });
  await db.query('delete from "Session"');
  await setField(page, '#heroHeadline', 'DIRETAS TANPA LOGIN');
  await page.click('button[type=submit]');
  await sleep(2500);
  report.check('6a. Setelah sesi dicabut, penyimpanan DITOLAK server', (await profile()).heroHeadline !== 'DIRETAS TANPA LOGIN');
  report.check('6b. Pengguna dialihkan ke halaman login', page.url().includes('/admin/login'), page.url());

  await ctx.close();
} catch (error) {
  console.log(`\nTES BERHENTI: ${error.message}`);
  report.check('Tes selesai tanpa pengecualian', false, error.message);
} finally {
  await browser.close();
  await db.end();
}

process.exit(report.finish() ? 0 : 1);
