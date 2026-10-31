# Visual follow-up captures

`before/` and `after/` each contain 49 full-page screenshots at widths 320, 375, 390, 430, 768, 1024, and 1440 pixels. Each width includes Home, About, Partners, the Partners contact dialog, Demo initial state, Demo drawn rectangle, and Demo completed extrusion. Browser viewport height is 900 pixels. Reduced motion is enabled.

Reproduce against the relevant frozen production build:

```sh
AUDIT_ORIGIN=http://127.0.0.1:4354 AUDIT_LABEL=before node scripts/capture-visual-followup.mjs
AUDIT_ORIGIN=http://127.0.0.1:4355 AUDIT_LABEL=after node scripts/capture-visual-followup.mjs
AUDIT_ORIGIN=http://127.0.0.1:4354 node scripts/capture-hero-typography.mjs
```

The capture script visits the whole page and waits for the footer canvas to contain painted artwork. Before a full-page screenshot, it copies those actual canvas pixels into a same-size image and hides the original canvas while preserving its layout. Chromium's full-page capture can resize the viewport and clear an offscreen canvas; this capture-only snapshot prevents a blank footer artifact. Product source and layout remain unchanged by the capture script.

Each responsive JSON file records layout, font readiness, console errors, failed requests, and failed assets for its capture run. These are visual checks, not performance measurements or an accessibility audit.

`typography/` contains 18 screenshots: all three rotating phrases in Instrument Serif italic and Space Grotesk medium normal, at widths 375, 768, and 1440. The comparison changes only the phrase font family, style, and weight through browser CSS injection. Original responsive sizes remain 24, 30, and 42 pixels. The phrase text is set directly under reduced motion. `comparison.json` records computed styles and text bounds; none of these 18 states clips or causes horizontal overflow. The three `comparison-WIDTH.png` images place the first phrase side by side for review.

The final design retains Instrument Serif italic for its distinct, compact secondary hierarchy. Space Grotesk medium reads more strongly at the smallest size but repeats the heading texture. Both treatments fit all tested phrases. Space Grotesk's longest phrase measures 303, 379, and 531 pixels against available widths of 335, 704, and 568 pixels at the three tested viewports. See [the design follow-up](../../visual-design-followup.md) for the final typography decision.
