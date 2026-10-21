# Review evidence

Branch: `feat/minimal-cleanup-routing-seo`.

The five supplied annotated screenshots guided the removals. The logo emblem and Leqad name, palette, font families, hero headline/layout, CAD illustration, lesson callbacks and halftone particles are retained. The separate CAD descriptor beside the name was removed as annotated in red. The same approved font families are bundled locally to remove external-font failures. About now uses a static capture of the actual CAD lesson instead of mounting another interactive workbench.

## Validation

- `npm run lint`: TypeScript passed.
- `npm test`: 18 tests passed (14 existing lesson/platform tests and 4 route/SEO/server regression tests).
- `npm run build`: client build and prerendering of all four public routes and the 404 page passed.
- `npm run test:browser`: **30 tests passed**, no failures or skips. Runs against `npm start`, not just the Vite dev server, using system Chromium at `/usr/bin/chromium`.
- `git diff --check`: passed.

Browser coverage includes all four routes at **320, 375, 768, 1024 and 1440px**; no document overflow or console/page errors; mobile teaching panel before canvas; footer dimensions and mask; all lesson actions, hints, Why explanations, highlighting, completion/restart and step navigation; static About preview; real links, legacy hash replacement, direct refresh, Back/Forward; prerendered content/metadata with JavaScript disabled; wheel exclusions, mobile navigation and native touch scrolling; immediate route scroll resets; reduced-motion startup and runtime preference changes; and footer ascender clearance.

Desktop images are 1440px wide and mobile images are 375px wide. Captures use reduced motion to keep artwork stable and wait for local fonts and the footer canvas. They are full-page screenshots from the built site. Regenerate with `PORT=4173 npm start` and, in another terminal, `npm run screenshots`.

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | [Screenshot](screenshots/home-desktop.png) | [Screenshot](screenshots/home-mobile.png) |
| Demo | [Screenshot](screenshots/demo-desktop.png) | [Screenshot](screenshots/demo-mobile.png) |
| About | [Screenshot](screenshots/about-desktop.png) | [Screenshot](screenshots/about-mobile.png) |
| Partners | [Screenshot](screenshots/partners-desktop.png) | [Screenshot](screenshots/partners-mobile.png) |

## Independent review

A fresh reviewer found no Critical issues. A generated-HTML alias returned 200 before client routing showed a 404; known document aliases now redirect to canonical clean URLs, and direct access to `404.html` returns 404. A runtime preference change did not stop the persistent footer animation; the footer now subscribes to reduced-motion changes and settles its particles. Both issues have regression tests observed failing before their fixes. Visual review also found clipped footer ascenders and a narrow CAD ribbon; actual font-metric fitting and toolbar wrapping correct those issues.

No unresolved review findings are intentionally deferred.

## Hosting limitation

Local production routing is verified. **AI Studio production routing remains unverified:** this environment's outbound proxy rejected access to `leqada.ai.studio` with a tunnel 403. This result does not establish the hosting platform's capabilities. [Hosting documentation](hosting.md) gives the build/start contract and exact post-deployment checks. No deployment or merge was performed. Deployment remains a separate reviewed action.
