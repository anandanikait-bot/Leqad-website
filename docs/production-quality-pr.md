# Improve production artifact hygiene, route delivery and SEO

The production build copied historical branding archives and loaded the entire CAD lesson on every page. This change excludes confirmed reference material from dist (retaining repository originals), defers the demo module in the browser while preserving complete static HTML, and removes five unimported dependencies.

It also makes page titles descriptive, corrects the drawn rectangle's accessible SVG role, and prevents offscreen footer redraws when returning to a tab. Approved logos, colors, font files, page layouts, visible content, CAD geometry/state machine, and animation rates remain unchanged.

Validation: fresh npm ci; TypeScript, lint, 33 unit tests, build/prerender, and 179 browser tests passed. Before/after screenshots cover all public pages and contact/drawing/extrusion states at 320/375/390/430/768/1024/1440px. Final 49 axe scans have zero violations; this is not a WCAG certification.

See [the completed 20-item technical and 20-item visual audits](https://github.com/anandanikait-bot/Leqad-website/blob/fix/website-production-quality/docs/production-quality-audit.md) for screenshot comparisons, raw records, performance tradeoffs and production-only verification. Initial non-demo JS is 10.4% smaller; combined JS is slightly larger after splitting. Do not infer field performance improvements from local lab timing samples.

Live leqad.com access and GitHub's open-PR API were blocked in this environment. Hosting/deployed headers, real redirects, public crawler access, edge compression, physical devices, assistive technology and Formspree account receipt still require verification. No merge, deployment or DNS changes performed.
