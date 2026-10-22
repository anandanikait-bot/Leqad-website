import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Run against the built site: PORT=4173 npm start, then npm run screenshots.
const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const defaultChromium = existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || defaultChromium,
  args: ['--no-sandbox'],
});
await mkdir('docs/screenshots', { recursive: true });
try {
  for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 375, 900]] as const) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    for (const [name, path] of [['home', '/'], ['demo', '/demo'], ['about', '/about'], ['partners', '/partners']]) {
      await page.goto(origin + path);
      await page.evaluate(() => document.fonts.ready);
      if (path !== '/') {
        await page.locator('footer canvas').scrollIntoViewIfNeeded();
      }
      // Allow IntersectionObserver and the canvas draw to complete before full-page capture.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `docs/screenshots/${name}-${device}.png`, fullPage: true, animations: 'disabled' });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
