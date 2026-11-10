import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { detectImageType, parseUploadName, stripJpegMetadata } from '@/lib/image-type';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

// Di VPS folder ini adalah named volume Docker, supaya gambar tidak hilang saat container dibuat ulang.
// Folder ini dipilih saat aplikasi berjalan (lewat UPLOAD_DIR), bukan saat build, jadi bundler
// tidak perlu menelusuri isinya. Tanda turbopackIgnore mencegah build melacak seluruh project.
export function uploadDir() {
  return process.env.UPLOAD_DIR
    ? path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR)
    : path.join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads');
}

export type ImageChange =
  | { ok: false; error: string }
  | { ok: true; changed: false }
  | { ok: true; changed: true; url: string | null };

// Membaca isian gambar dari form. Hasilnya salah satu dari: ditolak, tidak berubah,
// diganti dengan file baru (sudah disimpan di disk), atau dihapus.
export async function readImageChange(
  formData: FormData,
  fileKey = 'image',
  removeKey = 'removeImage',
): Promise<ImageChange> {
  const file = formData.get(fileKey);

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: 'Gambar terlalu besar (maksimal 2 MB).' };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = detectImageType(bytes);

    if (!type) {
      return { ok: false, error: 'Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.' };
    }

    const data = type.ext === 'jpg' ? stripJpegMetadata(bytes) : bytes;

    if (!data) {
      return { ok: false, error: 'File JPEG rusak atau tidak lengkap.' };
    }

    const name = `${randomUUID()}.${type.ext}`;
    const dir = uploadDir();

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(/* turbopackIgnore: true */ dir, name), data, { flag: 'wx' });

    return { ok: true, changed: true, url: `/uploads/${name}` };
  }

  if (formData.get(removeKey) === 'on') {
    return { ok: true, changed: true, url: null };
  }

  return { ok: true, changed: false };
}

// Hanya menghapus file yang namanya berbentuk buatan server. Nama lain diabaikan,
// jadi data di database tidak bisa dipakai untuk menghapus file sembarang.
export async function deleteUploadByUrl(url: string | null | undefined) {
  if (!url?.startsWith('/uploads/')) return;

  const name = url.slice('/uploads/'.length);

  if (!parseUploadName(name)) return;

  try {
    await unlink(path.join(/* turbopackIgnore: true */ uploadDir(), name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Gagal menghapus file unggahan', name, error);
    }
  }
}

export async function readUpload(name: string) {
  if (!parseUploadName(name)) return null;

  try {
    return await readFile(path.join(/* turbopackIgnore: true */ uploadDir(), name));
  } catch {
    return null;
  }
}
