# Leqad.com domain cutover checklist

## Official public website
- Canonical origin: **https://leqad.com** (without `www`).
- Former AI Studio URL: `https://leqada.ai.studio`; the old hostname belongs to Google, not Spaceship.
- DNS/HTTPS mapping for `leqad.com` was completed by the owner on 2026-10-24. Do not replace the existing four A, four AAAA, Google verification TXT, or any SPF/email records.

## Changes in this repository
- All four public routes emit canonical, Open Graph, Twitter image and JSON-LD URLs rooted at `https://leqad.com`, in both prerendered HTML and client-side navigation.
- Public `robots.txt` and `sitemap.xml` point to `leqad.com`.
- The Express production server 308-redirects GET/HEAD requests to the known alternate hosts `www.leqad.com` and `leqada.ai.studio` **only if the request reaches this server with that Host header**; paths and queries are preserved. Other hostnames (such as the Cloud Run run.app URL) are not redirected.
- Regression tests cover metadata, sitemap/robots and host-based redirects.

## Set up www through Spaceship
1. Domain Manager → **leqad.com → URL redirect**.
2. Choose a **subdomain redirect for `www` only**. Do **not** forward `@` or the entire root domain.
3. Destination: `https://leqad.com`.
4. Type: **301 Permanent**, HTTPS/SSL supported. Select ordinary forwarding, **not frame masking**.
5. If available, preserve path and query string.
6. Save; confirm `https://www.leqad.com` and `https://www.leqad.com/about?source=www` land on the corresponding leqad.com URLs.

Spaceship says URL redirects require its DNS and it supports subdomain redirects with SSL; do not change nameservers if the existing domain mapping is healthy. If Spaceship asks to replace the root A/AAAA records or won't support subdomain-only redirect, stop rather than disrupting the primary website. Instead add a **separate** `www.leqad.com` mapping to the Cloud Run service, copy **Google-provided** CNAME records for host `www`, await that certificate, and let this app's 308 host redirect canonicalize the subdomain.

## Old URL
The legacy `leqada.ai.studio` URL is managed by Google AI Studio. Spaceship **cannot** redirect it using leqad.com's DNS. The app's redirect will work only if old-host traffic reaches this project's updated Cloud Run service with the original Host header. Otherwise leave it active and rely on canonical SEO metadata; investigate Google's supported options before unpublishing, which could release the name or affect availability.

## Deployment checks after review
1. Merge this PR only after all CI checks pass.
2. Deploy/publish the exact updated build to the existing Leqad Cloud Run service (a GitHub merge alone does not update AI Studio deployment).
3. Verify `https://leqad.com/`, `/demo`, `/about`, `/partners` load and the raw HTML contains the new canonical URL and branded image paths.
4. Confirm `https://leqad.com/robots.txt` and `https://leqad.com/sitemap.xml` return 200 and mention only the canonical domain.
5. Test both www and old AI Studio host redirect status, `Location`, path and query on real HTTPS connections. If old AI Studio remains separate, do not claim it's redirected.
6. Update site URL and sitemap settings in Google Search Console. Update GitHub repository homepage, outreach materials and external profile links **manually** where applicable.

Do not claim a DNS redirect or new Cloud Run deployment was completed by changes to this GitHub repository.

## Sharing/link preview recovery

The old published metadata referenced `https://leqada.ai.studio/assets/leqad-home-share-v1.png`. Because the official address is now `leqad.com`, link-preview crawlers can fail to fetch the image from the old hostname and render a blank card, even if the Leqad page title appears.

The new server-rendered Open Graph and Twitter tags use `https://leqad.com/assets/leqad-home-share-v1.png?v=20261025` (with the existing static PNG), correct `og:image:width`/`height` (1440×1000), HTTPS secure URL and image/png MIME type. The version parameter asks caches to re-fetch the image without changing its contents.

**Verify production rather than assuming GitHub deployment**:
- View *page source* (not DevTools's dynamically mutated DOM) at `https://leqad.com/`. Confirm `og:image`, `og:image:secure_url`, `og:url` and canonical URLs use `leqad.com`.
- Open `https://leqad.com/assets/leqad-home-share-v1.png?v=20261025` in a private browser window. It must return a visible PNG, not an HTML fallback, 403, or 404.
- Inspect the image HTTP response for `200` and `Content-Type: image/png`, without authentication.
- Ask the messaging platform to re-scrape the domain or reshare the URL. Some platforms cache previews of the page URL itself; a query-string variant such as `https://leqad.com/?share=20261025` may refresh them, but the canonical URL remains `https://leqad.com/`.
- Bots may be blocked by hosting/network policy even when your browser works. An actual crawler fetch is required to confirm the preview on each platform.

The preview uses the **existing** PNG; do not misstate it as a newly generated 1200×630 poster. If a separate 1200×630 static card is designed later, update the asset, width/height declarations, and tests in the same change.
