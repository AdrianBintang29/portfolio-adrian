'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { normalizeMultiline } from '@/lib/text';
import { readText } from '@/lib/validation';

export type ExperienceFields = {
  company: string;
  role: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  points: string;
  stack: string;
};

export type ExperienceState = {
  error?: string;
  values?: ExperienceFields;
};

const MAX_LENGTH: Record<keyof ExperienceFields, number> = {
  company: 80,
  role: 120,
  type: 40,
  period: 60,
  location: 80,
  summary: 600,
  points: 2000,
  stack: 300,
};

const MAX_POINTS = 10;
const MAX_POINT_LENGTH = 300;
const MAX_STACK_ITEMS = 12;

function readFields(formData: FormData): ExperienceFields {
  return {
    company: readText(formData, 'company'),
    role: readText(formData, 'role'),
    type: readText(formData, 'type'),
    period: readText(formData, 'period'),
    location: readText(formData, 'location'),
    summary: readText(formData, 'summary'),
    points: normalizeMultiline(String(formData.get('points') ?? '')),
    stack: readText(formData, 'stack'),
  };
}

// Satu baris = satu poin. Baris kosong dibuang.
function parsePoints(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseStack(value: string) {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(items));
}

function validate(values: ExperienceFields): string | null {
  if (
    !values.company ||
    !values.role ||
    !values.type ||
    !values.period ||
    !values.location ||
    !values.summary
  ) {
    return 'Perusahaan, jabatan, tipe, periode, lokasi, dan ringkasan wajib diisi.';
  }

  for (const key of Object.keys(MAX_LENGTH) as (keyof ExperienceFields)[]) {
    if (values[key].length > MAX_LENGTH[key]) {
      return `Isian "${key}" terlalu panjang (maksimal ${MAX_LENGTH[key]} karakter).`;
    }
  }

  const points = parsePoints(values.points);

  if (points.length > MAX_POINTS) {
    return `Poin tugas maksimal ${MAX_POINTS} baris.`;
  }

  if (points.some((point) => point.length > MAX_POINT_LENGTH)) {
    return `Satu poin tugas maksimal ${MAX_POINT_LENGTH} karakter.`;
  }

  if (parseStack(values.stack).length > MAX_STACK_ITEMS) {
    return `Teknologi maksimal ${MAX_STACK_ITEMS} item.`;
  }

  return null;
}

function refreshPages() {
  revalidatePath('/');
  revalidatePath('/admin/experience');
}

export async function createExperience(
  _state: ExperienceState,
  formData: FormData,
): Promise<ExperienceState> {
  await requireAdmin();

  const values = readFields(formData);
  const error = validate(values);

  if (error) return { error, values };

  const prisma = getPrisma();
  const last = await prisma.experience.aggregate({ _max: { sortOrder: true } });

  await prisma.experience.create({
    data: {
      company: values.company,
      role: values.role,
      type: values.type,
      period: values.period,
      location: values.location,
      summary: values.summary,
      points: parsePoints(values.points),
      stack: parseStack(values.stack),
      sortOrder: (last._max.sortOrder ?? -1) + 1,
    },
  });

  refreshPages();
  redirect('/admin/experience');
}

export async function updateExperience(
  id: string,
  _state: ExperienceState,
  formData: FormData,
): Promise<ExperienceState> {
  await requireAdmin();

  const values = readFields(formData);
  const error = validate(values);

  if (error) return { error, values };

  const prisma = getPrisma();
  const existing = await prisma.experience.findUnique({ where: { id } });

  if (!existing) return { error: 'Pengalaman tidak ditemukan.', values };

  await prisma.experience.update({
    where: { id },
    data: {
      company: values.company,
      role: values.role,
      type: values.type,
      period: values.period,
      location: values.location,
      summary: values.summary,
      points: parsePoints(values.points),
      stack: parseStack(values.stack),
    },
  });

  refreshPages();
  redirect('/admin/experience');
}

export async function toggleExperiencePublished(id: string) {
  await requireAdmin();

  const prisma = getPrisma();
  const item = await prisma.experience.findUnique({ where: { id } });

  if (!item) return;

  await prisma.experience.update({ where: { id }, data: { published: !item.published } });
  refreshPages();
}

export async function moveExperience(id: string, direction: 'up' | 'down') {
  await requireAdmin();

  const prisma = getPrisma();

  await prisma.$transaction(async (tx) => {
    const items = await tx.experience.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    const index = items.findIndex((item) => item.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || target < 0 || target >= items.length) return;

    const reordered = items.map((item) => item.id);
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    for (const [position, itemId] of reordered.entries()) {
      await tx.experience.update({ where: { id: itemId }, data: { sortOrder: position } });
    }
  });

  refreshPages();
}

export async function deleteExperience(id: string) {
  await requireAdmin();

  const prisma = getPrisma();
  const item = await prisma.experience.findUnique({ where: { id } });

  if (!item) return;

  await prisma.experience.delete({ where: { id } });
  refreshPages();
}
