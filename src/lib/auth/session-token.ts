import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_SECONDS = 60 * 60 * 2;

function getKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET belum diatur atau kurang dari 32 karakter');
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(sessionId: string, expiresAt: Date) {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());
}

export async function readSessionToken(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] });
    return typeof payload.sessionId === 'string' ? { sessionId: payload.sessionId } : null;
  } catch {
    return null;
  }
}