// Alat bersama untuk tes ujung ke ujung. Hanya boleh menyentuh database portfolio_test.
import puppeteer from 'puppeteer-core';
import { hash } from 'bcryptjs';
import pg from 'pg';

export const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3200';
export const PASSWORD = 'password-tes-12345';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createReporter() {
  const results = [];

  return {
    check(name, ok, detail = '') {
      results.push({ name, ok });
      console.log(`${ok ? 'LOLOS' : 'GAGAL'}  ${name}${detail ? ` -> ${detail}` : ''}`);
      return ok;
    },
    must(name, ok, detail = '') {
      this.check(name, ok, detail);
      if (!ok) throw new Error(`Tes dihentikan: ${name}`);
    },
    finish() {
      const failed = results.filter((item) => !item.ok).length;
      console.log(`\n${results.length - failed}/${results.length} lolos`);
      return failed === 0;
    },
  };
}

export async function connectDb() {
  const url = process.env.E2E_DATABASE_URL;

  if (!url || !url.includes('portfolio_test')) {
    throw new Error('E2E_DATABASE_URL wajib menunjuk ke database portfolio_test.');
  }

  const db = new pg.Client({ connectionString: url });
  await db.connect();
  return db;
}

export async function resetAdmin(db) {
  await db.query('delete from "Session"');
  await db.query('delete from "Admin"');
  const passwordHash = await hash(PASSWORD, 10);
  await db.query(
    'insert into "Admin"(id, username, "passwordHash", "updatedAt") values (gen_random_uuid(), $1, $2, now())',
    ['adrian', passwordHash],
  );
}

export function launch() {
  return puppeteer.launch({ executablePath: CHROME, headless: true });
}

export async function newSession(browser) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  page.on('dialog', (dialog) => dialog.accept());
  return { page, ctx };
}

export async function login(page) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle0' });
  await page.type('#username', 'adrian');
  await page.type('#password', PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type=submit]'),
  ]);
}

export async function setField(page, selector, value) {
  await page.$eval(selector, (el) => {
    el.value = '';
  });
  if (value) await page.type(selector, value);
}

// Mematikan pemeriksaan browser supaya yang diuji benar-benar pemeriksaan di server.
export async function disableBrowserValidation(page) {
  await page.$eval('form', (form) => form.setAttribute('novalidate', 'true'));
  await page.$$eval('input[required], textarea[required]', (els) =>
    els.forEach((el) => el.removeAttribute('required')),
  );
  await page.$$eval('input[type=url], input[type=email]', (els) =>
    els.forEach((el) => el.setAttribute('type', 'text')),
  );
  await page.$$eval('input[maxlength], textarea[maxlength]', (els) =>
    els.forEach((el) => el.removeAttribute('maxlength')),
  );
}

export async function submitForm(page) {
  await page.click('button[type=submit]');
  await page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled, {
    timeout: 15000,
  });
  await sleep(700);
}

export async function pageText(page) {
  return page.$eval('body', (body) => body.innerText);
}

export async function publicText(ctx) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const text = await pageText(page);
  await page.close();
  return text;
}
