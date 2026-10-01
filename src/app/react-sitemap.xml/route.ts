import { reactRoutes } from '@/config/routes';
import { getConfig } from '@/config/site';
import { getPage } from '@/lib/content';

export const dynamic = 'force-dynamic';
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]!));

export async function GET() {
  const config = getConfig();
  try {
    const entries = config.indexable ? await Promise.all(reactRoutes.map(async (route) => {
      const page = await getPage(route.slug);
      return !page || page.seo.noIndex ? '' : `<url><loc>${escapeXml(new URL(route.path, config.origin).href)}</loc><lastmod>${page.modified}</lastmod></url>`;
    })) : [];
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch {
    return new Response('Sitemap temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
