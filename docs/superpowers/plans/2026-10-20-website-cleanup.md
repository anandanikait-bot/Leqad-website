# Leqad Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved minimal Leqad cleanup with clean URLs, crawlable pages and intact lesson behavior.
**Architecture:** React Router owns browser navigation. Vite builds the client and a small prerender entry; generated HTML is hydrated. An explicit Express production server serves the known prerendered routes with meaningful 404 responses. A single Lenis lifecycle owns smooth scrolling.
**Tech Stack:** Existing React/Vite/TypeScript, React Router, Lenis, Node tests, Playwright with system Chromium.
**Spec:** docs/superpowers/specs/2026-10-20-website-cleanup-design.md

## Global Constraints
- Preserve existing logo, hero artwork, fonts, colors, lesson state/progression and halftone particle interactions.
- Only /demo has the interactive lesson; About preview is noninteractive.
- No deployment or automatic merge. Production hosting behavior must be reported as unverified if inaccessible.
- Browser widths: 320, 375, 768, 1024, 1440px. Canonical origin: https://leqada.ai.studio.

## Review Focus
- Legacy URLs replace their history entry without breaking Back/Forward.
- Prerendered HTML has route content without JavaScript and hydrates without mismatch.
- Reduced-motion changes destroy/recreate Lenis without duplicate loops; panels keep native interaction.
- Narrow layouts expose the teaching CTA before the canvas without horizontal overflow.
- Unknown routes and missing assets return real 404s, not misleading HTML with 200.

### Task 1: Routing and crawlable build
**Files:** src/App.tsx, src/main.tsx, src/lib/routes.ts, src/lib/seo.ts, src/entry-server.tsx, scripts/prerender.ts, server.mjs, package.json, public/robots.txt, public/sitemap.xml, test/routing-and-seo.test.ts, test/production-server.test.ts.
**Interfaces:** route definitions expose pathname, PageRoute and metadata. renderPage(pathname) returns HTML. Production server reads dist route HTML.
- [ ] Add behavioral regression tests for legacy destinations, unique SEO and production deep links/404s; run to observe missing behavior.
- [ ] Install router, Lenis and browser test tooling; implement route navigation, hydration, per-route head generation and static prerendering.
- [ ] Serve exact route documents through a tested production server; verify no-JS content and correct status codes.
- [ ] Run unit tests, build and TypeScript; commit the routing/build change.

### Task 2: Focused UI and scrolling
**Files:** header/footer, hero, About/ProductPreview, DemoPage/DemoWorkbench/LessonPanel/SimulatedCADCanvas, halftone footer, shared Button, ScrollManager, artwork/CSS; test/browser/website.spec.ts.
**Interfaces:** all navigational actions are Link/NavLink; lesson callbacks remain intact; ScrollManager uses pathname and excludes data-lenis-prevent nodes.
- [ ] Add browser assertions for removals, closed help, progression, static About and navigation; observe expected failures.
- [ ] Apply screenshot removals and canvas mask, static preview, accessible links and single managed Lenis lifecycle.
- [ ] Verify lesson completion/restart, optional hints/highlighting, clean refreshes, history and reduced motion.
- [ ] Verify all routes at each requested width without overflow; capture desktop/mobile screenshots and commit.

### Task 3: Review and delivery
**Files:** docs/hosting.md, docs/validation.md, test screenshots and PR body.
- [ ] Run final full checks and obtain a fresh whole-branch review; address material findings with regression coverage.
- [ ] Record actual results and exact AI Studio post-deployment checks; retry production/GitHub access only after a meaningful configuration change.
- [ ] Commit reviewable artifacts, push only the feature branch and open a PR if authorized access works; never deploy or merge.
