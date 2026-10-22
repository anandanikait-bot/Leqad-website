# Final three polish fixes

This pass starts at `f7b0861` on the existing `polish/minimal-demo-footer-seo` source branch. A fresh fetch revealed that PR #11 had already been merged by the owner on the remote: `origin/main` contains merge commit `68e1818`. These follow-up changes are committed to that same source branch; pushing it cannot add commits to an already-merged PR. No new PR, merge, or deployment is performed by this pass.

## Changes

- Desktop model framing uses a uniform **1.18 camera scale**, with view-dependent bounds and clearance for dimension labels. The underlying vertices, proportions, translucent preview, shading, fine edges, and rust indicators are unchanged. Smaller screens prioritize a complete fit. Top, Isometric, Front, and Right views and live depth updates remain functional.
- Step 4 emphasizes the existing toolbar → origin → live preview → opposite-corner workflow. The toolbar names Corner Rectangle while drawing is available. The **Use guided rectangle** alternative has an outline treatment and a minimum 44px touch target. Existing inline status text supplies context-sensitive instructions; no additional panels were added.
- Coordinates show dashes when the pointer leaves or the model enters extrusion. Reserved numeric space prevents the readout from wrapping the toolbar and moving the drawing target at 1024px.
- The completion tap's follow-up click cannot also apply dimensions to the newly mounted profile. This preserves the dimension-editing step on touch devices while retaining subsequent deliberate profile clicks.
- The homepage hero, official logo artwork and optimized navbar asset, footer and its animation, typography, palette, dependencies, lesson actions and prerequisites are unchanged. `PlateModel.tsx` retains the existing 260ms transition and runtime reduced-motion handling.

## Verification

