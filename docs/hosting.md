# Hosting and route verification

Production routing on `https://leqada.ai.studio/` is **not verified**. Requests to the home page, `/demo` and `/partners` were rejected by this environment's outbound proxy (`Tunnel connection failed: 403 Forbidden`). This is a network-access limitation, not evidence that AI Studio supports or rejects clean routes. No deployment was performed.

## Build and server contract

Use Node 24 (validated with 24.19.0), then:

```sh
npm ci
npm run build
PORT=3000 npm start
```

The obsolete top-level esbuild 0.25 dependency was removed and the lockfile's existing esbuild 0.28.2 dependency was hoisted to satisfy both tsx and Vite 8's optional peer requirement. Run a fresh standard `npm ci`, build, TypeScript check and tests before deployment. The previous 18 Node and 30 browser test results predate this final dependency cleanup; the refreshed installation is not independently validated here. Package integrity and TLS checks must remain enabled.

The build writes real rendered content and route-specific head metadata into:

- `dist/index.html`
- `dist/demo/index.html`
- `dist/about/index.html`
- `dist/partners/index.html`
- `dist/404.html`

`server.mjs` uses `dist/routes.json` to serve the exact document for `/`, `/demo`, `/about` and `/partners`. It handles direct requests and refreshes without an implicit SPA fallback, redirects known trailing-slash URLs to canonical paths, preserves query strings, and returns 404 for unknown pages/assets. It honors the platform's `PORT` variable and binds to `0.0.0.0`. Fonts and preview imagery are served locally.

For this behavior, the host must run the production server after the build. `npm run dev` supports local SPA development, but its HTML is not prerendered and is not the production SEO target. Serving only `dist/index.html` for every URL would lose route-specific initial content and metadata. Do not configure a blanket home-page rewrite as a substitute.

If AI Studio ignores `npm start`, serves only a single generated document, or does not expose routing/server configuration, the repository alone cannot guarantee clean-route refreshes or crawler-visible route content there. Verify the platform's actual startup mechanism; if it cannot honor this contract, use a host that supports this Node server or the generated per-route static documents. Do not publish a router relying on unsupported rewrites.

## Required checks after a separately reviewed deployment

These checks have not been run successfully against production. Run them from a machine allowed to reach the host, after review and explicit deployment authorization:

```sh
for path in / /demo /about /partners; do
  curl --fail --silent --show-error -D - "https://leqada.ai.studio${path}"
done
curl --silent --show-error -D - https://leqada.ai.studio/missing-page
curl --silent --show-error -D - https://leqada.ai.studio/assets/missing.js
curl --silent --show-error -D - 'https://leqada.ai.studio/demo/?source=check'
curl --fail --silent --show-error https://leqada.ai.studio/robots.txt
curl --fail --silent --show-error https://leqada.ai.studio/sitemap.xml
```

For all four routes require HTTP 200, the correct route H1 and meaningful body text in the raw response, a unique title/description, the exact clean canonical URL, social tags and JSON-LD. Unknown paths and assets must return 404. `/demo/?source=check` must redirect to `/demo?source=check`. Confirm static JS, CSS, fonts, logo and preview image return 200.

In a browser, directly open and hard-refresh `/demo`, `/about` and `/partners`; try the same with JavaScript disabled to verify route-specific public content. Test `/#/demo`, `/#/about`, `/#/partners`, Back/Forward and links opened in a new tab. Verify no hydration errors, follow all eight lesson actions, open Need help?, toggle Show me where, restart, test mobile navigation, and confirm reduced-motion behavior. Recheck the platform's own redirects, caching and authentication so they do not hide 404s or force every route to the home document.
