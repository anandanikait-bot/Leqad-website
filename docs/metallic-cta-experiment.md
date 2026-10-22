# Optional metallic hero CTA experiment

This is a visual A/B experiment, **not** a redesign or automatic replacement of Leqad's approved CTA.

| Version | Preview route | Behavior |
| --- | --- | --- |
| Original (default) | `/` | Existing rust link to `/demo`, no metallic code loaded |
| Experimental | `/?metallic=1` | Self-contained WebGL2 metallic sheen around a navy-toned link to `/demo` |

The experimental component is derived from the complete uploaded `Pasted text(3).txt` source. It does **not** use `@paper-design/shaders` or install other dependencies. The component is adapted for React Router link semantics, a responsive 270px desktop label, keyboard focus, pointer inputs, ripple cleanup, hover-only animation (idle speed 0), reduced-motion support, and cleanup of WebGL/observers.

The original rust CTA remains on the homepage when the query parameter is not present. The experiment now uses Leqad navy (#0E2943), ivory (#F5EFE7) and a muted rust rim (#B74B21). The reflective animation remains subtle and hover-led, with a static initial state. No CAD demo, approved logo, hero geometry, footer, or scroll-engine changes are made.

## About page: gentler presentation
The About page now uses a shorter, less forceful introduction, softer background grids, reduced parallax travel (preview 12px desktop / 6px mobile; decorative layers 12px and 4px), and removes the repeated final demo promo card. Existing product-status disclosure, educational content, partnership inquiry, and direct demo links remain available.

The About update is a modest visual and copy adjustment, **not** a change to the approved homepage. Tests validate that its parallax remains bounded and that the CTA paths stay accessible.

## Acceptance
- Both versions can reach `/demo` via mouse or keyboard.
- Experiment fits mobile and desktop widths without horizontal overflow.
- Static shader rendering is used with reduced-motion preference.
- No extra animation or WebGL module loads for the original homepage route.
- `npm ci`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:browser` pass.
- Compare *fresh* CI screenshots and bundle/resource results before choosing a default.

## Visual comparison
The GitHub Action uploads `metallic-cta-experiment-review` with screenshots at 375px and 1440px for both variants and `comparison.json` describing element bounds, resource transfers, and canvas presence. This is a lightweight comparison, not a GPU frame-time benchmark.

**Do not merge or deploy** this experiment until the new treatment is approved.