| Command | Final result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache` | Passed; no dependency or lockfile changes |
| `npm run lint` | Passed; TypeScript |
| `npm test` | 23 passed, 0 failed, 0 skipped |
| `npm run build` | Passed; client build plus four public routes and 404 prerender |
| `npm run test:browser` | 48 passed, 0 failed, 0 skipped; 48.7 seconds, system Chromium |
| `git diff --check` | Passed |

Browser playtests include the complete eight-step lesson, two-click drawing, two-tap mobile drawing followed by width/height/depth editing, extrusion cancellation, confirmation and restart; guided drawing; sketch/drawing cancellation; invalid drafts; prerequisites; keyboard shortcuts; view controls; and reduced motion. Maximum 50 × 40 × 50mm geometry **and labels** are checked against the SVG bounds in all four views at 320, 375, 768, 1024 and 1440px. Existing route, SEO, prerender, navigation, static About, footer, logo, overflow and scrolling checks remain in the full suite.

During development, the new tests first failed for missing framing/guidance, then caught a misplaced guided-button style and a touch completion click skipping dimension editing. Capture playtesting also exposed a 32.66px coordinate-driven layout shift at 1024px; its regression test failed before the fixed-width readout correction. Final outcomes above supersede those development failures. Independent review checked the framing, state preservation, guided styling and touch event fix; all material findings were resolved.

## Before and after

Before captures were freshly generated from the unchanged `f7b0861` production build immediately before implementation. After captures are generated from the modified production build. Preview and solid comparisons use the same 48 × 36 × 12mm dimensions.

| State | Before desktop | After desktop | Before mobile | After mobile |
| --- | --- | --- | --- | --- |
| Rectangle interaction | [Before](screenshots/before-polish/04-draw-rectangle-desktop.png) | [After](screenshots/demo/04-draw-rectangle-desktop.png) | [Before](screenshots/before-polish/04-draw-rectangle-mobile.png) | [After](screenshots/demo/04-draw-rectangle-mobile.png) |
| Extrusion preview | [Before](screenshots/before-polish/08-extrude-preview-desktop.png) | [After](screenshots/demo/08-extrude-preview-desktop.png) | [Before](screenshots/before-polish/08-extrude-preview-mobile.png) | [After](screenshots/demo/08-extrude-preview-mobile.png) |
| Confirmed solid | [Before](screenshots/before-polish/09-confirmed-plate-desktop.png) | [After](screenshots/demo/09-confirmed-plate-desktop.png) | [Before](screenshots/before-polish/09-confirmed-plate-mobile.png) | [After](screenshots/demo/09-confirmed-plate-mobile.png) |

## Fresh evidence from this build

| Width | Drawing | Dimensions | Extrusion preview | Confirmed solid | Maximum model |
| --- | --- | --- | --- | --- | --- |
| 320px | [Drawing](screenshots/demo/04-draw-rectangle-320px.png) | [Dimensions](screenshots/demo/05-edit-dimensions-320px.png) | [Preview](screenshots/demo/08-extrude-preview-320px.png) | [Solid](screenshots/demo/09-confirmed-plate-320px.png) | [50 × 40 × 50](screenshots/demo/10-maximum-model-320px.png) |
| 375px | [Drawing](screenshots/demo/04-draw-rectangle-mobile.png) | [Dimensions](screenshots/demo/05-edit-dimensions-mobile.png) | [Preview](screenshots/demo/08-extrude-preview-mobile.png) | [Solid](screenshots/demo/09-confirmed-plate-mobile.png) | [50 × 40 × 50](screenshots/demo/10-maximum-model-mobile.png) |
| 768px | [Drawing](screenshots/demo/04-draw-rectangle-768px.png) | [Dimensions](screenshots/demo/05-edit-dimensions-768px.png) | [Preview](screenshots/demo/08-extrude-preview-768px.png) | [Solid](screenshots/demo/09-confirmed-plate-768px.png) | [50 × 40 × 50](screenshots/demo/10-maximum-model-768px.png) |
| 1024px | [Drawing](screenshots/demo/04-draw-rectangle-1024px.png) | [Dimensions](screenshots/demo/05-edit-dimensions-1024px.png) | [Preview](screenshots/demo/08-extrude-preview-1024px.png) | [Solid](screenshots/demo/09-confirmed-plate-1024px.png) | [50 × 40 × 50](screenshots/demo/10-maximum-model-1024px.png) |
| 1440px | [Drawing](screenshots/demo/04-draw-rectangle-desktop.png) | [Dimensions](screenshots/demo/05-edit-dimensions-desktop.png) | [Preview](screenshots/demo/08-extrude-preview-desktop.png) | [Solid](screenshots/demo/09-confirmed-plate-desktop.png) | [50 × 40 × 50](screenshots/demo/10-maximum-model-desktop.png) |

The capture script uses actual corner selections; narrow mobile captures use touchscreen taps. Desktop drawing captures show the live pointer preview. Mobile drawing captures show the first-corner preview before the second tap. Tall workspace crops temporarily hide the sticky header only during capture; the application header is unchanged.

Final footer: [1440px](screenshots/footer-1440px.png), [768px](screenshots/footer-768px.png), [375px](screenshots/footer-375px.png). Full-page route captures were also refreshed at all five widths.

[Updated hands-on recording](screenshots/demo/sketch-to-extrude.mp4), **13.25 seconds**, shows viewport Top Plane selection, Sketch, Corner Rectangle, origin placement, live pointer preview, opposite corner, width/height editing, Finish Sketch, Start Extrude, depth editing, confirmation and the final isometric solid. A recording-only pointer dot makes the real cursor path visible; it is not application UI. Frames come from the actual browser, encoded with system ffmpeg. No dependency was added.

Regenerate with the production server running: `npm run screenshots`, `npm run screenshots:demo`, and `npx tsx scripts/capture-footer-screenshots.ts`. The demo script captures every lesson state at all five widths, maximum model size, and the recording when system ffmpeg is available.

## Changed files and limitations

[Exact changed-file manifest](modified-files.txt) includes implementation, tests, scripts, documentation and all evidence paths for this pass.

This remains an educational CAD simulation, not a CAD geometry engine or live integration. Freeform orbiting remains deferred. Mouse, keyboard and Chromium touch emulation were tested; physical-device and formal screen-reader/WCAG audits were not performed.

Production hosting/build synchronization remains unverified: the environment proxy blocks `leqada.ai.studio` with a tunnel 403. Local routing and refresh checks do not establish deployed routing compatibility. Follow the [hosting verification checklist](hosting.md) after a separately authorized deployment. GitHub GraphQL access is also blocked (`Forbidden`), so the repository contains prepared review text in [pull-request.md](pull-request.md); live PR metadata was not updated. The already-merged PR #11 cannot receive these new commits. Owner review must account for the source-branch follow-up separately.
