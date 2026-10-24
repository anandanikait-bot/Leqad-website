# About-page static preview: approved color correction

## Root cause

The screenshot visible in the **About** page's "Interactive Demo Preview" is a separate static asset (`public/assets/cad-lesson-preview.png`). It was captured before the site's Hay's Russet palette update, so its button and reference-plane accents remained the legacy bright orange even after the live demo changed.

This is **not** a bug in the `/demo` route or CAD state machine.

## Fix

- `ProductPreview.tsx` now displays `/assets/cad-lesson-preview-russet.svg`.
- The corrected static SVG wraps the original screenshot without changing its text, layout, dimensions, or CAD geometry. A targeted SVG color filter converts only legacy warm orange pixels to Hay's Russet `#793327`, preserving navy `#0E2943`, ivory `#F5EFE7`, and the semantic red/green CAD axes.
- Keep the original PNG as the source/reference. The HTML remains a single accessible static image and link to the real demo; no second interactive lesson is added.
- The separate, abandoned `fix/demo-selection-color-contrast` branch was reset to `main`; no live-demo styling changes belong in this fix.

## Quality gate

The dedicated Playwright test renders the actual SVG preview in Chromium, samples a formerly orange button pixel and expects the exact approved russet RGB (121, 51, 39), verifies the image's dimensions, and checks there are no interactive lesson buttons in the About preview.

Run unit, TypeScript, ESLint, build and full browser tests before merging.

## Future maintenance

When the live demo's UI substantially changes, replace this static preview with a newly captured screenshot from the current build (see `scripts/capture-demo-states.ts`) rather than indefinitely accumulating image filters. The correction here is deliberately scoped to the stale About screenshot.


## Avoiding confusion with the real interactive demo

The About page preview is **a static screenshot**, not a second CAD instance. To avoid visitors clicking on pictured controls and assuming the site is broken:

- A visible caption explicitly says "Static screenshot — select to try the interactive demo."
- The **whole image is a link** to `/demo`, with a bottom-right "Open interactive demo" affordance. Clicking even a pictured fake CAD control therefore leads to the real interactive lesson.
- The existing separate "Explore Interactive Demo" button remains a second clear entry point.
- The screenshot link has its own descriptive accessible name, visible keyboard focus, and Enter-to-open semantics. The image alt text makes its static nature clear.
- No duplicate interactive CAD component is mounted on the About page; the screenshot retains its original imagery and the functional lesson remains on `/demo`.

Additional browser tests verify direct image clicks, keyboard navigation and mobile/desktop layouts.


## Current illustrated preview (2026-10-24)
The earlier raster screenshot became stale as the live CAD canvas evolved. The About section now references `/assets/cad-lesson-illustration.svg`: a crisp **static illustration** of the first-sketch drawing step, not a purported browser screenshot. Its navy `#0E2943`, ivory `#F5EFE7`, russet `#793327`, and neutral CAD workspace `#EDF1F3` match Leqad's palette. Conventional X and Y axis indicators remain red/green for CAD clarity.

The text expressly says *Illustrated preview*, and the entire illustration links to the actual `/demo` route. Exactly one visible "Open interactive demo" cue overlays the image, with an understated caption below; no duplicate CTA button. The previous filtered SVG is retained as a historical asset but no longer used on this page. The live lesson is never simulated by the About page itself.

The live demo's sketch-mode viewBox is separately corrected to keep the drawing origin near the vertical center at common mobile and desktop aspect ratios, with grid lines extending to every edge.
