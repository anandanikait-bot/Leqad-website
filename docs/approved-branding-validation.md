# Approved typography and branding validation

Typography A (Minimal Engineering) and Branding A, implemented from `main` at `de6720162f1675e2a80451cc2a2e6057dd85efea` on `feat/approved-typography-branding`.

The approved preview screenshots were reviewed before implementation. Fresh screenshots below were reviewed afterward. No blocking readability, clipping, spacing, or responsive issues were found.

## Changes

- Space Grotesk headings at 600; rotating hero phrase at 500. Manrope body text, navigation, and buttons. IBM Plex Mono technical labels retained; its existing package supplies real 400/500/600/700 faces.
- Original Google Fonts variable files, accompanying OFL licenses, and [source hashes](../public/assets/fonts/sources.json). Two static font preloads and `font-display: swap` avoid a third-party font connection.
- Navbar logo is 12% larger: 49.28px tall below 768px and 53.76px above. The existing 64px content height plus 1px border stays unchanged.
- Footer samples the complete official horizontal SVG into halftone dots. It preserves source alpha, ivory strokes, internal negative space, exact 1625:470 proportions, and Hay’s Russet accents. Centering, responsive dot density, reserved height, spacing, and bottom fade match Branding A.
- All official SVG files are byte-for-byte unchanged; [checksums](screenshots/approved-branding/official-svg-checksums.json). Navy `#0E2943`, ivory `#F5EFE7`, Hay’s Russet `#793327`. Existing CTA colors remain as approved.
- No marketing copy, route behavior, CAD geometry, lesson state, scrolling, or animation logic changes. No new dependencies or manifest changes.

## Automated results

| Check | Result |
| --- | --- |
| TypeScript: `npm run lint` | Pass |
| Unit: `npm test` | 24 passed |
| Production build and prerender: `npm run build` | Pass; all four routes and 404 generated |
| Browser: `npm run test:browser` | 93 passed |
| Responsive capture and font loading | 20 route/width cases; no horizontal overflow, clipped inspected text, logo/nav collisions, or page exceptions |
| Accessibility: axe-core 4.14.0, WCAG 2/2.1 A/AA | 35 scans; 0 reported violations |
| Initial font-load shifts | 24 final cold-context cases plus 24 comparison cases, normal loading and 250ms font delay; final maximum 0.003200, baseline maximum 0.023284 |
| Official SVG preservation | All unchanged |

Browser coverage includes the full eight-step walkthrough, actual rectangle drawing, touch input, dimension editing, extrusion, cancellation, restart, keyboard navigation, route refreshes, reduced motion, and existing scroll/parallax behavior.

The old assertions for 44/48px logo height, 220–310px footer height, and 70% fade were updated for the approved design. The fresh complete browser run passed afterward.

[Raw test output](screenshots/approved-branding/test-results.txt), [responsive metrics](screenshots/approved-branding/browser-combined.json), [accessibility results](screenshots/approved-branding/accessibility.json), and [font-loading observations](screenshots/approved-branding/font-loading-cls.json).

Font loading was measured in local Chromium with fresh contexts, reduced motion, and an observer running before navigation through font readiness plus 300ms. These are initial-load observations, not production field measurements. The comparison build is the unchanged typography baseline at `0d9b602`; the newer base commit only changed footer mask processing/assets. An earlier audit of this implementation observed a maximum 0.024759; both runs remained below 0.1.

Axe retains manual contrast-review items for gradients, layered content, and illustrated canvas/SVG elements. [Examples and reasons](screenshots/approved-branding/contrast-review.json) are retained; zero automated violations is not an accessibility certification.

## Visual judgment

The heading/body contrast in style is restrained and consistent with the unchanged official wordmark. The 12% enlargement is recognizable without crowding navigation. The complete centered footer lockup reads cleanly at 320px and remains balanced on desktop. The 1024px secondary hero CTA keeps its approved readable two-line wrap, without overlap; no extra layout redesign was introduced.

All five widths (320, 375, 768, 1024, 1440) were inspected. An independent read-only review found no actionable issues and verified delayed footer SVG loading and cached reload with reduced motion.

## Screenshots

[Browse all screenshots](screenshots/approved-branding/index.html). Each link opens a native-resolution full-page PNG; navbar, mobile menu, instruction panel, and footer crops are in the same directory.

| Surface | 320px | 375px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- | --- |
| Homepage | [320](screenshots/approved-branding/final/home-320.png) | [375](screenshots/approved-branding/final/home-375.png) | [768](screenshots/approved-branding/final/home-768.png) | [1024](screenshots/approved-branding/final/home-1024.png) | [1440](screenshots/approved-branding/final/home-1440.png) |
| About | [320](screenshots/approved-branding/final/about-320.png) | [375](screenshots/approved-branding/final/about-375.png) | [768](screenshots/approved-branding/final/about-768.png) | [1024](screenshots/approved-branding/final/about-1024.png) | [1440](screenshots/approved-branding/final/about-1440.png) |
| Partners | [320](screenshots/approved-branding/final/partners-320.png) | [375](screenshots/approved-branding/final/partners-375.png) | [768](screenshots/approved-branding/final/partners-768.png) | [1024](screenshots/approved-branding/final/partners-1024.png) | [1440](screenshots/approved-branding/final/partners-1440.png) |
| Demo | [320](screenshots/approved-branding/final/demo-320.png) | [375](screenshots/approved-branding/final/demo-375.png) | [768](screenshots/approved-branding/final/demo-768.png) | [1024](screenshots/approved-branding/final/demo-1024.png) | [1440](screenshots/approved-branding/final/demo-1440.png) |
| Navbar | [320](screenshots/approved-branding/final/navbar-320.png) | [375](screenshots/approved-branding/final/navbar-375.png) | [768](screenshots/approved-branding/final/navbar-768.png) | [1024](screenshots/approved-branding/final/navbar-1024.png) | [1440](screenshots/approved-branding/final/navbar-1440.png) |
| Footer | [320](screenshots/approved-branding/final/footer-320.png) | [375](screenshots/approved-branding/final/footer-375.png) | [768](screenshots/approved-branding/final/footer-768.png) | [1024](screenshots/approved-branding/final/footer-1024.png) | [1440](screenshots/approved-branding/final/footer-1440.png) |

## Reproduce

`main` currently has no package lock, so `npm ci` cannot run. Setup used `npm install --package-lock=false --cache /tmp/leqad-npm-cache`, preserving the repository manifests.

```sh
npm run lint
npm test
npm run build
npm run test:browser
# With the built site served at localhost:4173:
node scripts/audit-approved-branding.mjs
node scripts/audit-font-loading.mjs
# Optional comparison: set BASELINE_ORIGIN to a separately served baseline build.
# Use a separately installed axe-core; it is not a website dependency:
AXE_SOURCE_PATH=/path/to/axe-core/axe.min.js node scripts/audit-content-accessibility.mjs
```

The accessibility script writes its existing content-UX report location; this review's fresh result is copied into `screenshots/approved-branding/accessibility.json`.

No merge or deployment was performed. Production/CDN font timing and hosting behavior remain for post-approval deployment verification.
