import { chromium, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.SCREENSHOT_ORIGIN ?? 'http://127.0.0.1:4173';
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium',
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell']
  .find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
await mkdir('docs/screenshots/metallic-cta', { recursive: true });
const evidence: object[] = [];

try {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    for (const variant of ['rust', 'metallic'] as const) {
      await page.goto(origin + (variant === 'metallic' ? '/?metallic=1' : '/'));
      await page.evaluate(() => document.fonts.ready);
      const link = page.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
      await expect(link).toBeVisible();
      await expect(page.locator('[data-metallic-cta]')).toHaveCount(variant === 'metallic' ? 1 : 0);
      await page.screenshot({
        path: `docs/screenshots/metallic-cta/${variant}-${width}px.png`,
        fullPage: true,
        animations: 'disabled',
      });
      const data = await page.evaluate(() => {
        const link = document.querySelector('main a[href="/demo"]') as HTMLAnchorElement;
        const box = link.getBoundingClientRect();
        return {
          ctaBounds: { x: box.x, y: box.y, width: box.width, height: box.height },
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          shaderCanvases: document.querySelectorAll('[data-metallic-cta] canvas').length,
          shaderEnabled: Boolean(document.querySelector('[data-metallic-cta]')),
          resourceTransferBytes: performance.getEntriesByType('resource')
            .reduce((total, resource) => total + ((resource as PerformanceResourceTiming).transferSize || 0), 0),
        };
      });
      if (data.horizontalOverflow) throw new Error(`Horizontal overflow at ${width}px: ${variant}`);
      evidence.push({ width, variant, ...data });
    }
    await page.close();
  }
  await writeFile('docs/screenshots/metallic-cta/comparison.json', JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await browser.close();
}
