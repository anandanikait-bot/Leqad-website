# Crisp Leqad browser favicon

Branch: `fix/crisp-browser-favicon`, from latest `main` at `d0f1270`. This changes the browser tab icon only. No merge or deployment was performed.

## What changed

The previous favicon was an SVG containing a raster navbar image and color-matrix filters. It relied on runtime filtering and scaling to produce tiny tab images. The replacement is a set of favicon-specific optical drawings, rasterized directly at each native output size, plus an ICO containing those exact PNG frames.

- Separate **16×16, 32×32 and 48×48** drawings preserve the approved circular silhouette, cream chambers, navy structure, two diagonal slots and rust three-pronged center. They are favicon adaptations, not a claim of geometry-identical native vectors for the official logo.
- Each drawing has its own grid and optical spacing. The 16px version uses thicker navy structure, enlarged rust accents and wider separators so important details survive small-size rendering. Curves receive normal edge-coverage antialiasing; there are no blur operations, SVG filters, shadows, texture or scaled source-image pixels in the generated assets.
- The exterior is transparent, including all four corner pixels. Cream inside the symbol is intentional artwork; there is no opaque square background. A restrained cream perimeter keeps the symbol distinguishable on dark tabs. The silhouette reaches within half a pixel of the image edge, avoiding the source logo's extra padding.
- Colors use Leqad's existing navy `#0E2943`, cream `#F5EFE7` and rust `#B74B21`. The artwork stays recognizable on both themes without color filters or a theme-dependent SVG.
- `index.html` declares each PNG's exact dimensions and an ICO fallback. All four paths include **v2**, avoiding reuse of the old `leqad-tab-v1.svg` URL. The Apple touch icon is unchanged. The old SVG remains available for existing links and the before comparison, but is no longer an active favicon reference.

## Delivered assets

| File | Native dimensions | Bytes |
| --- | --- | --- |
| [leqad-16-v2.png](../public/assets/favicons/leqad-16-v2.png) | 16×16 | 826 |
| [leqad-32-v2.png](../public/assets/favicons/leqad-32-v2.png) | 32×32 | 2,200 |
| [leqad-48-v2.png](../public/assets/favicons/leqad-48-v2.png) | 48×48 | 3,645 |
| [leqad-v2.ico](../public/assets/favicons/leqad-v2.ico) | 16×16, 32×32, 48×48 PNG frames | 6,725 |

## Actual browser-tab evidence

The native-size comparison is a review sheet on light/dark tab-color samples. The separate tab-strip and full-window captures below are **real headed Chromium browser UI**, captured from a virtual X display, not webpage imitations. Cropped tab strips retain their original device pixels; no resizing was applied.

| Tab appearance | Native 16px at 100% scale | Native 32px at 200% scale |
| --- | --- | --- |
| Light | [Actual tab strip](screenshots/favicon/tab-strip-light-16px.png) | [Actual tab strip](screenshots/favicon/tab-strip-light-32px.png) |
| Dark | [Actual tab strip](screenshots/favicon/tab-strip-dark-16px.png) | [Actual tab strip](screenshots/favicon/tab-strip-dark-32px.png) |

[Native-size before/after review, plus pixel inspection](screenshots/favicon/native-size-review.png).

Full windows: [light 1×](screenshots/favicon/chromium-light-1x.png), [light 2×](screenshots/favicon/chromium-light-2x.png), [dark 1×](screenshots/favicon/chromium-dark-1x.png), [dark 2×](screenshots/favicon/chromium-dark-2x.png).

[Browser verification data](screenshots/favicon/chromium-verification.json) records Chromium **154.0.8037.57**, actual device-pixel ratios of 1 and 2, and the favicon bitmap database from fresh temporary profiles. In all four cases Chromium selected the new versioned ICO and stored native **16×16 and 32×32** frames. The ICO also includes the exact native 48×48 PNG. No old filtered SVG was selected. Temporary verification profiles were removed afterward.

All four tab captures and the native-size review were visually inspected. The automated checks verify image dimensions, alpha transparency, substantial opaque brand-color regions, valid ICO directory entries and exact frame contents. They do not substitute for the visual review. Verification used Chromium on Linux; separately branded Google Chrome installations and other desktop operating systems were not run.

## Test results

| Check | Result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache` | Passed; dependency declarations and lockfile unchanged |
| `npm run lint` | Passed |
| `npm test` | **26 passed**, 0 failed, 0 skipped |
| `npm run build` | Passed; client build plus all route prerenders |
| `npm run test:browser` | **60 passed**, 0 failed, 0 skipped |
| `git diff --check` | Passed |

The new link check first failed against the old SVG declaration; the ICO-frame check first failed before the new asset existed. Native-pixel checks also identified insufficient solid navy coverage in the first small drawing, which was corrected with size-specific spacing. Final counts above are from the complete passing suite. Existing route/SEO, logo integrity, responsive layout, parallax, reduced-motion, native-touch and full CAD walkthrough checks remain intact.

A source comparison confirms **no changes** to any application component, official logo or navbar image, footer, hero artwork/interaction logic, product claims, titles, styles, dependencies or lockfile. The approved PNG SHA-256 remains `ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1`.

## Reproduce

Generate only the favicon assets:

```bash
npx tsx scripts/generate-favicons.ts
npm run build
```

With the production server running on port 4173, make the native-size review sheet:

```bash
npx tsx scripts/capture-favicon-review.ts
```

For actual headed browser tabs, start an X server (the review used Xvfb with a 1440×1000×24 display) and provide its display number:

```bash
FAVICON_REVIEW_DISPLAY=:99 npx tsx scripts/capture-favicon-review.ts
```

The headed capture helper requires Chromium, ImageMagick `import`/`convert`, Python's standard SQLite module and an X display. Xvfb was extracted into `/tmp` solely for verification; no website dependency or system installation was added. The generator uses the existing Playwright dependency and guards the approved source checksum before producing new icons. Future artwork revisions should receive a new versioned filename rather than overwrite a previously deployed version.

## PR delivery

Git push is available, but GitHub GraphQL calls currently return `Post "https://api.github.com/graphql": Forbidden`. The branch and prepared [PR description](favicon-pr.md) are ready; a live PR must not be claimed created without a successful creation response. The attempted PR action and remaining access limitation are reported with delivery. Production icons will change only after a separately reviewed deployment; this task does not deploy.
