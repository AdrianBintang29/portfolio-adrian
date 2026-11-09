'use server';

import { compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getPrisma } from '@/lib/db/prisma';
import { createSession } from '@/lib/auth/session';

export type LoginState = { error?: string };

const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5zA4vVHaqKQ3rYb9n9bS2G2Yz6mQwHy';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function isLocked(username: string) {
  const entry = failedAttempts.get(username);
  return Boolean(entry && entry.lockedUntil > Date.now());
}

function recordFailure(username: string) {
  const entry = failedAttempts.get(username) ?? { count: 0, lockedUntil: 0 };
  const count = entry.count + 1;

  failedAttempts.set(username, {
    count,
    lockedUntil: count >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCK_MINUTES * 60 * 1000 : 0,
  });
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!username || !password) {
    return { error: 'Username atau password salah.' };
  }

  if (isLocked(username)) {
    return { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' };
  }

  const admin = await getPrisma().admin.findUnique({ where: { username } });
  const passwordMatches = await compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !passwordMatches) {
    recordFailure(username);
    return { error: 'Username atau password salah.' };
  }

  failedAttempts.delete(username);
  await createSession(admin.id);
  redirect('/admin');
}