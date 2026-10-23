# Final content and UX refinement

Based on `main` at `c932e3da69647291af61c403687141b6aa093dc5`, including merged PR #23. Branch: `polish/final-content-ux`. No merge or deployment is authorized or performed.

## What changed

- Homepage remains hero-only, with no header or footer. Its description identifies a browser-extension learning assistant prototype starting with Onshape and invites visitors to one first-sketch exercise. The rotating headline, metallic CTA, secondary About link, and interactive artwork remain.
- About identifies the static website screenshot as **Interactive Demo Preview**. Product Status explains the distinction between the extension and eight-step website simulation, including the outstanding live-platform validation. Repeated disclaimers and public automated-testing copy were removed.
- Current capabilities use three concise points; future work is framed once as planned. Marketing no longer suggests a library of completed exercises.
- Partners focuses on technical compatibility and educational evaluation, with commercial possibilities mentioned briefly. The existing planner remains optional, collapsed by default, and uses a secondary drafting action. Unsupported instructor-workload/outcome claims and repeated contact buttons were removed.
- The owner explicitly deferred email integration while creating a project address. There is no install link, signup backend, `mailto:` address, or delivery claim. **Draft an Inquiry Note** consistently opens the existing clipboard helper, which clearly states that a public email is not yet available and nothing is sent. Partners has one prominent drafting action. A future working contact action can use **Contact Leqad** once an address is approved.
- Demo completion offers **Learn About Leqad** in place of a repeated disclaimer. The short visible **Simulation · Not connected to live CAD** clarification remains; a duplicate canvas notice is shortened. Lesson state, drawing, dimensions, extrusion, cancellation, and restart logic are unchanged.
- Footer retains the approved symbol/halftone artwork. Redundant text branding is removed, the early-stage description is accurate, and copyright is visually separate from the concise Onshape-independence statement.
- Accessibility checks identified low contrast in small eyebrow/planner/plane-label text and accessible names that omitted visible toggle labels. The fixes use existing palette shades and label-only changes; no CAD geometry or interaction code changed.

## Evidence behind the public claims

The website assets, screenshot history, source, and supplied branding/reference material were inspected. **No verified screenshot of the extension running in live Onshape was found.** The retained `public/assets/cad-lesson-preview.png` is the website simulation, not an extension screenshot. No replacement extension image was generated.

