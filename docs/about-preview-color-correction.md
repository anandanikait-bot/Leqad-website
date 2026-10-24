# About-page CAD preview — simplified, honest and actionable

## Why we changed it
A near-photographic illustration of the entire CAD application included fake controls: Sketch, Restart, Draw rectangle, Previous, and a teaching panel. Those looked clickable, even though the entire mock interface was only one screenshot link. A tiny label and an overlaid second-looking button were not enough to distinguish the preview from the real demo.

## Current design
- The preview is **only a technical sketch diagram** (40 × 30 mm rectangle, dimension lines, and origin/axes). It has no illustrated UI controls and does not pretend to be a screenshot of the live CAD system.
- It retains a neutral grid and brand navy #0E2943, ivory #F5EFE7, and Hay's Russet #793327; red/green axes remain conventional CAD directional cues.
- The illustration is a non-interactive `<figure>`, clearly captioned. Beside it, a short readable explanation describes the guided exercise.
- One actual, keyboard-focusable **Try the interactive demo** link opens `/demo`. No overlay, nested links, duplicate CTA, or fake buttons.
- The figure and explanation sit side-by-side on larger viewports and stack on narrow screens. The image retains its existing limited/reduced-motion-safe parallax attribute.
- The real CAD demo, its logic, website header/branding, and Cloud Run DNS are untouched.

## Verification
The focused Playwright tests verify: SVG dimensions and palette, absence of fake control-panel text, one real CTA, non-interactive illustration, keyboard navigation, responsive widths 320–1920px, no horizontal scrolling and /demo entry. The full browser suite and generated page screenshots must pass on the final commit before merging.
