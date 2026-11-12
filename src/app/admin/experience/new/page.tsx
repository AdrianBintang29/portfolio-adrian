import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { createExperience } from '../experience-actions';
import { ExperienceForm } from '../experience-form';

export const metadata = {
  title: 'Tambah pengalaman | Admin',
  robots: { index: false, follow: false },
};

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin/experience" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke daftar pengalaman
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Tambah pengalaman</h1>

      <ExperienceForm
        action={createExperience}
        submitLabel="Tambah pengalaman"
        defaults={{
          company: '',
          role: '',
          type: '',
          period: '',
          location: '',
          summary: '',
          points: '',
          stack: '',
        }}
      />
    </main>
  );
}
