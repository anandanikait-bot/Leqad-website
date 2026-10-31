# Production quality audit

Base: `ab3a313` (latest main fetched 2026-10-31 UTC). Branch: `fix/website-production-quality`.

The baseline was installed with `npm ci --cache /tmp/leqad-npm-cache` (the default cache is outside this workspace's writable paths). TypeScript, ESLint, all 33 unit tests, build/prerender and all 170 existing browser tests passed. Build output was frozen before implementation and served independently for before captures. Open PR enumeration via GitHub API and live `https://leqad.com` requests were blocked (API Forbidden / CONNECT 403); remote overlap, hosting, headers and DNS are not represented as passing.

## Technical audit: 20 items

| # | Check | Baseline | Final / evidence |
|---|---|---|---|
| 1 | Four direct routes, hard refresh | Passed | Generated HTML, production browser/server tests |
| 2 | Meaningful visible content without JavaScript | Passed | No-JS browser checks; prerender retained |
| 3 | Unique titles/descriptions | Passed | Existing generic titles made more descriptive; no visible copy change |
| 4 | One meaningful H1, heading hierarchy, HTML language | Passed | Route scans and no-JS tests |
| 5 | Canonicals/OG URLs/query/slash handling | Passed | Canonical route list, redirects and query checks |
| 6 | Organization/WebSite/page structured data | Passed | JSON parsed; graph URLs/linkage verified; no invented schema |
| 7 | Social PNGs/MIME/dimensions | Passed locally | Binary PNG signature/dimensions and HTTP checks; live Needs production verification |
| 8 | Robots public access | Passed locally | Text MIME, status and directives; live Needs production verification |
| 9 | Sitemap canonical/indexable route list | Passed locally | XML parsed and every URL checked against canonical and HTTP status |
| 10 | Optional llms.txt | Not applicable | Not required; not added |
| 11 | Domain/alternate-host redirects | Needs production verification | Server unit tests cover host behavior; DNS/TLS/edge unchanged |
| 12 | Real unknown-route/asset 404 and noindex | Passed | No canonical for unknown page; no homepage fallback |
| 13 | Public handoff artifacts | Failed | Exact dist-only cleanup; originals retained in public/ |
| 14 | Unintended public source maps/environment files | Passed | Generated tree scanned; no source maps enabled |
| 15 | Route JS delivery | Failed | Demo eagerly loaded on unrelated routes; deferred in the client; eager server rendering preserves complete static HTML |
| 16 | Dependency usage | Failed | Five unimported direct packages removed, lock updated; no runtime dependency upgrades |
| 17 | Decorative lifecycle/reduced motion/WebGL fallback | Failed | Tab restoration could redraw an offscreen footer; intersection and tab visibility now stay separate. Existing lifecycle tests retained; no FPS/design changes |
| 18 | Console/hydration/network reliability | Passed locally | All direct routes, reload and client navigation checked; Formspree account delivery remains production-only |
| 19 | Accessible sketch SVG semantics | Failed | Full-page axe drew rectangle and found prohibited aria-label; added image role with existing accessible name |
| 20 | Responsive behavior and performance evidence | Passed locally / Needs production verification | Seven widths; cold local desktop/mobile records; field INP and physical-device experience unverified |

## Visual audit: 20 items

These are visual judgments from seven-width page and interactive-state screenshots, distinct from automated tests. Baseline is the current approved site, not the older annotated screenshots. No visual redesign is proposed.

| # | Criterion | Result |
|---|---|---|
| 1 | Approved logo geometry and wordmark | Passed; asset bytes unchanged |
| 2 | Navy, ivory, russet identity | Passed; color/style sources unchanged |
| 3 | Approved heading/body/mono typography | Passed; fonts unchanged |
| 4 | Homepage layout and whitespace | Passed; preserved |
| 5 | Rotating headline readability/behavior | Passed; existing animation preserved |
| 6 | Interactive CAD hero | Passed; geometry/handlers preserved |
| 7 | CTA identity and label clarity | Passed; shader/labels preserved |
| 8 | Navigation alignment/mobile menu | Passed; existing layout preserved |
| 9 | Footer logo centering and proportions | Passed; capture waits for canvas paint |
| 10 | Footer functional links | Passed; retained |
| 11 | Heading hierarchy and spacing | Passed; no added badges/sections |
| 12 | Paragraph density/readability | Passed; no visible copy changes |
| 13 | No gradient headline/generic purple palette | Passed |
| 14 | No decorative emoji/new texture/glass | Passed |
| 15 | No unnecessary shadows/borders | Passed; existing controls retained |
| 16 | No repetitive new card layouts | Passed |
| 17 | About preview remains noninteractive | Passed; unchanged |
| 18 | Partners planner and contact hierarchy | Passed; unchanged |
| 19 | Demo tools/instruction legibility | Passed; existing mobile tool labels preserved |
| 20 | Seven-width clipping/overlap/overflow | Automated page overflow checks plus visual inspection; extreme freely rotated hero angles are not an all-angle clipping certification |

## Evidence and limitations

Screenshots and raw records: [before](screenshots/production-quality/before/) and [after](screenshots/production-quality/after/). Page, contact-dialog, drawn-rectangle and extrusion captures cover 320, 375, 390, 430, 768, 1024 and 1440 px. `responsive.json` records browser diagnostics/overflow; `accessibility.json` contains unsuppressed axe results including manual-review items; `build.json` inventories actual generated files; `performance.json` records cold local lab samples with methodology.

Local tests do not prove deployed behavior. After deployment, verify live HTML/metadata/statuses, robots/sitemap/image MIME, edge compression/cache policy, alternate HTTPS host redirects, no archives/maps at origin, Search Console/social preview refresh, and real Formspree account receipt. Test a physical phone and field CWV/INP. No real inquiry was submitted, no DNS changed, no deploy or merge performed.


## Implementation boundaries

The server still uses `renderToString` for static HTML. Only the browser lazily imports the demo route; the build passes the eager lesson component through the same Suspense boundary. This preserves meaningful no-JS content and stable hydration, while the homepage/About/Partners avoid downloading the lesson code. Initial navigation to the demo requires an additional module request; the focused test verifies its real navigation and refresh interactions. Contact/planner modules remain eager because splitting every small interaction would increase complexity and loading boundaries.

Dist cleanup uses an exact list, rather than deleting source originals or broad file types. Font provenance and OFL licenses remain public. Removed unused packages: `@google/genai`, `dotenv`, `motion`, `@fontsource/dm-sans`, and `autoprefixer`; 48 installed packages disappear, with no dependency version upgrades. Approved font files remain unchanged; WOFF2 conversion and frame-rate changes are not part of this pass.

Axe results are automated findings, not WCAG certification. Manual review here means screenshot/design inspection; physical-device and assistive-technology review remain owner checks. Existing keyboard, touch-emulation, drawing, dimension editing, extrusion/cancellation/restart, contact states, reduced-motion and WebGL fallback tests are retained.


## Verification results

| Check | Baseline | Final stable build |
|---|---:|---:|
| npm ci (workspace cache) | Passed, 318 packages | Passed, 270 packages |
| TypeScript | Passed | Passed |
| ESLint, zero warnings allowed | Passed | Passed |
| Unit tests | 33 passed | 33 passed |
| Build and all route prerenders | Passed | Passed |
| Full browser suite | 170 passed | 179 passed (2.9 minutes) |
| Focused new browser tests | Expected failures before fixes | 9 passed |
| Axe screenshot-state scans | 7 drawn-sketch violations / 49 scans | 0 violations / 49 scans |
| Screenshots | 49 across seven widths | 49 across seven widths |
| Overflow/browser diagnostics | No failures in captured states | No failures in captured states |
| Independent source review | Read-only SEO/asset audits | No actionable code issue remaining |

The first exploratory optimization run exposed a real no-JS regression: streamed Suspense output placed the lesson outside main until a reveal script ran. The new crawler test, existing no-JS page test, and `/demo fits 768px without overflow` heading assertion failed. The final implementation restores synchronous eager server rendering, and all three pass in the full stable rerun. A new overly broad artifact assertion rejected the legitimate font README; it now tests only the confirmed handoff paths. The existing raw-HTML title unit assertion also needed entity decoding for the new ampersand-containing title. No assertions were removed. Tests first reproduced archive publication, eager demo delivery, SVG semantics and offscreen footer redraw before their fixes.

## Screenshot comparisons

Every width has full-page images in the evidence directories. Representative direct links:

| Page/state | Before desktop | After desktop | Before mobile | After mobile |
|---|---|---|---|---|
| Homepage | [before 1440px](screenshots/production-quality/before/home-1440.png) | [after 1440px](screenshots/production-quality/after/home-1440.png) | [before 375px](screenshots/production-quality/before/home-375.png) | [after 375px](screenshots/production-quality/after/home-375.png) |
| About | [before 1440px](screenshots/production-quality/before/about-1440.png) | [after 1440px](screenshots/production-quality/after/about-1440.png) | [before 375px](screenshots/production-quality/before/about-375.png) | [after 375px](screenshots/production-quality/after/about-375.png) |
| Partners | [before 1440px](screenshots/production-quality/before/partners-1440.png) | [after 1440px](screenshots/production-quality/after/partners-1440.png) | [before 375px](screenshots/production-quality/before/partners-375.png) | [after 375px](screenshots/production-quality/after/partners-375.png) |
| Demo | [before 1440px](screenshots/production-quality/before/demo-drawn-rectangle-1440.png) | [after 1440px](screenshots/production-quality/after/demo-drawn-rectangle-1440.png) | [before 375px](screenshots/production-quality/before/demo-drawn-rectangle-375.png) | [after 375px](screenshots/production-quality/after/demo-drawn-rectangle-375.png) |
| Inquiry | [before 1440px](screenshots/production-quality/before/contact-dialog-1440.png) | [after 1440px](screenshots/production-quality/after/contact-dialog-1440.png) | [before 375px](screenshots/production-quality/before/contact-dialog-375.png) | [after 375px](screenshots/production-quality/after/contact-dialog-375.png) |
| Drawn rectangle | [before 1440px](screenshots/production-quality/before/demo-drawn-rectangle-1440.png) | [after 1440px](screenshots/production-quality/after/demo-drawn-rectangle-1440.png) | [before 375px](screenshots/production-quality/before/demo-drawn-rectangle-375.png) | [after 375px](screenshots/production-quality/after/demo-drawn-rectangle-375.png) |
| Extruded solid | [before 1440px](screenshots/production-quality/before/demo-extruded-1440.png) | [after 1440px](screenshots/production-quality/after/demo-extruded-1440.png) | [before 375px](screenshots/production-quality/before/demo-extruded-375.png) | [after 375px](screenshots/production-quality/after/demo-extruded-375.png) |


Visual judgment: the approved design remains intact. Before/after page PNG dimensions match at all 28 route/width combinations. Canvas/CTA paint timing can vary between captures, so these are not claims of pixel-identical rendering. No new clipping or overlap was identified in the captured states; arbitrary extreme hero rotations remain outside this certification.

Reproduce captures with `AUDIT_ORIGIN=http://127.0.0.1:4173 AUDIT_LABEL=after AUDIT_PHASE=capture node scripts/audit-production-quality.mjs`. On an otherwise idle host run the same command with `AUDIT_PHASE=metrics`. Use a separately served frozen baseline build and `AUDIT_LABEL=before` for comparisons; never measure against a build being rewritten. Raw JSON includes settings, all samples, ranges via individual measurements, failed requests and every generated asset's size.

## Measured performance comparison

See the [complete performance report](screenshots/production-quality/performance-summary.md) for all three-sample medians/ranges, per-route request and transfer counts, long-task records and raw CDP data.

| Measure | Before | After |
|---|---:|---:|
| Deployment directory | 6,083,707 bytes | 2,121,367 bytes (65.1% smaller) |
| Initial JS on /, /about, /partners | 427,564 bytes | 382,980 bytes (10.4% smaller) |
| Combined JS across both chunks | 427,564 bytes | 429,587 bytes |
| Offline gzip of combined JS | 129,355 bytes | 130,709 bytes |
| Cold demo requests | 12 | 13 |
| Cold samples per build | 24 | 24 |

The reduction in deployment size is primarily unrequested reference material, not a 65% reduction in page transfer. Non-demo page transfers fall about 44.5 KB (~5%). Demo transfer grows 2,421 bytes and one request. Local timing changes are mixed: desktop demo median LCP rose from 344 to 396 ms; mobile medians remain near 1.7 seconds; CLS medians are unchanged. There is no clear overall LCP or CPU improvement. Visible homepage canvas/CTA work remains substantial in this 4× CPU lab profile; inspect physical-device responsiveness before publishing rather than reducing animation quality without evidence. No field INP claim is made.
