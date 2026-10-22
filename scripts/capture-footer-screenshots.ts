import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const defaultChromium = existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || defaultChromium,
  args: ['--no-sandbox'],
});

await mkdir('docs/screenshots', { recursive: true });

try {
  const widths = [
    { label: '1440px', width: 1440, height: 1000 },
    { label: '768px', width: 768, height: 1000 },
    { label: '375px', width: 375, height: 900 },
  ] as const;

  for (const { label, width, height } of widths) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });

    await page.goto('http://127.0.0.1:4173/about');
    await page.evaluate(() => document.fonts.ready);
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Allow canvas rendering and layout to settle
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    await footer.screenshot({
      path: `docs/screenshots/footer-${label}.png`,
      animations: 'disabled',
    });

    console.log(`Captured footer screenshot at ${label}`);
    await page.close();
  }
} finally {
  await browser.close();
}
