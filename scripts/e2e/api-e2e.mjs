// Tes untuk endpoint API publik. Tidak membutuhkan browser.
import { BASE, createReporter } from './helpers.mjs';

const report = createReporter();

const get = (path, init) => fetch(`${BASE}${path}`, init);

// Tes 1: /api/health menjawab sehat tanpa perlu login (dipakai Docker healthcheck).
{
  const response = await get('/api/health');
  const body = await response.json().catch(() => null);
  report.check('1a. GET /api/health menjawab 200', response.status === 200, String(response.status));
  report.check('1b. Isi jawaban {"status":"ok"}', body?.status === 'ok', JSON.stringify(body));
  report.check('1c. Jawaban tidak boleh disimpan cache (selalu segar)', (response.headers.get('cache-control') ?? '').includes('no-store'), response.headers.get('cache-control') ?? '');
  report.check('1d. Jenis konten JSON', (response.headers.get('content-type') ?? '').includes('application/json'));
}

// Tes 2: tidak membocorkan rincian internal.
{
  const text = await (await get('/api/health')).text();
  const leaks = ['DATABASE_URL', 'postgresql', 'SESSION_SECRET', 'portfolio_test', '127.0.0.1:5433', 'password'];
  const found = leaks.filter((word) => text.toLowerCase().includes(word.toLowerCase()));
  report.check('2. Jawaban tidak memuat alamat database, rahasia, atau kata sandi', found.length === 0, found.join(','));
}

// Tes 3: hanya GET yang diterima.
{
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const response = await get('/api/health', { method });
    report.check(`3. ${method} /api/health ditolak (405)`, response.status === 405, String(response.status));
  }
}

// Tidak memakai process.exit(): di Windows ia bisa crash (UV_HANDLE_CLOSING) kalau koneksi
// fetch masih menutup. Cukup atur kode keluar dan biarkan Node berhenti sendiri.
process.exitCode = report.finish() ? 0 : 1;
