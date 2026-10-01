import { z } from 'zod';

// Runtime validation protects against malformed API responses; TS alone cannot do this.
const text = z.string().trim().min(1).max(10000);
export const safeHref = z.string().max(2048).refine((value) => {
  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value) || /^#[A-Za-z][\w-]*$/.test(value)) return true;
  if (/^(mailto:|tel:)[^:]+$/i.test(value)) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}, 'Use a root-relative URL, fragment, HTTPS, mailto, or tel URL.');

export const linkSchema = z.object({ label: text, href: safeHref });
export const imageSchema = z.object({
  url: z.string().refine((value) => {
    if (/^\/react-assets\/[\w./-]+$/.test(value) && !value.includes('..')) return true;
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !/\.svg$/i.test(url.pathname); } catch { return false; }
  }, 'Use an HTTPS raster image or a trusted /react-assets/ file.'),
  alt: z.string().max(1000), // Empty is valid only for decorative images.
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
});
export const siteSchema = z.object({
  name: text,
  logo: imageSchema.optional(),
  navigation: z.array(linkSchema.extend({ children: z.array(linkSchema).max(30).optional() })).max(20),
  headerCta: linkSchema,
  footer: z.object({
    description: text,
    columns: z.array(z.object({ title: text, links: z.array(linkSchema).max(30) })).max(6),
    socialLinks: z.array(linkSchema).max(10),
    copyright: text,
  }),
});
export const pageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  modified: z.iso.datetime(),
  seo: z.object({ title: text, description: text, image: imageSchema.optional(), noIndex: z.boolean() }),
  hero: z.object({ eyebrow: text, heading: text, description: text, primaryCta: linkSchema, secondaryCta: linkSchema.optional(), image: imageSchema.optional() }),
  features: z.object({ heading: text, items: z.array(z.object({ title: text, description: text })).max(12) }),
  testimonials: z.array(z.object({ quote: text, name: text, role: text })).max(12),
  faq: z.object({ heading: text, items: z.array(z.object({ question: text, answer: text })).max(30) }),
  cta: z.object({ heading: text, description: text, link: linkSchema }),
});
