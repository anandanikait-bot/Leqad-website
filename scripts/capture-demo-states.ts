import { chromium, type Page } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium'].find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
await mkdir('docs/screenshots/demo', { recursive: true });
const worldPoint = async (page: Page, x: number, y: number) => {
  const viewport = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  await viewport.scrollIntoViewIfNeeded();
  return viewport.evaluate((element, position) => {
    const svg = element as SVGSVGElement;
    const p = svg.createSVGPoint(); p.x = position.x; p.y = position.y;
    const screen = p.matrixTransform(svg.getScreenCTM()!);
    return { x: screen.x, y: screen.y };
  }, { x, y });
};
try {
  for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 375, 900], ['320px', 320, 900], ['768px', 768, 1000], ['1024px', 1024, 1000]] as const) {
    const touch = width < 768;
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: touch, isMobile: touch });
    await page.goto(origin + '/demo');
    await page.evaluate(() => document.fonts.ready);
    const workspace = page.locator('section[aria-labelledby="demo-title"] > div');
    const shot = async (name: string) => {
      // A cropped tall workspace should not contain a sticky-header overlay.
      await page.locator('header').evaluate(element => { element.style.visibility = 'hidden'; });
      await workspace.screenshot({ path: `docs/screenshots/demo/${name}-${device}.png`, animations: 'disabled' });
      await page.locator('header').evaluate(element => { element.style.visibility = ''; });
      await page.evaluate(() => window.scrollTo(0, 0));
    };
    await shot('01-introduction');
    await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
    await shot('02-select-plane');
    await page.getByRole('button', { name: 'Select Top Plane in viewport', exact: true }).click();
    await shot('03-start-sketch');
    await page.getByRole('button', { name: 'Sketch tool', exact: true }).click();
    await page.getByRole('button', { name: 'Corner Rectangle tool', exact: true }).click();
    let point = await worldPoint(page, 0, 0);
    if (touch) await page.touchscreen.tap(point.x, point.y);
    else await page.mouse.click(point.x, point.y);
    point = await worldPoint(page, 135, -96);
    if (!touch) await page.mouse.move(point.x, point.y);
    await shot('04-draw-rectangle');
    // Cropped screenshots can scroll the page; resolve coordinates again.
    point = await worldPoint(page, 135, -96);
    if (touch) await page.touchscreen.tap(point.x, point.y);
    else await page.mouse.click(point.x, point.y);
    await page.getByLabel('Width (mm)', { exact: true }).fill('48');
    await page.getByLabel('Height (mm)', { exact: true }).fill('36');
    await shot('05-edit-dimensions');
    await page.getByRole('button', { name: 'Set 48 × 36 mm dimensions', exact: true }).click();
    await page.getByRole('button', { name: 'Finish sketch', exact: true }).waitFor();
    await shot('06-finish-sketch');
    await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
    await shot('07-accepted-profile');
    await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
    await page.getByLabel('Depth (mm)', { exact: true }).fill('12');
    await shot('08-extrude-preview');
    await page.getByRole('button', { name: 'Create solid', exact: true }).click();
    await shot('09-confirmed-plate');
    await page.getByRole('button', { name: 'Restart walkthrough', exact: true }).click();
    for (const name of ['Start walkthrough', 'Select Top Plane', 'Start sketch', 'Use guided rectangle']) await page.getByRole('button', { name, exact: true }).click();
    await page.getByLabel('Width (mm)', { exact: true }).fill('50');
    await page.getByLabel('Height (mm)', { exact: true }).fill('40');
    for (const name of ['Set 50 × 40 mm dimensions', 'Finish sketch', 'Start Extrude']) await page.getByRole('button', { name, exact: true }).click();
    await page.getByLabel('Depth (mm)', { exact: true }).fill('50');
    await shot('10-maximum-model');
    await page.close();
  }

  // Record real browser frames; no new animation or rendering dependency.
  if (existsSync('/usr/bin/ffmpeg')) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(origin + '/demo');
    await page.evaluate(() => document.fonts.ready);
    // A recording-only cursor makes the actual pointer path visible in frames.
    await page.evaluate(() => {
      const cursor = document.createElement('div');
      cursor.style.cssText = 'position:fixed;width:12px;height:12px;border:2px solid #fff;border-radius:50%;background:#B74B21;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);left:-30px';
      document.body.append(cursor);
      document.addEventListener('pointermove', event => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; });
    });
    const encoder = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '12', '-c:v', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'docs/screenshots/demo/sketch-to-extrude.mp4'], { stdio: ['pipe', 'ignore', 'inherit'] });
    const encoded = new Promise<void>((resolve, reject) => {
      encoder.once('error', reject);
      encoder.once('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
    });
    let finished = false;
    const recording = (async () => {
      while (!finished) {
        const start = Date.now();
        const frame = await page.screenshot({ type: 'jpeg', quality: 85 });
        if (!encoder.stdin.write(frame)) await new Promise<void>(resolve => encoder.stdin.once('drain', resolve));
        await page.waitForTimeout(Math.max(0, 1000 / 12 - (Date.now() - start)));
      }
    })();
    const click = async (name: string) => {
      const target = page.getByRole('button', { name, exact: true });
      await target.scrollIntoViewIfNeeded();
      const box = (await target.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
      await target.click();
      await page.waitForTimeout(400);
    };
    const edit = async (label: string, value: string) => {
      const field = page.getByLabel(label, { exact: true });
      await field.scrollIntoViewIfNeeded();
      const box = (await field.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
      await field.click();
      await field.fill(value);
      await page.waitForTimeout(400);
    };
    try {
      await click('Start walkthrough');
      await click('Select Top Plane in viewport');
      await click('Sketch tool');
      await click('Corner Rectangle tool');
      let p = await worldPoint(page, 0, 0);
      await page.mouse.move(p.x, p.y, { steps: 8 });
      await page.mouse.click(p.x, p.y);
      await page.waitForTimeout(350);
      p = await worldPoint(page, 135, -96);
      for (let i = 1; i <= 16; i++) {
        const preview = await worldPoint(page, 135 * i / 16, -96 * i / 16);
        await page.mouse.move(preview.x, preview.y);
        await page.waitForTimeout(55);
      }
      await page.waitForTimeout(500);
      await page.mouse.click(p.x, p.y);
      await page.waitForTimeout(400);
      await edit('Width (mm)', '48');
      await edit('Height (mm)', '36');
      await click('Set 48 × 36 mm dimensions');
      await click('Finish sketch');
      await click('Start Extrude');
      await edit('Depth (mm)', '18');
      await page.waitForTimeout(650);
      await click('Create solid');
      await page.waitForTimeout(1200);
    } finally {
      finished = true;
      await recording;
      encoder.stdin.end();
      await encoded;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
