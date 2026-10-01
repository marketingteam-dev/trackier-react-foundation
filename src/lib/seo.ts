import 'server-only';
import type { Metadata } from 'next';
import { getConfig } from '@/config/site';
import type { MarketingPage } from './content/types';

export function pageMetadata(page: MarketingPage, path: string): Metadata {
  const config = getConfig();
  const canonical = new URL(path, config.origin).href;
  const image = page.seo.image;
  return {
    title: page.seo.title, description: page.seo.description,
    alternates: { canonical },
    robots: { index: config.indexable && !page.seo.noIndex, follow: config.indexable && !page.seo.noIndex },
    openGraph: { type: 'website', title: page.seo.title, description: page.seo.description, url: canonical, ...(image ? { images: [{ url: new URL(image.url, config.origin).href, width: image.width, height: image.height, alt: image.alt }] } : {}) },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: page.seo.title, description: page.seo.description, ...(image ? { images: [new URL(image.url, config.origin).href] } : {}) },
  };
}

export function webpageJsonLd(page: MarketingPage, path: string) {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: page.seo.title, description: page.seo.description, url: new URL(path, getConfig().origin).href, dateModified: page.modified }).replace(/</g, '\\u003c');
}
