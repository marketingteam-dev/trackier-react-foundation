# How to add a new React page

Example URL: **`/partner-program/`**. This is an illustration, not permission to replace an existing Trackier URL. Confirm current ownership and redirects first. All copy below is sample copy.

## A. Use the existing marketing template

### 1. Create the WordPress content on staging

In WordPress admin, open **React Pages → Add New**. Enter title “Partner program — sample” and set **Content key (slug)** to `partner-program` (lowercase, no slashes). This is a content lookup key; the frontend registry chooses its public URL. If the slug box is hidden, enable it in Screen Options.

Copy `wordpress/examples/page.json` into the structured content box. Edit the hero heading/description, CTA labels and destinations, feature list, FAQs and bottom CTA. For example, use a neutral heading such as “Partner program page — sample.” Leave testimonials empty until you have approved quotes and permission. Set SEO title/description and leave `seo.noIndex: true` during review. Select approved images from the WordPress media library and supply their public URL, real dimensions, and meaningful alt text. This JSON editor is a starter interface; an editor unfamiliar with JSON should work with a developer until labeled fields are added.

Publish on **protected staging**. A draft is deliberately not available to this starter's API. Previewing draft content needs the authenticated flow described in the main guide; publishing a staging-only draft to test is acceptable only when the staging site itself is access-controlled.

Verify in a browser/API client: `https://YOUR-STAGING-WORDPRESS-ORIGIN/wp-json/trackier/v1/pages/partner-program`. Success is JSON with `slug: "partner-program"`, the requested fields, native title, and modified timestamp. On live WordPress, publishing the custom post makes its public JSON accessible even before the public frontend path is routed. Plan publication timing accordingly.

### 2. Add the app's route mapping

Update `src/config/routes.ts` to include this new entry. Full resulting file for this example:

```ts
export type ReactRoute = { path: string; slug: string };

export const reactRoutes: readonly ReactRoute[] = [
  { path: '/react-demo/', slug: 'react-demo' },
  { path: '/react-demo/reuse/', slug: 'reuse-demo' },
  { path: '/partner-program/', slug: 'partner-program' },
];

export function findReactRoute(path: string): ReactRoute | undefined {
  return reactRoutes.find((route) => route.path === path);
}

export function pathFromSegments(segments: string[]): string {
  return `/${segments.join('/')}/`;
}
```

That is the only React source change required for a new page using this template in WordPress mode. Do not create `src/app/partner-program/page.tsx` for this case and do not duplicate header/footer.

Update the matching ownership test now: in `tests/content-and-routes.test.ts`, remove `/partner-program/` from the unowned-path examples and add an assertion that `findReactRoute('/partner-program/')` exists. Keep unrelated WordPress routes protected. Do this before running the checks in step 5.

`src/app/[...slug]/page.tsx` already performs the lookup, enforces ownership, requests `getPage('partner-program')`, produces metadata, and renders `MarketingPage`. `src/app/layout.tsx` surrounds it with the shared shell. The sitemap reads the same registry, so it can include the page when published and indexable.

### 3. Optional: try it without WordPress

File `src/lib/content/mock.ts` — append this **sample-only** fixture after the existing `mockPages` declaration. This is for `CONTENT_MODE=mock`; production WordPress mode ignores it:

```ts
mockPages['partner-program'] = {
  ...mockPages['react-demo'],
  slug: 'partner-program',
  title: 'Partner program — sample',
  seo: {
    title: 'Partner program — sample',
    description: 'Local sample for learning to add another marketing page.',
    noIndex: true,
  },
  hero: {
    ...mockPages['react-demo'].hero,
    heading: 'Partner program page — sample',
    description: 'Replace this placeholder with approved program information.',
    primaryCta: { label: 'Return to the demonstration', href: '/react-demo/' },
  },
};
```

If you keep the example image/FAQ/features, retain their sample labels. Do not pass them off as program details. No program eligibility, commission rates, benefits, customer metrics, or endorsements have been invented.

### 4. Metadata and navigation

Set the WordPress payload's `seo.title`, `seo.description`, optional `seo.image`, and `seo.noIndex`. Canonical URL comes from `SITE_URL` plus the registry's `/partner-program/`; editors do not enter an arbitrary canonical host. Query strings such as UTM parameters do not change it. Open Graph uses the same approved SEO content.

Add a custom link `/partner-program/` to the shared WordPress menu only when its public path is ready. The custom post type does not have a WordPress frontend permalink, so use the final public path. Synchronize Elementor's menu selection and purge/update each frontend's caches. For initial testing, navigate directly to the URL without adding a public menu item.

### 5. Preview and test

Terminal — project root `/Users/amanchoudhary/Desktop/trackier-React`:

```sh
npm run check
npm run build
npm start
```

