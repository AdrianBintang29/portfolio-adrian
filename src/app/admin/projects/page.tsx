import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { ProjectRowActions } from './project-row-actions';

export const metadata = {
  title: 'Project | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  await requireAdmin();

  const projects = await getPrisma().project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/admin" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke panel
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Project</h1>
          <p className="mt-3 text-sm text-gray-blue">
            Urutan di sini sama dengan urutan di halaman publik. Project yang disembunyikan tidak tampil di publik.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Tambah project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-sm text-gray-blue">Belum ada project. Tambahkan yang pertama.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {projects.map((project, index) => (
            <li key={project.id} className="border border-navy/15 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-navy">{project.title}</h2>
                  <p className="mt-1 text-xs text-gray-blue">
                    /{project.slug} ·{' '}
                    {project.published ? 'Tampil di publik' : 'Disembunyikan'}
                    {project.featured ? ' · Unggulan' : ''}
                  </p>
                </div>

                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-sm font-bold text-navy underline underline-offset-4 hover:text-gray-blue"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-4">
                <ProjectRowActions
                  id={project.id}
                  title={project.title}
                  published={project.published}
                  featured={project.featured}
                  isFirst={index === 0}
                  isLast={index === projects.length - 1}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
