import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPrisma } from '@/lib/db/prisma';
import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  readSessionToken,
  signSessionToken,
} from '@/lib/auth/session-token';

export async function createSession(adminId: string) {
  const prisma = getPrisma();
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);

  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  const session = await prisma.session.create({ data: { adminId, expiresAt } });
  const token = await signSessionToken(session.id, expiresAt);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!token) return null;

  const session = await getPrisma().session.findUnique({ where: { id: token.sessionId } });

  if (!session || session.expiresAt <= new Date()) return null;

  return { sessionId: session.id, adminId: session.adminId };
}

export const requireAdmin = cache(async () => {
  const session = await getSession();

  if (!session) redirect('/admin/login');

  return session;
});

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (token) {
    await getPrisma().session.deleteMany({ where: { id: token.sessionId } });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function deleteAllSessions(adminId: string) {
  await getPrisma().session.deleteMany({ where: { adminId } });

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}