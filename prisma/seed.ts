import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { initialProfile, initialProjects, initialSkillGroups } from './seed-data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL belum diatur di file .env');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // upsert: aman dijalankan berulang kali, data tidak dobel.
  for (const [index, project] of initialProjects.entries()) {
    await prisma.project.upsert({
      where: { slug: project.id },
      update: {},
      create: {
        title: project.title,
        slug: project.id,
        summary: project.summary,
        stack: project.stack,
        liveUrl: project.demoUrl,
        repoUrl: project.repoUrl,
        featured: project.featured,
        sortOrder: index,
      },
    });
  }

  // Skill tidak punya kolom unik, jadi hanya diisi kalau tabelnya masih kosong.
  const skillCount = await prisma.skill.count();

  if (skillCount === 0) {
    let order = 0;

    for (const group of initialSkillGroups) {
      for (const name of group.items) {
        await prisma.skill.create({
          data: { name, category: group.category, sortOrder: order++ },
        });
      }
    }
  }

  // Profil hanya satu baris, jadi hanya diisi kalau tabelnya masih kosong.
  if ((await prisma.profile.count()) === 0) {
    await prisma.profile.create({ data: initialProfile });
  }

  const [projects, skills, profiles] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.profile.count(),
  ]);
  console.log(`Seed selesai: ${projects} project, ${skills} skill, ${profiles} profil.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());