import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { logout, logoutEverywhere } from './logout-actions';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">Panel admin</h1>
      <p className="mt-3 text-sm text-gray-blue">
        Kamu masuk sebagai admin. ID sesi: {session.sessionId}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/profile"
          className="inline-block bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Edit profil
        </Link>

        <Link
          href="/admin/projects"
          className="inline-block bg-yellow px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Kelola project
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <form action={logout}>
          <button
            type="submit"
            className="border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Keluar
          </button>
        </form>

        <form action={logoutEverywhere}>
          <button
            type="submit"
            className="border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Keluar dari semua perangkat
          </button>
        </form>
      </div>
    </main>
  );
}
