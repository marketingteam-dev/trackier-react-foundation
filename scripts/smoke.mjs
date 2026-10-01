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
