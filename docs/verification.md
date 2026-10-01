# Verification record

Date: 2026-09-30. Checks apply to the supplied local starter, not trackier.com.

## Completed

- npm installed the pinned framework packages and generated `package-lock.json`; installation audit reported zero known vulnerabilities at that time. This is not a guarantee about future dependency advisories.
- TypeScript checks passed and a Next.js 16.3.7 production build completed with React 19.3.0 and TypeScript 7.0.2 on Node 22.17.0.
- Four automated contract/ownership tests passed: complete sample data, exact route allowlist, unsafe URL rejection, malformed CMS response rejection.
- Production HTTP smoke checks passed: both pages rendered meaningful HTML with shared header/footer; canonical metadata and JSON-LD present; genuine HTTP 404 for an unowned path; 308 slash redirect preserved UTM query; SVG asset loaded; noindex sitemap omitted URL entries; refresh endpoint rejected GET and was disabled without a secret.
- Production integration tests against a local fake WordPress API passed: published content, cached response reuse, authenticated invalidation, rejection of incorrect credentials, immediate fresh content after invalidation, true 404 for missing published content, error 500 for bad endpoint/outage/invalid schema, and shared site content failure. No mock content was substituted.
- Browser checks: desktop layout rendered correctly, dropdown expanded and closed with Escape, mobile layout at 390×844 had equal viewport/content widths (no horizontal overflow), mobile menu toggled and closed with Escape, native FAQ disclosure opened. No warning/error logs were observed during the desktop check. Temporary viewport override was reset.

## Not yet verified / intentionally outside this starter

- No PHP runtime or WordPress installation was available here. The plugin has not been executed in WordPress. Follow `wordpress/README.md` staging tests, including activation, capability/nonce protection, content save validation, menu selection and publish-status privacy.
- Actual Trackier brand parity, Elementor templates, multi-level mega menus, typography/font licensing and production menu content require supplied design/configuration and cross-frontend visual review.
- DigitalOcean server routing/TLS/firewall/CDN configuration, production API/media hosts and existing redirects have not been inspected or changed.
- Real WordPress image optimization/delivery, production sitemap/robots integration, live indexing and Core Web Vitals have not been measured.
- Forms, CRM, analytics, consent, tracking and third-party services are not wired up and need explicit integration/testing.
- Authenticated draft preview, automatic publish webhooks, CMS JSON revision UI, media picker and full editorial field controls are not implemented. Their intended boundaries and next steps are documented.

## Repeat locally

Terminal — project root, configured environment:

```sh
npm run check
npm run build
npm start
```

Second terminal — same project root, with the mock-mode production server running:

```sh
npm run test:smoke
```

Terminal — project root, after production build (temporary fake API/app use ports 3981/3982):

```sh
npm run test:wordpress
```

Expected: all commands exit successfully; test commands print `PASS` or passing TAP test counts. The fake API test is isolated and contacts no live WordPress server. Repeat build/tests after code or dependency changes, and retest routing through the actual front door before rollout.
