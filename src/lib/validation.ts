// Pemeriksaan isian yang dipakai bersama oleh semua form admin.

export function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

// Hanya menerima tautan web biasa. Menolak "javascript:", "data:", dan sejenisnya
// supaya tautan berbahaya tidak bisa tampil sebagai tombol di halaman publik.
export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
