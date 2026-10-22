# Landing page and supporting-page parallax

Branch: `feat/landing-parallax`, created from latest fetched `main`, `68e1818e5be8d9a6dee5de719f1d721cbf03cf09`. That base was fetched again after implementation and remained unchanged. No merge or deployment is performed by this work.

## Changes

- `/` does not mount `SiteHeader`, including in prerendered HTML. Other public routes retain the existing header. The homepage still has no footer and uses the full available viewport height, with natural document scrolling on short/narrow screens.
- Heading, reserved-height cycling phrase, description and CTA group are centered within the existing left column. Desktop retains the text/artwork columns and vertical alignment; smaller screens stack naturally. Copy, font families/sizes, cycling phrases and interactive CAD artwork logic are unchanged.
- About moves only its static product-preview image and the existing collaboration-banner grid. Each has 16px total travel (up to 8px either side). The Partners closing banner has a faint technical grid with 12px total travel (up to 6px either side). Text, CTAs and inputs remain in normal, stationary document layout.
- A shared helper subscribes to the existing Lenis `scroll` notifications. It caches parent layout measurements and writes only transforms during scrolling. Resize/font readiness update the measurements. There is no added scroll controller, animation loop, per-frame React state, or dependency. The existing Lenis options, CAD exclusion, native touch mode and route reset behavior are unchanged.
- Parallax is limited to About and Partners. Initial and runtime reduced-motion preferences disable it entirely and restore the original transforms. Route cleanup removes the scroll subscription, resize observers/listener and transform styles. The pages remain complete without animation or JavaScript.

## Verification

| Command | Result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache` | Passed; dependency declarations and lockfile unchanged |
| `npm run lint` | Passed; TypeScript |
| `npm test` | 23 passed, 0 failed, 0 skipped |
| `npm run build` | Passed; client build, four public routes and 404 prerendered |
| `npm run test:browser` | 54 passed, 0 failed, 0 skipped, system Chromium |
| `npm run screenshots` | Passed; four routes at all five widths |
| `npx tsx scripts/capture-parallax-states.ts` | Passed; active-motion desktop/mobile closeups and scroll measurements |
| `git diff --check` | Passed |

The new behavior checks first failed against the unchanged build for the mounted homepage header and missing motion layers, then passed after implementation. The full browser suite also validates centered hero/CTA geometry, desktop columns and viewport use, reachable artwork and its click-to-switch interaction at every requested width; real scroll-linked movement and stable parent boxes; initial/runtime reduced motion; navigation back to the stable Demo; native mobile touch scrolling; public-route headers, metadata and prerendering without JavaScript; and the existing eight-step lesson, dimensions, extrusion, cancellations, restart, view controls and prerequisite guards.

Independent review found no material issues. The reviewer also exercised repeated reduced-motion toggles and mobile route changes without browser errors. No formal frame-time benchmark, physical-device test or screen-reader audit was performed.

## Fresh screenshots

The following captures come from the modified production build, after fonts were ready. Full-page captures use reduced motion so every page is visible without relying on animation. The homepage was visually inspected at every listed width; the separate closeups below show the supporting-page layers with motion enabled.

| Width | Homepage | About | Partners | Demo |
| --- | --- | --- | --- | --- |
| 320px | [Home](screenshots/home-320px.png) | [About](screenshots/about-320px.png) | [Partners](screenshots/partners-320px.png) | [Demo](screenshots/demo-320px.png) |
| 375px | [Home](screenshots/home-mobile.png) | [About](screenshots/about-mobile.png) | [Partners](screenshots/partners-mobile.png) | [Demo](screenshots/demo-mobile.png) |
| 768px | [Home](screenshots/home-768px.png) | [About](screenshots/about-768px.png) | [Partners](screenshots/partners-768px.png) | [Demo](screenshots/demo-768px.png) |
| 1024px | [Home](screenshots/home-1024px.png) | [About](screenshots/about-1024px.png) | [Partners](screenshots/partners-1024px.png) | [Demo](screenshots/demo-1024px.png) |
| 1440px | [Home](screenshots/home-desktop.png) | [About](screenshots/about-desktop.png) | [Partners](screenshots/partners-desktop.png) | [Demo](screenshots/demo-desktop.png) |

| Active-motion detail | Desktop | Mobile |
| --- | --- | --- |
| About preview image | [Image](screenshots/parallax/about-preview-desktop.png) | [Image](screenshots/parallax/about-preview-mobile.png) |
| About collaboration grid | [Image](screenshots/parallax/about-grid-desktop.png) | [Image](screenshots/parallax/about-grid-mobile.png) |
| Partners closing banner | [Image](screenshots/parallax/partners-grid-desktop.png) | [Image](screenshots/parallax/partners-grid-mobile.png) |

[Scroll measurements](screenshots/parallax/scroll-measurements.json) record transform offsets before/after a real 160px document scroll and the unchanged document position of nearby text, on desktop and mobile viewports. Travel stays within the declared bounds. These are browser measurements, not a performance benchmark.

## Scope and remaining delivery limitation

Implementation files: `src/App.tsx`, `src/components/home/Hero.tsx`, `src/components/home/ProductPreview.tsx`, `src/components/about/AboutPage.tsx`, `src/components/partners/PartnershipOverview.tsx`, `src/components/layout/ScrollManager.tsx`, and new `src/lib/parallax.ts`. Tests: `test/browser/website.spec.ts` and new `test/browser/landing-parallax.spec.ts`. Evidence helper: `scripts/capture-parallax-states.ts`.

A comparison against the base confirms no changes to any Demo source, hero CAD geometry/interaction source, sonar grid animation, footer source, brand assets, product claims, dependency declarations or lockfile. The only scroll-manager change is the route-limited parallax subscription; the existing controller settings and route-reset effects remain intact.

GitHub GraphQL requests return `Post "https://api.github.com/graphql": Forbidden` through this environment. The branch and prepared [draft PR description](landing-parallax-pr.md) are reviewable, but the live draft PR cannot be claimed created without a successful creation response. No merge or deployment is authorized or performed. Production hosting behavior is outside this local validation; the existing [post-deployment checklist](hosting.md) still applies after a separately authorized deployment.
