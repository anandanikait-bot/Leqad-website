# Current-brand social link card

The former Open Graph image was a screenshot of an animated homepage. It included an incomplete headline and a legacy bright-orange call-to-action despite the approved visual identity. It also used a tall 1440 × 1000 ratio, which crops poorly in link previews.

## Approved replacement
- `public/assets/leqad-home-share-v2.svg` is the editable 1200 × 630 (1.905:1) source.
- The official Leqad horizontal logo is embedded exactly from the approved SVG. No AI-generated substitute emblem is shipped.
- Palette: dark navy `#0E2943`, ivory `#F5EFE7`, Hay's Russet `#793327`; secondary neutrals remain understated.
- The headline reads "Learn CAD by building." with concise, honest information about the browser simulation.
- A simple cuboid shows the sketch-to-extrude idea, with text explicitly labeling it a concept visualization, not live CAD.
- Flat surfaces, no shadows and no pictured fake UI controls.

## Delivery
- `scripts/generate-social-card.mjs` uses Resvg with the website's existing Space Grotesk and Manrope font assets to rasterize the exact SVG to `public/assets/leqad-home-share-v2.png`.
- `npm run build` performs this step before Vite copies static assets into `dist/assets/`.
- The PNG is generated and Git-ignored; its versioned URL is the stable social image. Do not regenerate by capturing the animated homepage.
- Open Graph/Twitter tags must reference `https://leqad.com/assets/leqad-home-share-v2.png?v=20261025`, `image/png`, and dimensions `1200×630`.
- The demo route intentionally retains its separate CAD lesson image.

## Release verification
Review the generated PNG visually, check TypeScript/lint/unit/build/browser tests, then publish the updated Cloud Run build. Confirm the image returns HTTP 200 and is publicly downloadable without authentication, including to social preview bots; check raw page source for `og:image` and canonical URL. Previously cached messaging previews may need a re-scrape.

Github merge alone does not update the published AI Studio / Cloud Run service.
