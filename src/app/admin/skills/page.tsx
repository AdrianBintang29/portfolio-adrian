import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { SkillList } from './skill-list';

export const metadata = {
  title: 'Skill | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  await requireAdmin();

  const skills = await getPrisma().skill.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, category: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/admin" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke panel
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Skill</h1>
      <p className="mt-3 text-sm text-gray-blue">
        Skill dikelompokkan di halaman publik menurut kategorinya. Urutan kategori mengikuti skill pertama di tiap kategori.
      </p>

      <SkillList skills={skills} />
    </main>
  );
}
