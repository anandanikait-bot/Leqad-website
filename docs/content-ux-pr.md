The website repeated prototype caveats, described the simulated preview ambiguously, and gave visitors several contact buttons that only drafted notes. This change makes the existing pages more concise and separates the Onshape-targeted extension prototype from the website's eight-step simulation.

- Keep the homepage hero-only, identify the learning-assistant format and initial platform, and preserve the interactive artwork, rotating headline, metallic CTA, and About link.
- Label the static image **Interactive Demo Preview**, consolidate limitations in Product Status, use singular first-sketch curriculum claims, and remove testing language from marketing copy.
- Focus Partners on technical compatibility and educational evaluation. Retain the optional collapsed planner and one prominent drafting action. Simplify footer copy while preserving the approved halftone artwork.
- Add a useful About link after demo completion. Fix small-text contrast and visible-label/accessibility-name mismatches without changing CAD geometry, lesson logic, dependencies, or scrolling behavior.

**Evidence and deliberate deferrals:** No authentic extension screenshot was found. Extension source at `4554add` confirms that Onshape is the implementation target; live Onshape compatibility remains unverified and is disclosed in Product Status. No public installation/signup service or approved email was found. The owner explicitly deferred email integration while creating an address. Contact currently means an honest clipboard draft helper, with no message delivery; no email address, biography, privacy page, or outcome claims were invented.

**Validation:** TypeScript, 25 unit tests, production build/prerender, and all 93 Playwright tests pass locally. The browser suite covers direct routes/refreshes, the complete eight-step demo, touch drawing, dimension editing, extrusion, cancellation, restart, and reduced motion. An additional axe-core/keyboard audit reports 0 detected violations across 35 route/state/width checks. Automated contrast items requiring manual review are retained in the raw report. Remote GitHub Actions results have not been verified; these are local results. Production hosting was not tested or deployed.

[Full evidence, test details, accessibility results, and before/after screenshots at all five widths](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/content-ux-validation.md)

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/home-desktop.png) | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/home-mobile.png) |
| About | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/about-desktop.png) | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/about-mobile.png) |
| Partners | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/partners-desktop.png) | [Screenshot](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/partners-mobile.png) |

[Demo completion](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/demo/09-confirmed-plate-mobile.png) · [Fresh sketch-to-extrude transition recording](https://github.com/anandanikait-bot/Leqad-website/blob/polish/final-content-ux/docs/screenshots/demo/sketch-to-extrude.mp4)

Draft for owner review. Do not merge or deploy automatically.
