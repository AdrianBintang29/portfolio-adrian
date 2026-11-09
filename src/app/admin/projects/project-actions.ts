'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { isHttpUrl, readText } from '@/lib/validation';

export type ProjectFields = {
  title: string;
  slug: string;
  summary: string;
  stack: string;
  liveUrl: string;
  repoUrl: string;
};

export type ProjectState = {
  error?: string;
  values?: ProjectFields;
};

const MAX_LENGTH: Record<keyof ProjectFields, number> = {
  title: 120,
  slug: 80,
  summary: 400,
  stack: 200,
  liveUrl: 200,
  repoUrl: 200,
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_STACK_ITEMS = 12;

function readFields(formData: FormData): ProjectFields {
  return {
    title: readText(formData, 'title'),
    slug: readText(formData, 'slug'),
    summary: readText(formData, 'summary'),
    stack: readText(formData, 'stack'),
    liveUrl: readText(formData, 'liveUrl'),
    repoUrl: readText(formData, 'repoUrl'),
  };
}

function parseStack(value: string) {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(items));
}

function validate(values: ProjectFields): string | null {
  if (!values.title || !values.slug || !values.summary) {
    return 'Judul, slug, dan ringkasan wajib diisi.';
  }

  for (const key of Object.keys(MAX_LENGTH) as (keyof ProjectFields)[]) {
    if (values[key].length > MAX_LENGTH[key]) {
      return `Isian "${key}" terlalu panjang (maksimal ${MAX_LENGTH[key]} karakter).`;
    }
  }

  if (!SLUG_PATTERN.test(values.slug)) {
    return 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: project-saya).';
  }

  if (parseStack(values.stack).length > MAX_STACK_ITEMS) {
    return `Teknologi maksimal ${MAX_STACK_ITEMS} item.`;
  }

  if (values.liveUrl && !isHttpUrl(values.liveUrl)) {
    return 'Tautan demo harus diawali https:// atau http://.';
  }

  if (values.repoUrl && !isHttpUrl(values.repoUrl)) {
    return 'Tautan repository harus diawali https:// atau http://.';
  }

  return null;
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function refreshPages() {
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function createProject(
  _state: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await requireAdmin();

  const values = readFields(formData);
  const error = validate(values);

  if (error) return { error, values };

  const prisma = getPrisma();
  const last = await prisma.project.aggregate({ _max: { sortOrder: true } });

  try {
    await prisma.project.create({
      data: {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        stack: parseStack(values.stack),
        liveUrl: values.liveUrl || null,
        repoUrl: values.repoUrl || null,
        sortOrder: (last._max.sortOrder ?? -1) + 1,
      },
    });
  } catch (caught) {
    if (isUniqueViolation(caught)) {
      return { error: `Slug "${values.slug}" sudah dipakai project lain.`, values };
    }
    throw caught;
  }

  refreshPages();
  redirect('/admin/projects');
}

export async function updateProject(
  id: string,
  _state: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await requireAdmin();

  const values = readFields(formData);
  const error = validate(values);

  if (error) return { error, values };

  try {
    await getPrisma().project.update({
      where: { id },
      data: {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        stack: parseStack(values.stack),
        liveUrl: values.liveUrl || null,
        repoUrl: values.repoUrl || null,
      },
    });
  } catch (caught) {
    if (isUniqueViolation(caught)) {
      return { error: `Slug "${values.slug}" sudah dipakai project lain.`, values };
    }
    throw caught;
  }

  refreshPages();
  redirect('/admin/projects');
}

export async function togglePublished(id: string) {
  await requireAdmin();

  const prisma = getPrisma();
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return;

  await prisma.project.update({ where: { id }, data: { published: !project.published } });
  refreshPages();
}

export async function toggleFeatured(id: string) {
  await requireAdmin();

  const prisma = getPrisma();
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return;

  await prisma.project.update({ where: { id }, data: { featured: !project.featured } });
  refreshPages();
}

export async function moveProject(id: string, direction: 'up' | 'down') {
  await requireAdmin();

  const prisma = getPrisma();

  await prisma.$transaction(async (tx) => {
    const projects = await tx.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    const index = projects.findIndex((project) => project.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || target < 0 || target >= projects.length) return;

    const reordered = projects.map((project) => project.id);
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    for (const [position, projectId] of reordered.entries()) {
      await tx.project.update({ where: { id: projectId }, data: { sortOrder: position } });
    }
  });

  refreshPages();
}

export async function deleteProject(id: string) {
  await requireAdmin();

  await getPrisma().project.deleteMany({ where: { id } });
  refreshPages();
}
