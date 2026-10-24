import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

// Uses the same actual-page capture workflow as capture-screenshots.ts.
// Run after a production build: SCREENSHOT_ORIGIN=http://127.0.0.1:4173 npx tsx scripts/capture-social-preview.ts
const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const executablePath = [
  process.env.CHROMIUM_PATH,
  '/usr/bin/chromium',
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell',
  '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
].find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('img', { name: 'Leqad logo' }).evaluate(async image => {
    await (image as HTMLImageElement).decode();
  });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.screenshot({ path: 'public/assets/leqad-home-share-v1.png', animations: 'disabled' });
} finally {
  await browser.close();
}
