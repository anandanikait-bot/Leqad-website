import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium'].find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
await mkdir('docs/screenshots/demo', { recursive: true });
try {
  for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 375, 900]] as const) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
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
    await shot('04-draw-rectangle');
    await page.getByRole('button', { name: 'Draw rectangle', exact: true }).click();
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
    await page.close();
  }

  // Record real browser frames; no new animation or rendering dependency.
  if (existsSync('/usr/bin/ffmpeg')) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(origin + '/demo');
    await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
    for (const name of ['Select Top Plane', 'Start sketch', 'Draw rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch']) {
      await page.getByRole('button', { name, exact: true }).click();
    }
    const encoder = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '12', '-c:v', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'docs/screenshots/demo/sketch-to-extrude.mp4'], { stdio: ['pipe', 'ignore', 'inherit'] });
    const encoded = new Promise<void>((resolve, reject) => {
      encoder.once('error', reject);
      encoder.once('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
    });
    const recording = (async () => {
      for (let i = 0; i < 42; i++) {
        encoder.stdin.write(await page.screenshot({ type: 'jpeg', quality: 80 }));
        await page.waitForTimeout(60);
      }
    })();
    await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
    await page.waitForTimeout(650);
    await page.getByLabel('Depth (mm)', { exact: true }).fill('18');
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Create solid', exact: true }).click();
    await recording;
    encoder.stdin.end();
    await encoded;
    await page.close();
  }
} finally {
  await browser.close();
}
