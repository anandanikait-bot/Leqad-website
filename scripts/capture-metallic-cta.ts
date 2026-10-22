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
    // Unsupported WebGL2 is already covered by the dedicated browser test.
    // The standalone screenshot runner must not mock browser APIs: its
    // initialization order can differ from the Playwright test runner.
    for (const variant of ['normal-motion', 'reduced-motion'] as const) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: variant === 'reduced-motion' ? 'reduce' : 'no-preference',
      });
      try {
        const page = await context.newPage();
        await page.goto(origin + '/');
        await page.evaluate(() => document.fonts.ready);
        const button = page.locator('[data-metallic-cta]');
        await expect(button).toBeVisible();
        const link = button.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
        await expect(link).toHaveAttribute('href', '/demo');
        await expect(button).toHaveAttribute('data-shader-status', /ready|fallback/);

        await page.screenshot({
          path: 'docs/screenshots/metallic-cta/' + variant + '-' + width + 'px.png',
          fullPage: true,
          animations: 'disabled',
        });
        const data = await page.evaluate(() => {
          const link = document.querySelector('main a[href="/demo"]') as HTMLAnchorElement;
          const box = link.getBoundingClientRect();
          return {
            ctaBounds: { x: box.x, y: box.y, width: box.width, height: box.height },
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            shaderStatus: document.querySelector('[data-metallic-cta]')?.getAttribute('data-shader-status'),
            shaderCanvases: document.querySelectorAll('[data-metallic-cta] canvas').length,
            resourceTransferBytes: performance.getEntriesByType('resource')
              .reduce((total, resource) => total + ((resource as PerformanceResourceTiming).transferSize || 0), 0),
          };
        });
        if (data.horizontalOverflow) throw new Error('Horizontal overflow at ' + width + 'px: ' + variant);
        evidence.push({ width, variant, ...data });
      } finally {
        await context.close();
      }
    }
  }
  await writeFile('docs/screenshots/metallic-cta/comparison.json', JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await browser.close();
}
