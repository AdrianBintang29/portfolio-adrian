import { connection } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

const headers = { 'Cache-Control': 'no-store' };

// Dipakai Docker healthcheck. Hanya memeriksa bahwa aplikasi hidup dan database bisa dijangkau.
// Sengaja tidak mengembalikan rincian apa pun (alamat, versi, pesan error) supaya tidak membocorkan
// informasi internal ke publik.
export async function GET() {
  // Tanpa ini, Next.js bisa menjalankan query saat build dan membekukan jawabannya.
  await connection();

  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok' }, { headers });
  } catch (error) {
    console.error('Health check gagal:', error instanceof Error ? error.message : error);
    return Response.json({ status: 'error' }, { status: 503, headers });
  }
}