The referenced extension repository was cloned read-only and inspected at [`4554addaf800a539b3aa188fb54b7cd252553ae4`](https://github.com/anandanikait-bot/leqad/tree/4554addaf800a539b3aa188fb54b7cd252553ae4):

| Evidence | Finding |
| --- | --- |
| [`apps/extension/wxt.config.ts`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/apps/extension/wxt.config.ts) | Manifest V3 configuration names Onshape and requests storage permission. |
| [`apps/extension/entrypoints/onshape.content.tsx`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/apps/extension/entrypoints/onshape.content.tsx) | Content script matches `https://cad.onshape.com/documents/*`; mounts the panel and uses local progress storage. |
| [`semanticTargets.ts`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/apps/extension/src/services/semanticTargets.ts) | Recognizes top-plane, sketch, and finish-sketch controls through accessible labels and visible DOM state. |
| [`foundations.ts`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/packages/lesson-engine/src/lessons/foundations.ts) | One first-sketch lesson exists, currently containing an enter-sketch step. This is distinct from the website's eight-step walkthrough. |
| [`README.md`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/README.md) and [`implementation-progress.md`](https://github.com/anandanikait-bot/leqad/blob/4554addaf800a539b3aa188fb54b7cd252553ae4/docs/implementation-progress.md) | Explicitly state that fixture checks do not establish live Onshape compatibility and that live validation remains pending. |

**Confirmed:** Onshape is the implementation's target platform. **Not confirmed:** end-to-end compatibility in live Onshape, public installation availability, or learning outcomes. The site therefore uses “starting with Onshape” and keeps the live-compatibility limitation in Product Status.

The inspected extension reads document URL identity and recognized page controls; its progress store saves lesson state (including model identity) and panel preferences to `browser.storage.local`. This audit is not a privacy certification. No privacy page or broad data-handling promises were added. No builder biography, personal contact details, or school information was published.

## Local validation

Environment: Node 24.19.0, system Chromium 154.0.8037.57, local production server on port 4173.

| Check | Result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache` | Passed; dependency manifests unchanged |
| `npm run lint` | Passed (TypeScript) |
| `npm test` | 25 passed, 0 failed, 0 skipped |
| `npm run build` | Passed; prerendered `/`, `/demo`, `/about`, `/partners`, and `/404` |
| `npm run test:browser` | 93 passed, 0 failed, 0 skipped |
| Accessibility and keyboard audit | 35 scans, 0 automatically detected WCAG 2/2.1 A/AA violations with axe-core 4.14.0 |
| `npm run screenshots` | Captured all four public routes at 320, 375, 768, 1024, and 1440px |
| `npm run screenshots:demo` | Captured nine major states on desktop/mobile and a fresh sketch-to-extrude transition recording |
| `git diff --check` | Passed |

The baseline before editing passed 25 unit tests and 93 browser tests. Obsolete footer-copy expectations and a preview-CTA selector were corrected without dropping the footer, navigation, or functional assertions. Contact tests now exercise the actual topic selector and clipboard output and assert that drafting sends no requests. The full suite covers direct routes and refreshes, hash redirects, mobile touch drawing, dimensions, view controls, extrusion, cancellation, restart, and reduced-motion behavior.

The additional accessibility audit completes all eight steps using keyboard activation at each width, follows the new completion link, expands the optional planner with Enter, and verifies forward/reverse dialog focus trapping and Escape. [Raw results](screenshots/content-ux/accessibility.json) retain axe's color-contrast items requiring manual review; automated checks do not fully assess canvas artwork or replace assistive-technology testing. Screenshots were visually reviewed for hierarchy, wrapping, clipped content, footer readability, and the restrained two-column layouts.

The approved source logo checksum remains `ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1`. All `public/assets`, logo/halftone implementations, metallic CTA implementation, lesson data/state/geometry, Lenis/parallax system, and dependency manifests are unchanged from the base. The hero artwork changes only its accessible toggle name; CAD canvas changes only the Iso accessible name contrast of two static labels, and a duplicate simulation notice.

## Responsive comparisons

“Before” images were freshly captured from the local production build of `c932e3d`, not taken from the live deployment. “After” images show this branch. Each cell links both captures at the same width.

| Page | 320px | 375px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- | --- |
| Home | [Before](screenshots/content-ux/before/home-320px.png) / [After](screenshots/home-320px.png) | [Before](screenshots/content-ux/before/home-mobile.png) / [After](screenshots/home-mobile.png) | [Before](screenshots/content-ux/before/home-768px.png) / [After](screenshots/home-768px.png) | [Before](screenshots/content-ux/before/home-1024px.png) / [After](screenshots/home-1024px.png) | [Before](screenshots/content-ux/before/home-desktop.png) / [After](screenshots/home-desktop.png) |
| About | [Before](screenshots/content-ux/before/about-320px.png) / [After](screenshots/about-320px.png) | [Before](screenshots/content-ux/before/about-mobile.png) / [After](screenshots/about-mobile.png) | [Before](screenshots/content-ux/before/about-768px.png) / [After](screenshots/about-768px.png) | [Before](screenshots/content-ux/before/about-1024px.png) / [After](screenshots/about-1024px.png) | [Before](screenshots/content-ux/before/about-desktop.png) / [After](screenshots/about-desktop.png) |
| Partners | [Before](screenshots/content-ux/before/partners-320px.png) / [After](screenshots/partners-320px.png) | [Before](screenshots/content-ux/before/partners-mobile.png) / [After](screenshots/partners-mobile.png) | [Before](screenshots/content-ux/before/partners-768px.png) / [After](screenshots/partners-768px.png) | [Before](screenshots/content-ux/before/partners-1024px.png) / [After](screenshots/partners-1024px.png) | [Before](screenshots/content-ux/before/partners-desktop.png) / [After](screenshots/partners-desktop.png) |
| Demo | [Before](screenshots/content-ux/before/demo-320px.png) / [After](screenshots/demo-320px.png) | [Before](screenshots/content-ux/before/demo-mobile.png) / [After](screenshots/demo-mobile.png) | [Before](screenshots/content-ux/before/demo-768px.png) / [After](screenshots/demo-768px.png) | [Before](screenshots/content-ux/before/demo-1024px.png) / [After](screenshots/demo-1024px.png) | [Before](screenshots/content-ux/before/demo-desktop.png) / [After](screenshots/demo-desktop.png) |

[Desktop demo completion](screenshots/demo/09-confirmed-plate-desktop.png) · [Mobile completion](screenshots/demo/09-confirmed-plate-mobile.png) · [Fresh sketch-to-extrude transition recording](screenshots/demo/sketch-to-extrude.mp4).

## Reproduce the optional accessibility audit

Install the audit tool outside the website dependency tree, start the built site, and run:

```sh
npm install --prefix /tmp/leqad-content-a11y --no-package-lock --ignore-scripts axe-core@4.14.0
AXE_SOURCE_PATH=/tmp/leqad-content-a11y/node_modules/axe-core/axe.min.js node scripts/audit-content-accessibility.mjs
```

Set `CHROMIUM_PATH` if Chromium is elsewhere, and `SCREENSHOT_ORIGIN` if the local server uses another origin. This adds no website dependency.

## Remaining verification and delivery

- Project email/contact delivery is deferred at the owner's request. The current helper only copies a draft.
- A live extension screenshot, live Onshape acceptance, public installation, and learning outcomes remain unverified. The website does not claim them.
- Builder information and a privacy page remain omitted pending separately verified/approved content.
- Hosted routing and the deployed version were not tested during this task. No deployment occurred; the existing [hosting verification checklist](hosting.md) applies after an authorized deployment.
- Local command results are not GitHub Actions results. Remote CI must be checked on the pull request; API access in this environment has previously been blocked.

The branch was pushed successfully. Creating the draft PR with `gh pr create --draft` failed with `Post "https://api.github.com/graphql": Forbidden`. **No live PR was created, and GitHub Actions results could not be retrieved.** The prepared [PR description](content-ux-pr.md) and [GitHub PR creation form](https://github.com/anandanikait-bot/Leqad-website/pull/new/polish/final-content-ux) are available for review. This access failure does not affect the completed local checks or the pushed changes.
