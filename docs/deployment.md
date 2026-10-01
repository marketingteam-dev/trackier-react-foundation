# Deployment, URL ownership, SEO, and rollback

**Planning example only. No server configuration here has been tested against your DigitalOcean VM. No production changes are authorized by this document.** Your hosting team must adapt it after inspecting the actual web server, TLS, WordPress/CDN/cache configuration, origin redirects and available resources.

## Choosing the place to route requests

Keep the current front door when practical. If Nginx on the DigitalOcean VM receives `trackier.com` HTML requests, add selected-path proxy rules there after review. If Apache/OpenLiteSpeed receives them, implement equivalent exact routing in that supported layer or add a carefully planned proxy. If an upstream service actually proxies all HTML, that service can own the same allowlist. Do not introduce another CDN solely for this starter.

WP Rocket's asset CDN configuration does not establish an HTML routing layer. Confirm whether “WP Rocket CDN” means RocketCDN or another connected service, its DNS configuration, whether HTML is proxied, and which assets are rewritten. [WP Rocket's CDN integration](https://docs.wp-rocket.me/article/42-using-wp-rocket-with-a-cdn).

Next can run as a supervised Node process on the existing VM if it has capacity and service isolation. A separate small app/staging VM avoids competing with WordPress's PHP/database resources; choose after measuring capacity and team operations skills. A managed Next host is another option if your front server can reliably proxy to it with the required host/forwarded-header behavior. The public visitor URL remains on `trackier.com` in each case.

A single Next instance is sufficient initially. Plan process restarts, log rotation, health checks, persistent/cache permissions, TLS/firewall policy and backups. Do not run a foreground dev server as production infrastructure. If you later add replicas, coordinate data cache invalidation and deployment asset versions across them; the single-process refresh endpoint does not magically invalidate unrelated replica disks. See [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting).

## Illustrative routing logic

Pseudocode in `docs/deployment.md` — **not Nginx/Apache syntax**, not ready to paste into a server:

```text
Inspect the existing normalized path without dropping the query string.
Never double-decode paths or silently change WordPress's case/redirect policy.

1. Preserve existing infrastructure paths (TLS challenges, health checks, etc).
2. Preserve WordPress administrative/API/media/plugin paths and query endpoints.
   In particular, root ?rest_route=..., ?p=..., ?page_id=..., ?preview=...,
   ?s=..., ?feed=..., and the SEO plugin's query endpoints still go to WP.
3. Forward these reserved namespaces/endpoints to Next:
   /_next/*
   /react-assets/*
   /api/react/revalidate and /api/react/revalidate/
   /react-sitemap.xml (normal canonical form; .xml has no trailing slash)
4. Forward ONLY these exact example page paths to Next:
   /react-demo and /react-demo/
   /react-demo/reuse and /react-demo/reuse/
5. Everything else uses the existing WordPress request handler.

Forward original path, full query, method, body and required headers.
Do not strip /react-demo from the upstream path.
Do not redirect visitors to a private Next origin.
Do not use a blanket WordPress-to-Next fallback.
```

The exact path list is a **proposed example** to compare with `src/config/routes.ts`, not a launch instruction. A prefix rule for `/react-demo/` is broader than an exact rule and would also capture child WordPress URLs. Review namespace collisions even for `/_next/` and `/react-assets/` before reserving them. When the homepage is eventually approved, add an exact `/` rule after auditing all root query endpoints and replace the local-only redirect in `src/app/page.tsx` with a real content route. Do not proxy `/` as a general prefix.

Adapt before implementation:

- Actual server product/version, order of rewrites/location matching, existing `try_files`/PHP handler, document root and TLS config.
- WordPress root/subdirectory/multisite paths and all plugins' endpoints; preserve existing access controls.
- Next upstream address/port, service user, proxy timeouts, health behavior and firewall restrictions.
- Correct upstream TLS SNI/Host, public `Host`/forwarded host/protocol handling and redirect behavior; prevent spoofed forwarded headers by trusting only your proxy.
- Query/method/body preservation, request-size/rate limits for API routes, and cache/header rules.
- Authoritative route inventory and approved ownership changes. Back up the old virtual-host config and test syntax before reload.

## Origin requests and loops

The browser loads `/react-demo/` from the public site. The Next server calls a **fixed** `WP_API_BASE_URL` ending `/wp-json/trackier/v1/`; it does not fetch its own public page URL. Only validated allowlisted slugs become a relative API request, so the visitor cannot choose an arbitrary upstream.

Prefer an API-only origin virtual host or private network endpoint that reaches WordPress directly with a valid TLS certificate and accepted Host. It must not canonical-redirect back through public React routing. A private/internal hostname is infrastructure, not a new public website for visitors. If your private network uses an IP, TLS and Host need deliberate configuration; do not turn off certificate verification. This starter permits HTTP only for localhost integration tests.

Using the public site's `/wp-json/` can work if that namespace is unconditionally routed to WordPress and no cache/security redirect intervenes. Verify with the hosting team first. The client rejects redirects and has an 8-second timeout, making misrouted origins fail visibly rather than following loops. Do not put a catch-all Next rewrite back to `trackier.com` when the same front router would forward it right back to Next.

WordPress `home`/`siteurl`, admin cookies and media URLs must be reviewed before introducing an origin host. Do not blindly change WordPress's public URLs to the private origin; this can leak origin URLs in links or break login. Configure the API route/virtual host and WordPress canonical behavior together.

## Direct visits, slashes, queries, redirects and 404s

Direct URL requests, refreshes and link clicks all reach the same server router. For an approved page, forward both slash forms to Next; `trailingSlash: true` returns a permanent 308 to the canonical slash form, preserving queries. File-like resources such as `/react-sitemap.xml` are exceptions to that slash rule. Verify against existing WordPress canonicals before migrating a real path; preserve its established URL format or explicitly plan the redirect.

Keep all query strings, including UTM attribution, search-related plugin parameters and the framework's `_rsc` parameter. A fragment such as `#faq` is handled in the browser and never reaches the server. Ordinary tracking queries do not change the page's canonical URL. Do not globally delete queries to improve caching; some are functional.

Keep a central redirect register: source URL, destination, owner, status and reason. Preserve existing 301/308 redirects and avoid loops between WordPress's slash/canonical redirects and Next. Do not redirect every old/missing page to the homepage. Use actual 404/410 behavior where appropriate; only redirect when there is a valid replacement.

An assigned path with absent published content produces Next's 404. An unknown path goes to WordPress and should produce WordPress's own 404. Test through the real proxy, not only localhost. Do not intercept Next errors with a custom 200 response. Page API outages remain server errors (currently 500 in this starter), distinct from missing content. A branded 503 at the hosting layer can be appropriate for a known origin outage if it preserves the error status; do not fabricate a successful page.

This starter avoids route-level loading/Suspense boundaries before content existence is resolved and blocks streamed metadata. If changing rendering strategy, retest status codes for browsers and crawlers; once headers are streamed, a later not-found view may not change HTTP 200 to 404.

## Framework requests and caches

Next's browser JS/CSS use `/_next/static/*`, optimized images use `/_next/image?...`, and App Router navigation can request an RSC representation of the **same page path**, not a separate fixed API path. Preserve `_rsc`, `RSC`, `Next-Router-State-Tree`, `Next-Router-Prefetch`, `Next-Url`, Accept and response `Vary` behavior as applicable. Keep original methods/bodies if future forms or Server Actions are introduced. Current ordinary anchors avoid cross-frontend prefetching and in-app routing ambiguity.

Initially cache hashed static assets according to their upstream headers and **do not add a shared HTML/RSC cache in front of Next**. Respect the server's dynamic/no-store responses. An incorrectly keyed CDN cache can serve RSC data as HTML or mix query variants. WordPress caching rules should apply to WordPress-owned pages only. Do not send Next JS/CSS through WordPress minification, combination, delay/defer rewriting or Elementor optimizers.

The public-data cache is already handled by the Next fetch layer. WordPress plugin responses ask intermediate caches not to store them. Check actual CDN and WP Rocket exceptions and cache purges; adding more cache layers can undermine timely edits/unpublishing. New deployments must keep assets available long enough for clients that loaded the previous HTML; avoid mixing release directories or deleting the old release immediately.

## Staging deployment sequence

1. Create a separate release directory and staging service or compatible app host. Protect the staging hostname with authentication/IP restrictions; use HTTPS. This may be a staging subdomain for testing even though final visitor URLs stay on trackier.com.
2. Put the full source/lockfile into version control through your team's normal process. Keep `.env.local`, credentials, `.next` and `node_modules` out of Git. No repository or remote is created by this starter.
3. Set environment values using the hosting secret/config system. Initially use mock mode with `SITE_INDEXABLE=false`; later connect protected staging WordPress. Use the staging public origin as `SITE_URL`. Set media host before building. No production WordPress credentials are needed for public API content.
4. Install and check the plugin on staging WordPress using `wordpress/README.md`. Bind the shared menus, configure Elementor counterparts, populate approved content and audit required integrations.
5. Build in a release directory using commands below. If using a separate CI build server, keep the runtime dependencies, `.next`, `public`, configuration and compatible Node runtime in the deployed release; a managed Next platform handles its own packaging. Do not upload only `.next` to PHP hosting.
6. Start the production-mode app behind the staging reverse proxy. A service supervisor (the host's systemd/process system, for example) must restart it on failure/reboot. Restrict the raw Node port to the proxy/private network.
7. Test through the staging front door with the proposed ownership rules. Keep the default owner WordPress. Check logs, API/cache behavior, outages, URLs and the complete pre-launch checklist.

Terminal example — in the **new staging release directory containing this project's `package.json`**, not inside the live WordPress directory:

```sh
npm ci
npm run check
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

Success: dependencies installed, tests pass, build succeeds and Next reports `Ready` on port 3100. The last command demonstrates the process command only; use the hosting supervisor for a lasting deployment. Loopback binding assumes the reverse proxy is on the same VM. Adapt for a separate VM/private network; do not expose a Node port publicly without the hosting team's network controls.

## SEO, performance, accessibility and integrations audit

| Area | Starter behavior | Required migration work |
| --- | --- | --- |
| Indexable content | Complete server HTML; small client navigation component | Inspect source on staging; audit any future client-only sections |
| Titles/descriptions | Structured WP SEO fields → Next metadata | Map current SEO plugin values; avoid overwriting proven titles without approval |
| Canonicals | Public `SITE_URL` + owned path, no UTM query | Set correct production origin; preserve URL case/slash/redirect decisions; never canonicalize to private CMS origin |
| Open Graph/social cards | Title/description/URL and optional approved image | Supply real raster share images; verify fetch accessibility and image dimensions |
| Structured data | Escaped basic `WebPage` JSON-LD | Add only applicable verified Organization/Breadcrumb/Product data; do not invent ratings or assume FAQ rich-result eligibility |
| Sitemaps | `/react-sitemap.xml` includes assigned published indexable pages only | Keep one sitewide sitemap owner; exclude migrated entries from WP child sitemaps and include the React sitemap in the existing index or list both in existing robots/Search Console |
| Robots | Meta noindex plus build-time X-Robots-Tag for mock/staging | Existing `/robots.txt` remains sitewide owner; enable only intended production content and remove staging header in a rebuilt release |
| Duplicate origins | Canonicals supplied, sample noindex | Protect private/staging app origins with access control; canonical/noindex is not authentication; do not expose a second indexable WordPress copy |
| Images/fonts | Intrinsic image sizes, allowed-host optimizer, sample system font | Audit approved fonts and licenses, self-host if suitable, avoid duplicate weights and oversized images, tune image sizes |
| Accessibility | Skip link, landmarks, focus outlines, labeled menu buttons, Escape close, native FAQ | Test real menus/mega menus with keyboard and screen reader, focus order/return, zoom, contrast, reduced motion and mobile overflow |
| JavaScript | Most components server-rendered, no extra UI framework | Keep calculators/forms as small client boundaries; measure third-party scripts before adding |
| Analytics | None installed | Inventory GTM/GA/ads/session replay/pixels; choose one owner per event; preserve UTM/referrers and validate one page-view per full navigation |
| Consent | None installed | Use the same consent provider, storage/cookie domain/path, defaults and choices across both sites; load tracking only through the agreed consent integration |
| Forms/CRM | None installed | Inventory Elementor form actions, CRM/API/webhook, spam controls, file handling, error/success UX, email delivery and conversion events; implement/test explicitly on React |
| Third parties | None assumed | Review chat, maps, embeds, A/B testing, personalization, search, localization and tag dependencies |

WordPress SEO, consent, analytics and Elementor form plugins do **not** automatically execute on Next pages. Never copy secrets from a form plugin into client JS. Use a server route for privileged submissions, validate input, authenticate/authorize where required, add spam/rate controls and test actual delivery with approved test accounts. If temporarily linking to an existing WordPress form, document that choice and verify the full journey instead of showing a nonfunctional React form.

For sitemaps, the current plugin's custom post type is non-public, but third-party SEO behavior still needs verification. For a migrated normal WordPress page, remove its duplicate sitemap entry through the actual SEO plugin's supported mechanism. Keep the React child sitemap reachable and list only final canonical URLs. If the SEO plugin cannot add a child sitemap easily, its owner can list both sitemap URLs in the existing robots file and submit them to Search Console. Do not create a competing Next robots route. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Record performance before migration using the current page and after using staging/production data: LCP, INP, CLS, HTML/API response times, image sizes, JS transfer and server resource usage. No performance score or live SEO preservation claim has been made by this starter. Real content and third-party scripts strongly affect results.

## Launch one page

1. Choose a low-risk page with clear ownership and measurable acceptance criteria. Do not start with the homepage merely because it is in an example.
2. Preserve the current Elementor page/template, redirects, SEO values and analytics baseline. Prepare a WordPress fallback for a brand-new path.
3. Deploy the approved application release while its path still belongs to WordPress. Verify its internal/staging origin, cache refresh and image host configuration.
4. For final production build, use `CONTENT_MODE=wordpress`, `SITE_URL=https://trackier.com`, `SITE_INDEXABLE=true` and real approved content with `seo.noIndex=false` where intended. These sample pages must not become indexable company pages. Build-time headers/image configuration require rebuilding.
5. Update only the approved front-router path rule and required Next namespaces/endpoints. Preserve the old configuration. Purge affected old HTML/redirect caches.
6. Smoke-test the public path plus adjacent WordPress paths. Validate forms/consent/tracking with the responsible teams and monitor server/404 logs.
7. Keep a rollback owner available during the initial observation window. Add more pages only after this path is stable and the shell matches.

## Rollback

Roll back a migrated page by removing/restoring its **exact** route rule so WordPress serves its preserved page again, and purging the affected edge/WP caches. Leave Next asset endpoints available if other React pages still need them. Restore sitemap ownership, canonical decisions, redirects and navigation as appropriate. Keep the last known good Next release for app rollback if the problem is application code.

For a new path with no prior WP page, route it to the prepared WP fallback or use a specific approved redirect/status response. Do not assume WordPress has a substitute automatically. An origin outage is not a reason to silently serve unrelated mock content or the homepage.

Do not delete the WordPress page, plugin data, prior app release or old server config as part of the initial cutover. Rehearse reversal on staging, including cache effects and analytics. Keep a short change record with the URL owner before/after, release identifier, operator, validation evidence and rollback rule.
