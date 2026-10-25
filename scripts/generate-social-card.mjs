import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Build a static social card from the approved branded SVG, not an
// unreliable screenshot of the animated homepage or WebGL artwork.
const source = resolve('public/assets/leqad-home-share-v2.svg');
const target = resolve('public/assets/leqad-home-share-v2.png');
const png = new Resvg(readFileSync(source, 'utf8'), {
  fitTo: { mode: 'original' },
  font: {
    loadSystemFonts: false,
    fontFiles: [
      resolve('public/assets/fonts/SpaceGrotesk-variable-v1.ttf'),
      resolve('public/assets/fonts/Manrope-variable-v1.ttf'),
    ],
    defaultFontFamily: 'Space Grotesk',
  },
}).render().asPng();
if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
  throw new Error('Unexpected social card size; expected 1200 × 630.');
}
writeFileSync(target, png);
console.log('Generated social card:', target, png.length, 'bytes');
