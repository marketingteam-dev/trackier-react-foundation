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
