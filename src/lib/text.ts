// Pengolah teks multi-baris. Logika murni tanpa efek samping, sehingga mudah diuji.

// Browser mengirim baris baru gaya Windows (\r\n). Kita seragamkan ke \n.
const toUnixNewlines = (value: string) => value.replace(/\r\n?/g, '\n');

// Merapikan teks sebelum disimpan: baris baru diseragamkan, spasi di ujung baris dibuang,
// dan tiga baris kosong atau lebih diringkas menjadi satu baris kosong.
export function normalizeMultiline(value: string) {
  return toUnixNewlines(value)
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Memecah teks menjadi paragraf. Satu baris kosong memisahkan dua paragraf.
// Hasilnya tidak pernah memuat paragraf kosong.
export function splitParagraphs(value: string) {
  return toUnixNewlines(value)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
