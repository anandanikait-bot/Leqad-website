# Apply approved Minimal Engineering typography and Leqad branding

Branch: `feat/approved-typography-branding` → `main`.

[Create the PR](https://github.com/anandanikait-bot/Leqad-website/pull/new/feat/approved-typography-branding)

PR creation was attempted using `gh pr create`; GitHub API access returned `Post "https://api.github.com/graphql": Forbidden`. The branch is pushed; no PR number or URL was created. No merge or deployment was performed.

The text below is the prepared PR description. Screenshots and validation are committed on this branch.

---

Apply approved Typography A and Branding A: Space Grotesk headings, Manrope body/navigation/buttons, retained IBM Plex Mono, and a 12% larger navbar logo within the existing header height. The centered halftone footer now samples the complete official SVG lockup, preserving its geometry, proportions, alpha, and navy/ivory/Hay’s Russet palette.

Font files are self-hosted with OFL licenses and preloaded. Existing website content, CAD interactions, lesson state, scrolling, and animation logic are unchanged.

Validation: TypeScript and production/prerender build pass; 24 unit tests and 93 browser tests pass; 20 responsive route/width checks at 320, 375, 768, 1024, and 1440px pass; 35 axe WCAG A/AA scans report zero violations. Cold-load font observations remain below 0.1 CLS with normal and delayed font delivery. Manual visual review and an independent code review found no blocking issues.

- [Validation, limitations, and screenshot matrix](docs/approved-branding-validation.md)
- [Desktop homepage](docs/screenshots/approved-branding/final/home-1440.png)
- [Mobile About](docs/screenshots/approved-branding/final/about-375.png)
- [Desktop footer](docs/screenshots/approved-branding/final/footer-1440.png)
- [Mobile footer](docs/screenshots/approved-branding/final/footer-375.png)

![Desktop footer](docs/screenshots/approved-branding/final/footer-1440.png)

No merge or deployment. Production font timing and hosting remain unverified. Main currently lacks a package lock; setup used npm install without creating one. Accessibility manual-review items for gradients/canvas are documented.
