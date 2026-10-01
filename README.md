# Trackier incremental React foundation

This repository is a complete local starter and a migration guide. **Nothing has been deployed or changed on trackier.com.** The design and copy are explicitly demonstration content. They are not a recreation of the current Trackier design, approved marketing claims, or real testimonials.

## 1. Understanding of the requirements

Keep the existing WordPress/Elementor website running. Move selected complete pages to React over time, with the same public domain and a coherent header/footer. Editors should continue managing content in WordPress. Developers should reuse layouts and sections instead of copying pages.

React is a library for building **components**: reusable pieces of an interface, such as a header or hero. **Props** are the inputs passed to a component, such as its heading. Next.js is a framework built on React; it adds routing, server rendering, metadata, builds, and production server support. A **route** connects a URL path to a page. A **layout** surrounds pages with shared structure.

## 2. Essential questions and assumptions

Confirmed by you: WordPress runs on a **DigitalOcean VM**, you use **WP Rocket's CDN**, and custom plugins are allowed.

Before production routing, your hosting team must provide the following. These details do not block local development:

- Whether the VM runs Nginx, Apache, OpenLiteSpeed, or a combination; relevant virtual-host rules and who can safely change them.
- The exact CDN product and whether DNS/HTML passes through it. Asset delivery alone cannot dispatch page requests to different applications.
- Existing cache layers, WordPress subdirectory/multisite setup, permalink rules, redirects, API restrictions, and TLS termination.
- Available memory/CPU, a place for a supervised Node.js process, firewall policy, and whether a separate small staging/application VM is preferred.
- A server-reachable WordPress API origin that does not redirect back through frontend routing, and the public media host/path.
- Current Elementor header/footer templates, menu configuration, responsive screenshots, fonts/licenses, logo files, brand tokens, sticky/mega-menu behavior, and CTA destinations.
- The SEO plugin, sitemap ownership, analytics/tag manager, consent system, forms/CRM integrations, and the first low-risk migration candidate.

Assumptions: one English-language site initially; WordPress pretty permalinks; HTTPS in staging/production; no authenticated customer experience on these marketing pages. Internationalization, multisite, or account features need additional route and content design. Public-domain homepage migration is **not** authorized or configured.

## 3. Architecture comparison and recommendation

| Choice | SEO / first response | Existing WordPress fit | Hosting | Beginner maintenance | Header/footer | Performance / growth |
| --- | --- | --- | --- | --- | --- | --- |
| Browser-only React app on selected paths | Often sends an HTML shell first; prerendering/SSR needs extra work | Works behind selective routing | Static assets plus a path router | Simple initial app; more SEO/routing glue later | Separate implementation | Good interactive apps; avoid shipping everything as browser JS for marketing |
| React embedded in WordPress | WordPress still renders the page; widget content needs its own rendering plan | Excellent for calculators or small tools in Elementor | Existing PHP host plus bundled assets | Easiest for a few widgets; Elementor/CSS/lifecycle conflicts can grow | Existing Elementor shell stays | Good for isolated widgets; less suitable for many independent page layouts |
| **Next.js on selected paths** | Full HTML rendered on server; static generation is also available | WordPress remains default route owner and CMS | Node.js service or compatible managed Next hosting, plus selective proxy routing | More setup initially; consistent conventions thereafter | Shared React layout; Elementor shell aligned separately | Small interactive boundaries, cached content, reusable templates; best fit for many complete pages |

**Recommendation: Next.js App Router, TypeScript, CSS, WordPress REST, and an exact route allowlist at the existing front door.** Put isolated calculators inside WordPress when that is all a page needs. These approaches can coexist.

**Server rendering** means the server produces page HTML for each request. **Static generation** means producing HTML ahead of requests and serving a saved version. This starter uses request-time server rendering with cached public WordPress data. That keeps routing and real 404 responses understandable without requiring a rebuild for every copy edit. Static generation/ISR can be added later for measured needs.

Stable versions were checked on 2026-09-30: Next.js 16.3.7, React 19.3.0, TypeScript 7.0.2. `package-lock.json` records exact installed dependencies. Use Node.js 24 LTS for new environments; the starter was also tested on the available Node 22.17.0. Next's minimum is lower, but Node 20 is now past LTS support. See [Next installation](https://nextjs.org/docs/app/getting-started/installation) and [Node release status](https://nodejs.org/en/about/previous-releases).

