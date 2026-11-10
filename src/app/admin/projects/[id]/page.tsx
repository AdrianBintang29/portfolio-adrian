import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { updateProject } from '../project-actions';
import { ProjectForm } from '../project-form';

export const metadata = {
  title: 'Edit project | Admin',
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const project = await getPrisma().project.findUnique({ where: { id } });

  if (!project) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin/projects" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke daftar project
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Edit project</h1>

      <ProjectForm
        action={updateProject.bind(null, project.id)}
        imageUrl={project.imageUrl}
        submitLabel="Simpan perubahan"
        defaults={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          stack: project.stack.join(', '),
          liveUrl: project.liveUrl ?? '',
          repoUrl: project.repoUrl ?? '',
        }}
      />
    </main>
  );
}
