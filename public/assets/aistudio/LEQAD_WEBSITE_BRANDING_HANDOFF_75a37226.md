# CODEX / AI MODEL TASK — Leqad website branding and footer

Repository: `anandanikait-bot/Leqad-website`

Use the attached **`Leqad_Approved_Logo_Reference_DO_NOT_MODIFY.png`** as the authoritative approved visual reference. It is the **second** navy-and-russet, rounded/tri-lobed circular Leqad logo from the design comparison, without a wordmark. The older square geometric symbol is superseded. Preserve this image EXACTLY; no redesign, reinterpretation, recoloring, edge smoothing, recomposition, cropping, aspect-ratio changes, new wordmark, or altered spacing.

Image dimensions: 1254 × 1254 pixels.
Image SHA-256: `ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1`.

Important source-of-truth rule: the supplied reference file is a PNG render, not confirmed native SVG paths. Do not falsely claim an automatically traced SVG is pixel- or geometry-identical to the original. If an approved native SVG can be positively matched, use it unchanged; otherwise use this *exact PNG* for the current site, including the favicon, and note separately that true SVG conversion needs owner review. Do not use the old square `Leqad_Original_Left_Faithful_1d96263c.svg` as a substitute.

## Objectives

1. **Favicon and header** — Replace the existing old square logo in the site header and browser favicon with the approved reference. Save the asset in a stable public path (e.g. `/assets/brand/leqad-approved.png`) without modifying its bytes. Point `index.html` to the new asset with a correct `type="image/png"` or, if a genuinely approved matching SVG exists, link that. Rework `src/components/shared/BrandLogo.tsx` to display the approved asset. Preserve the current `Leqad` header text and header behavior; don't change the logo artwork.
2. **Footer with generous breathing room** — On **interior pages** `/demo`, `/about`, and `/partners`, add the approved logo to a dedicated branding area within `src/components/layout/SiteFooter.tsx` ABOVE the existing halftone `leqad` wordmark, not over it or under a canvas. Follow the spirit of the attached Rift footer screenshot: quiet dark section, ample negative space, clear logo, massive halftone wordmark below. A reasonable starting point: 104–128px artwork width on desktop, 72–88px on mobile, padding of 48–72px desktop / 28–40px mobile around the logo, and 40px minimum clearance before the halftone art. These are layout guidelines, adjust for good visual balance; never stretch the logo. Because the reference image has a light background, present it against a compatible light/ivory tile or surface if needed instead of attempting an unapproved transparency transformation. Ensure readable supporting copy, no crowding or overlap with the copyright signature, no horizontal overflow, and reduced-motion support. Keep the existing halftone implementation and interaction, plus the bottom copyright signature.
3. **Do not add the footer to the homepage** — `src/App.tsx` intentionally renders only `SiteHeader` + `Hero` for `/`, while other pages have `SiteFooter`. Preserve this exact behavior.
4. **Browser tab title** — The visible document title should be **exactly `Leqad`** on every public route, without `— Learn CAD by Building` or other subtitle/suffix. The current titles come from `src/lib/routes.ts` and are assembled in `src/lib/seo.ts`; update these consistently in prerendered HTML and client-side navigation. Retain all route-specific descriptions, canonical URLs, Open Graph and Twitter metadata (their titles may be distinct if SEO needs it), structured data, and direct-route prerender behavior. `scripts/prerender.ts` already uses `renderHead`. Existing tests currently assume unique document titles, so deliberately update those assertions to reflect the new user requirement while still testing route-unique metadata/canonicals. Do not remove the actual marketing copy or hero text on the page; only change the browser/tab title and associated title logic.
5. **Scope and governance** — Keep the current site design, header navigation, hero, demo and internal routes otherwise unchanged. Do not change the extension repository. Work in a NEW, focused branch and open a PR; do **not** merge or deploy without explicit owner approval. Document the asset provenance and hash, and identify any visual limitations of using PNG rather than a validated SVG.

## Relevant verified files (website repo main at 2026-10-21)

- `src/components/layout/SiteFooter.tsx`: dark navy footer, `<HalftoneWordmarkFooter ... wordmark="leqad" />` followed by a small footer signature; the footer currently lacks this logo.
- `components/ui/halftone-wordmark-footer.tsx`: canvas-based halftone wordmark; avoid destructive changes.
- `src/components/shared/BrandLogo.tsx`: currently inlines the old square geometric mark. Replace it.
- `src/components/layout/SiteHeader.tsx`: renders `<BrandLogo size="md" />`.
- `index.html`: currently links `/assets/aistudio/Leqad_Original_Left_Faithful_1d96263c.svg` as the favicon.
- `src/lib/routes.ts`: currently sets `/` title to `Leqad — Learn CAD by Building` and other longer page titles.
- `src/lib/seo.ts`: populates `<title>`, OG/Twitter metadata, structured data, and canonical links.
- `scripts/prerender.ts`: prerenders `/`, `/demo`, `/about`, `/partners`, `/404`.
- `src/App.tsx`: omits footer on homepage by design; keep it that way.
- `test/routing-and-seo.test.ts`, `test/browser/website.spec.ts`: update/add assertions without dropping meaningful coverage.

## Acceptance checks

- Desktop Chrome tab says exactly `Leqad`; refreshing and directly opening `/demo`, `/about`, `/partners` retains that exact tab title.
- The browser favicon and header display the **approved rounded blue/russet three-pronged mark**, never the previous square icon.
- The approved image file bytes match the reference SHA-256. No geometry, palette, border, spacing, or internal pattern modifications.
- Footer branding area appears on `/demo`, `/about`, `/partners` only, with generous spacing; homepage remains hero-only without footer.
- At widths 320, 375, 768, 1024 and 1440px, footer logo and halftone art don't overlap, clip, or cause horizontal scrolling. Check dark/light contrast and 100/125/150% zoom.
- Build/prerender output includes the asset and tab title, and they work even with JS disabled.
- Existing demo interactions and navigation continue working; accessibility alt text or labels are meaningful and duplicated decoration is hidden from screen readers where appropriate.
- Run `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`; report actual results and skipped tests instead of claiming unrun checks passed.
- Provide before/after screenshots, the PR link, changed file list, evidence of exact asset identity, and any unresolved SVG-conversion issue. Leave the PR unmerged, without deployment.

Finish with a concise report of what changed, what actually passed, and anything awaiting owner approval.