## 4. Routing diagram and route ownership table

Diagram in `README.md` — proposed architecture, not a deployed configuration:

```text
Visitor: https://trackier.com/path/
                    |
        Existing TLS / front web server
        (or a verified HTML-capable edge router)
                    |
          explicit path ownership check
             /                  \
     exact React paths       everything else
          |                       |
      Next.js server       existing WordPress + Elementor
          |                       |
          +-- server REST GET ---> WordPress API origin
          |
   HTML + /_next assets

Public WordPress media remains on its approved public media/CDN host.
Content API requests bypass the public page router where possible.
```

| Path / request | Proposed production owner | Important rule |
| --- | --- | --- |
| `/`, `/blog/`, `/existing-page/`, every other existing page | WordPress | Default; do not replace homepage for this starter |
| `/react-demo/`, `/react-demo/reuse/` | Next only **if later explicitly approved** | Demonstration allowlist, not permission to launch these paths |
| `/partner-program/`, `/new-landing-page/` | WordPress/unassigned until deliberate migration | Tutorial/examples do not transfer ownership |
| `/_next/*`, including `/_next/static/*` and `/_next/image?...` | Next | Pass full query and correct headers; reserve namespace after conflict audit |
| `/react-assets/*` | Next | Public assets are deliberately namespaced |
| `/api/react/revalidate/` | Next | POST with server-held Bearer secret; rate-limit at front door |
| `/react-sitemap.xml` | Next | Contains only assigned, published, indexable React routes |
| `/wp-admin/*`, `/wp-login.php`, `/wp-json/*`, `/wp-content/*`, `/wp-includes/*` | WordPress | Include bare endpoints and existing subdirectory prefixes |
| `/?rest_route=...`, `/?p=...`, `/?page_id=...`, preview/search/feed query routes | WordPress | Must be considered **before** a future `/` migration |
| `/feed/`, page/category feeds, XML-RPC if used, other plugin endpoints/assets | WordPress | Inventory actual paths; preserve existing policy |
| `/robots.txt`, main sitemap/index and WP sitemap child files | Existing WordPress/SEO owner | One coordinated sitewide owner |
| `/.well-known/*`, TLS challenge and infrastructure paths | Existing hosting owner | Preserve infrastructure routes |
| Unknown URL | WordPress by default | WordPress returns its normal 404; unknown URLs sent directly to Next also return 404 |

The local Next origin redirects `/` to `/react-demo/` for convenience. This does not authorize routing the public homepage to Next.

Use your web server/reverse proxy for dispatch if it currently receives the site's HTML traffic. A **reverse proxy** forwards a request to another server while keeping the visitor's URL unchanged. A verified full-site CDN can also do this. WordPress should not bootstrap PHP merely to proxy every React page; that adds complexity and couples availability. WP Rocket's ordinary CDN integration rewrites static asset URLs; verify the actual product before relying on it for HTML routing. [WP Rocket CDN documentation](https://docs.wp-rocket.me/article/42-using-wp-rocket-with-a-cdn).

The app has a second gate in `src/config/routes.ts`; its catch-all file accepts only those exact paths. No rewrite sends all WordPress URLs to React. Full routing pseudocode, slash/query behavior, cache headers, origin isolation and rollback are in [docs/deployment.md](docs/deployment.md).

All navigation uses ordinary anchors. Clicking between WordPress and React performs a full document navigation, so the receiving frontend initializes correctly. Direct visits and refreshes use the same routing rule. React content links should use root-relative public URLs, never private CMS-origin URLs. Audit absolute WordPress menu URLs when testing staging.

## 5. Header and footer strategy

There are three different goals:

| Goal | Realistic implementation |
| --- | --- |
| Same appearance and behavior | Match Elementor and React against one documented design specification and breakpoint test set |
| One content source | WordPress menus plus shared site settings exposed through the plugin; explicitly bind Elementor widgets to those same sources |
| Identical rendering code | Achieved within React via the shared layout; **not automatically shared with Elementor** |

Implement the React shell once in `src/app/layout.tsx`, `src/components/layout/Header.tsx`, and `Footer.tsx`. It includes an optional logo, desktop dropdowns, mobile menu, CTA, sticky header, footer columns, and text social links. The supplied sample uses a placeholder wordmark, no fake social accounts, a simple one-level dropdown, and sample styling. It does **not** reproduce any existing mega menu.

