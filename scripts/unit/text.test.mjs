// Tes unit untuk pengolah teks multi-baris. Jalankan: npm run test:unit
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeMultiline, splitParagraphs } from '../../src/lib/text.ts';

test('splitParagraphs memecah teks di setiap baris kosong', () => {
  assert.deepEqual(splitParagraphs('Satu.\n\nDua.\n\nTiga.'), ['Satu.', 'Dua.', 'Tiga.']);
});

test('splitParagraphs menerima baris baru gaya Windows (CRLF) dari form browser', () => {
  assert.deepEqual(splitParagraphs('Satu.\r\n\r\nDua.'), ['Satu.', 'Dua.']);
});

test('splitParagraphs tidak menghasilkan paragraf kosong', () => {
  assert.deepEqual(splitParagraphs('\n\n  Satu.  \n\n\n\n\n   \n\nDua.\n\n'), ['Satu.', 'Dua.']);
  assert.deepEqual(splitParagraphs(''), []);
  assert.deepEqual(splitParagraphs('   \n\n  '), []);
});

test('splitParagraphs mempertahankan baris baru tunggal di dalam satu paragraf', () => {
  assert.deepEqual(splitParagraphs('Baris satu\nbaris dua\n\nParagraf dua'), [
    'Baris satu\nbaris dua',
    'Paragraf dua',
  ]);
});

test('normalizeMultiline menyeragamkan baris baru dan merapikan baris kosong berlebih', () => {
  assert.equal(normalizeMultiline('Satu.\r\n\r\n\r\n\r\nDua.\r\n'), 'Satu.\n\nDua.');
  assert.equal(normalizeMultiline('  Satu.  \n\n  Dua.  '), 'Satu.\n\n  Dua.');
  assert.equal(normalizeMultiline('Satu.   \nDua.\t'), 'Satu.\nDua.');
  assert.equal(normalizeMultiline(''), '');
});

test('normalizeMultiline tidak mengubah teks berbahaya menjadi aman atau sebaliknya (hanya merapikan)', () => {
  assert.equal(normalizeMultiline('<script>x</script>'), '<script>x</script>');
});
