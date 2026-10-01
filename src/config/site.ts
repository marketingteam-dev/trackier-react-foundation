import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  CONTENT_MODE: z.enum(['mock', 'wordpress']),
  SITE_URL: z.url(),
  SITE_INDEXABLE: z.enum(['true', 'false']).default('false'),
  WP_API_BASE_URL: z.string().optional(),
  WP_REVALIDATE_SECONDS: z.coerce.number().int().min(0).max(86400).default(300),
});

export function getConfig() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) throw new Error('Invalid environment configuration. Copy .env.example to .env.local and check its values.');
  const env = result.data;
  const origin = new URL(env.SITE_URL);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
    throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query, or fragment.');
  }
  if (env.SITE_INDEXABLE === 'true' && (env.CONTENT_MODE !== 'wordpress' || origin.protocol !== 'https:')) {
    throw new Error('Indexing requires wordpress mode and an HTTPS SITE_URL. Sample content must remain noindex.');
  }
  let apiBase: URL | undefined;
  if (env.CONTENT_MODE === 'wordpress') {
    if (!env.WP_API_BASE_URL) throw new Error('WP_API_BASE_URL is required in wordpress mode.');
    apiBase = new URL(env.WP_API_BASE_URL.endsWith('/') ? env.WP_API_BASE_URL : `${env.WP_API_BASE_URL}/`);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(apiBase.hostname);
    if ((apiBase.protocol !== 'https:' && !(local && apiBase.protocol === 'http:')) || apiBase.username || apiBase.password || apiBase.search || apiBase.hash || !apiBase.pathname.endsWith('/wp-json/trackier/v1/')) {
      throw new Error('WP_API_BASE_URL must use HTTPS (HTTP allowed for localhost), end in /wp-json/trackier/v1/, and have no credentials/query/fragment.');
    }
  }
  return { mode: env.CONTENT_MODE, origin: origin.origin, indexable: env.SITE_INDEXABLE === 'true', apiBase, revalidateSeconds: env.WP_REVALIDATE_SECONDS };
}
