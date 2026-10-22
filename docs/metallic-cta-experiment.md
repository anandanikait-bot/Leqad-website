# Leqad metallic hero CTA — approved as default

The homepage's primary **Explore Interactive Demo** link now uses the Leqad-styled metallic treatment by default. This change is limited to the primary CTA; About, Partners, and the CAD lesson retain their existing standard button styles.

## User-facing behavior
- `/`: metallic navy/ivory primary CTA, linking to `/demo`. No query parameter is necessary.
- WebGL2 unavailable/blocked: a static navy button with ivory text and the same link remains functional. The failed canvas is removed.
- Reduced motion: static initial shader image; no perpetual idle animation. If motion is allowed, the effect is hover-led, with a restrained rust-accented edge.
- While the lazily split WebGL component loads: a layout-matched static navy link prevents a missing CTA.

The shader derives from the supplied complete WebGL component, without adding `@paper-design/shaders` or other packages. It includes proper cleanup of timers, WebGL renderer, resize/visibility observers, plus keyboard-focus indicators and native React Router link semantics.

## About page — gentler presentation
The About page uses a shorter, less forceful introduction, softer background grids and lower parallax travel (preview 12px desktop/6px mobile; decorative layers 12px and 4px). A repeated final demo promo card was removed; original product status disclosures, educational content, partnership inquiry and demo links remain available.

## Verification
- Home at 320, 375, 768, 1024, and 1440px without horizontal overflow.
- Mouse/touch/keyboard CTA still reaches `/demo`.
- WebGL2-disabled environment uses the static navy fallback.
- Reduced-motion users can see and use the link.
- TypeScript, build, unit and browser tests; fresh screenshot evidence.
- `metallic-cta-experiment-review` artifact compares the default metallic look to the actual WebGL-disabled fallback at 375 and 1440px, alongside lightweight transfer-byte and bounding-box data.

This draft PR **does not merge or deploy** the change.
