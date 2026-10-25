# Hosting and route verification

The intended canonical public origin is **https://leqad.com/**. The owner reported that the DNS mapping and HTTPS certificate work on 2026-10-24, but the exact production build and deep-route behavior have **not** been independently verified here. Earlier requests to the original `leqada.ai.studio` host were rejected by this environment's outbound proxy (`Tunnel connection failed: 403 Forbidden`); this is an access limitation, not evidence of route failure. No deployment was performed by this documentation update.

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
  curl --fail --silent --show-error -D - "https://leqad.com${path}"
done
curl --silent --show-error -D - https://leqad.com/missing-page
curl --silent --show-error -D - https://leqad.com/assets/missing.js
curl --silent --show-error -D - 'https://leqad.com/demo/?source=check'
curl --fail --silent --show-error https://leqad.com/robots.txt
curl --fail --silent --show-error https://leqad.com/sitemap.xml
```

For all four routes require HTTP 200, the correct route H1 and meaningful body text in the raw response, a unique title/description, the exact clean canonical URL, social tags and JSON-LD. Unknown paths and assets must return 404. `/demo/?source=check` must redirect to `/demo?source=check`. Confirm static JS, CSS, fonts, logo and preview image return 200.

In a browser, directly open and hard-refresh `/demo`, `/about` and `/partners`; try the same with JavaScript disabled to verify route-specific public content. Test `/#/demo`, `/#/about`, `/#/partners`, Back/Forward and links opened in a new tab. Verify no hydration errors, follow all eight lesson actions, open Need help?, toggle Show me where, restart, test mobile navigation, and confirm reduced-motion behavior. Recheck the platform's own redirects, caching and authentication so they do not hide 404s or force every route to the home document.

## Domain migration and www forwarding

The canonical origin for prerendered metadata, the sitemap and social-sharing cards is `https://leqad.com`.
The old AI Studio address is Google-managed. The Express server returns 308 redirects to `https://leqad.com` for GET/HEAD requests with a `Host` of `leqada.ai.studio` or `www.leqad.com`, preserving path and query. **This cannot guarantee an old-URL redirect unless Google's edge actually forwards requests and original hostnames to this Node server.** Test it after deployment; do not unpublish the old AI Studio URL as a workaround.

For `www.leqad.com`, prefer Spaceship's HTTPS-enabled subdomain-only **301 URL redirect** to `https://leqad.com`. Keep the existing A/AAAA/TXT records for `@` untouched. Do not apply a root-domain redirect, change nameservers, or use a masked/frame redirect. Test `https://www.leqad.com/about?from=www` redirects to `https://leqad.com/about?from=www`, and verify certificate and DNS state. If Spaceship cannot preserve the full path/query, an alternative is to map `www.leqad.com` to the same Cloud Run service with Google-provided DNS and let the Node server 308 canonicalize it. That requires separate certificate provisioning.

Publishing to Google AI Studio / Cloud Run is a separate operation from merging to GitHub. Recheck the raw HTML from all four routes and their canonical/Open Graph/JSON-LD metadata after the deployment. Submit `https://leqad.com/sitemap.xml` in Google Search Console when the new version is live.
