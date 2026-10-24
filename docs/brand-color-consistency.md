# Leqad color consistency audit

The approved official logo palette is **deep navy #0E2943**, **ivory #F5EFE7**, and **Hay’s Russet #793327** (source: `public/assets/brand/BRAND_BASELINE.md`). The prior website frequently used the separate, legacy orange CTA accent #B74B21. This change aligns visible CTA faces, interactive highlights, active links, the shader base, the metallic rim, modal states, and CAD lesson accents with the approved Russet.

- Primary brand: navy **#0E2943**, ivory **#F5EFE7**, Hay’s Russet **#793327**.
- Tone-on-tone alternatives: **#62281F** for russet hover, lighter muted-russet highlights in the metallic sheen, and dark navy variants inside the 3D presentation.
- Support neutrals, not independent accents: **#FAF8F4** near-ivory page background, **#FFFFFF** panels, **#D9DDD9** borders, **#55616B** supporting text, **#EDF1F3** CAD workspace.
- Success and error messages retain accessible textual/icon distinctions while using navy/ivory/russet rather than bright green/pink brand-breaking panels. Form submission behavior and error roles remain unchanged.
- Exception: CAD geometry X/Y axis guide colors (red and green) are retained for standard engineering orientation. Their meaning takes precedence over monochrome branding.
- The official SVG logos, generated historical screenshots, and archived design documents were intentionally left unchanged.

The existing `BRAND_COLORS.rust` and Tailwind `--color-brand-rust` names remain as compatibility aliases for **#793327**, not the old orange. The new `test/brand-palette.test.ts` prevents accidentally reintroducing the legacy website colors.

This is a **visual-theme change** only. Verify desktop/mobile contrast and screenshot appearance in the PR CI preview; no live deployment is performed by this branch.
