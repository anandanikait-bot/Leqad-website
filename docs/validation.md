# Final website and hands-on demo refinement

This work continues draft [PR #11](https://github.com/anandanikait-bot/Leqad-website/pull/11), branch `polish/minimal-demo-footer-seo`. Before editing, `main` (`840fc03`) and PR #11 (`c0caf52`) were fetched and compared. PR #11 already included the latest main, editable sketch sizes, extrusion prerequisites, the simplified two-group footer, accurate product copy, and exact browser titles. Those changes were retained.

## Implemented

- Corner Rectangle now arms a drawing tool. Select the origin, move the pointer to see a live preview, and select the opposite corner. Touch uses the same two-tap interaction. The guided Draw rectangle button remains available; G arms drawing and Escape cancels it.
- Width, height, depth and action validity live in the lesson state. Empty/out-of-range drafts do not create invalid geometry or unlock actions. Returning to a field restores both its last valid value and action validity. D applies valid dimensions when focus is outside an input.
- Sketch cancellation discards dependent geometry. Extrusion cancellation returns to the accepted sketch and restores the default depth. Restart restores the initial lesson, sizes and completion tracking. Skipping steps cannot create a part.
- A lightweight shared-vertex plate model uses hero-inspired Euler rotation and perspective, fine edges, restrained shading and a 260ms sketch-to-solid transition. Reduced motion skips the transition. The hero itself is unchanged. Top, Isometric, Front and Right views use real projections, and the final solid stays visible after confirmation.
- Sketch/extrusion controls sit above the viewport rather than over the model. Each step retains one primary teaching-panel action, optional help, highlighting and existing navigation.
- The approved logo remains byte-identical. A 144×144 navbar/favicon PNG was derived by resampling the source, with no redrawing, tracing, color changes or cropping. The 44px mobile/48px desktop header sizes are unchanged. The About preview is a fresh, noninteractive capture of the current implementation.
- PR #11's two-group footer, integrated circular symbol, large halftone lettering, fade, prototype disclaimer and absence from the homepage are preserved. Footer animation math was not modified. Product claims and exact route titles remain accurate before and after hydration.

## Actual commands and outcomes

| Command | Result |
| --- | --- |
| `npm ci` | Passed, no legacy-peer workaround needed on PR #11's dependency tree |
| `npm run lint` | Passed, TypeScript |
| `npm test` | 23 passed, 0 failed, 0 skipped |
| `npm run build` | Client build plus prerendered `/`, `/demo`, `/about`, `/partners`, `/404` passed |
| `npm run test:browser` | 46 passed, 0 failed, 0 skipped in system Chromium |
| `git diff --check` | Passed |

Browser tests cover all four routes at **320, 375, 768, 1024 and 1440px**; full eight-step completion; direct feature-tree and viewport plane selection; armed two-click rectangle drawing; two-tap mobile drawing; valid/invalid dimension edits; actual sketch proportions; dimension/depth consistency through preview and confirmation; depth cancellation; drawing/sketch cancellation; restart and prerequisite guards; keyboard shortcuts; fields revisited after invalid drafts; model bounds at maximum width/height/depth at every breakpoint; settings not covering geometry; static About; exact browser titles with and without JavaScript; clean URLs, refresh, Back/Forward and legacy hash links; logo sizing; reduced motion; native mobile scrolling; footer behavior and overflow.

## Fresh visual evidence

All linked captures below were generated from this modified production build. They are not copied from earlier work. Page screenshots wait for local fonts and footer painting. Demo captures hide the sticky header only while cropping the tall workspace, so the header is not misleadingly overlaid across the teaching panel. The header remains unchanged in the application.

| Page | 320px | 375px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- | --- |
| Home | [Image](screenshots/home-320px.png) | [Image](screenshots/home-mobile.png) | [Image](screenshots/home-768px.png) | [Image](screenshots/home-1024px.png) | [Image](screenshots/home-desktop.png) |
| Demo | [Image](screenshots/demo-320px.png) | [Image](screenshots/demo-mobile.png) | [Image](screenshots/demo-768px.png) | [Image](screenshots/demo-1024px.png) | [Image](screenshots/demo-desktop.png) |
| About | [Image](screenshots/about-320px.png) | [Image](screenshots/about-mobile.png) | [Image](screenshots/about-768px.png) | [Image](screenshots/about-1024px.png) | [Image](screenshots/about-desktop.png) |
| Partners | [Image](screenshots/partners-320px.png) | [Image](screenshots/partners-mobile.png) | [Image](screenshots/partners-768px.png) | [Image](screenshots/partners-1024px.png) | [Image](screenshots/partners-desktop.png) |

| Lesson state | Desktop | Mobile |
| --- | --- | --- |
| 1. Introduction | [Image](screenshots/demo/01-introduction-desktop.png) | [Image](screenshots/demo/01-introduction-mobile.png) |
| 2. Select plane | [Image](screenshots/demo/02-select-plane-desktop.png) | [Image](screenshots/demo/02-select-plane-mobile.png) |
| 3. Start sketch | [Image](screenshots/demo/03-start-sketch-desktop.png) | [Image](screenshots/demo/03-start-sketch-mobile.png) |
| 4. Draw rectangle | [Image](screenshots/demo/04-draw-rectangle-desktop.png) | [Image](screenshots/demo/04-draw-rectangle-mobile.png) |
| 5. Edit dimensions | [Image](screenshots/demo/05-edit-dimensions-desktop.png) | [Image](screenshots/demo/05-edit-dimensions-mobile.png) |
| 6. Finish sketch | [Image](screenshots/demo/06-finish-sketch-desktop.png) | [Image](screenshots/demo/06-finish-sketch-mobile.png) |
| 7. Accepted planar profile | [Image](screenshots/demo/07-accepted-profile-desktop.png) | [Image](screenshots/demo/07-accepted-profile-mobile.png) |
| 8. Extrusion preview | [Image](screenshots/demo/08-extrude-preview-desktop.png) | [Image](screenshots/demo/08-extrude-preview-mobile.png) |
| Confirmed solid | [Image](screenshots/demo/09-confirmed-plate-desktop.png) | [Image](screenshots/demo/09-confirmed-plate-mobile.png) |

[Sketch-to-extrude recording](screenshots/demo/sketch-to-extrude.mp4): 3.5 seconds of actual browser frames, including depth editing and confirmation. Footer closeups: [desktop](screenshots/footer-1440px.png), [tablet](screenshots/footer-768px.png), [mobile](screenshots/footer-375px.png).

Regenerate against the production server with `npm run screenshots`, `npm run screenshots:demo`, and `tsx scripts/capture-footer-screenshots.ts`. The demo recording uses system ffmpeg when available. CI runs the fresh page/demo captures and uploads review artifacts after successful checks.

## Review, performance and accessibility

An independent reviewer found a field-remount validation defect, incorrect Front/Right view labels and stale instructions. All were corrected; the validation defect has a failing-then-passing browser regression. No material review findings remain deferred. Screenshots were inspected manually, including the model faces, numeric labels, mobile controls and footer composition.

The navbar derivative is **24,349 bytes**, compared with **1,208,163 bytes** for the source (about 98% less). The canonical SHA-256 remains `ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1`. No heavy 3D dependency was added. Compared with PR #11's baseline, client JS grew from 120.59 to 121.52 kB gzip; CSS dropped from 9.20 to 9.07 kB gzip. The new transition stops after 260ms and respects runtime reduced-motion changes; model inspection does not run an idle animation loop.

Number fields retain explicit labels and linked validation messages. Invalid values disable both guided and toolbar actions. Plane selection is keyboard accessible. Native page/touch scrolling is retained. No formal screen-reader or complete WCAG audit was run. Freeform orbiting is deliberately deferred: tested view buttons provide inspection, and the unsupported orbit-ready claim was removed. This remains a local illustrated CAD lesson, not a CAD kernel, geometry validator or live integration.

## Production/build synchronization

Local production build, prerendering and routing were verified. A fresh read-only request to `https://leqada.ai.studio/demo` still failed with `Tunnel connection failed: 403 Forbidden` from the environment proxy. Consequently the deployed build/version and any older production walkthrough cannot be compared from this environment. This is an access limitation, not evidence about the deployed app. A Git push does not update or verify production.

No deployment or merge was performed. Follow [the hosting contract and post-deployment checks](hosting.md) only after a separately reviewed, authorized deployment. GitHub API access was also unavailable earlier; updating PR #11's source branch through Git preserves the existing draft PR while keeping this report and the prepared description reviewable in the repository.

## Modified implementation files

- `src/components/demo/DemoWorkbench.tsx`, `LessonPanel.tsx`, `SimulatedCADCanvas.tsx`: interaction/state, validation, clear controls and corrected views.
- `src/components/demo/PlateModel.tsx`, `DimensionInput.tsx`, `src/lib/plate-geometry.ts`: focused rendering, editable drafts and projection helpers.
- `src/lib/lesson-data.ts`: accurate two-click/inline-control guidance.
- `src/components/shared/BrandLogo.tsx`, `public/assets/brand/leqad-navbar.png`, `index.html`: optimized approved logo and favicon.
- `src/components/home/ProductPreview.tsx`, `public/assets/cad-lesson-preview.png`, `src/lib/seo.ts`: fresh static preview and correct intrinsic/share-image dimensions.
- Browser/unit tests, screenshot scripts, package scripts, CI workflow and review documentation.
