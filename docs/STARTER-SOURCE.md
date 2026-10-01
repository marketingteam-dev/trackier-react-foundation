# Complete starter source

Generated snapshot. Every heading below is the exact project-relative file path. These files already exist in the repository and form one runnable project. See README.md for setup and architecture. package-lock.json is provided separately in the repository. Do not copy secrets into this listing. Regenerate from the project root with `npm run docs:source`.

## package.json

````json
{
  "name": "trackier-react-foundation",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=22.17.0 <25"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "tsx --test tests/*.test.ts",
    "check": "npm run typecheck && npm test",
    "test:smoke": "node scripts/smoke.mjs",
    "test:wordpress": "node scripts/test-wordpress.mjs",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "docs:source": "node scripts/source-listing.mjs"
  },
  "dependencies": {
    "next": "16.3.7",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "server-only": "0.0.1",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "prettier": "3.9.9",
    "tsx": "^4.0.0",
    "typescript": "7.0.2"
  }
}
````

## .env.example

````text
# Copy this file to .env.local. All values here are non-secret examples.
# Explicit modes: mock or wordpress. There is no fallback between them.
CONTENT_MODE=mock
SITE_URL=http://localhost:3000
# Keep false for local development, staging, and sample content.
SITE_INDEXABLE=false

# Only used in wordpress mode; provide a server-reachable WordPress API URL.
# Prefer a dedicated origin route that bypasses public frontend routing.
WP_API_BASE_URL=https://wordpress-origin.example.invalid/wp-json/trackier/v1/
WP_REVALIDATE_SECONDS=300
# Optional exact public media origin; Next images allow /wp-content/uploads/**.
WP_MEDIA_ORIGIN=

# Optional: at least 32 random characters. Blank disables the revalidation API.
# Never prefix this with NEXT_PUBLIC_. Store a real value only in environment secrets.
REVALIDATE_SECRET=
````

## .gitignore

````text
node_modules/
.next/
.env*
!.env.example
*.tsbuildinfo
.DS_Store
coverage/
artifacts/
````

## .nvmrc

````text
24
````

## .prettierrc.json

````json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 100,
  "endOfLine": "lf"
}
````

## .prettierignore

````text
# Dependencies, build output, and generated files
node_modules/
.next/
coverage/
artifacts/
*.tsbuildinfo
next-env.d.ts
package-lock.json
docs/STARTER-SOURCE.md
wordpress/examples/*.json

# Private environment files and formats without a configured Prettier plugin
.env*
wordpress/**/*.php
public/**/*.svg
````

## .editorconfig

````text
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.php]
indent_size = 4
````

## .vscode/settings.json

````json
{
  "prettier.requireConfig": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
````

## .vscode/extensions.json

````json
{
  "recommendations": ["esbenp.prettier-vscode"]
}
````

## tsconfig.json

````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## next-env.d.ts

````ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## next.config.ts

````ts
import type { NextConfig } from 'next';

const mediaOrigin = process.env.WP_MEDIA_ORIGIN;
const media = mediaOrigin ? new URL(mediaOrigin) : undefined;
if (media && (media.protocol !== 'https:' || media.username || media.password || media.pathname !== '/' || media.search || media.hash)) {
  throw new Error('WP_MEDIA_ORIGIN must be a bare HTTPS origin, without credentials, path, query, or fragment.');
}

const config: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  // Resolve page existence + SEO before sending response headers, including to browsers.
  // This is intentional: no streaming metadata or route-level loading.tsx here.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: media ? [{ protocol: 'https', hostname: media.hostname, port: media.port, pathname: '/wp-content/uploads/**', search: '' }] : [],
    // Remote SVG is deliberately not enabled. Use raster WP uploads.
  },
  async headers() {
    return process.env.SITE_INDEXABLE === 'true' && process.env.CONTENT_MODE === 'wordpress'
      ? []
      : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default config;
````

## src/app/[...slug]/page.tsx

````tsx
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { findReactRoute, pathFromSegments } from '@/config/routes';
import { getPage } from '@/lib/content';
import { pageMetadata, webpageJsonLd } from '@/lib/seo';
import { MarketingPage } from '@/components/sections/MarketingPage';

type Props = { params: Promise<{ slug: string[] }> };
async function resolvePage(params: Props['params']) {
  await connection();
  const path = pathFromSegments((await params).slug);
  const route = findReactRoute(path);
  if (!route) notFound();
  const page = await getPage(route.slug);
  if (!page) notFound();
  return { page, path };
}

export async function generateMetadata({ params }: Props) {
  const { page, path } = await resolvePage(params);
  return pageMetadata(page, path);
}

export default async function Page({ params }: Props) {
  const { page, path } = await resolvePage(params);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webpageJsonLd(page, path) }} />
    <MarketingPage page={page} />
  </>;
}
````

## src/app/api/react/revalidate/route.ts

````ts
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
````

## src/app/error.tsx

````tsx
'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="status-page" role="alert"><h1>This page is temporarily unavailable.</h1><p>We could not load its content. Please try again shortly.</p><button className="button button-primary" onClick={reset}>Try again</button></section>;
}
````

## src/app/global-error.tsx

````tsx
'use client';

export default function GlobalError() {
  return <html lang="en"><body style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '12vh auto', padding: 24 }}><main role="alert"><h1>The website is temporarily unavailable.</h1><p>We could not load the shared navigation or page content. Please try again shortly.</p><a href="/react-demo/">Try again</a></main></body></html>;
}
````

## src/app/layout.tsx

````tsx
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSite } from '@/lib/content';
import { getConfig } from '@/config/site';
import '@/styles/globals.css';

export const metadata: Metadata = { title: 'React migration starter', robots: { index: false, follow: false } };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // HTML is rendered on request; public WordPress fetches have their own data cache.
  await connection();
  const site = await getSite();
  const config = getConfig();
  return <html lang="en"><body>
    <a className="skip-link" href="#main-content">Skip to content</a>
    {!config.indexable && <div className="demo-banner">{config.mode === 'mock' ? 'LOCAL DEMONSTRATION · Sample content, not the live Trackier website' : 'STAGING PREVIEW · Search indexing is disabled'}</div>}
    <Header site={site} />
    <main id="main-content">{children}</main>
    <Footer site={site} />
  </body></html>;
}
````

## src/app/not-found.tsx

````tsx
export default function NotFound() {
  return <section className="status-page"><p className="eyebrow">404</p><h1>Page not found</h1><p>This URL is not assigned to a published React page.</p><a className="button button-primary" href="/react-demo/">Return to the demonstration</a></section>;
}
````

## src/app/page.tsx

````tsx
import { redirect } from 'next/navigation';

// Convenience on the local / staging Next origin only. Production / stays WordPress.
export default function Home() { redirect('/react-demo/'); }
````

## src/app/react-sitemap.xml/route.ts

````ts
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
````

## src/components/layout/Footer.tsx

````tsx
import type { SiteSettings } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';