Success: tests/type checks pass, build succeeds, production server reports `Ready`. Open `http://localhost:3000/partner-program/`. If an existing server uses the port, stop it first. Verify desktop/mobile layout, header/footer, links, keyboard operation, image loading, title/description, canonical, noindex state and absence of console errors. View Page Source to confirm the heading is in server HTML. An unassigned neighboring URL should remain 404 on Next; a missing WordPress page should return 404 rather than an empty template.

Add the new page to your staging acceptance test list; adapt smoke checks to the configured environment rather than removing meaningful checks. The ownership test should already have been updated in step 2.

### 6. Assign the URL after staging approval

A developer deploys the app version containing the new registry entry. Your hosting operator then adds **exact** rules for `/partner-program` and `/partner-program/` to the front router, preserving query strings and sending Next assets/requests to the same app. Next normalizes the unslashed URL with a permanent redirect. Do not use `/partner*` or a catch-all rewrite.

Before this routing change, WordPress still owns the public path. Afterward, visitors see Next at the same URL. If migrating an existing page, remove duplicate sitemap output and preserve old redirects/query behavior. Publish final approved content, set `SITE_URL=https://trackier.com`, and enable production indexing only after the noindex/SEO checks. Rebuild when changing build-time configuration. Roll back by restoring the previous path ownership and cache state.

### 7. What requires a deployment?

| Task | Editor or developer? | Deploy? |
| --- | --- | --- |
| Edit heading, CTA, features, FAQs, approved testimonials or SEO on an existing route | Editor (with the initial JSON UI's limitations) | No; cached content must refresh |
| Change a shared menu label/destination | Editor / menu administrator | No; both frontend caches may need refresh |
| Create content for a new page using this template | Editor | Content alone: no. New public route: developer app deployment + hosting change |
| Change a published slug | Coordinate editor + developer | Registry and redirects need updating; treat as URL change |
| Add a new section type, template, calculator or form | Developer | Yes; possibly WP schema/plugin update too |

This deliberate registry gate prevents an editor's new page or slug collision from taking over an existing WordPress URL. A future CMS-driven ownership registry could reduce deployments but would need collision checks, reserved paths, authorization and routing synchronization. It is unnecessary initially.

## B. A page needs a new layout or interactive feature

Keep the shared layout. Add new sections under `src/components/sections/` and compose them in a dedicated template component. If it uses existing fields, do not change the API schema merely to reorder sections. If it introduces new content, update the WordPress shape/controls, TypeScript schema, fixtures and relevant tests together, ideally additively so the previous frontend can still read content during rollout.

A tiny example feature can show how client components fit without inventing financial results. File to create: `src/features/calculator/PercentageCalculator.tsx`:

```tsx
'use client';

import { useState } from 'react';

export function PercentageCalculator() {
  const [part, setPart] = useState('25');
  const [total, setTotal] = useState('100');
  const a = Number(part);
  const b = Number(total);
  const valid = part.trim() !== '' && total.trim() !== ''
    && Number.isFinite(a) && Number.isFinite(b) && a >= 0 && b > 0;

  return <section aria-labelledby="percentage-heading">
    <h2 id="percentage-heading">Percentage calculator — sample</h2>
    <p><label>Part <input type="number" min="0" step="any"
      value={part} onChange={(event) => setPart(event.target.value)} /></label></p>
    <p><label>Total <input type="number" min="0" step="any"
      value={total} onChange={(event) => setTotal(event.target.value)} /></label></p>
    <output aria-live="polite">
      {valid ? `${((a / b) * 100).toFixed(1)}%` : 'Enter a nonnegative part and a total greater than zero.'}
    </output>
  </section>;
}
```

This code is a tutorial, not an included production calculator. Specify the actual domain logic and test invalid/zero inputs and expected calculations before adding a real feature. Only this interactive component ships its logic to the browser; the content request remains on the server.

File to create: `src/components/sections/PartnerPage.tsx`:

```tsx
import type { MarketingPage as PageData } from '@/lib/content/types';
import { Hero } from './Hero';
import { FeatureGrid } from './FeatureGrid';
import { FAQ } from './FAQ';
import { CTASection } from './CTASection';
import { Section } from '@/components/ui/Section';
import { PercentageCalculator } from '@/features/calculator/PercentageCalculator';

export function PartnerPage({ page }: { page: PageData }) {
  return <>
    <Hero content={page.hero} />
    <FeatureGrid content={page.features} />
    <Section><PercentageCalculator /></Section>
    <FAQ content={page.faq} />
    <CTASection content={page.cta} />
  </>;
}
```

File to update: `src/app/[...slug]/page.tsx`. Import `PartnerPage` and replace its single `<MarketingPage page={page} />` render with the conditional below. Preserve `resolvePage`, the allowlist, metadata, and JSON-LD logic already in that file:

```tsx
{path === '/partner-program/'
  ? <PartnerPage page={page} />
  : <MarketingPage page={page} />}
```

Once there are several templates, add a typed `template` property to `ReactRoute` and a small template switch instead of many path conditions. Do not introduce a general-purpose page-builder engine before you need one. The interactive feature/layout changes need a developer deployment; subsequent content edits remain editorial.
