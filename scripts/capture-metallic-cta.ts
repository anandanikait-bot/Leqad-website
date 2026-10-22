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
    for (const variant of ['metallic-default', 'static-webgl-fallback'] as const) {
      // Apply WebGL policy before creating the page so it is in place for
      // prerender hydration and every document, including client navigations.
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      });
      if (variant === 'static-webgl-fallback') {
        await context.addInitScript(() => {
          const original = HTMLCanvasElement.prototype.getContext;
          Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            configurable: true,
            value: function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
              if (type === 'webgl2') return null;
              return Reflect.apply(original, this, [type, ...args]);
            },
          });
        });
      }
      const page = await context.newPage();
      await page.goto(origin + '/');
      if (variant === 'static-webgl-fallback') {
        // Explicitly verify test setup. A fallback screenshot cannot be trusted
        // if the browser did not actually receive the simulated restriction.
        const blocked = await page.evaluate(() => {
          const probe = document.createElement('canvas');
          return probe.getContext('webgl2') === null;
        });
        if (!blocked) throw new Error('WebGL override failed to initialize in screenshot context');
      }
      await page.evaluate(() => document.fonts.ready);
      const button = page.locator('[data-metallic-cta]');
      await expect(button).toBeVisible();
      if (variant === 'static-webgl-fallback') {
        await expect(button).toHaveAttribute('data-shader-status', 'fallback');
      }
      const link = page.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
      await expect(link).toHaveAttribute('href', '/demo');
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
          shaderStatus: document.querySelector('[data-metallic-cta]')?.getAttribute('data-shader-status'),
          shaderCanvases: document.querySelectorAll('[data-metallic-cta] canvas').length,
          resourceTransferBytes: performance.getEntriesByType('resource')
            .reduce((total, resource) => total + ((resource as PerformanceResourceTiming).transferSize || 0), 0),
        };
      });
      if (data.horizontalOverflow) throw new Error(`Horizontal overflow at ${width}px: ${variant}`);
      evidence.push({ width, variant, ...data });
      await context.close();
    }
  }
  await writeFile('docs/screenshots/metallic-cta/comparison.json', JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await browser.close();
}