export function Footer({ site }: { site: SiteSettings }) {
  return <footer className="site-footer"><Container>
    <div className="footer-grid"><div><a className="brand" href="/">{site.name}</a><p className="footer-description">{site.footer.description}</p></div>
      {site.footer.columns.map((column, index) => <nav aria-label={column.title} key={`${column.title}-${index}`}><h2 className="footer-title">{column.title}</h2><ul>{column.links.map((link, linkIndex) => <li key={`${link.href}-${linkIndex}`}><a href={link.href}>{link.label}</a></li>)}</ul></nav>)}
    </div>
    <div className="footer-bottom"><p>{site.footer.copyright}</p>{site.footer.socialLinks.length > 0 && <nav aria-label="Social links"><ul className="social-links">{site.footer.socialLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>}</div>
  </Container></footer>;
}
````

## src/components/layout/Header.tsx

````tsx
'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Header({ site }: { site: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const dropdownButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  return <header className="site-header" onKeyDown={(event) => {
    if (event.key !== 'Escape') return;
    if (dropdown !== null) { dropdownButtons.current[dropdown]?.focus(); setDropdown(null); }
    else if (mobileOpen) { setMobileOpen(false); mobileButton.current?.focus(); }
  }}>
    <Container className="header-inner">
      <a className="brand" href="/" aria-label={`${site.name} home`}>
        {site.logo ? <Image src={site.logo.url} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} className="brand-logo" unoptimized={site.logo.url.startsWith('/react-assets/') && site.logo.url.endsWith('.svg')} /> : <><span className="brand-mark" aria-hidden="true">t</span><span>{site.name}</span></>}
      </a>
      <button ref={mobileButton} className="nav-toggle" aria-expanded={mobileOpen} aria-controls={`${id}-navigation`} onClick={() => { setMobileOpen(!mobileOpen); setDropdown(null); }}>{mobileOpen ? 'Close menu' : 'Menu'}<span aria-hidden="true"> {mobileOpen ? '×' : '☰'}</span></button>
      <nav id={`${id}-navigation`} aria-label="Main navigation" className={`main-nav ${mobileOpen ? 'is-open' : ''}`}>
        <ul className="nav-list">
          {site.navigation.map((item, index) => <li key={`${item.href}-${index}`} className="nav-item" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown((value) => value === index ? null : value); }}>
            <div className="nav-item-heading"><a href={item.href}>{item.label}</a>
              {!!item.children?.length && <button ref={(element) => { dropdownButtons.current[index] = element; }} className="dropdown-toggle" aria-label={`Toggle ${item.label} links`} aria-expanded={dropdown === index} aria-controls={`${id}-dropdown-${index}`} onClick={() => setDropdown(dropdown === index ? null : index)}><span aria-hidden="true">⌄</span></button>}
            </div>
            {!!item.children?.length && <ul id={`${id}-dropdown-${index}`} className="dropdown" hidden={dropdown !== index}>{item.children.map((child, childIndex) => <li key={`${child.href}-${childIndex}`}><a href={child.href}>{child.label}</a></li>)}</ul>}
          </li>)}
        </ul>
        <Button {...site.headerCta} />
      </nav>
    </Container>
  </header>;
}
````

## src/components/sections/CTASection.tsx

````tsx
import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
export function CTASection({ content }: { content: MarketingPage['cta'] }) {
  return <Section labelledBy="cta-heading"><div className="cta-panel"><div><p className="eyebrow">Keep building</p><h2 id="cta-heading">{content.heading}</h2><p>{content.description}</p></div><Button {...content.link} /></div></Section>;
}
````

## src/components/sections/FAQ.tsx

