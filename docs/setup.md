# Beginner setup guide

No production access is needed for these local steps. A **terminal** is an application where you type commands. On macOS use Terminal; on Windows use PowerShell or a supported terminal. A command's **working directory** is the folder it runs in. `cd` changes that folder.

## 1. Install the software

Install Node.js **24 LTS** from [nodejs.org](https://nodejs.org/en/download). Node runs JavaScript outside the browser; npm, its package installer, comes with it. LTS means long-term support. Use a current patched Node 24 release for a new deployment. Node 22 remains supported; the local test environment used 22.17.0. Install a code editor such as VS Code, and a modern browser. Git is useful for version history and deployment but not required to try this supplied folder. No global React/Next CLI installation is needed.

Terminal — any directory:

```sh
node --version
npm --version
```

Success: version numbers (normally Node `v24.x.x` for a new installation), not “command not found.” Restart the terminal after installation if needed. `.nvmrc` contains `24` for people already using the optional nvm version manager.

## 2. Open the supplied project

The project is already created in `/Users/amanchoudhary/Desktop/trackier-React`. Open that folder in your editor. On another computer, copy/download this complete folder or clone a repository your team creates. Include `package-lock.json`, source, config, docs and `.env.example`; exclude `node_modules`, `.next`, and private `.env.local`. Do not run `create-next-app` over these files.

Terminal — your current computer:

```sh
cd /Users/amanchoudhary/Desktop/trackier-React
pwd
npm ci
```

Success: `pwd` shows the project folder; npm installs packages with no failure. `npm ci` installs the exact dependency versions in the lockfile. Run it from the folder containing `package.json`. On a different computer, adapt only the `cd` path. `node_modules` is generated dependency code; do not edit it.

## 3. Set environment variables

An **environment variable** is a named setting supplied to the running application. It separates environment-specific values (like an API address) from source code.

Terminal — project root, only if `.env.local` does not already exist:

```sh
cp .env.example .env.local
```

PowerShell equivalent in the project root is `Copy-Item .env.example .env.local`. Success is a new `.env.local` file. The example contains no secrets. Leave `CONTENT_MODE=mock`, `SITE_URL=http://localhost:3000`, and `SITE_INDEXABLE=false`. `.env.local` is ignored by Git. The project requires an explicit mode; absence or a typo produces a configuration error.

Settings live in `.env.local` next to `package.json`, **not** inside `src`. Restart the development server after changing them. Next config values such as image hosts and robots headers also require a new production build. Never put credentials in a `NEXT_PUBLIC_` variable: those are exposed to browsers.

## 4. Start the development server

Terminal — project root:

```sh
npm run dev
```

Success: Next reports `Ready` and a local address, normally `http://localhost:3000`. Leave this terminal running. Open `http://localhost:3000/react-demo/` in your browser; try `/react-demo/reuse/` too. The homepage on this local server redirects to the first example. This local server cannot change trackier.com.

If port 3000 is occupied, stop your previous local server with Control+C. During this task a production preview may already be running there; use its existing page or stop it before starting dev. To use another port, run `npm run dev -- --port 3001` from the project root and set `SITE_URL=http://localhost:3001` so canonical URLs agree. Success is `Ready` on 3001.

The development server updates the browser as you save files. Stop it with Control+C when finished. **Development** favors quick updates; **production** uses compiled, optimized output.

## 5. Edit these files first

1. `src/lib/content/mock.ts`: change clearly labeled local sample headings and CTA labels to learn how content flows. Keep the sample noindex.
2. `src/styles/tokens.css`: change the shared color or content width; notice both pages update.
3. `src/components/sections/Hero.tsx`: inspect how `content` props become HTML. JSX is the HTML-like syntax inside React files.
4. `src/config/routes.ts`: inspect the exact path-to-content mappings. It is separate from the real server's routing rules.
5. `src/app/layout.tsx`: see how all React pages share one header/footer. Do not paste those components into each page.

Keep WordPress data-fetching code in `src/lib`, not in each section. Only browser interactions need `'use client'`. Data passed to a client component is visible to visitors; pass only public content.

## 6. Connect staging WordPress

Ask your WordPress team to follow [wordpress/README.md](../wordpress/README.md). This includes backing up staging, installing the supplied plugin, configuring site settings, creating two published sample React Pages, and checking JSON endpoints. No real application password is needed for public published content.

File `.env.local` — example values to replace with your verified staging addresses:

```dotenv
CONTENT_MODE=wordpress
SITE_URL=http://localhost:3000
SITE_INDEXABLE=false
WP_API_BASE_URL=https://YOUR-STAGING-WORDPRESS-ORIGIN/wp-json/trackier/v1/
WP_REVALIDATE_SECONDS=300
WP_MEDIA_ORIGIN=https://YOUR-PUBLIC-MEDIA-HOST
REVALIDATE_SECRET=
```

The two uppercase URL placeholders must be replaced; they are not real hosts. `WP_API_BASE_URL` includes the plugin namespace and trailing slash. A subdirectory WordPress install may have a prefix before `/wp-json/`. Use an origin endpoint that does not redirect. `WP_MEDIA_ORIGIN` is just the public scheme + hostname (+ port if applicable), not a URL with a path. Leave it empty if using only supplied local assets. The permitted remote path is configured separately in `next.config.ts`.

Restart dev. Success: the banner changes to STAGING PREVIEW; edits to published WordPress content appear after cache refresh. The plugin example hero uses the starter's local SVG, so it works before configuring remote media. If real requests fail, fix them; the code intentionally does not switch to mock mode automatically.

## 7. Check and build

A production build translates your TypeScript/React source into files the production server can execute. Build artifacts live in `.next`. Stop dev on the same port before running the production server. Avoid building into the same `.next` while that build is actively serving traffic.

Terminal — project root:

```sh
npm run check
npm run build
npm start
```

Success: type checking has no errors, tests pass, Next reports a successful build, and the production server reports `Ready`. The route table uses `ƒ` because pages render on demand. Your content copy can change without rebuilding because the running server fetches WordPress.

With mock-mode production server running, a second terminal — same project root:

```sh
npm run test:smoke
```

Success: a `PASS` message for rendered HTML, metadata, 404, redirects, assets, sitemap and refresh protection. This script assumes the default noindex mock environment; it is not a live production-site test. `SMOKE_BASE_URL` can point it at a different local port.

After building, this integration test creates temporary local servers itself — project root:

```sh
node scripts/test-wordpress.mjs
```

Success: `PASS` for published API content, caching/revalidation, 404s and API failures. It uses ports 3981 and 3982 and a fake local API; no WordPress credentials or live-site access. It tests the frontend integration, **not PHP execution**.

## 8. Deploy to staging, then connect selected URLs

Deployment means putting the built app on a server and keeping its process running. Follow [docs/deployment.md](deployment.md) with your hosting operator. Use a separate protected staging hostname/process, configure environment settings in the host's secret/environment system, install exact dependencies, build, and supervise `next start` behind HTTPS. Preserve WordPress's PHP service.

After staging tests, deploy the approved app version first. Only then add a single approved path to the front server's explicit React allowlist. Visitors continue using trackier.com. DNS alone cannot dispatch `/one-page/` differently from `/another-page/`; the HTTP router must do it. No production URL is connected automatically by this starter.

## 9. Format code with Prettier in VS Code

Prettier formats code; it does not change how your React components work. The extension message “No local configuration ... will fall back to VS Code configuration” is informational, not an error. This project now includes a local Prettier dependency, `.prettierrc.json`, `.editorconfig`, and `.vscode/settings.json` so formatting settings are shared.

1. Open the **project folder** containing `package.json` in VS Code, rather than opening a single file outside a workspace.
2. Install/enable **Prettier - Code formatter** (`esbenp.prettier-vscode`). The workspace recommends it. Run `npm ci` from the project root if you have not installed the updated dependencies.
3. Run **Developer: Reload Window** from the Command Palette (Command+Shift+P on macOS, Control+Shift+P on Windows/Linux).
4. Open `src/components/sections/FAQ.tsx` or another `.ts`/`.tsx` file and save it. Format on save is configured for supported languages. For manual formatting, use **Format Document With… → Prettier - Code formatter**, or Shift+Option+F on macOS / Shift+Alt+F on Windows.
5. If it still fails, use **View → Output → Prettier** and inspect the later `ERROR` message. Confirm that the extension is enabled for this workspace and that the file language is **TypeScript React** for `.tsx`. The Output log itself is not a source file to format.

Terminal — project root, to deliberately format the supported project files:

```sh
npm run format
```

Success: files are formatted. This changes whitespace throughout the supported source/docs; review those edits. Existing source was not bulk-reformatted when the formatter was added, so a formatting check can initially report differences.

Terminal — project root, to report formatting differences without changing files:

```sh
npm run format:check
```

Success after formatting: `All matched files use Prettier code style!`. A list of warnings means those files need formatting, not that the extension is broken. Generated files, private environment files, and WordPress PHP are excluded. PHP formatting would require a separate formatter/plugin and is not enabled by this setup. See [Prettier editor integration](https://prettier.io/docs/editors/).