The plugin registers shared primary and footer menu locations. Assigning the same primary menu to Elementor's supported menu widget and the plugin synchronizes labels, URLs, ordering, and one child level. Its footer menu overrides the first footer column. Other footer columns, CTA, logo, social links, description, and copyright live in site settings. React consumes them now; Elementor needs dynamic bindings/custom widget or a small theme adapter to consume those fields. That adapter cannot be safely specified against templates we have not seen and is not installed by this starter.

Typography, CSS, animations, mobile behavior, focus management, sticky offsets, and complex mega-menu rendering must be maintained in each renderer. Use the same approved font files, tokens, image assets, content and interaction requirements. Port `src/styles/tokens.css` values into Elementor globals; test both shells at 390, 800, 1024 and 1440 pixels, keyboard-only, zoomed text and long labels. Keep paired screenshots and review both frontends for every shared change. Menu data may require Next cache refresh and WordPress page-cache purge.

Do not scrape Elementor header HTML into React: its generated CSS, scripts, responsive logic, IDs, and accessibility behavior need auditing. Sharing exact rendering code would require deliberately replacing the Elementor shell with a shared implementation, a larger project with its own risk. Start with shared content and verified visual parity.

## 6. WordPress content model

An **API** is a defined way for programs to request data. WordPress REST already provides public pages/posts/media; evaluate it before adding GraphQL. Core page responses include rendered HTML, but do not define a universal public Elementor/navigation/SEO contract. This small REST adapter supplies the missing structured contract. GraphQL would only be justified later by a concrete requirement, such as complex related-content queries that REST cannot serve efficiently. [WordPress pages API](https://developer.wordpress.org/rest-api/reference/pages/).

| Content | WordPress ownership / API field | React responsibility |
| --- | --- | --- |
| Title and content key | Native title/slug of a React Page | Approved public path maps to content slug in route registry |
| Hero | `hero.eyebrow`, `heading`, `description` | Hero layout and responsive presentation |
| CTAs | Label and safe destination | Button appearance, semantics and tracking hook when later added |
| Images and alt text | Media library; structured `url`, `alt`, `width`, `height` | Image optimization, sizes, layout reservation |
| Features | Heading + list of title/description pairs | FeatureGrid component |
| Testimonials | Optional list of quote/name/role | Display only approved entries; demo list is empty |
| FAQs | Question/answer list | Accessible HTML disclosures |
| Navigation/footer | WP menus and shared settings | Shared React shell; Elementor adapter/bindings separately |
| SEO | Title, description, optional image, noIndex | Generate tags, canonical from public route, WebPage JSON-LD |
| Interactions/design | Usually not editorial content | Calculators, form behavior, tokens, layouts, business logic |

New React Pages use a non-public custom post type `trackier_react`. It has a WordPress admin UI and a published-content API, but no WordPress frontend permalink/archive/feed; this avoids creating an extra indexable WordPress copy. Existing Elementor pages remain unchanged. For an actual migrated existing path, retain its old page/template as rollback material and exclude its duplicate listing from the existing SEO sitemap as appropriate.

`GET /wp-json/trackier/v1/pages/react-demo` returns the **illustrative** payload in [wordpress/examples/sample-api-response.json](wordpress/examples/sample-api-response.json). It is generated from sample data, not captured from Trackier. The complete typed model is [src/lib/content/types.ts](src/lib/content/types.ts), inferred from [schema.ts](src/lib/content/schema.ts). Site response examples are in [wordpress/examples/site.json](wordpress/examples/site.json).

`wordpress/trackier-react-content/trackier-react-content.php` supplies the custom post type, a validated JSON meta box, settings editor, menu adapter, and public endpoints. No paid field plugin is required. JSON is a practical starter adapter, **not the final editorial experience**: before wider editor adoption, replace it with labeled controls/repeaters using custom UI or a justified fields plugin, preserving the API shape. Current JSON content has no autosave/revision interface; keep backups. Images are entered with media URL/dimensions/alt; a later media-picker adapter should store attachment IDs and resolve current media metadata centrally.

**Rendered HTML vs structured fields:** `content.rendered` can be useful for conventional article bodies. React then displays HTML whose allowed tags/attributes must be sanitized on the server with a maintained allowlist sanitizer. WordPress authors and plugins can emit markup that needs scrutiny; never assume HTML is safe, execute shortcodes in a browser, or insert it wholesale without reviewing scripts/styles/iframes. This starter renders plain text fields with React escaping and does not inject WordPress HTML. The only HTML insertion is escaped JSON-LD generated from known fields. Existing Elementor layouts are not automatically converted into structured React sections; migration requires editorial mapping and layout work.

**Fetching and errors:** components call `getPage`/`getSite` in `src/lib/content/index.ts`. Only the server-side WordPress client knows the origin. Responses have an 8-second timeout, redirects are rejected, and Zod validates all data at runtime. A specific published-page-not-found response returns 404. A wrong endpoint, timeout, invalid JSON, or service failure throws a server error; the page/site error UI appears. Optional images and empty optional section lists can be omitted. Missing required content is a publishing error, not fabricated text. Mock mode is explicit, visibly labeled, and never a production failure fallback.

**Images:** `next/image` reserves dimensions, supplies responsive sizes, and optimizes permitted public raster images. Only the configured HTTPS media origin and `/wp-content/uploads/**` are accepted by the image optimizer. Adapt the exact pattern for a verified CDN path. The local trusted SVG is served unoptimized; arbitrary remote SVG is rejected. Keep useful alt text (empty only for decorative images), use approved raster social cards, and audit delivery/caching from both sites. Replacing a file at the same URL may leave optimized/CDN copies stale; use versioned filenames. [Next image documentation](https://nextjs.org/docs/app/api-reference/components/image).

**Caching and refresh:** public fetches default to a 300-second Next data cache. HTML is still server-rendered per request using that data. Timed refresh is demand-driven and may serve stale data while refreshing; 300 seconds is not a guaranteed publication deadline during low traffic or failures. WordPress/edge caching adds its own delays. Setting `WP_REVALIDATE_SECONDS=0` opts out. The authenticated `POST /api/react/revalidate/` expires the fixed `wordpress` tag; the next request refreshes. It is disabled without a 32+ character secret. An automatic WordPress publish/menu/settings webhook is a **future integration**, not silently installed. Use a server-side hook/job with retries, secure secret storage, and logging if immediate publishing is needed; purge WP/CDN caches as well. [Next fetch caching](https://nextjs.org/docs/app/api-reference/functions/fetch), [tag revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).

| Change | Frontend deployment? | Refresh needed? |
| --- | --- | --- |
| Copy, links, SEO, existing-page images | No | Next timed refresh or authenticated revalidation; other caches if present |
| Unpublish/delete | No | Invalidate immediately for urgent removal; cached public content may otherwise remain |
| New approved public URL using current template | Yes in this starter | Add app allowlist and hosting route; published content then fetched |
| New component/template/schema, styles, dependency, image host | Yes | Build/test/deploy and update matching WordPress adapter if necessary |
| Mock fixture changes | Yes for a deployed demo | Mock data is source code |

**Public vs authenticated content:** published page/site endpoints require no frontend credentials. Never put secrets in `NEXT_PUBLIC_*`, client components, source control, JSON payloads, or preview query strings. Server-only imports guard the fetching layer. Public API access is intentional; unpublished, private, password-protected, scheduled and draft content is excluded.

**Draft preview:** intentionally not shipped. Use published sample content in access-controlled staging initially. A later preview implementation should validate a short-lived signed token bound to a post ID/user, confirm editor authorization, set Next Draft Mode via a server handler, fetch drafts with a least-privilege server-held WordPress Application Password over HTTPS, return `private, no-store` + noindex responses, restrict redirect destinations to the allowlist, and offer an exit flow. Draft Mode is not authentication by itself. Do not log tokens or cache draft JSON/HTML at the proxy. [Next Draft Mode](https://nextjs.org/docs/app/guides/draft-mode), [WordPress authentication](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/).

## 7. Project folder structure

Tree in `README.md` (paths are relative to the project root):

```text
trackier-React/
├── .env.example                 # non-secret environment template
├── .nvmrc                       # suggested Node major: 24 LTS
├── .gitignore                   # excludes secrets/build outputs/dependencies
├── package.json / package-lock.json  # commands/dependencies/exact versions
├── next.config.ts               # slash, SEO streaming, image-host policy
├── tsconfig.json / next-env.d.ts # TypeScript configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx           # one header/footer surrounding all pages
│   │   ├── page.tsx             # local Next-origin convenience redirect
│   │   ├── [...slug]/page.tsx   # allowlisted page lookup + metadata
│   │   ├── error.tsx / global-error.tsx / not-found.tsx
│   │   ├── api/react/revalidate/route.ts # protected refresh endpoint
│   │   └── react-sitemap.xml/route.ts   # only React-owned sitemap entries
│   ├── components/
│   │   ├── layout/              # Header, Footer
│   │   ├── ui/                  # Container, Button, Section
│   │   └── sections/            # Hero, FeatureGrid, FAQ, CTASection,
│   │                            # MarketingPage composition/template
│   ├── features/               # future calculators/forms with own logic
│   ├── lib/
│   │   ├── content/            # schema, types, mock fixtures, getPage/getSite
│   │   ├── wordpress/client.ts # HTTP requests/errors/timeout/cache
│   │   └── seo.ts              # canonical, metadata, escaped JSON-LD
│   ├── config/                 # route registry and server environment config
│   └── styles/                 # tokens.css and globals.css
├── public/react-assets/        # trusted local demo SVG; later approved assets
├── wordpress/
│   ├── trackier-react-content/ # optional installable plugin directory
│   ├── examples/               # full sample API and editor payloads
│   └── README.md               # WordPress staging setup and acceptance checks
├── tests/                      # contract, link safety, route ownership tests
├── scripts/                    # HTTP smoke, fake-API integration, examples
└── docs/                       # beginner setup, adding pages, deployment,
                                # verification record and full source listing
```

Styling uses ordinary CSS plus custom properties (design tokens). This has no styling dependency, is easy to inspect, and maps well to Elementor's global styles. Class names are deliberately scoped to these components; React and Elementor use separate documents, so their entire CSS bundles need not coexist. As the site grows, CSS Modules can localize feature styles without changing the content architecture.

TypeScript adds checks to JavaScript before it runs. Initially learn `string`, `number`, `boolean`, arrays, object types, optional `?` fields, and component props. `MarketingPage['hero']` means “the hero part of the MarketingPage type.” `Promise<T>` means “a value of type T that arrives asynchronously”; `await` waits for it on the server. You do not need advanced generic abstractions. Runtime schema validation is still necessary because network data can be malformed despite your TypeScript declarations.

## 8. Complete starter implementation

The runnable implementation is already in this directory: there is no missing scaffold or copy-and-paste assembly step. [docs/STARTER-SOURCE.md](docs/STARTER-SOURCE.md) provides a full source listing, with the exact file path before each code block. Use the repository files as the source of truth; the listing is a generated snapshot. `package-lock.json` is supplied directly rather than duplicated in that listing.

Runtime dependencies: Next.js, React/React DOM, the server-only guard, and Zod for API validation. Development dependencies: TypeScript, type definitions and `tsx` for meaningful tests. No Redux, GraphQL, database, Tailwind, form platform, or analytics SDK is needed for the foundation.

Two working marketing examples share the same layout and section components: `/react-demo/` and `/react-demo/reuse/`. Metadata resolves before the response is sent. There is intentionally **no route-level `loading.tsx`**: placing a streaming loading boundary before checking page existence can produce a 200 response before discovering a missing page. The browser keeps its current document/loading indicator during ordinary navigation; errors have retry UI. Add loading states locally to future calculators/forms after route validity is established. The choice to block metadata uses the documented [`htmlLimitedBots` configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots).

## 9. Beginner setup guide

Follow [docs/setup.md](docs/setup.md) for software installation, terminal basics, every command, expected success output, environment variables, local development and production build steps. Start with mock mode; WordPress access is not necessary. Then follow [wordpress/README.md](wordpress/README.md) to connect a staging CMS.

Quick start — terminal, working directory `/Users/amanchoudhary/Desktop/trackier-React`:

```sh
cd /Users/amanchoudhary/Desktop/trackier-React
npm ci
cp .env.example .env.local
npm run dev
```

If `.env.local` already has your settings, keep it instead of copying over it. Open `http://localhost:3000/react-demo/`. A visible LOCAL DEMONSTRATION banner confirms mock mode. A **build** compiles and optimizes your source code for production; run `npm run build`, then `npm start` only after stopping the development server on that port.

## 10. How to add a new React page

The complete step-by-step `/partner-program/` tutorial is [docs/adding-pages.md](docs/adding-pages.md). For an existing template: create and publish structured content on staging WordPress, add one entry in `src/config/routes.ts`, and reuse the existing catch-all route, metadata helper, layout and sections. No copied header/footer and no new route component are needed. Test locally/staging, deploy the app, then explicitly assign the public URL at the front router.

Editors can update a published approved page's content without deployments. Developers/hosting operators approve new URL ownership and new layouts/interactive features. A new URL requires an app deployment in this intentionally conservative starter, even when its content uses an existing template.

## 11. Deployment and rollback guide

Use [docs/deployment.md](docs/deployment.md). Deploy the application separately into access-controlled staging, keep the current WordPress service intact, audit all integrations, and launch one low-risk page. An internal/staging hostname is acceptable; visitors still use `trackier.com` after selective routing. Production Next needs a running server, not merely uploading `.next` to WordPress or a static-only host.

Rollback changes the affected path's ownership back to WordPress and purges relevant caches. Keep its previous Elementor version ready; for a brand-new page without an old version, prepare a WordPress fallback or an approved redirect before launch. Do not rely on an untested catch-all fallback or an automatic “if Next 404 then WordPress” rule, which obscures real missing pages.

## 12. Maintenance and troubleshooting checklist

Before launch:

- [ ] Approved content and matching header/footer on both renderers, including mobile, keyboard and mega-menu requirements.
- [ ] Only the approved URL routes to Next; WP admin/API/media/assets/feeds/robots/sitemaps and unrelated pages still work.
- [ ] Direct visits, refresh, slash redirect, UTM queries, old redirects, genuine 404s and error responses verified through the public router.
- [ ] Titles/descriptions/canonicals/Open Graph agree with the public URL; HTTPS; only intended production pages indexable.
- [ ] Main sitemap/robots owner includes the React sitemap without duplicate URLs; staging/origin is access-controlled and noindex.
- [ ] Real content, image allowlist, alt text, focus states and slow-network performance checked.
- [ ] Forms submit to intended systems with validation/spam controls; consent persistence and analytics events tested across both frontends.
- [ ] Cache refresh, urgent unpublish, origin failure, monitoring, backups and one-path rollback rehearsed.
- [ ] PHP plugin exercised on staging; dependency/security update process and support owners assigned.

| Symptom | Check / action |
| --- | --- |
| API unavailable | Server logs, plugin activation, exact API base, TLS/DNS, firewall, redirects, REST security plugins and timeout. A generic WP 404 is a configuration error, not a missing content page. |
| Old content after edit | Confirm published slug; inspect WP/CDN cache; wait for demand refresh or call authenticated refresh; hard-reload in dev; invalidate every replica if scaled. |
| Missing/failed images | Public HTTPS URL, exact host/path allowlist, media permissions, intrinsic dimensions, content type, optimizer access and source redirect behavior. Change image-host config then rebuild. |
| React 404 | Check app route registry **and** front-server allowlist, exact case/slash, published WP slug and password/status. |
| WordPress URL opens React | Remove broad wildcard rules; restore WordPress default; check query-based endpoints and namespace collisions. |
| Styling mismatch | Confirm font asset/version, tokens, breakpoint, logo dimensions, menu content, sticky offset and cache. Compare both renderers' screenshots. |
| Error is HTTP 200 | Check for streaming loading/Suspense wrappers, proxy custom error interception or cache pollution; retest raw response headers. |
| Duplicate tracking | Check tag manager + inline tags + SPA route events. This starter uses full navigations; send one page view per loaded document. |
| Draft cannot be previewed | Expected: no authenticated draft preview exists yet. Do not expose draft endpoints publicly to work around it. |

Schedule dependency/WordPress/plugin updates with staging regression tests; review 404/error logs and web performance after each migrated page. The full SEO/performance/integration audit and operational acceptance plan are in [docs/deployment.md](docs/deployment.md). Actual checks and remaining gaps are recorded in [docs/verification.md](docs/verification.md).
