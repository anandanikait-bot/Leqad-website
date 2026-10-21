# Leqad website cleanup — approved design

Approved in chat on October 20, 2026. Preserve the logo, colors, fonts, hero composition/artwork and CAD lesson logic. Remove the annotated badges, duplicate navigation/footer copy and demo chrome. Keep a navy visual footer with the original halftone particles, 220–310px artwork and a canvas-only fade over the bottom 30%. Close optional hints/why explanations under Need help?. Mobile teaching panel precedes canvas. Only /demo contains an interactive lesson; About uses a static preview.

Use React Router links, Back/Forward, and replace known legacy hash routes. Build prerendered HTML for /, /demo, /about and /partners with unique title/description, canonical, social tags and accurate structured data. Hydrate that HTML in the browser. Supply an explicit production server that serves each route's generated HTML, robots and sitemap, rather than relying on an undocumented host rewrite. AI Studio compatibility remains unverified until tested on the real deployment; do not deploy or claim it works there.

Use maintained Lenis with restrained wheel smoothing, native touch behavior, reduced-motion opt-out, lifecycle cleanup, workspace/panel exclusions and immediate route resets. Preserve canvas artwork and limit offscreen/reduced-motion work.

Validate TypeScript, production build, existing tests and browser behavior at 320, 375, 768, 1024 and 1440px. Test primary progression, hints, highlighting, static About, legacy links, clean direct requests/refreshes, Back/Forward, reduced motion and Lenis exclusions. Capture desktop/mobile screenshots. Work on a separate branch and create a PR if GitHub access permits. Do not deploy or merge.
