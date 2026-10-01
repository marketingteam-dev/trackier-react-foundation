import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const headers = { 'Cache-Control': 'no-store' };
  if (!secret || secret.length < 32) return Response.json({ error: 'Revalidation is disabled.' }, { status: 503, headers });
  const token = request.headers.get('authorization') ?? '';
  const digest = (value: string) => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(digest(token), digest(`Bearer ${secret}`))) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
  // Fixed tag: no arbitrary path, URL, or cache key supplied by a caller.
  revalidateTag('wordpress', { expire: 0 });
  return Response.json({ revalidated: true, message: 'The next content request will fetch fresh data.' }, { headers });
}