````tsx
import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
export function FAQ({ content }: { content: MarketingPage['faq'] }) {
  if (!content.items.length) return null;
  return <Section id="faq" className="faq-section" labelledBy="faq-heading"><div className="faq-grid"><div><p className="eyebrow">Common questions</p><h2 id="faq-heading" className="section-heading">{content.heading}</h2></div><div>{content.items.map((item, index) => <details className="faq-item" key={`${item.question}-${index}`}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></Section>;
}
````

## src/components/sections/FeatureGrid.tsx

````tsx
import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
export function FeatureGrid({ content }: { content: MarketingPage['features'] }) {
  if (!content.items.length) return null;
  return <Section id="features" labelledBy="features-heading"><p className="eyebrow">The building blocks</p><h2 id="features-heading" className="section-heading">{content.heading}</h2><div className="feature-grid">{content.items.map((item, index) => <article className="feature-card" key={`${item.title}-${index}`}><span className="feature-number" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Section>;
}
````

## src/components/sections/Hero.tsx

````tsx
import Image from 'next/image';
import type { MarketingPage } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero({ content }: { content: MarketingPage['hero'] }) {
  return <section className="hero" aria-labelledby="hero-heading"><Container className={`hero-grid ${!content.image ? 'hero-text-only' : ''}`}><div>
    <p className="eyebrow"><span className="status-dot" aria-hidden="true" />{content.eyebrow}</p>
    <h1 id="hero-heading">{content.heading}</h1><p className="hero-description">{content.description}</p>
    <div className="button-row"><Button {...content.primaryCta} />{content.secondaryCta && <Button {...content.secondaryCta} variant="secondary" />}</div>
  </div>{content.image && <div className="hero-art"><Image src={content.image.url} alt={content.image.alt} width={content.image.width} height={content.image.height} sizes="(max-width: 800px) 100vw, 50vw" preload unoptimized={content.image.url.startsWith('/react-assets/') && content.image.url.endsWith('.svg')} /></div>}</Container></section>;
}
````

## src/components/sections/MarketingPage.tsx

````tsx
import type { MarketingPage as MarketingPageData } from '@/lib/content/types';
import { Hero } from './Hero';
import { FeatureGrid } from './FeatureGrid';
import { FAQ } from './FAQ';
import { CTASection } from './CTASection';
import { Section } from '@/components/ui/Section';

export function MarketingPage({ page }: { page: MarketingPageData }) {
  return <><Hero content={page.hero} /><FeatureGrid content={page.features} />
    {page.testimonials.length > 0 && <Section labelledBy="testimonials-heading"><h2 id="testimonials-heading">What people say</h2><div className="feature-grid">{page.testimonials.map((item, index) => <figure className="feature-card" key={index}><blockquote><p>{item.quote}</p></blockquote><figcaption>{item.name} · {item.role}</figcaption></figure>)}</div></Section>}
    <FAQ content={page.faq} /><CTASection content={page.cta} /></>;
}
````

## src/components/ui/Button.tsx

````tsx
import type { LinkItem } from '@/lib/content/types';
export function Button({ label, href, variant = 'primary' }: LinkItem & { variant?: 'primary' | 'secondary' }) {
  // Ordinary anchors work across both WordPress and Next.js ownership boundaries.
  return <a className={`button button-${variant}`} href={href}>{label}<span aria-hidden="true"> ↗</span></a>;
}
````

## src/components/ui/Container.tsx

````tsx
import type { ReactNode } from 'react';
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}
````

## src/components/ui/Section.tsx

````tsx
import type { ReactNode } from 'react';
import { Container } from './Container';
export function Section({ children, id, className = '', labelledBy }: { children: ReactNode; id?: string; className?: string; labelledBy?: string }) {
  return <section id={id} className={`section ${className}`} aria-labelledby={labelledBy}><Container>{children}</Container></section>;
}
````

## src/config/routes.ts

````ts
// This is the APPLICATION allowlist. The hosting router needs a matching allowlist.
// Nothing in this file changes trackier.com or its web server.
export type ReactRoute = { path: string; slug: string };
export const reactRoutes: readonly ReactRoute[] = [
  { path: '/react-demo/', slug: 'react-demo' },
  { path: '/react-demo/reuse/', slug: 'reuse-demo' },
];

export function findReactRoute(path: string): ReactRoute | undefined {
  return reactRoutes.find((route) => route.path === path);
}

export function pathFromSegments(segments: string[]): string {
  return `/${segments.join('/')}/`;
}
````

## src/config/site.ts

````ts
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
````

## src/lib/content/index.ts

````ts
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
````

## src/lib/content/mock.ts

````ts
import type { MarketingPage, SiteSettings } from './types';

// SAMPLE CONTENT ONLY. No real company claims, testimonials, or API responses.
export const mockSite: SiteSettings = {
  name: 'Trackier · demo',
  navigation: [
    { label: 'Explore the starter', href: '/react-demo/', children: [
      { label: 'Marketing template', href: '/react-demo/' },
      { label: 'Another page', href: '/react-demo/reuse/' },
    ] },
    { label: 'Common questions', href: '/react-demo/#faq' },
    { label: 'WordPress blog ↗', href: 'https://trackier.com/blog/' },
  ],
  headerCta: { label: 'See page reuse', href: '/react-demo/reuse/' },
  footer: {
    description: 'A local demonstration of a shared website foundation. Replace this copy with approved content before launch.',
    columns: [
      { title: 'Sample pages', links: [{ label: 'Marketing template', href: '/react-demo/' }, { label: 'Reused template', href: '/react-demo/reuse/' }] },
      { title: 'Explore', links: [{ label: 'Questions', href: '/react-demo/#faq' }, { label: 'Live WordPress blog ↗', href: 'https://trackier.com/blog/' }] },
    ],
    socialLinks: [],
    copyright: 'Demonstration content — not the live Trackier website.',
  },
};

const demo: MarketingPage = {
  slug: 'react-demo', title: 'Marketing template · sample', modified: '2026-09-30T00:00:00Z',
  seo: { title: 'Marketing page starter | Local demonstration', description: 'Sample content showing a reusable marketing page powered by structured WordPress content.', noIndex: true },
  hero: {
    eyebrow: 'A foundation for what comes next',
    heading: 'One website.\nRoom to grow.',
    description: 'Keep publishing in WordPress. Build selected experiences with reusable React components. This demonstration shows how the pieces fit together.',
    primaryCta: { label: 'Explore a second page', href: '/react-demo/reuse/' },
    secondaryCta: { label: 'How this works', href: '#features' },
    image: { url: '/react-assets/foundation.svg', alt: 'WordPress content feeds reusable page sections inside a shared website layout.', width: 680, height: 500 },
  },
  features: { heading: 'A few building blocks. Many possibilities.', items: [
    { title: 'Content in one place', description: 'Headings, links, images, and page sections are supplied by WordPress or the explicit local sample data.' },
    { title: 'A familiar experience', description: 'Every React page uses the same header, footer, spacing, colors, and accessible components.' },
    { title: 'Grow one page at a time', description: 'Only deliberately assigned URLs use this frontend. Existing WordPress pages keep their own routes.' },
  ] },
  testimonials: [],
  faq: { heading: 'A clear starting point.', items: [
    { question: 'Is this the live Trackier website?', answer: 'No. This is sample content in a local starter. It does not change the live site or make claims about the company.' },
    { question: 'Where will the page content come from?', answer: 'In WordPress mode, the server requests published structured fields from the accompanying WordPress integration plugin.' },
    { question: 'Can the existing website stay online?', answer: 'Yes. Your web server can send only an explicit list of selected paths to this application, leaving other paths with WordPress.' },
  ] },
  cta: { heading: 'The next page starts here.', description: 'See the same layout and sections with different sample content.', link: { label: 'View the second example', href: '/react-demo/reuse/' } },
};

export const mockPages: Record<string, MarketingPage> = {
  'react-demo': demo,
  'reuse-demo': {
    ...demo, slug: 'reuse-demo', title: 'Reusable sections · sample',
    seo: { title: 'A second page | Local demonstration', description: 'A second sample page built with the same React layout and reusable sections.', noIndex: true },
    hero: { ...demo.hero, eyebrow: 'Same foundation. A new page.', heading: 'Create once.\nBuild on it.', description: 'This page reuses the marketing template, shared navigation, and footer. Only the content changes.', primaryCta: { label: 'Back to the first example', href: '/react-demo/' } },
    features: { heading: 'Reuse the parts that already work.', items: [
      { title: 'A shared layout', description: 'Header and footer changes are made once in React and appear on both pages.' },
      { title: 'Typed content', description: 'A clear data contract tells WordPress and React which fields each page needs.' },
      { title: 'Small interactive features', description: 'Add a calculator or form in its own feature folder when the page needs one.' },
    ] },
    cta: { heading: 'Make the foundation your own.', description: 'Replace the sample copy, connect staging WordPress, and verify the shared design before launch.', link: { label: 'Return to the starter', href: '/react-demo/' } },
  },
};
````

## src/lib/content/schema.ts

````ts
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
````

## src/lib/content/types.ts

````ts
import type { z } from 'zod';
import type { imageSchema, linkSchema, pageSchema, siteSchema } from './schema';

export type LinkItem = z.infer<typeof linkSchema>;
export type ImageAsset = z.infer<typeof imageSchema>;
export type SiteSettings = z.infer<typeof siteSchema>;
export type MarketingPage = z.infer<typeof pageSchema>;
````

## src/lib/seo.ts

````ts
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
````

## src/lib/wordpress/client.ts

````ts
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
````

## src/styles/globals.css

````css
@import './tokens.css';

* { box-sizing: border-box; }
html { scroll-padding-top: 7rem; }
body { margin: 0; color: var(--color-ink); background: var(--color-white); font-family: var(--font-body); line-height: 1.65; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-underline-offset: .2em; }
button, input { font: inherit; }
button, summary { cursor: pointer; }
button { color: inherit; }
img { max-width: 100%; height: auto; }
h1, h2, h3, p { margin-top: 0; }
h1, h2, h3 { line-height: 1.12; letter-spacing: -.035em; }
h1 { font-size: clamp(2.7rem, 5.5vw, 4.7rem); margin-bottom: 1.4rem; white-space: pre-line; }
h2 { font-size: clamp(2rem, 3.5vw, 2.85rem); }
h3 { font-size: 1.35rem; }
:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 5px; border-radius: 3px; }
[hidden] { display: none !important; }
.container { width: min(var(--content-width), calc(100% - 3rem)); margin-inline: auto; }
.skip-link { position: fixed; left: 1rem; top: -8rem; padding: .75rem 1.25rem; background: white; z-index: 100; }
.skip-link:focus { top: 1rem; }
.demo-banner { padding: .5rem 1rem; text-align: center; font-size: .7rem; letter-spacing: .075em; font-weight: 700; background: var(--color-brand-soft); color: #46298e; }
.site-header { position: sticky; top: 0; z-index: 20; background: rgb(255 255 255 / 98%); border-bottom: 1px solid var(--color-border); }
.header-inner { min-height: 86px; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.brand { display: inline-flex; align-items: center; gap: .6rem; font-weight: 800; font-size: 1.15rem; text-decoration: none; white-space: nowrap; }
.brand-mark { display: grid; place-items: center; width: 33px; height: 33px; color: white; background: var(--color-brand); border-radius: 10px; font-size: 1.5rem; }
.brand-logo { max-width: 180px; max-height: 52px; width: auto; }
.main-nav { display: flex; align-items: center; gap: 1.75rem; font-size: .86rem; font-weight: 600; }
.nav-list, .dropdown, .site-footer ul { list-style: none; padding: 0; margin: 0; }
.nav-list { display: flex; gap: 1.25rem; }
.nav-item { position: relative; }
.nav-item-heading { display: flex; align-items: center; }
.nav-item-heading > a { padding-block: .7rem; text-decoration: none; }
.nav-item a:hover, .site-footer a:hover { color: var(--color-brand); text-decoration: underline; }
.dropdown-toggle { border: 0; background: transparent; min-width: 36px; min-height: 44px; font-size: 1.1rem; }
.dropdown { position: absolute; top: 100%; left: 0; min-width: 230px; padding: .5rem; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow); }
.dropdown a { display: block; padding: .75rem; text-decoration: none; }
.nav-toggle { display: none; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: .6rem; min-height: 48px; padding: .8rem 1.2rem; border: 1px solid transparent; border-radius: 8px; font-size: .9rem; font-weight: 700; line-height: 1.4; text-decoration: none; text-align: center; }
.button-primary { color: white; background: var(--color-brand); }
.button-primary:hover { background: var(--color-brand-hover); }
.button-secondary { border-color: var(--color-border); background: white; }
.button-secondary:hover { background: var(--color-surface); }
.button-row { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
.hero { padding: 5.75rem 0 5rem; background: linear-gradient(145deg, white 30%, #faf8ff); }
.hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 3rem; align-items: center; }
.hero-text-only { grid-template-columns: 1fr; max-width: 850px; }
.hero-description { color: var(--color-muted); font-size: 1.08rem; max-width: 520px; }
.eyebrow { text-transform: uppercase; font-size: .7rem; font-weight: 700; letter-spacing: .11em; color: var(--color-brand); margin-bottom: 1.3rem; display: flex; align-items: center; gap: .6rem; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-accent); }
.hero-art { padding: .6rem; border-radius: 28px; background: #f0ecfa; box-shadow: var(--shadow); }
.hero-art img { display: block; border-radius: 20px; }
.section { padding-block: var(--space-6); }
.section-heading { max-width: 670px; margin-bottom: 2.6rem; }
.feature-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
.feature-card { margin: 0; padding: 2rem; border: 1px solid var(--color-border); border-radius: var(--radius); }
.feature-card p { color: var(--color-muted); margin-bottom: 0; font-size: .95rem; }
.feature-number { display: inline-block; color: var(--color-brand); background: var(--color-brand-soft); padding: .4rem .65rem; border-radius: 8px; margin-bottom: 1.6rem; font-weight: 700; font-size: .8rem; }
.feature-card blockquote { margin: 0 0 1.5rem; }
.faq-section { background: var(--color-surface); }
.faq-grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: 5rem; }
.faq-item { border-bottom: 1px solid #d7dae5; padding-block: 1.35rem; }
.faq-item:first-child { padding-top: 0; }
.faq-item summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-weight: 700; list-style: none; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary span { color: var(--color-brand); font-size: 1.3rem; }
.faq-item[open] summary span { transform: rotate(45deg); }
.faq-item p { color: var(--color-muted); margin: 1rem 0 0; font-size: .95rem; }
.cta-panel { display: flex; align-items: center; justify-content: space-between; gap: 3rem; padding: 3.5rem; border-radius: 24px; background: var(--color-brand-soft); }
.cta-panel h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
.cta-panel p:not(.eyebrow) { color: var(--color-muted); margin: 0; max-width: 580px; }
.cta-panel > .button { flex-shrink: 0; }
.site-footer { padding: 4rem 0 1.5rem; border-top: 1px solid var(--color-border); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; }
.footer-description { color: var(--color-muted); max-width: 370px; margin-top: 1rem; font-size: .9rem; }
.footer-title { font-size: .9rem; letter-spacing: 0; margin: .3rem 0 1rem; }
.site-footer li { margin-bottom: .6rem; font-size: .88rem; color: var(--color-muted); }
.site-footer li a { text-decoration: none; display: inline-block; padding-block: .25rem; }
.footer-bottom { border-top: 1px solid var(--color-border); margin-top: 2.5rem; padding-top: 1.5rem; display: flex; justify-content: space-between; gap: 1rem; color: var(--color-muted); font-size: .76rem; }
.footer-bottom p { margin: 0; }
.social-links { display: flex; gap: 1rem; }
.status-page { min-height: 50vh; max-width: 850px; margin-inline: auto; padding: 5rem 1.5rem; }
.status-page h1 { font-size: 2.5rem; }
@media (max-width: 1050px) and (min-width: 801px) { .header-inner { gap: 1rem; } .main-nav { gap: .75rem; font-size: .78rem; } .nav-list { gap: .5rem; } .main-nav > .button { padding: .65rem; font-size: .78rem; } }
@media (max-width: 800px) {
  .container { width: min(var(--content-width), calc(100% - 2rem)); }
  .header-inner { min-height: 72px; flex-wrap: wrap; gap: 0; }
  .nav-toggle { display: block; border: 1px solid var(--color-border); border-radius: 8px; padding: .6rem .8rem; background: white; min-height: 44px; }
  .main-nav { display: none; flex-basis: 100%; padding: 1rem 0 1.5rem; max-height: 70dvh; overflow-y: auto; }
  .main-nav.is-open { display: block; }
  .nav-list { display: block; margin-bottom: 1rem; }
  .nav-item-heading { justify-content: space-between; }
  .dropdown { position: static; min-width: 0; box-shadow: none; margin-block: .4rem; }
  .hero { padding: 3.5rem 0; }
  .hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .hero-description { max-width: none; }
  .hero-art { max-width: 560px; }
  .section { padding-block: 3.5rem; }
  .feature-grid, .faq-grid { grid-template-columns: 1fr; gap: 1rem; }
  .section-heading { margin-bottom: 1.7rem; }
  .faq-item:first-child { padding-top: 1rem; }
  .cta-panel { padding: 2rem; flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .footer-grid > div { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
````

## src/styles/tokens.css

````css
:root {
  --color-ink: #202332;
  --color-muted: #596172;
  --color-brand: #5937c8;
  --color-brand-hover: #4527a3;
  --color-brand-soft: #f0ecfd;
  --color-accent: #087768;
  --color-border: #e3e5ed;
  --color-surface: #f7f8fc;
  --color-white: #fff;
  --font-body: Arial, Helvetica, sans-serif;
  --content-width: 1180px;
  --radius: 20px;
  --space-1: .5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 5rem;
  --shadow: 0 20px 60px rgb(29 25 55 / 7%);
  /* Breakpoint contract: 800px. CSS media queries cannot use var(). */
}
````

## public/react-assets/foundation.svg

````xml
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="500" viewBox="0 0 680 500" fill="none">
  <rect width="680" height="500" rx="24" fill="#F9F7FF"/>
  <circle cx="580" cy="62" r="100" fill="#EAE4FB"/>
  <circle cx="65" cy="455" r="120" fill="#E3F1EC"/>
  <rect x="67" y="46" width="546" height="410" rx="16" fill="white" stroke="#DDD8EB"/>
  <path d="M67 95H613" stroke="#E4DFEF"/>
  <circle cx="91" cy="71" r="5" fill="#C5B3EE"/><circle cx="109" cy="71" r="5" fill="#DAD0F1"/><circle cx="127" cy="71" r="5" fill="#E8E2F4"/>
  <text x="164" y="76" font-family="Arial, sans-serif" font-size="12" fill="#687084">SHARED WEBSITE LAYOUT</text>
  <rect x="99" y="123" width="482" height="53" rx="9" fill="#F0ECFD"/>
  <text x="124" y="155" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#5937C8">Header &amp; navigation</text>
  <rect x="99" y="197" width="290" height="167" rx="9" fill="#F7F8FC"/>
  <rect x="123" y="224" width="56" height="8" rx="4" fill="#087768"/>
  <rect x="123" y="249" width="218" height="14" rx="4" fill="#443466"/>
  <rect x="123" y="273" width="169" height="14" rx="4" fill="#443466"/>
  <rect x="123" y="301" width="198" height="6" rx="3" fill="#B9B5C7"/>
  <rect x="123" y="324" width="92" height="20" rx="5" fill="#5937C8"/>
  <rect x="409" y="197" width="172" height="167" rx="9" fill="#E5F3EE"/>
  <rect x="433" y="223" width="124" height="57" rx="8" fill="white"/>
  <text x="448" y="248" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#205C50">WordPress</text>
  <text x="448" y="266" font-family="Arial, sans-serif" font-size="11" fill="#48786E">Your content</text>
  <path d="M495 291V313M489 307L495 314L501 307" stroke="#087768" stroke-width="2" stroke-linecap="round"/>
  <text x="439" y="341" font-family="Arial, sans-serif" font-size="12" fill="#205C50">Reusable sections</text>
  <rect x="99" y="385" width="482" height="39" rx="9" fill="#F0ECFD"/>
  <text x="124" y="410" font-family="Arial, sans-serif" font-size="13" fill="#5937C8">Footer &amp; shared links</text>
</svg>
````

## wordpress/examples/page.json

````json
{
  "seo": {
    "title": "Marketing page starter | Local demonstration",
    "description": "Sample content showing a reusable marketing page powered by structured WordPress content.",
    "noIndex": true
  },
  "hero": {
    "eyebrow": "A foundation for what comes next",
    "heading": "One website.\nRoom to grow.",
    "description": "Keep publishing in WordPress. Build selected experiences with reusable React components. This demonstration shows how the pieces fit together.",
    "primaryCta": {
      "label": "Explore a second page",
      "href": "/react-demo/reuse/"
    },
    "secondaryCta": {
      "label": "How this works",
      "href": "#features"
    },
    "image": {
      "url": "/react-assets/foundation.svg",
      "alt": "WordPress content feeds reusable page sections inside a shared website layout.",
      "width": 680,
      "height": 500
    }
  },
  "features": {
    "heading": "A few building blocks. Many possibilities.",
    "items": [
      {
        "title": "Content in one place",
        "description": "Headings, links, images, and page sections are supplied by WordPress or the explicit local sample data."
      },
      {
        "title": "A familiar experience",
        "description": "Every React page uses the same header, footer, spacing, colors, and accessible components."
      },
      {
        "title": "Grow one page at a time",
        "description": "Only deliberately assigned URLs use this frontend. Existing WordPress pages keep their own routes."
      }
    ]
  },
  "testimonials": [],
  "faq": {
    "heading": "A clear starting point.",
    "items": [
      {
        "question": "Is this the live Trackier website?",
        "answer": "No. This is sample content in a local starter. It does not change the live site or make claims about the company."
      },
      {
        "question": "Where will the page content come from?",
        "answer": "In WordPress mode, the server requests published structured fields from the accompanying WordPress integration plugin."
      },
      {
        "question": "Can the existing website stay online?",
        "answer": "Yes. Your web server can send only an explicit list of selected paths to this application, leaving other paths with WordPress."
      }
    ]
  },
  "cta": {
    "heading": "The next page starts here.",
    "description": "See the same layout and sections with different sample content.",
    "link": {
      "label": "View the second example",
      "href": "/react-demo/reuse/"
    }
  }
}
````

## wordpress/examples/reuse-page.json

````json
{
  "seo": {
    "title": "A second page | Local demonstration",
    "description": "A second sample page built with the same React layout and reusable sections.",
    "noIndex": true
  },
  "hero": {
    "eyebrow": "Same foundation. A new page.",
    "heading": "Create once.\nBuild on it.",
    "description": "This page reuses the marketing template, shared navigation, and footer. Only the content changes.",
    "primaryCta": {
      "label": "Back to the first example",
      "href": "/react-demo/"
    },
    "secondaryCta": {
      "label": "How this works",
      "href": "#features"
    },
    "image": {
      "url": "/react-assets/foundation.svg",
      "alt": "WordPress content feeds reusable page sections inside a shared website layout.",
      "width": 680,
      "height": 500
    }
  },
  "features": {
    "heading": "Reuse the parts that already work.",
    "items": [
      {
        "title": "A shared layout",
        "description": "Header and footer changes are made once in React and appear on both pages."
      },
      {
        "title": "Typed content",
        "description": "A clear data contract tells WordPress and React which fields each page needs."
      },
      {
        "title": "Small interactive features",
        "description": "Add a calculator or form in its own feature folder when the page needs one."
      }
    ]
  },
  "testimonials": [],
  "faq": {
    "heading": "A clear starting point.",
    "items": [
      {
        "question": "Is this the live Trackier website?",
        "answer": "No. This is sample content in a local starter. It does not change the live site or make claims about the company."
      },
      {
        "question": "Where will the page content come from?",
        "answer": "In WordPress mode, the server requests published structured fields from the accompanying WordPress integration plugin."
      },
      {
        "question": "Can the existing website stay online?",
        "answer": "Yes. Your web server can send only an explicit list of selected paths to this application, leaving other paths with WordPress."
      }
    ]
  },
  "cta": {
    "heading": "Make the foundation your own.",
    "description": "Replace the sample copy, connect staging WordPress, and verify the shared design before launch.",
    "link": {
      "label": "Return to the starter",
      "href": "/react-demo/"
    }
  }
}
````

## wordpress/examples/sample-api-response.json

````json
{
  "slug": "react-demo",
  "title": "Marketing template · sample",
  "modified": "2026-09-30T00:00:00Z",
  "seo": {
    "title": "Marketing page starter | Local demonstration",
    "description": "Sample content showing a reusable marketing page powered by structured WordPress content.",
    "noIndex": true
  },
  "hero": {
    "eyebrow": "A foundation for what comes next",
    "heading": "One website.\nRoom to grow.",
    "description": "Keep publishing in WordPress. Build selected experiences with reusable React components. This demonstration shows how the pieces fit together.",
    "primaryCta": {
      "label": "Explore a second page",
      "href": "/react-demo/reuse/"
    },
    "secondaryCta": {
      "label": "How this works",
      "href": "#features"
    },
    "image": {
      "url": "/react-assets/foundation.svg",
      "alt": "WordPress content feeds reusable page sections inside a shared website layout.",
      "width": 680,
      "height": 500
    }
  },
  "features": {
    "heading": "A few building blocks. Many possibilities.",
    "items": [
      {
        "title": "Content in one place",
        "description": "Headings, links, images, and page sections are supplied by WordPress or the explicit local sample data."
      },
      {
        "title": "A familiar experience",
        "description": "Every React page uses the same header, footer, spacing, colors, and accessible components."
      },
      {
        "title": "Grow one page at a time",
        "description": "Only deliberately assigned URLs use this frontend. Existing WordPress pages keep their own routes."
      }
    ]
  },
  "testimonials": [],
  "faq": {
    "heading": "A clear starting point.",
    "items": [
      {
        "question": "Is this the live Trackier website?",
        "answer": "No. This is sample content in a local starter. It does not change the live site or make claims about the company."
      },
      {
        "question": "Where will the page content come from?",
        "answer": "In WordPress mode, the server requests published structured fields from the accompanying WordPress integration plugin."
      },
      {
        "question": "Can the existing website stay online?",
        "answer": "Yes. Your web server can send only an explicit list of selected paths to this application, leaving other paths with WordPress."
      }
    ]
  },
  "cta": {
    "heading": "The next page starts here.",
    "description": "See the same layout and sections with different sample content.",
    "link": {
      "label": "View the second example",
      "href": "/react-demo/reuse/"
    }
  }
}
````

## wordpress/examples/site.json

````json
{
  "name": "Trackier · demo",
  "navigation": [
    {
      "label": "Explore the starter",
      "href": "/react-demo/",
      "children": [
        {
          "label": "Marketing template",
          "href": "/react-demo/"
        },
        {
          "label": "Another page",
          "href": "/react-demo/reuse/"
        }
      ]
    },
    {
      "label": "Common questions",
      "href": "/react-demo/#faq"
    },
    {
      "label": "WordPress blog ↗",
      "href": "https://trackier.com/blog/"
    }
  ],
  "headerCta": {
    "label": "See page reuse",
    "href": "/react-demo/reuse/"
  },
  "footer": {
    "description": "A local demonstration of a shared website foundation. Replace this copy with approved content before launch.",
    "columns": [
      {
        "title": "Sample pages",
        "links": [
          {
            "label": "Marketing template",
            "href": "/react-demo/"
          },
          {
            "label": "Reused template",
            "href": "/react-demo/reuse/"
          }
        ]
      },
      {
        "title": "Explore",
        "links": [
          {
            "label": "Questions",
            "href": "/react-demo/#faq"
          },
          {
            "label": "Live WordPress blog ↗",
            "href": "https://trackier.com/blog/"
          }
        ]
      }
    ],
    "socialLinks": [],
    "copyright": "Demonstration content — not the live Trackier website."
  }
}
````

## wordpress/trackier-react-content/trackier-react-content.php

````php
<?php
/**
 * Plugin Name: Trackier React Content Starter
 * Description: Structured published content and shared navigation for an incremental React frontend. Install on staging first.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */
defined('ABSPATH') || exit;

function trf_link_shape() { return ['label' => 'text', 'href' => 'href']; }
function trf_image_shape() { return ['url' => 'image-url', 'alt' => 'alt', 'width' => 'integer', 'height' => 'integer']; }
function trf_list($shape, $max) { return ['_list' => $shape, '_max' => $max]; }
function trf_page_shape() {
    return [
        'seo' => ['title' => 'text', 'description' => 'text', 'image?' => trf_image_shape(), 'noIndex' => 'boolean'],
        'hero' => ['eyebrow' => 'text', 'heading' => 'text', 'description' => 'text', 'primaryCta' => trf_link_shape(), 'secondaryCta?' => trf_link_shape(), 'image?' => trf_image_shape()],
        'features' => ['heading' => 'text', 'items' => trf_list(['title' => 'text', 'description' => 'text'], 12)],
        'testimonials' => trf_list(['quote' => 'text', 'name' => 'text', 'role' => 'text'], 12),
        'faq' => ['heading' => 'text', 'items' => trf_list(['question' => 'text', 'answer' => 'text'], 30)],
        'cta' => ['heading' => 'text', 'description' => 'text', 'link' => trf_link_shape()],
    ];
}
function trf_site_shape() {
    return [
        'name' => 'text', 'logo?' => trf_image_shape(),
        'navigation' => trf_list(array_merge(trf_link_shape(), ['children?' => trf_list(trf_link_shape(), 30)]), 20),
        'headerCta' => trf_link_shape(),
        'footer' => ['description' => 'text', 'columns' => trf_list(['title' => 'text', 'links' => trf_list(trf_link_shape(), 30)], 6), 'socialLinks' => trf_list(trf_link_shape(), 10), 'copyright' => 'text'],
    ];
}

// A small, strict contract validator. Unknown keys are omitted; text is plain text.
function trf_clean($value, $shape, $path = 'content') {
    $fail = static function () use ($path) { throw new InvalidArgumentException('Invalid or missing field: ' . $path); };
    if (is_array($shape)) {
        if (!is_array($value)) { $fail(); }
        if (array_key_exists('_list', $shape)) {
            if (array_values($value) !== $value || count($value) > $shape['_max']) { $fail(); }
            $out = [];
            foreach ($value as $index => $item) { $out[] = trf_clean($item, $shape['_list'], $path . '.' . $index); }
            return $out;
        }
        $out = [];
        foreach ($shape as $raw_key => $child) {
            $optional = str_ends_with($raw_key, '?');
            $key = rtrim($raw_key, '?');
            if (!array_key_exists($key, $value)) {
                if ($optional) { continue; }
                throw new InvalidArgumentException('Missing field: ' . $path . '.' . $key);
            }
            $out[$key] = trf_clean($value[$key], $child, $path . '.' . $key);
        }
        return $out;
    }
    if ($shape === 'boolean') { if (!is_bool($value)) { $fail(); } return $value; }
    if ($shape === 'integer') { if (!is_int($value) || $value < 1 || $value > 20000) { $fail(); } return $value; }
    if (!is_string($value) || strlen($value) > 10000) { $fail(); }
    if ($shape === 'text' || $shape === 'alt') {
        $value = trim(wp_strip_all_tags($value));
        if (($shape === 'text' && $value === '') || ($shape === 'alt' && strlen($value) > 1000)) { $fail(); }
        return $value;
    }
    if (strlen($value) > 2048 || preg_match('/[\s\\\\\x00-\x1f\x7f]/', $value)) { $fail(); }
    if ($shape === 'href' && (preg_match('~^/(?!/)~', $value) || preg_match('/^#[A-Za-z][\w-]*$/', $value) || preg_match('/^(mailto:|tel:)[^:]+$/i', $value))) { return $value; }
    if ($shape === 'image-url' && preg_match('~^/react-assets/[\w./-]+$~', $value) && !str_contains($value, '..')) { return $value; }
    $url = wp_parse_url($value);
    if (!$url || ($url['scheme'] ?? '') !== 'https' || empty($url['host']) || isset($url['user']) || isset($url['pass'])) { $fail(); }
    if ($shape === 'image-url' && preg_match('/\.svg$/i', $url['path'] ?? '')) { $fail(); }
    return esc_url_raw($value, ['https']);
}

function trf_parse_json($raw, $shape) {
    if (!is_string($raw) || strlen($raw) > 100000) { throw new InvalidArgumentException('JSON must be text under 100 KB.'); }
    return trf_clean(json_decode($raw, true, 32, JSON_THROW_ON_ERROR), $shape);
}
function trf_notice($message) { set_transient('trf_notice_' . get_current_user_id(), $message, 120); }
add_action('admin_notices', function () {
    $key = 'trf_notice_' . get_current_user_id();
    $message = get_transient($key);
    if ($message) { echo '<div class="notice notice-error"><p>' . esc_html($message) . '</p></div>'; delete_transient($key); }
});

add_action('init', function () {
    register_post_type('trackier_react', [
        'labels' => ['name' => 'React Pages', 'singular_name' => 'React Page'],
        'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
        'show_ui' => true, 'show_in_rest' => false, 'show_in_nav_menus' => false,
        'rewrite' => false, 'query_var' => false, 'has_archive' => false,
        'supports' => ['title'], 'capability_type' => 'page', 'map_meta_cap' => true,
        'menu_icon' => 'dashicons-layout',
    ]);
    register_nav_menus(['trackier_primary' => 'Trackier shared primary navigation', 'trackier_footer' => 'Trackier shared first footer column']);
});

add_action('add_meta_boxes_trackier_react', function ($post) {
    add_meta_box('slugdiv', 'Content key (slug)', 'post_slug_meta_box', 'trackier_react', 'side');
    add_meta_box('trf_content', 'Structured page content (JSON)', function ($post) {
        wp_nonce_field('trf_save_content', 'trf_nonce');
        $content = get_post_meta($post->ID, '_trf_content', true);
        echo '<p>Paste a page payload from wordpress/examples/page.json. Use plain text. Slug uses lowercase letters, numbers and hyphens. No draft preview is implemented.</p>';
        echo '<p>Keep a backup before edits. This initial JSON editor does not provide content revisions or autosave.</p>';
        echo '<label class="screen-reader-text" for="trf_json">Page content JSON</label><textarea id="trf_json" name="trf_json" rows="28" style="width:100%;font-family:monospace">' . esc_textarea($content ? wp_json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '') . '</textarea>';
    }, 'trackier_react', 'normal', 'high');
});

// Never publish a first invalid payload. An invalid edit retains the previous payload.
add_filter('wp_insert_post_data', function ($data, $postarr) {
    if (($data['post_type'] ?? '') !== 'trackier_react' || !isset($_POST['trf_json'], $_POST['trf_nonce'])) { return $data; }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['trf_nonce'])), 'trf_save_content') || !current_user_can('edit_pages')) { return $data; }
    try { trf_parse_json(wp_unslash($_POST['trf_json']), trf_page_shape()); }
    catch (Throwable $e) {
        if (empty($postarr['ID']) || !get_post_meta($postarr['ID'], '_trf_content', true)) { $data['post_status'] = 'draft'; }
        trf_notice('React content was not saved: ' . $e->getMessage() . '. Previous valid content is unchanged; title/status may have changed.');
    }
    return $data;
}, 10, 2);

add_action('save_post_trackier_react', function ($post_id) {
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) { return; }
    if (!isset($_POST['trf_nonce'], $_POST['trf_json']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['trf_nonce'])), 'trf_save_content')) { return; }
    try { update_post_meta($post_id, '_trf_content', trf_parse_json(wp_unslash($_POST['trf_json']), trf_page_shape())); }
    catch (Throwable $e) { trf_notice('React content was not saved: ' . $e->getMessage() . '. Previous valid content is unchanged.'); }
});

add_action('admin_menu', function () {
    add_options_page('React Site Settings', 'React Site Settings', 'manage_options', 'trf-site', function () {
        if (!current_user_can('manage_options')) { return; }
        if (isset($_POST['trf_site_json'])) {
            check_admin_referer('trf_save_site');
            try {
                update_option('trf_site', trf_parse_json(wp_unslash($_POST['trf_site_json']), trf_site_shape()), false);
                echo '<div class="notice notice-success"><p>Shared site content saved.</p></div>';
            } catch (Throwable $e) { echo '<div class="notice notice-error"><p>' . esc_html($e->getMessage() . '. Previous settings are unchanged.') . '</p></div>'; }
        }
        echo '<div class="wrap"><h1>React Site Settings</h1><p>Start from wordpress/examples/site.json. Assign the shared menu locations to override navigation and the first footer column. Elementor must be configured separately to consume those same menus.</p><form method="post">';
        wp_nonce_field('trf_save_site');
        echo '<label for="trf_site_json">Shared site JSON</label><textarea id="trf_site_json" name="trf_site_json" rows="30" style="width:100%;font-family:monospace">' . esc_textarea(wp_json_encode(get_option('trf_site', new stdClass()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) . '</textarea>';
        submit_button('Save shared content');
        echo '</form></div>';
    });
});

function trf_menu($location, $children = true) {
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) { return null; }
    $items = wp_get_nav_menu_items($locations[$location]) ?: [];
    $out = [];
    foreach ($items as $item) {
        if ($item->menu_item_parent || !empty($item->_invalid)) { continue; }
        $link = ['label' => wp_strip_all_tags($item->title), 'href' => $item->url];
        if ($children) {
            $nested = [];
            foreach ($items as $child) {
                if ((int) $child->menu_item_parent === (int) $item->ID && empty($child->_invalid)) { $nested[] = ['label' => wp_strip_all_tags($child->title), 'href' => $child->url]; }
            }
            if ($nested) { $link['children'] = $nested; }
        }
        $out[] = $link;
    }
    return $out;
}
function trf_response($data) {
    $response = new WP_REST_Response($data, 200);
    // Next.js owns the short public-data cache. Avoid another opaque WP/CDN cache.
    $response->header('Cache-Control', 'no-store');
    $response->header('X-Robots-Tag', 'noindex');
    return $response;
}
add_action('rest_api_init', function () {
    register_rest_route('trackier/v1', '/site', [
        'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true',
        'callback' => function () {
            $site = get_option('trf_site');
            if (!$site) { return new WP_Error('trackier_site_unconfigured', 'Site settings are not configured.', ['status' => 503]); }
            try {
                $primary = trf_menu('trackier_primary');
                $footer = trf_menu('trackier_footer', false);
                if ($primary !== null) { $site['navigation'] = $primary; }
                if ($footer !== null) {
                    if (empty($site['footer']['columns'][0])) { $site['footer']['columns'][0] = ['title' => 'Links', 'links' => []]; }
                    $site['footer']['columns'][0]['links'] = $footer;
                }
                return trf_response(trf_clean($site, trf_site_shape()));
            } catch (Throwable $e) { return new WP_Error('trackier_invalid_site', 'Shared content is invalid. Ask an administrator to review it.', ['status' => 500]); }
        },
    ]);
    register_rest_route('trackier/v1', '/pages/(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)', [
        'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true',
        'callback' => function ($request) {
            $posts = get_posts(['post_type' => 'trackier_react', 'name' => $request['slug'], 'post_status' => 'publish', 'has_password' => false, 'posts_per_page' => 1]);
            if (!$posts) { return new WP_Error('trackier_page_not_found', 'No published React page exists for this slug.', ['status' => 404]); }
            $post = $posts[0];
            try {
                $page = trf_clean(get_post_meta($post->ID, '_trf_content', true), trf_page_shape());
                $page['slug'] = $post->post_name;
                $page['title'] = trf_clean($post->post_title, 'text');
                $page['modified'] = get_post_modified_time('Y-m-d\TH:i:s\Z', true, $post);
                return trf_response($page);
            } catch (Throwable $e) { return new WP_Error('trackier_invalid_page', 'Published page content is invalid. Ask an editor to review it.', ['status' => 500]); }
        },
    ]);
});
````

## tests/content-and-routes.test.ts

````ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { pageSchema, safeHref, siteSchema } from '../src/lib/content/schema';
import { mockPages, mockSite } from '../src/lib/content/mock';
import { findReactRoute, reactRoutes } from '../src/config/routes';

test('sample content satisfies the public contract and makes no testimonial claims', () => {
  siteSchema.parse(mockSite);
  for (const page of Object.values(mockPages)) {
    pageSchema.parse(page);
    assert.equal(page.seo.noIndex, true);
    assert.deepEqual(page.testimonials, []);
  }
});
test('only exact, approved paths belong to React', () => {
  assert.ok(findReactRoute('/react-demo/'));
  for (const path of ['/', '/blog/', '/existing-page/', '/wp-json/', '/wp-admin/', '/react-demo/unknown/', '/partner-program/', '/react-demo//', '/REACT-DEMO/']) assert.equal(findReactRoute(path), undefined, path);
  assert.equal(new Set(reactRoutes.map((route) => route.path)).size, reactRoutes.length);
});
test('unsafe link schemes and ambiguous destinations are rejected', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,test', '//evil.example', '/\\evil.example', 'https://user:password@example.com/', 'https://example.com/\n']) assert.equal(safeHref.safeParse(href).success, false, href);
  for (const href of ['/blog/?source=nav', '#faq', 'https://trackier.com/blog/', 'mailto:hello@example.invalid', 'tel:+123456789']) assert.equal(safeHref.safeParse(href).success, true, href);
});
test('malformed CMS data is rejected instead of filled with fabricated defaults', () => {
  const original = mockPages['react-demo'];
  assert.equal(pageSchema.safeParse({ ...original, hero: { heading: 'Incomplete' } }).success, false);
  assert.equal(pageSchema.safeParse({ ...original, seo: { ...original.seo, noIndex: 'false' } }).success, false);
  assert.equal(pageSchema.safeParse({ ...original, hero: { ...original.hero, image: { url: 'http://localhost/private', width: -1, height: 0, alt: '' } } }).success, false);
  assert.equal(pageSchema.safeParse({ ...original, testimonials: [], hero: { ...original.hero, image: undefined } }).success, true);
});
````

## scripts/export-examples.ts

````ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { mockPages, mockSite } from '../src/lib/content/mock';

mkdirSync('wordpress/examples', { recursive: true });
writeFileSync('wordpress/examples/site.json', JSON.stringify(mockSite, null, 2) + '\n');
for (const [slug, page] of Object.entries(mockPages)) {
  const { title, modified, slug: omittedSlug, ...payload } = page;
  void title; void modified; void omittedSlug;
  writeFileSync(`wordpress/examples/${slug === 'react-demo' ? 'page' : 'reuse-page'}.json`, JSON.stringify(payload, null, 2) + '\n');
}
writeFileSync('wordpress/examples/sample-api-response.json', JSON.stringify(mockPages['react-demo'], null, 2) + '\n');
````

## scripts/smoke.mjs

````js
import assert from 'node:assert/strict';

const base = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
for (const path of ['/react-demo/', '/react-demo/reuse/']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<h1/);
  assert.match(html, /<header/);
  assert.match(html, /<footer/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /noindex/);
}
const missing = await fetch(base + '/not-an-owned-page/');
assert.equal(missing.status, 404);
const slash = await fetch(base + '/react-demo?utm_source=smoke', { redirect: 'manual' });
assert.equal(slash.status, 308);
assert.ok(slash.headers.get('location').endsWith('/react-demo/?utm_source=smoke'));
assert.equal((await fetch(base + '/react-assets/foundation.svg')).status, 200);
const sitemap = await fetch(base + '/react-sitemap.xml');
assert.equal(sitemap.status, 200);
assert.doesNotMatch(await sitemap.text(), /<loc>/);
assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'GET' })).status, 405);
assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'POST' })).status, process.env.REVALIDATE_SECRET ? 401 : 503);
console.log('PASS: server HTML, shared layout, metadata, true 404, slash/query redirect, assets, noindex sitemap, protected refresh endpoint.');
````

