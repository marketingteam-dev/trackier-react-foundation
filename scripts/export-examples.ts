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
