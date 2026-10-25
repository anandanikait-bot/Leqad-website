# Approved Leqad logo — rendering clarity pass

## Scope and identity

The official October 2026 SVGs and approved 16/32/180px favicon PNGs are **unchanged**. No paths, letters, colors, proportions, SVG viewBoxes, filters, or raster substitutes are introduced.

## Presentation changes

- Homepage: the existing full vector lockup uses an even, modestly larger size (56px on narrow screens, 60px on tablets, 64px on desktops). This gives the detailed center emblem more physical pixels without changing its shape.
- Navbar: the same vector lockup is 56px tall inside the existing 64px header, retaining margins on both sides. Its link no longer shrinks or fades its opacity on hover.
- Footer: the halftone effect remains intact. Its sampling mask is rendered from the **same official dark SVG at 2x resolution** before calculating dot coverage, instead of dropping thin vector details in a 1x intermediate canvas. The visible canvas still follows device pixel ratio. This changes only sampling fidelity, not the identity or the halftone style.
- Browser tab: the unchanged adaptive SVG remains the preferred favicon; the existing 16/32px PNG and 180px touch fallbacks remain.

## Validation

- Verify exact SVG asset URLs, viewBox-based proportions, no CSS blur/filter/compositing and no clipping at 320, 375, 768, 1024, 1440 and 1920px.
- Confirm navbar height and menu clearance remain unchanged.
- Run unit tests, TypeScript, lint, production build, browser tests and responsive screenshot capture.
- The favicon can only reproduce detail available at 16 physical pixels. Fine subpixel details at that size cannot be made sharper without changing the approved artwork, which is explicitly out of scope.

No source artwork, social-share screenshot, domain settings, or production deployment is modified.
