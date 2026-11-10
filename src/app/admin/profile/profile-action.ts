'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { deleteUploadByUrl, readImageChange } from '@/lib/uploads';
import { isHttpUrl, readText } from '@/lib/validation';

export type ProfileFields = {
  name: string;
  fullName: string;
  role: string;
  bio: string;
  email: string;
  githubUrl: string;
};

export type ProfileState = {
  error?: string;
  saved?: boolean;
  values?: ProfileFields;
};

const MAX_LENGTH: Record<keyof ProfileFields, number> = {
  name: 80,
  fullName: 120,
  role: 80,
  bio: 400,
  email: 120,
  githubUrl: 200,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ProfileFields): string | null {
  if (!values.name || !values.fullName || !values.role || !values.bio || !values.email) {
    return 'Nama, nama lengkap, role, bio, dan email wajib diisi.';
  }

  for (const key of Object.keys(MAX_LENGTH) as (keyof ProfileFields)[]) {
    if (values[key].length > MAX_LENGTH[key]) {
      return `Isian "${key}" terlalu panjang (maksimal ${MAX_LENGTH[key]} karakter).`;
    }
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    return 'Format email tidak valid.';
  }

  if (values.githubUrl && !isHttpUrl(values.githubUrl)) {
    return 'Tautan GitHub harus diawali https:// atau http://.';
  }

  return null;
}

export async function updateProfile(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  await requireAdmin();

  const values: ProfileFields = {
    name: readText(formData, 'name'),
    fullName: readText(formData, 'fullName'),
    role: readText(formData, 'role'),
    bio: readText(formData, 'bio'),
    email: readText(formData, 'email'),
    githubUrl: readText(formData, 'githubUrl'),
  };

  const error = validate(values);

  if (error) {
    return { error, values };
  }

  const prisma = getPrisma();
  const profile = await prisma.profile.findFirst();

  if (!profile) {
    return { error: 'Profil belum ada di database. Jalankan npm run db:seed.', values };
  }

  const image = await readImageChange(formData);

  if (!image.ok) {
    return { error: image.error, values };
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      ...values,
      githubUrl: values.githubUrl || null,
      ...(image.changed ? { avatarUrl: image.url } : {}),
    },
  });

  if (image.changed) {
    await deleteUploadByUrl(profile.avatarUrl);
  }

  revalidatePath('/');
  revalidatePath('/admin/profile');

  return { saved: true };
}