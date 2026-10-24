# Website UX quality audit

Baseline: `fa9e793694551d9674ca1b81c41125ab3d9da301` (latest fetched main at the start of this pass). Branch: `fix/website-ux-quality-pass`. Evidence was captured against local production builds, baseline on port 4310 and revised build on 4311. No preview or production deployment was performed.

## Implementation matrix

| Phase / finding | Original evidence | Priority | Files changed | Implementation | Validation / result | Remaining issue |
|---|---|---|---|---|---|---|
| 0: reproducible installation | `npm ci` failed because no lockfile existed; install without lock succeeded | P1 | `package-lock.json`, workflow | Commit dependency lock and use `npm ci` | Clean install check recorded below; IMPROVED | Baseline failure is not attributed to this change |
| 1: contact destination | No owner-approved address in repository or session | P0 | `src/lib/contact.ts`, inquiry entry points | Configuration-driven destination; absent default retains honest draft-only journey | NEEDS OWNER INPUT | Owner must verify/configure a public address before direct contact is available |
| 1: failed copy hid note | Rejected clipboard promise produced instructions but no complete selectable note | P0 | `ContactModal.tsx` | Read-only complete note, Select All, accurate success/failure feedback | Regression covers rejected clipboard and retained values; FIXED | Clipboard permission depends on browser context |
| 1: reopening changed drafts | Open effect reset topic/message | P0 | `ContactModal.tsx` | Preserve entered draft, validate email, restore opener focus | Contact regression suite; FIXED | Draft is session memory, not persistent storage |
| 2: incomplete primary heading | Baseline accessible heading was “Learn CAD by” | P0 | `Hero.tsx` | One complete stable accessible heading, decorative animated text hidden from AT | Hero accessibility regression fails baseline; FIXED | Real assistive technology listening not performed |
| 2: homepage brand recognition | Homepage had no logo and intentionally no navbar | P1 | `Hero.tsx` | Restrained official horizontal SVG above headline | Screenshots across five widths; IMPROVED | Homepage remains header-free |
| 3: typography/density | Existing four typefaces and shared layout already established | P1 | About, Partners, product-status components | Retained fonts/layout, consolidated caveats and reduced copy repetition | Responsive screenshots; IMPROVED | No broad typography redesign |
| 4: product clarity | Caveats repeated in adjacent copy | P1 | `CurrentProductAndVision.tsx`, About, Partners, Hero | Distinguish current prototype, website simulation, unverified capabilities and plans | Content/route tests, copy review; IMPROVED | Live Onshape compatibility and learning outcomes remain unverified |
| 5: founder context | No brief origin explanation | P1 | `AboutPage.tsx` | Understated learning/teaching CAD and high-school robotics context from supplied facts | Copy review; IMPROVED | Owner editorial review requested in PR |
| 6: eight-step demo | Existing modeled-state gates and keyboard controls worked | P1 | New `demo-edge-cases.spec.ts` | Preserve implementation; add invalid/boundary dimensions, cancellation, restart, rapid navigation coverage | Full workflow and edge tests; ALREADY SATISFIED | Simulation is not a CAD connection |
| 7: mobile Escape | Open mobile menu did not close on Escape | P1 | `SiteHeader.tsx` | Escape close with focus return, route change cleanup | New keyboard regressions; FIXED | Native screen-reader testing not available |
| 8: CAD canvas state stack | Outer canvas save/restore imbalance in draw loop | P1 | `CadArtwork3D.tsx` | Balance saved states; preserve offscreen/hidden/reduced-motion gates | Regression fails baseline, passes revised build; FIXED | Lab timing is not production performance |
| 8: metallic lifecycle | Hidden-tab rendering and incomplete resource cleanup | P1 | `metallic-button.tsx` | Visibility pause/resume and cleanup of buffers/shaders/program allocations | Lifecycle and WebGL-fallback regressions; FIXED | Visual enhancement remains optional |
| 8: sonar, scrolling, parallax | Intro settles; reduced-motion and native mobile scrolling already present | P1 | Existing implementation retained | Avoid unnecessary changes | Existing parallax/scrolling tests; ALREADY SATISFIED | Manual real-device GPU profiling not performed |
| 9: official logos | Existing approved light/dark/symbol SVG placements and favicon | P1 | Official SVG files unchanged | Keep geometry and brand colors | Brand asset tests, unchanged SVG checksums and small-size light/dark reference renders; ALREADY SATISFIED | Browser-chrome favicon theme review not performed |
| 9: social preview | Previous PNG used older centered hero composition | P2 | `public/assets/leqad-home-share-v1.png`, capture script | Capture actual revised website with official logo | Image visually inspected; IMPROVED | Social networks may cache prior image |
| 10: lint mislabeled | `lint` was TypeScript only | P2 | package scripts, `eslint.config.js`, workflow | Separate TypeScript check and true ESLint correctness pass across JS/MJS/TS/TSX | Lint and typecheck; FIXED | Deliberately narrow rules avoid unrelated style rewrites |
| 11: responsive/accessibility QA | Baseline unit/build/browser passed; screenshot comparison absent for this pass | P0 | Browser regressions, audit scripts, evidence directory | Five widths, axe, font-delay checks, state screenshots | Results below | Automated scans are not a complete accessibility assessment |
| 12: deployment / exact-commit CI | No authorized deployment; GitHub API access unavailable in session | P0 | Workflow updated | Prepared local production verification and reviewable changes | NOT VERIFIED | Preview/production review and final commit CI remain owner/remote follow-up |

