# Improve CAD dimension contrast and mobile tool labels

Branch `polish/pre-yc-cad-labels` targets `main` from `9f6b73e`.

[Create the focused PR](https://github.com/anandanikait-bot/Leqad-website/pull/new/polish/pre-yc-cad-labels)

GitHub API creation returned `Post "https://api.github.com/graphql": Forbidden`. The branch is pushed; no PR was created automatically. Exact-commit remote CI is NOT VERIFIED. Local check results are recorded in the linked validation report.

---

Improve homepage CAD dimension readability with ivory glyphs on tight navy backings, and show compact mobile Sketch/Extrude/Rectangle/Dimension names while retaining 44px targets. Geometry, interactions, action gating, keyboard controls, desktop presentation, branding and animation frame rates remain unchanged.

Validation: TypeScript/lint, 33 unit tests, production build/prerender and 169 browser tests passed. Before/after capture covers 320/375/1440,2D/3D, active tools, all routes and refreshes. Accessibility comparison found the same pre-existing SVG ARIA finding at all 3 widths; extreme-rotation label clipping at 320 also predates this change. Performance is investigated and documented only.

[Validation, before/after screenshots and limitations](docs/pre-yc-polish-validation.md)

No deployment or merge. Live host, physical phone, real Formspree and remote CI acceptance remain separate owner/CI checks.
