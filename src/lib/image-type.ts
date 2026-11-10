// Logika murni untuk gambar unggahan. Tidak menyentuh disk, database, atau jaringan,
// sehingga bisa diuji langsung dan aman dipakai dari mana saja.

export type ImageType = {
  ext: 'jpg' | 'png' | 'webp';
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
};

const JPEG: ImageType = { ext: 'jpg', contentType: 'image/jpeg' };
const PNG: ImageType = { ext: 'png', contentType: 'image/png' };
const WEBP: ImageType = { ext: 'webp', contentType: 'image/webp' };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((value, index) => bytes[offset + index] === value);
}

// Jenis file ditentukan dari ISI-nya, bukan dari nama atau Content-Type kiriman pengguna,
// karena keduanya bisa dipalsukan dengan mudah. SVG sengaja tidak didukung: SVG bisa memuat skrip.
export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return JPEG;
  if (startsWith(bytes, PNG_SIGNATURE)) return PNG;

  const isRiff = startsWith(bytes, [0x52, 0x49, 0x46, 0x46]);
  const isWebp = startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8);
  if (isRiff && isWebp) return WEBP;

  return null;
}

// Nama file yang disajikan hanya boleh berbentuk "<uuid>.<jpg|png|webp>" buatan server.
// Pola yang ketat ini menutup path traversal dan nama sembarang.
const UPLOAD_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export function parseUploadName(name: string): ImageType | null {
  const match = UPLOAD_NAME.exec(name);
  if (!match) return null;

  const ext = match[1];
  if (ext === 'jpg') return JPEG;
  if (ext === 'png') return PNG;
  return WEBP;
}

// Foto dari ponsel sering membawa EXIF berisi lokasi GPS dan model perangkat.
// Fungsi ini menyalin JPEG tanpa segmen metadata (APPn dan komentar), dengan tetap
// mempertahankan JFIF (APP0) dan segmen warna ICC (APP2) supaya tampilan tidak berubah.
// Mengembalikan null kalau struktur JPEG rusak, sehingga file semacam itu ditolak.
export function stripJpegMetadata(input: Uint8Array): Uint8Array | null {
  if (input.length < 4 || input[0] !== 0xff || input[1] !== 0xd8) return null;

  const output: number[] = [0xff, 0xd8];
  let position = 2;

  while (position < input.length) {
    if (input[position] !== 0xff) return null;

    let marker = input[position + 1];
    while (marker === 0xff && position + 2 < input.length) {
      position += 1;
      marker = input[position + 1];
    }

    if (marker === undefined) return null;

    if (marker === 0xd9) {
      output.push(0xff, 0xd9);
      return Uint8Array.from(output);
    }

    const standalone = marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);
    if (standalone) {
      output.push(0xff, marker);
      position += 2;
      continue;
    }

    if (position + 4 > input.length) return null;

    const length = (input[position + 2] << 8) | input[position + 3];
    if (length < 2 || position + 2 + length > input.length) return null;

    if (marker === 0xda) {
      // Mulai data gambar. Sisanya (sampai penutup) disalin apa adanya.
      for (let index = position; index < input.length; index += 1) output.push(input[index]);
      return output[output.length - 2] === 0xff && output[output.length - 1] === 0xd9
        ? Uint8Array.from(output)
        : null;
    }

    const isMetadata = (marker >= 0xe1 && marker <= 0xef && marker !== 0xe2) || marker === 0xfe;

    if (!isMetadata) {
      for (let index = position; index < position + 2 + length; index += 1) output.push(input[index]);
    }

    position += 2 + length;
  }

  return null;
}
