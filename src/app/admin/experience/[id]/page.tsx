import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { updateExperience } from '../experience-actions';
import { ExperienceForm } from '../experience-form';

export const metadata = {
  title: 'Edit pengalaman | Admin',
  robots: { index: false, follow: false },
};

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const item = await getPrisma().experience.findUnique({ where: { id } });

  if (!item) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin/experience" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke daftar pengalaman
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Edit pengalaman</h1>

      <ExperienceForm
        action={updateExperience.bind(null, item.id)}
        submitLabel="Simpan perubahan"
        defaults={{
          company: item.company,
          role: item.role,
          type: item.type,
          period: item.period,
          location: item.location,
          summary: item.summary,
          points: item.points.join('\n'),
          stack: item.stack.join(', '),
        }}
      />
    </main>
  );
}
