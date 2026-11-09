'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { readText } from '@/lib/validation';

export type SkillState = {
  error?: string;
};

const MAX_NAME = 60;
const MAX_CATEGORY = 60;

function refreshPages() {
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

function validate(name: string, category: string): string | null {
  if (!name || !category) {
    return 'Nama dan kategori wajib diisi.';
  }

  if (name.length > MAX_NAME) {
    return `Nama terlalu panjang (maksimal ${MAX_NAME} karakter).`;
  }

  if (category.length > MAX_CATEGORY) {
    return `Kategori terlalu panjang (maksimal ${MAX_CATEGORY} karakter).`;
  }

  return null;
}

export async function createSkill(_state: SkillState, formData: FormData): Promise<SkillState> {
  await requireAdmin();

  const name = readText(formData, 'name');
  const category = readText(formData, 'category');
  const error = validate(name, category);

  if (error) return { error };

  const prisma = getPrisma();

  const duplicate = await prisma.skill.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, category: { equals: category, mode: 'insensitive' } },
  });

  if (duplicate) {
    return { error: `Skill "${name}" sudah ada di kategori "${category}".` };
  }

  const last = await prisma.skill.aggregate({ _max: { sortOrder: true } });

  await prisma.skill.create({
    data: { name, category, sortOrder: (last._max.sortOrder ?? -1) + 1 },
  });

  refreshPages();
  return {};
}

export async function updateSkill(
  id: string,
  _state: SkillState,
  formData: FormData,
): Promise<SkillState> {
  await requireAdmin();

  const name = readText(formData, 'name');
  const category = readText(formData, 'category');
  const error = validate(name, category);

  if (error) return { error };

  const prisma = getPrisma();

  const duplicate = await prisma.skill.findFirst({
    where: {
      id: { not: id },
      name: { equals: name, mode: 'insensitive' },
      category: { equals: category, mode: 'insensitive' },
    },
  });

  if (duplicate) {
    return { error: `Skill "${name}" sudah ada di kategori "${category}".` };
  }

  await prisma.skill.updateMany({ where: { id }, data: { name, category } });

  refreshPages();
  return {};
}

export async function moveSkill(id: string, direction: 'up' | 'down') {
  await requireAdmin();

  await getPrisma().$transaction(async (tx) => {
    const skills = await tx.skill.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true },
    });

    const index = skills.findIndex((skill) => skill.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || target < 0 || target >= skills.length) return;

    const reordered = skills.map((skill) => skill.id);
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    for (const [position, skillId] of reordered.entries()) {
      await tx.skill.update({ where: { id: skillId }, data: { sortOrder: position } });
    }
  });

  refreshPages();
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  await getPrisma().skill.deleteMany({ where: { id } });
  refreshPages();
}
