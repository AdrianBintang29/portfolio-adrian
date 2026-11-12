import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { getPrisma } from '@/lib/db/prisma';
import { ExperienceRowActions } from './experience-row-actions';

export const metadata = {
  title: 'Pengalaman | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminExperiencePage() {
  await requireAdmin();

  const items = await getPrisma().experience.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/admin" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke panel
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Pengalaman</h1>
          <p className="mt-3 text-sm text-gray-blue">
            Urutan di sini sama dengan urutan di halaman publik. Yang disembunyikan tidak tampil di
            publik. Kalau semua disembunyikan, bagian Experience hilang dari halaman.
          </p>
        </div>

        <Link
          href="/admin/experience/new"
          className="bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Tambah pengalaman
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-sm text-gray-blue">Belum ada pengalaman. Tambahkan yang pertama.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {items.map((item, index) => (
            <li key={item.id} className="border border-navy/15 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-navy">{item.company}</h2>
                  <p className="mt-1 text-xs text-gray-blue">
                    {item.role} · {item.period} ·{' '}
                    {item.published ? 'Tampil di publik' : 'Disembunyikan'}
                  </p>
                </div>

                <Link
                  href={`/admin/experience/${item.id}`}
                  className="text-sm font-bold text-navy underline underline-offset-4 hover:text-gray-blue"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-4">
                <ExperienceRowActions
                  id={item.id}
                  title={item.company}
                  published={item.published}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
