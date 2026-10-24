# Fix website inquiry UX, accessibility, and rendering lifecycle

Branch `fix/website-ux-quality-pass` targets `main`.

[Create the pull request](https://github.com/anandanikait-bot/Leqad-website/pull/new/fix/website-ux-quality-pass)

GitHub API PR creation returned `Post "https://api.github.com/graphql": Forbidden`. No PR was created automatically. Remote CI status is not verified. The description below is ready for review.

---

Fix inquiry draft loss and unusable clipboard-failure recovery, complete the accessible homepage heading, and add Escape/focus handling to mobile navigation. Pause hidden shader work and release WebGL buffers; balance CAD canvas state without changing geometry or lesson logic.

Add a restrained official homepage logo, supplied founder context, clearer current/unverified/planned product copy, and a fresh social preview. Preserve current fonts, official SVG geometry, demo behavior, and the header-free homepage. Add true ESLint, separate typecheck, a dependency lockfile, and CI updates.

Validation: clean npm ci, TypeScript, ESLint, production build, 24 unit tests and 110 browser tests pass. 48 axe scans report zero WCAG A/AA violations. Before/after screenshots cover all five widths with no horizontal overflow; delayed font-load observations stay below 0.1 CLS. Measured hidden shader draws fell from 21 to 0 in the one-second comparison; canvas save-stack growth and buffer cleanup are corrected.

[Audit matrix, evidence, screenshots and limitations](docs/website-ux-quality-audit.md)

The owner-approved Formspree endpoint now accepts direct submissions from the React dialog. Pending, accepted and failure states preserve the draft and prevent duplicate clicks. Forwarding to `anandanikait@gmail.com` follows the owner’s Formspree settings and needs a real post-deployment check. Native screen-reader listening, installed Edge/Chrome browser chrome, deployed-host checks, and exact-commit remote CI remain unverified. No merge or deployment.

[Formspree implementation and validation](formspree-integration.md). Tests mock the external service rather than creating real inquiries.
