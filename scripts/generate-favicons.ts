import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Favicon-only optical drawings. The approved logo and navbar asset are inputs
// for comparison, never edited or resampled into these icons.
const NAVY = '#0E2943', CREAM = '#F5EFE7', RUST = '#B74B21';
const output = 'public/assets/favicons';
const sizes = [16, 32, 48] as const;
const profiles = {
  16: { grid: .25, cavityScale: .8, slotStroke: .25, rim: .5 },
  32: { grid: .25, cavityScale: .92, slotStroke: .125, rim: .75 },
  48: { grid: .125, cavityScale: 1, slotStroke: 0, rim: .75 },
};
// Curves follow the approved symbol's circular silhouette, two lower chambers,
// upper chamber, two diagonal slots and rust three-pronged center.
const top = 'M11 8 C10 5.5 17 2.5 24 2.5 C31 2.5 38 5.5 37 8 C36.8 10 30 14 27 14 C25.2 14 24.7 11.4 24.2 10 C23.5 12.3 22.8 14.2 20.8 14 C17.4 13.8 11.2 10 11 8 Z';
const lower = 'M5.8 14.8 C4.2 16.1 2.4 20 2.5 25 C2.8 32.5 7.5 39 14 42.8 C16.4 44.2 18.6 43.7 19.8 41.2 C21.5 37.6 22.3 33.2 22.3 30.5 C22.3 28.5 21.1 27.6 19.5 27.8 C17 28.2 14.2 29.4 12.2 29.2 C14.5 27 16 25 16.6 23 C17 21.8 16.2 20.2 14.4 18.9 C12.4 17.3 8.7 15.4 7.2 14.9 C6.6 14.6 6.2 14.5 5.8 14.8 Z';
const slot = 'M6.4 12 C7.2 10.9 9.6 11.2 11.3 12.1 C14.1 13.6 17.2 16 19.2 18 C20.1 18.9 21 20.6 20.4 20.8 C19.5 21 18 20 16.6 19.2 C13.8 17.5 9.6 14.6 7.3 13.3 C6.5 12.9 6.1 12.5 6.4 12 Z';
const center = 'M24 10 L22 22.4 L12 30 L22.2 26 Q24 25.3 25.8 26 L36 30 L26 22.4 Z';
const rustTop = 'M24 14.2 L22.6 22.4 Q23.4 23 24 23.2 Q24.6 23 25.4 22.4 Z';
const rustSide = 'M22.4 23 L15 28.4 L23.2 25.2 Q23.7 24.9 23.6 24.3 L23.6 23.7 Z';

function drawing(size: typeof sizes[number]) {
  const profile = profiles[size];
  const nativePath = (path: string, cavity?: { x: number; y: number }) => {
    // Snap each control point in its own output grid, after optical adjustment.
    let axis = 0;
    return path.replace(/-?\d*\.?\d+/g, number => {
      let coordinate = Number(number);
      const anchor = axis++ % 2 === 0 ? cavity?.x : cavity?.y;
      if (anchor !== undefined) coordinate = anchor + (coordinate - anchor) * profile.cavityScale;
      return String(Math.round(coordinate * size / 48 / profile.grid) * profile.grid);
    });
  };
  const mirror = `translate(${size} 0) scale(-1 1)`;
  const centerPath = size === 16 ? 'M8 3.75 L6.75 7.25 L3.5 10.25 L7.25 9 Q8 8.5 8.75 9 L12.5 10.25 L9.25 7.25 Z' : nativePath(center);
  const topAccent = size === 16 ? 'M8 5 L7 7.25 L8 7.75 L9 7.25 Z' : nativePath(rustTop);
  const sideAccent = size === 16 ? 'M7 7.75 L4.5 9.75 L7.75 8.75 L7.75 8.25 Z' : nativePath(rustSide);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - .5}" fill="${CREAM}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - .5 - profile.rim}" fill="${NAVY}"/>
    <g fill="${CREAM}">
      <path d="${nativePath(top, { x: 24, y: 9 })}"/>
      <path d="${nativePath(lower, { x: 12, y: 29 })}"/>
      <path d="${nativePath(lower, { x: 12, y: 29 })}" transform="${mirror}"/>
      <g stroke="${CREAM}" stroke-width="${profile.slotStroke}" stroke-linejoin="round">
        <path d="${nativePath(slot)}"/>
        <path d="${nativePath(slot)}" transform="${mirror}"/>
      </g>
      <path d="${centerPath}"/>
    </g>
    <g fill="${RUST}">
      <path d="${topAccent}"/><path d="${sideAccent}"/>
      <path d="${sideAccent}" transform="${mirror}"/>
    </g>
  </svg>`;
}

const source = await readFile('public/assets/brand/leqad-approved.png');
if (createHash('sha256').update(source).digest('hex') !== 'ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1') throw new Error('Approved reference changed; review the reference before regenerating.');
await mkdir(output, { recursive: true });
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium'].find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const frames: Buffer[] = [];
  for (const size of sizes) {
    const svg = drawing(size);
    const data = await page.evaluate(async ({ svg, size }) => {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d')!.drawImage(image, 0, 0); // Native-size rasterization, no scaling or filters.
      return canvas.toDataURL('image/png').split(',')[1];
    }, { svg, size });
    const png = Buffer.from(data, 'base64');
    frames.push(png);
    await writeFile(`${output}/leqad-${size}-v2.png`, png);
  }
  // ICO directory holds the exact native PNGs. No automatic frame resizing.
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  for (const [index, size] of sizes.entries()) {
    const entry = 6 + index * 16;
    directory[entry] = directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(frames[index].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += frames[index].length;
  }
  await writeFile(`${output}/leqad-v2.ico`, Buffer.concat([directory, ...frames]));
} finally {
  await browser.close();
}