## scripts/source-listing.mjs

````js
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';

const roots = ['src', 'public', 'wordpress', 'tests', 'scripts'];
const extensions = { '.ts': 'ts', '.tsx': 'tsx', '.mjs': 'js', '.json': 'json', '.php': 'php', '.css': 'css', '.svg': 'xml' };
const files = ['package.json', '.env.example', '.gitignore', '.nvmrc', '.prettierrc.json', '.prettierignore', '.editorconfig', '.vscode/settings.json', '.vscode/extensions.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.ts'];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) walk(path);
    else if (extname(path) in extensions) files.push(path);
  }
}
roots.forEach(walk);
let output = '# Complete starter source\n\nGenerated snapshot. Every heading below is the exact project-relative file path. These files already exist in the repository and form one runnable project. See README.md for setup and architecture. package-lock.json is provided separately in the repository. Do not copy secrets into this listing. Regenerate from the project root with `npm run docs:source`.\n\n';
for (const file of files) output += `## ${file}\n\n\`\`\`\`${extensions[extname(file)] ?? 'text'}\n${readFileSync(file, 'utf8').trimEnd()}\n\`\`\`\`\n\n`;
mkdirSync('docs', { recursive: true });
writeFileSync('docs/STARTER-SOURCE.md', output.trimEnd() + '\n');
console.log(`Wrote docs/STARTER-SOURCE.md with ${files.length} complete source files.`);
````

