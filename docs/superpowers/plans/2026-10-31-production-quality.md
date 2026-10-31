# Production Quality Implementation Plan

> Execution: implement in this session, with independent audits and final review.

**Goal:** Verify the generated website and correct confirmed defects with no redesign.
**Architecture:** Keep Vite static route prerendering, React hydration, Express route handling, and the existing CAD state machine.
**Tech stack:** React/TypeScript, Vite, Express, Playwright/axe.
**Spec:** User's eleven-phase production quality brief in this conversation.

## Constraints and review focus
- Preserve branding, typography, geometry, lesson interactions, animations and homepage layout.
- No merge, deployment, DNS changes or real inquiry submissions.
- Validate unknown routes/assets, direct refresh, no-JS content, delayed hydration and reduced motion.
- Verify public artifact exclusions preserve all runtime image/font/favicon URLs and repository originals.
- Use measured cold local desktop/mobile results; do not claim field INP or live hosting correctness.

## Tasks
- [x] Install and run baseline typecheck/lint/unit/build/browser checks from latest main; freeze dist; capture all seven widths and network/performance records.
- [x] Add generated-build regression coverage for semantic SEO, crawler resources, social PNGs, artifact hygiene and runtime errors. Observe confirmed artifact test failure before correction.
- [x] Exclude unused public handoff archives/docs from dist without deleting originals. Remove only dependencies with no imports. Keep font licenses and existing public branding URLs.
- [x] Measure eager demo cost; split only demo code if prerendered content and hydration remain correct. Verify navigation/back/reload and no-JS content. Avoid unnecessary loading UI.
- [x] Correct semantic SVG issue only if axe reproduces it; preserve SVG geometry and labels.
- [x] Compare baseline/final responsive screenshots and lab metrics; run final npm ci/typecheck/lint/unit/build/browser and production route checks.
- [x] Write 20-item technical and visual audit, limitations and PR handoff; review diff, commit/push branch, attempt one PR. No merge or deploy.

Execution note: GitHub API restrictions may block PR creation; record the actual attempt and provide the prepared body and compare link if so. Final results and production-only limitations are recorded in docs/production-quality-audit.md.
