import 'server-only';
import { getConfig } from '@/config/site';

export class ContentError extends Error {
  constructor(public readonly code: 'NETWORK' | 'HTTP' | 'INVALID', public readonly status?: number) {
    super(`Content service error: ${code}${status ? ` (${status})` : ''}`);
    this.name = 'ContentError';
  }
}

export async function wordpressGet(resource: string): Promise<unknown | null> {
  const config = getConfig();
  if (!config.apiBase) throw new Error('WordPress mode requires an API base URL.');
  let response: Response;
  try {
    response = await fetch(new URL(resource, config.apiBase), {
      headers: { Accept: 'application/json' },
      // No browser cookies or credentials are forwarded to this public endpoint.
      ...(config.revalidateSeconds === 0 ? { cache: 'no-store' as const } : { next: { revalidate: config.revalidateSeconds, tags: ['wordpress'] } }),
      signal: AbortSignal.timeout(8000),
      redirect: 'error', // A misconfigured origin must fail instead of looping.
    });
  } catch { throw new ContentError('NETWORK'); }

  if (response.status === 404) {
    // Distinguish a missing page from a wrong API URL / disabled plugin.
    const body: unknown = await response.json().catch(() => null);
    if (resource.startsWith('pages/') && body && typeof body === 'object' && 'code' in body && body.code === 'trackier_page_not_found') return null;
    throw new ContentError('HTTP', 404);
  }
  if (!response.ok) throw new ContentError('HTTP', response.status);
  if (!response.headers.get('content-type')?.includes('application/json')) throw new ContentError('INVALID');
  try { return await response.json(); } catch { throw new ContentError('INVALID'); }
}