## scripts/test-wordpress.mjs

````js
// Tests Next's production integration using a LOCAL fake API; it does not test PHP/WordPress.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const site = JSON.parse(readFileSync('wordpress/examples/site.json', 'utf8'));
const page = JSON.parse(readFileSync('wordpress/examples/sample-api-response.json', 'utf8'));
let pageState = 'ok';
let siteState = 'ok';
let heading = 'Published API integration fixture';
let pageReads = 0;
const api = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  if (request.url.endsWith('/site')) {
    response.statusCode = siteState === 'ok' ? 200 : 503;
    response.end(JSON.stringify(siteState === 'ok' ? site : { code: 'unavailable' }));
  } else {
    pageReads++;
    response.statusCode = pageState === 'ok' || pageState === 'invalid' ? 200 : pageState === 'missing' || pageState === 'wrong-endpoint' ? 404 : 503;
    response.end(JSON.stringify(pageState === 'ok' ? { ...page, hero: { ...page.hero, heading } } : pageState === 'missing' ? { code: 'trackier_page_not_found' } : pageState === 'invalid' ? { incomplete: true } : { code: 'rest_no_route' }));
  }
});
await new Promise((resolve) => api.listen(3981, '127.0.0.1', resolve));
const secret = randomBytes(32).toString('hex');
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3982'], { env: { ...process.env, CONTENT_MODE: 'wordpress', SITE_URL: 'http://localhost:3982', SITE_INDEXABLE: 'false', WP_API_BASE_URL: 'http://127.0.0.1:3981/wp-json/trackier/v1/', WP_REVALIDATE_SECONDS: '300', REVALIDATE_SECRET: secret }, stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
app.stdout.on('data', (data) => { log += data; });
app.stderr.on('data', (data) => { log += data; });
const base = 'http://127.0.0.1:3982';
async function refresh() {
  assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'POST', headers: { Authorization: `Bearer ${secret}` } })).status, 200);
}
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { await fetch(base + '/react-assets/foundation.svg'); ready = true; break; } catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
  }
  assert.ok(ready, log);
  await refresh();
  let response = await fetch(base + '/react-demo/');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Published API integration fixture/);
  const reads = pageReads;
  heading = 'Freshly edited API fixture';
  response = await fetch(base + '/react-demo/');
  assert.match(await response.text(), /Published API integration fixture/);
  assert.equal(pageReads, reads, 'public cache should reuse the API response');
  assert.equal((await fetch(base + '/api/react/revalidate/', { method: 'POST', headers: { Authorization: 'Bearer incorrect' } })).status, 401);
  await refresh();
  response = await fetch(base + '/react-demo/');
  assert.match(await response.text(), /Freshly edited API fixture/);
  for (const [state, status] of [['missing', 404], ['wrong-endpoint', 500], ['outage', 500], ['invalid', 500]]) {
    pageState = state; await refresh();
    response = await fetch(base + '/react-demo/');
    assert.equal(response.status, status, state);
    assert.doesNotMatch(await response.text(), /One website\./, 'must never silently return mock content');
  }
  pageState = 'ok'; siteState = 'outage'; await refresh();
  assert.equal((await fetch(base + '/react-demo/')).status, 500);
  console.log('PASS: WordPress mode, public cache, authenticated refresh, missing content 404, bad endpoint/API/schema failures 500, no mock fallback, shared content failure.');
} catch (error) { console.error(log); throw error; }
finally { app.kill('SIGTERM'); await new Promise((resolve) => api.close(resolve)); }
````
