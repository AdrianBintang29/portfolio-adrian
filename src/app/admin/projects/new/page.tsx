import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { createProject } from '../project-actions';
import { ProjectForm } from '../project-form';

export const metadata = {
  title: 'Tambah project | Admin',
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin/projects" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke daftar project
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Tambah project</h1>

      <ProjectForm
        action={createProject}
        submitLabel="Tambah project"
        defaults={{ title: '', slug: '', summary: '', stack: '', liveUrl: '', repoUrl: '' }}
      />
    </main>
  );
}
