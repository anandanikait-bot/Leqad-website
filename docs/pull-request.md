Leqad's landing page and walkthrough had repeated UI and two live demo instances, while hash routing and an empty HTML shell limited direct navigation and crawler-visible content. This change removes the annotated clutter, keeps the full lesson at `/demo`, uses a static About preview, and adds clean React Router links with legacy hash replacement.

The navy footer retains the original halftone particles and a large centered wordmark, with actual font-metric fitting and a canvas-only bottom fade. The logo emblem, Leqad name, fonts, colors, hero layout/artwork and CAD lesson callbacks are preserved; the annotated standalone CAD descriptor is removed. Optional hints and explanations are closed under “Need help?”. Lenis provides subtle wheel scrolling with native touch, reduced-motion opt-out, CAD/dialog exclusions and cleanup. The approved font families are served locally.

The production build prerenders `/`, `/demo`, `/about` and `/partners` with meaningful HTML, unique titles/descriptions, canonical links, Open Graph/Twitter metadata, a sharing image and accurate structured data. Robots and sitemap are included. An explicit production server serves the correct document for each route, redirects generated-document aliases and returns real 404s. It does not rely on undocumented SPA rewrites.

Validation:

- TypeScript and production client/prerender build passed.
- All 18 Node tests passed, including the 14 existing tests.
- All 30 Chromium browser tests passed: five requested widths, full lesson progression/restart, hints/highlighting, no duplicate interactive About demo, clean URLs/refreshes/history/legacy links, no-JS public content and metadata, mobile menu/touch, Lenis exclusions, reduced-motion lifecycle and footer fit/fade.
- Independent review findings were fixed with failing-then-passing regression coverage. Screenshot review corrected clipped wordmark ascenders and the narrow CAD ribbon.

**Hosting limitation:** local production routing works; AI Studio production compatibility is **unverified** because this environment's proxy rejects `leqada.ai.studio` with a tunnel 403. The host must honor `npm run build` followed by `npm start`, or serve the generated route documents correctly. [Hosting contract and exact post-deployment checks](https://github.com/anandanikait-bot/Leqad-website/blob/feat/minimal-cleanup-routing-seo/docs/hosting.md) are documented. No deployment or merge was performed.

[Full validation record and all eight screenshots](https://github.com/anandanikait-bot/Leqad-website/blob/feat/minimal-cleanup-routing-seo/docs/validation.md)

| Home, desktop | Home, mobile |
| --- | --- |
| ![Desktop home](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/minimal-cleanup-routing-seo/docs/screenshots/home-desktop.png) | ![Mobile home](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/minimal-cleanup-routing-seo/docs/screenshots/home-mobile.png) |

| Demo, desktop | Demo, mobile |
| --- | --- |
| ![Desktop demo](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/minimal-cleanup-routing-seo/docs/screenshots/demo-desktop.png) | ![Mobile demo](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/minimal-cleanup-routing-seo/docs/screenshots/demo-mobile.png) |
