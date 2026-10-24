# Website fonts

Original variable TTF files from the official Google Fonts repository. `sources.json` records source URLs, SHA-256 hashes, and weight axes. Their unmodified OFL 1.1 licenses accompany each file.

- Space Grotesk: headings, 600; rotating hero phrase, 500.
- Manrope: body, 400; navigation and buttons, 500/600; emphasis, 700.
- IBM Plex Mono: retained through the existing `@fontsource/ibm-plex-mono` dependency (400/500/600/700), including CAD SVG labels.

The two variable faces are self-hosted and preloaded in `index.html`, with `font-display: swap`. Logo lettering remains in the unchanged official SVG paths.
