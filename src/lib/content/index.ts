import 'server-only';
import { cache } from 'react';
import { getConfig } from '@/config/site';
import { ContentError, wordpressGet } from '@/lib/wordpress/client';
import { pageSchema, siteSchema } from './schema';

export const getSite = cache(async () => {
  const value = getConfig().mode === 'mock'
    ? (await import('./mock')).mockSite
    : await wordpressGet('site');
  const parsed = siteSchema.safeParse(value);
  if (!parsed.success) throw new ContentError('INVALID');
  return parsed.data;
});

export const getPage = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const value = getConfig().mode === 'mock'
    ? (await import('./mock')).mockPages[slug] ?? null
    : await wordpressGet(`pages/${encodeURIComponent(slug)}`);
  if (value === null) return null;
  const parsed = pageSchema.safeParse(value);
  if (!parsed.success || parsed.data.slug !== slug) throw new ContentError('INVALID');
  return parsed.data;
});
