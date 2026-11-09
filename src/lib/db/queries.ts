import { connection } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

export async function getProjects() {
  await connection();

  return getPrisma().project.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getSkillGroups() {
  await connection();

  const skills = await getPrisma().skill.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const groups = new Map<string, string[]>();

  for (const skill of skills) {
    const names = groups.get(skill.category) ?? [];
    names.push(skill.name);
    groups.set(skill.category, names);
  }

  return Array.from(groups, ([category, items]) => ({ category, items }));
}