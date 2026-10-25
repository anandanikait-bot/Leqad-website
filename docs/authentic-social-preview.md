# Website-sharing preview: authentic homepage capture

The share image is a **byte-for-byte copy of an existing screenshot of the actual Leqad website**, not a redesigned mockup or AI-generated graphic.

- Source: `docs/screenshots/quality-pass/after/home-1440.png`
- Public copy: `public/assets/leqad-home-share-v2.png`
- Dimensions: **1440 × 900** (matching original; no cropping, recoloring or image generation).
- The capture contains the exact approved Leqad logo, page typography, existing CAD canvas and current navy/ivory/Hay's Russet presentation.
- `src/lib/seo.ts` now points Open Graph and Twitter image tags to `https://leqad.com/assets/leqad-home-share-v2.png?v=20261025`, using the PNG's real 1440×900 dimensions.
- The `/demo` route keeps its separate screenshot.
- Unit tests verify the public asset is exactly the same bytes as the existing approved homepage screenshot. Browser tests check it serves a real PNG.

This is a literal homepage screenshot; no additional logos, illustrations, gradients, or UI were invented.

**Deployment:** GitHub merge does not automatically publish to Cloud Run. After deploying, verify the actual image URL and raw HTML metadata. Some messaging apps may cache previously generated cards. If the deployed homepage differs materially from the historical approved capture, refresh the source using a faithful screenshot of the *deployed* homepage, not generated design art.
