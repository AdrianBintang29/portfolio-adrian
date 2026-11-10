import { parseUploadName } from '@/lib/image-type';
import { readUpload } from '@/lib/uploads';

const notFound = () => new Response('Not found', { status: 404 });

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  const type = parseUploadName(name);

  if (!type) return notFound();

  const data = await readUpload(name);

  if (!data) return notFound();

  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': type.contentType,
      'Content-Length': String(data.length),
      // Nama file berisi UUID acak yang tidak pernah dipakai ulang, jadi aman di-cache lama.
      'Cache-Control': 'public, max-age=31536000, immutable',
      // Mencegah browser menebak jenis file dan menjalankannya sebagai skrip.
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
