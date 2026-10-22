import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = promisify(execFile);
const output = 'docs/screenshots/favicon';
const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium'].find(path => path && existsSync(path));
const dataUrl = async (path: string, mime = 'image/png') => `data:${mime};base64,${(await readFile(path)).toString('base64')}`;
await mkdir(output, { recursive: true });
const images = await Promise.all([16, 32, 48].map(size => dataUrl(`public/assets/favicons/leqad-${size}-v2.png`)));
const reference = await dataUrl('public/assets/brand/leqad-approved.png');
const old = await dataUrl('public/assets/brand/leqad-tab-v1.svg', 'image/svg+xml');
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
try {
  const oldImages: Record<string, string[]> = {};
  for (const colorScheme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    oldImages[colorScheme] = await page.evaluate(async url => {
      const image = new Image(); image.src = url; await image.decode();
      return [16, 32, 48].map(size => {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
        canvas.getContext('2d')!.drawImage(image, 0, 0, size, size);
        return canvas.toDataURL();
      });
    }, old);
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1060, height: 760 }, deviceScaleFactor: 1 });
  const panels = ['light', 'dark'].map(theme => `<section class="${theme}"><h2>${theme} tab colors · native pixels</h2>${[16, 32, 48].map((size, index) => `
    <div class="row"><span class="size">${size}×${size}</span><div class="tab"><small>Before</small><img src="${oldImages[theme][index]}" width="${size}" height="${size}"><span>Leqad</span></div><div class="tab"><small>After</small><img src="${images[index]}" width="${size}" height="${size}"><span>Leqad</span></div></div>`).join('')}</section>`).join('');
  await page.setContent(`<html><head><style>
    *{box-sizing:border-box}body{margin:0;background:#f3f4f5;color:#182433;font:14px Arial,sans-serif;padding:24px}h1{font-size:22px;margin:0 0 8px}p{color:#506070;margin:0 0 22px}.panels{display:grid;grid-template-columns:1fr 1fr;gap:16px}section{padding:18px;border-radius:12px}.light{background:#dee1e6}.dark{background:#202124;color:#e8eaed}h2{font-size:14px;margin:0 0 20px}.row{display:flex;align-items:center;gap:10px;margin:0 0 16px;min-height:64px}.size{width:42px;font-size:11px}.tab{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;flex:1;position:relative;background:#fff;min-height:64px}.dark .tab{background:#35363a}.tab small{position:absolute;top:-11px;left:6px;font-size:10px}.tab img{flex:none}.inspection{display:flex;gap:28px;align-items:center;margin-top:26px}.zoom{color:#e8eaed;background:#35363a;padding:14px;border-radius:10px}.zoom img{image-rendering:pixelated;display:block}figcaption{font-size:12px;margin-top:8px}figure{margin:0}.note{margin-top:18px;max-width:800px;font-size:12px;line-height:1.6}
    </style></head><body><h1>Leqad favicon · native-size review</h1><p>New PNG drawings at 1 device pixel per CSS pixel. Tab-color samples below; actual Chromium tab captures are separate.</p><div class="panels">${panels}</div><div class="inspection"><figure><img src="${reference}" width="128" height="128"><figcaption>Approved reference · untouched</figcaption></figure><figure class="zoom"><img src="${images[0]}" width="128" height="128"><figcaption>16px drawing · 8× pixel inspection</figcaption></figure><figure class="zoom"><img src="${images[1]}" width="128" height="128"><figcaption>32px drawing · 4× pixel inspection</figcaption></figure></div><p class="note">Transparent outside the circular symbol. Flat navy, cream and rust; no filters or blurred halos. The 16px drawing has wider accent geometry and separators; each size is rasterized directly in its own pixel grid.</p></body></html>`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
  await page.screenshot({ path: `${output}/native-size-review.png`, fullPage: true });
} finally { await browser.close(); }

// Optional headed proof: capture actual browser chrome, not a webpage imitation.
// Start Xvfb separately and set FAVICON_REVIEW_DISPLAY to its display number.
const display = process.env.FAVICON_REVIEW_DISPLAY;
if (display) {
  const evidence: object[] = [];
  for (const theme of ['light', 'dark']) for (const scale of [1, 2]) {
    const profile = await mkdtemp(join(tmpdir(), 'leqad-favicon-profile-'));
    const context = await chromium.launchPersistentContext(profile, {
      executablePath, headless: false, viewport: null, reducedMotion: 'reduce',
      ignoreDefaultArgs: ['--enable-automation'],
      env: { ...process.env, DISPLAY: display },
      args: ['--no-sandbox', '--test-type', '--no-first-run', '--no-default-browser-check',
        '--window-position=0,0', `--window-size=${1440 / scale},${1000 / scale}`,
        `--force-device-scale-factor=${scale}`, ...(theme === 'dark' ? ['--force-dark-mode'] : [])],
    });
    const version = context.browser()?.version();
    try {
      const page = context.pages()[0];
      await page.goto(origin);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('main h1').click();
      await page.waitForTimeout(1500); // Browser UI favicon commit is outside page lifecycle events.
      await run('/usr/bin/import', ['-display', display, '-window', 'root', `${output}/chromium-${theme}-${scale}x.png`]);
      await run('/usr/bin/convert', [`${output}/chromium-${theme}-${scale}x.png`,
        '-crop', `${300 * scale}x${44 * scale}+0+0`, '+repage', `${output}/tab-strip-${theme}-${16 * scale}px.png`]);
      evidence.push({ theme, scale, physicalTabIconSize: 16 * scale, version,
        devicePixelRatio: await page.evaluate(() => devicePixelRatio) });
    } finally { await context.close(); }
    const { stdout } = await run('python3', ['-c',
      'import sqlite3,json,sys; c=sqlite3.connect(sys.argv[1]); print(json.dumps(c.execute("SELECT f.url,b.width,b.height FROM favicons f JOIN favicon_bitmaps b ON b.icon_id=f.id").fetchall()))',
      join(profile, 'Default', 'Favicons')]);
    Object.assign(evidence[evidence.length - 1], { storedFaviconBitmaps: JSON.parse(stdout) });
    await rm(profile, { recursive: true, force: true });
  }
  await writeFile(`${output}/chromium-verification.json`, JSON.stringify(evidence, null, 2) + '\n');
}
