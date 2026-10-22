# Refine the landing hero and add restrained supporting-page parallax

The homepage previously retained the site navigation above a left-aligned hero. It now renders only the hero, centers its text and CTA group, and uses the full viewport while preserving the desktop two-column layout and interactive CAD artwork. Supporting routes retain their header and footer.

About adds transform-only depth to its static preview image and existing decorative grid. Partners adds a faint moving grid only in its closing banner. Text and controls stay stationary. The effects reuse the existing Lenis scroll notifications, cache layout measurements, clean up on navigation and disable for initial/runtime reduced motion. No additional controller, animation loop, dependency or per-scroll React render was added. Demo source and behavior, hero geometry/interaction logic, logo artwork, footer animation, typography and product claims are unchanged.

Validation passed: clean install, TypeScript, production/prerender build, **23 unit tests and 54 browser tests**, with zero failures or skips. Checks include all five responsive widths, header/CTA layout, hero interaction, parallax movement/limits, reduced motion, native mobile touch scrolling, route cleanup and the full existing walkthrough. Independent review found no material issues.

- [Validation and all screenshots](https://github.com/anandanikait-bot/Leqad-website/blob/feat/landing-parallax/docs/landing-parallax-validation.md)
- [Desktop homepage](https://github.com/anandanikait-bot/Leqad-website/blob/feat/landing-parallax/docs/screenshots/home-desktop.png)
- [Mobile homepage](https://github.com/anandanikait-bot/Leqad-website/blob/feat/landing-parallax/docs/screenshots/home-mobile.png)
- [About preview](https://github.com/anandanikait-bot/Leqad-website/blob/feat/landing-parallax/docs/screenshots/parallax/about-preview-desktop.png)
- [Partners banner](https://github.com/anandanikait-bot/Leqad-website/blob/feat/landing-parallax/docs/screenshots/parallax/partners-grid-desktop.png)

Base: main (`68e1818`). No merge or deployment performed. This is prepared draft review text; GitHub API access from this environment is currently blocked, so repository documentation does not assert that a live PR exists.
