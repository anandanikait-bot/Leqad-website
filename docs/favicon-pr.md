# Fix browser favicon with crisp native PNG and ICO assets

The existing tab SVG embedded the navbar raster and used color filters, making tiny tab rendering dependent on scaling and filtering. Dedicated 16×16, 32×32 and 48×48 optical drawings now provide flat navy/cream/rust artwork, transparent surroundings, tight bounds and size-specific pixel alignment. The multi-size ICO contains those exact PNG frames. Versioned v2 paths in `index.html` replace the SVG reference and avoid its cache; the Apple touch icon remains unchanged.

The official approved logo, navbar, footer, hero, all application components, page design, titles and dependencies are unchanged. These are favicon-specific adaptations, not replacements for the official brand source.

Validation: clean install, lint, production/prerender build, **26 unit tests and 60 browser tests passed**, with zero failures or skips. Reviewed actual headed Chromium tabs on light and dark themes at 100% and 200% display scaling, giving native 16px and 32px icon rendering. Fresh-profile favicon databases confirm native ICO frames were selected. The 48px asset was also inspected in the comparison sheet.

- [Validation and all visual evidence](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/favicon-validation.md)
- [Native-size before/after review](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/screenshots/favicon/native-size-review.png)
- [Actual dark 16px tab](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/screenshots/favicon/tab-strip-dark-16px.png)
- [Actual dark 32px tab](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/screenshots/favicon/tab-strip-dark-32px.png)
- [Actual light 16px tab](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/screenshots/favicon/tab-strip-light-16px.png)
- [Actual light 32px tab](https://github.com/anandanikait-bot/Leqad-website/blob/fix/crisp-browser-favicon/docs/screenshots/favicon/tab-strip-light-32px.png)

No merge or deployment performed. Verification used Chromium 154 on Linux; other OS/browser installations were not run.
