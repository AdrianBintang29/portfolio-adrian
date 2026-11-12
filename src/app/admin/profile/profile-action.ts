'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { normalizeMultiline } from '@/lib/text';
import { deleteUploadByUrl, readImageChange } from '@/lib/uploads';
import { isHttpUrl, readText } from '@/lib/validation';

export type ProfileFields = {
  name: string;
  fullName: string;
  bio: string;
  heroHeadline: string;
  aboutTitle: string;
  aboutBody: string;
  projectsTitle: string;
  projectsDescription: string;
  experienceDescription: string;
  contactDescription: string;
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
  bio: 400,
  heroHeadline: 120,
  aboutTitle: 80,
  aboutBody: 2000,
  projectsTitle: 120,
  projectsDescription: 300,
  experienceDescription: 300,
  contactDescription: 300,
  email: 120,
  githubUrl: 200,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ProfileFields): string | null {
  const required = [
    values.name,
    values.fullName,
    values.bio,
    values.heroHeadline,
    values.aboutTitle,
    values.aboutBody,
    values.projectsTitle,
    values.projectsDescription,
    values.experienceDescription,
    values.contactDescription,
    values.email,
  ];

  if (required.some((value) => !value)) {
    return 'Nama, nama lengkap, bio, judul Hero, judul dan isi About, judul dan deskripsi tiap bagian, serta email wajib diisi.';
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
    bio: readText(formData, 'bio'),
    heroHeadline: readText(formData, 'heroHeadline'),
    aboutTitle: readText(formData, 'aboutTitle'),
    aboutBody: normalizeMultiline(String(formData.get('aboutBody') ?? '')),
    projectsTitle: readText(formData, 'projectsTitle'),
    projectsDescription: readText(formData, 'projectsDescription'),
    experienceDescription: readText(formData, 'experienceDescription'),
    contactDescription: readText(formData, 'contactDescription'),
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

  // Handle upload foto profil avatar via readImageChange
  const image = await readImageChange(formData);
  if (!image.ok) {
    return { error: image.error, values };
  }

  let avatarUrl = profile.avatarUrl;
  if (image.changed) {
    await deleteUploadByUrl(profile.avatarUrl);
    avatarUrl = image.url;
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      ...values,
      githubUrl: values.githubUrl || null,
      avatarUrl,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/profile');

  return { saved: true };
}
