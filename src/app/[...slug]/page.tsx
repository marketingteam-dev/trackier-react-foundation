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
