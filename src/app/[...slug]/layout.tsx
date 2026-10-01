import { connection } from 'next/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSite } from '@/lib/content';
import { getConfig } from '@/config/site';

export default async function DemoLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const site = await getSite();
  const config = getConfig();
  return (
    <>
      {!config.indexable && (
        <div className="demo-banner">
          {config.mode === 'mock'
            ? 'LOCAL DEMONSTRATION · Sample content, not the live Trackier website'
            : 'STAGING PREVIEW · Search indexing is disabled'}
        </div>
      )}
      <Header site={site} />
      <main id="main-content">{children}</main>
      <Footer site={site} />
    </>
  );
}