## Automated checks

Baseline: old `lint` (TypeScript), 24 unit tests, production build and 96 browser tests passed. Baseline `npm ci` failed due to the absent lockfile.

Final local verification passed: clean `npm ci`, `npm run typecheck`, `npm run lint`, 24 unit tests, production build/prerender, and all 110 browser tests. The first full new suite had 109 passes and a cleanup assertion that read before unmount completed; the assertion now waits for observable buffer deletion and the complete rerun passed. Accessibility scanned 48 route and interaction states with zero reported WCAG A/AA violations. Before and after captures each cover 25 route/width cases with no horizontal overflow. The 48 cold-context font-delay comparison cases remained below 0.1 initial CLS, with a maximum of 0.0248. The ESLint parser uses Babel's TypeScript syntax support because the current TypeScript 7 compiler is newer than the supported peer range of typescript-eslint; no compiler downgrade or forced peer install was used.

## Before and after evidence

[Before screenshots](screenshots/quality-pass/before/) and [after screenshots](screenshots/quality-pass/after/) contain each public route and an unknown route at 320, 375, 768, 1024 and 1440 pixels. Inquiry dialogs are captured at every width; expanded mobile navigation at 320, 375 and 768. Full inner-page images include the footer; demo images include inner navigation. Captures use reduced motion for stable comparisons.

| State | Before | After |
|---|---|---|
| Home, 320px | [image](screenshots/quality-pass/before/home-320.png) | [image](screenshots/quality-pass/after/home-320.png) |
| Home, 1440px | [image](screenshots/quality-pass/before/home-1440.png) | [image](screenshots/quality-pass/after/home-1440.png) |
| About, 375px | [image](screenshots/quality-pass/before/about-375.png) | [image](screenshots/quality-pass/after/about-375.png) |
| Partners, 1440px | [image](screenshots/quality-pass/before/partners-1440.png) | [image](screenshots/quality-pass/after/partners-1440.png) |
| Inquiry, 320px | [image](screenshots/quality-pass/before/dialog-320.png) | [image](screenshots/quality-pass/after/dialog-320.png) |
| Mobile navigation | [image](screenshots/quality-pass/before/menu-375.png) | [image](screenshots/quality-pass/after/menu-375.png) |
| Demo, 375px | [image](screenshots/quality-pass/before/demo-375.png) | [image](screenshots/quality-pass/after/demo-375.png) |

## Accessibility and performance

[Accessibility results](screenshots/quality-pass/accessibility.json) include WCAG 2 A/AA and 2.1 A/AA checks plus items needing human review. Keyboard behavior is exercised in browser tests. DOM accessibility-name checks establish a stable hero heading; they do not substitute for listening with NVDA, VoiceOver or another screen reader.

[Font-delay comparison](screenshots/quality-pass/font-loading-cls.json) measures cold contexts with 0ms and 250ms artificial font delays. [Baseline](screenshots/quality-pass/before/performance.json) and [revised](screenshots/quality-pass/after/performance.json) performance samples record layout shifts, long tasks, loaded fonts and animation callbacks. These local headless measurements vary with concurrent browser load. They are not Lighthouse scores, real-user measurements or a claim of faster production loading. Canvas frame lifecycle assertions directly verify correctness of pausing and cleanup.

## Intentionally unchanged and limitations

- No invented email address, capabilities, statistics, endorsements or partnerships; no third-party contact provider.
- No homepage navbar, replacement font families, official SVG geometry edits, broad redesign or unrelated refactor.
- No merge, production deployment or public preview deployment.
- Chromium was available. Installed branded Chrome and Microsoft Edge, real touch hardware, browser-theme favicon inspection and native screen-reader listening were not verified. Touch input was emulated in Chromium.
- Remote CI on the final exact commit and deployed-host font/network behavior must be verified separately. Local production build checks do not establish either.

## Measured canvas lifecycle

[Baseline lifecycle](screenshots/quality-pass/canvas-lifecycle-before.json) and [revised lifecycle](screenshots/quality-pass/canvas-lifecycle-after.json) record actual browser instrumentation. In the one-second synthetic-hidden sample the shader drew 21 times before and zero times after. Canvas save-stack growth was 17 in the baseline visible sample and zero after the fix. Navigation released zero of one created vertex buffers before and one of one afterward. Reduced-motion and offscreen rendering remained paused. These counts establish lifecycle behavior, not a general frame-rate improvement under different concurrent loads.

[Light](screenshots/quality-pass/icon-light.png) and [dark](screenshots/quality-pass/icon-dark.png) color-scheme reference images show the actual existing SVG at 16/24/32/48/64px. This is a content render with browser color-scheme emulation, not a screenshot of browser tab chrome. No favicon asset change was needed.

## Launch and review follow-up

The owner-approved contact address is still absent. Configure `contactConfig.email` only after the owner verifies a public project address, then test opening and sending through a real email client. Drafts persist across dialog reopening within the mounted website session, not across a browser refresh.

The PR workflow now includes this feature branch on push so the exact committed revision can run remotely. Local passing checks do not establish remote CI status. Before publishing, verify all deep-link refreshes, fonts, SVGs, social metadata, contact behavior, demo and mobile layouts on the permitted deployment URL. No deployment was performed during this task.

GitHub PR creation returned `Post "https://api.github.com/graphql": Forbidden`. The implementation branch is pushed, with a [prepared PR description and creation link](website-ux-quality-pr.md). Remote CI and deployment checks remain NOT VERIFIED.
