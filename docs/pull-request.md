# Pull Request: Unified Halftone Logo & Wordmark Footer Composition

**Branch:** `feat/approved-branding-footer`  
**Repository:** `anandanikait-bot/Leqad-website`

## Summary of Changes

Rebuilt the bottom footer artwork across interior routes (`/demo`, `/about`, and `/partners`) so the official Leqad circular symbol and the oversized lowercase `leqad` wordmark appear together as one cohesive, animated halftone composition (inspired by Rift's footer design at https://tryrift.xyz/ and adapted to Leqad's brand identity).

### Key Implementations

1. **Integrated Halftone Architecture (`components/ui/halftone-wordmark-footer.tsx`):**
   - Maintained the core mathematical helpers: `hwfHex()`, `hwfRadius()`, `hwfStep()`, `hwfWarmth()`, and `hwfFitSize()`.
   - Converted the approved logo asset (`/assets/brand/leqad-approved.png`) into a temporary offscreen canvas mask that isolates the silhouette and internal negative space without creating any rectangular background patch.
   - Identified the logo's three russet accent petals to preserve their brand color (`#B74B21`) alongside the ivory structure (`#F5EFE7`) on the dark navy canvas (`#0E2943`).
   - Sampled both the circular mark and the `leqad` wordmark within a shared coordinate system, rendering both through the same dot field.
   - Applied identical spring-based pointer displacement, ripple shockwaves, and settling physics across both the circular mark and the wordmark.
   - Preserved reduced-motion lifecycle listeners, window/visibility listeners, and ResizeObserver.

2. **Responsive Proportions & Vertical Alignment:**
   - **Desktop & Tablet (≥580px):** Side-by-side layout with ~25% logo width, ~5% gap, and ~70% wordmark width, optically centered along the same horizontal centerline.
   - **Mobile (<580px):** Stacked composition inside the same compact canvas region, preventing any horizontal overflow, clipping of the circular logo, or collisions with the copyright section.
   - Maintained generous top clearance (≥18px above ascenders) ensuring zero ink in the top rows, with a subtle bottom gradient fade.

3. **Footer Cleanliness & Accessibility (`src/components/layout/SiteFooter.tsx`):**
   - Removed the isolated ivory card container above the brand thesis to avoid fragmented card-within-card clutter.
   - Maintained semantic accessibility and asset preloading via `<img src="/assets/brand/leqad-approved.png" alt="Leqad CAD education mark" className="sr-only" />`.
   - Verified that the official logo asset `public/assets/brand/leqad-approved.png` remains byte-identical with verified SHA-256: `ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1`.
   - Preserved site routing contracts: homepage remains hero-only without a footer; browser tab title remains exactly `Leqad`.

## Validation Results

- **`npm run lint`**: Passed (0 TypeScript errors).
- **`npm test`**: All 18 unit tests passed.
- **`npm run build`**: Client and SSR prerendering passed for `/`, `/demo`, `/about`, `/partners`, and `/404`.
- **`npm run test:browser`**: All 32 Playwright browser tests passed across viewports (320px, 375px, 768px, 1024px, 1440px), including reduced-motion settling, no-overflow checks, and ascender clearance.
- **Visual Capture**: Captured footer screenshots at 1440px, 768px, and 375px (`docs/screenshots/footer-*.png`).

| Viewport | Footer Screenshot |
| --- | --- |
| **Desktop (1440px)** | ![Footer 1440px](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/approved-branding-footer/docs/screenshots/footer-1440px.png) |
| **Tablet (768px)** | ![Footer 768px](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/approved-branding-footer/docs/screenshots/footer-768px.png) |
| **Mobile (375px)** | ![Footer 375px](https://raw.githubusercontent.com/anandanikait-bot/Leqad-website/feat/approved-branding-footer/docs/screenshots/footer-375px.png) |
