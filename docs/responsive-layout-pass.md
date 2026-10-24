# Responsive layout refinement

Target: `fix/website-ux-quality-pass` (PR #32). This is an additive responsive layout pass without changes to the approved SVG identity, existing fonts, lesson state logic, footer artwork, or contact flow.

- Desktop: demo, inner-page header, and footer text use a coordinated 1600px maximum width with responsive side padding. Content is intentionally capped on ultrawide monitors for legibility.
- Tablet and phone: instructions stack above the CAD drawing below 1024px, while the toolbar wraps without forcing horizontal page scroll.
- Desktop CAD: a flexible drawing area and a 320–430px teaching column. Drawing area scales with viewport height on larger screens instead of stopping at a fixed 440px SVG.
- Touch: primary CAD toolbar controls have at least 44px hit areas, with existing pointer interactions and geometry preserved.
- Page length: vertical scrolling remains normal. The oversized official halftone footer is allowed to continue below the first viewport and should not overlap or clip the workspace.

## Verification

The added Playwright suite exercises widths 320, 375, 430, 768, 1024, 1366, 1440, 1920, 2560, and 3840px at realistic viewport heights, checking bounds and horizontal overflow as well as an in-progress lesson across a resize.

Do not consider this approved until GitHub CI on the exact commit passes. Physical device, live deployment, and screen-reader spot checks remain separate. Do not merge or deploy without owner approval.
