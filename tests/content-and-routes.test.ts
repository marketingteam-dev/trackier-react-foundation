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
