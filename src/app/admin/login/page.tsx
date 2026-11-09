import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Masuk | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session) redirect('/admin');

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">Masuk ke admin</h1>
      <p className="mt-3 text-sm leading-6 text-gray-blue">
        Halaman ini khusus pemilik portfolio.
      </p>

      <LoginForm />
    </main>
  );
}