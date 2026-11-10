import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { getProfile } from '@/lib/db/queries';
import { ProfileForm } from './profile-form';

export const metadata = {
  title: 'Edit profil | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminProfilePage() {
  await requireAdmin();
  const profile = await getProfile();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin" className="text-sm font-bold text-gray-blue hover:text-navy">
        ← Kembali ke panel
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy">Edit profil</h1>
      <p className="mt-3 text-sm text-gray-blue">
        Perubahan di sini langsung tampil di halaman publik.
      </p>

      <ProfileForm
        avatarUrl={profile.avatarUrl}
        defaults={{
          name: profile.name,
          fullName: profile.fullName,
          role: profile.role,
          bio: profile.bio,
          email: profile.email,
          githubUrl: profile.githubUrl ?? '',
        }}
      />
    </main>
  );
}