'use server';

import { redirect } from 'next/navigation';
import { deleteAllSessions, deleteSession, requireAdmin } from '@/lib/auth/session';

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}

export async function logoutEverywhere() {
  const session = await requireAdmin();
  await deleteAllSessions(session.adminId);
  redirect('/admin/login');
}