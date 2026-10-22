# Final website and hands-on demo refinement

The walkthrough previously created a rectangle immediately on tool selection and used a separate static prism for extrusion. It now supports tool → origin → live preview → opposite-corner drawing, including mobile taps, while keeping guided actions. Edited width, height and depth carry through one shared-vertex plate model with real Top/Isometric/Front/Right projections, restrained hero-inspired shading and a reduced-motion-aware transition.

Feature controls sit above the viewport. Invalid numeric drafts cannot create geometry; navigation, cancel and restart preserve the prerequisite/completion rules. The approved logo source is unchanged; the 144px navbar/favicon derivative is 24KB and retains 44px/48px display sizing. About has a fresh static preview.

This continues PR #11's existing improvements: the hero-only homepage, exact browser titles and clean routes, accurate prototype/future claims, and the two-group footer with integrated halftone symbol, lettering, fade and disclaimer. Hero and footer animation mathematics were not changed.

Validation: `npm ci`, TypeScript and production/prerender build passed; **23 unit tests and 46 browser tests passed**. Browser checks include full completion, direct selections, pointer/touch drawing, invalid drafts, cancel/restart/prerequisites, maximum-size models at all five requested widths, metadata before/after hydration, logo sizing, reduced motion and native mobile scrolling. Independent review findings were fixed.

[All four pages at five breakpoints, every major demo state, modified files, test results and limitations](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/validation.md).

- [Desktop extrusion preview](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/screenshots/demo/08-extrude-preview-desktop.png)
- [Mobile extrusion preview](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/screenshots/demo/08-extrude-preview-mobile.png)
- [Confirmed plate](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/screenshots/demo/09-confirmed-plate-desktop.png)
- [Sketch-to-extrude recording](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/screenshots/demo/sketch-to-extrude.mp4)

Freeform orbit is deferred; the view controls are implemented and tested. Production build/version remains unverified because this environment's proxy blocks `leqada.ai.studio` with a tunnel 403. [Hosting verification steps](https://github.com/anandanikait-bot/Leqad-website/blob/polish/minimal-demo-footer-seo/docs/hosting.md) remain necessary after an authorized deployment. **No merge or deployment was performed.**
