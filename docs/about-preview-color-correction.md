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
