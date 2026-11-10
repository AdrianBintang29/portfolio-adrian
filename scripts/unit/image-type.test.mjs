// Tes unit untuk logika gambar. Jalankan: npm run test:unit
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectImageType, parseUploadName, stripJpegMetadata } from '../../src/lib/image-type.ts';

const bytes = (...values) => Uint8Array.from(values);
const text = (value) => [...value].map((char) => char.charCodeAt(0));
const segment = (marker, payload) =>
  [0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 0xff, ...payload];
const contains = (haystack, needle) =>
  Buffer.from(haystack).includes(Buffer.from(needle));

const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0);
const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 2);
const WEBP = bytes(...text('RIFF'), 0, 0, 0, 0, ...text('WEBP'));

test('detectImageType mengenali JPEG, PNG, dan WebP dari isi file', () => {
  assert.equal(detectImageType(JPEG)?.ext, 'jpg');
  assert.equal(detectImageType(PNG)?.ext, 'png');
  assert.equal(detectImageType(WEBP)?.ext, 'webp');
});

test('detectImageType menolak SVG, GIF, HTML, teks, dan file kosong', () => {
  assert.equal(detectImageType(Uint8Array.from(text('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))), null);
  assert.equal(detectImageType(Uint8Array.from(text('GIF89a......'))), null);
  assert.equal(detectImageType(Uint8Array.from(text('<html><script>alert(1)</script>'))), null);
  assert.equal(detectImageType(Uint8Array.from(text('ini bukan gambar'))), null);
  assert.equal(detectImageType(new Uint8Array(0)), null);
});

test('detectImageType menolak RIFF yang bukan WebP', () => {
  assert.equal(detectImageType(bytes(...text('RIFF'), 0, 0, 0, 0, ...text('WAVE'))), null);
});

test('detectImageType tidak tertipu nama: hanya isi file yang dibaca', () => {
  // File "foto.png" berisi teks tetap ditolak karena yang dilihat adalah isinya.
  assert.equal(detectImageType(Uint8Array.from(text('MZ... program berbahaya'))), null);
});

const UUID = '0b8f1c52-6d4e-4c6a-9f3a-2e7d1a4b5c60';

test('parseUploadName hanya menerima nama buatan server', () => {
  assert.equal(parseUploadName(`${UUID}.png`)?.contentType, 'image/png');
  assert.equal(parseUploadName(`${UUID}.jpg`)?.contentType, 'image/jpeg');
  assert.equal(parseUploadName(`${UUID}.webp`)?.contentType, 'image/webp');
});

test('parseUploadName menolak path traversal dan nama sembarang', () => {
  for (const name of [
    '../package.json',
    '..\\.env',
    `../${UUID}.png`,
    `${UUID}/../x.png`,
    '.env',
    'foto.png',
    'a.png',
    `${UUID}.svg`,
    `${UUID}.html`,
    `${UUID}.png.exe`,
    `${UUID}.PNG`,
    `${UUID.toUpperCase()}.png`,
    `${UUID}.png\n`,
    ` ${UUID}.png`,
    '',
  ]) {
    assert.equal(parseUploadName(name), null, `harus ditolak: ${JSON.stringify(name)}`);
  }
});

test('stripJpegMetadata membuang EXIF (lokasi GPS) tapi mempertahankan gambar', () => {
  const jpeg = Uint8Array.from([
    0xff, 0xd8,
    ...segment(0xe0, text('JFIF\0')),
    ...segment(0xe1, text('Exif\0\0GPS-SECRET-LOCATION')),
    ...segment(0xfe, text('KOMENTAR-PRIBADI')),
    ...segment(0xda, [0x00, 0x01, 0x02]),
    0x11, 0x22, 0x33,
    0xff, 0xd9,
  ]);

  assert.ok(contains(jpeg, 'GPS-SECRET-LOCATION'), 'prasyarat: bahan tes memang memuat EXIF');

  const cleaned = stripJpegMetadata(jpeg);

  assert.ok(cleaned, 'JPEG valid harus menghasilkan data');
  assert.ok(!contains(cleaned, 'GPS-SECRET-LOCATION'), 'EXIF harus hilang');
  assert.ok(!contains(cleaned, 'KOMENTAR-PRIBADI'), 'komentar harus hilang');
  assert.ok(contains(cleaned, 'JFIF'), 'segmen JFIF harus tetap ada');
  assert.equal(detectImageType(cleaned)?.ext, 'jpg');
  assert.equal(cleaned[0], 0xff);
  assert.equal(cleaned[1], 0xd8);
  assert.equal(cleaned[cleaned.length - 2], 0xff);
  assert.equal(cleaned[cleaned.length - 1], 0xd9);
  assert.deepEqual([...cleaned.slice(-5, -2)], [0x11, 0x22, 0x33]);
  assert.ok(cleaned.length < jpeg.length);
});

test('stripJpegMetadata menolak JPEG yang rusak atau terpotong', () => {
  assert.equal(stripJpegMetadata(bytes(0xff, 0xd8, 0xff, 0xe1, 0x00, 0x50, 1, 2)), null);
  assert.equal(stripJpegMetadata(bytes(0xff, 0xd8, 0x00, 0x00)), null);
  assert.equal(stripJpegMetadata(new Uint8Array(0)), null);
});
