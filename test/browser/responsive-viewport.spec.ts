import { test, expect } from '@playwright/test';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
];

for (const viewport of viewports) {
  test(`routes fit ${viewport.width}x${viewport.height} without horizontal clipping`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    const routes = viewport.width >= 2560 ? ['/demo', '/about'] : ['/demo', '/about', '/partners', '/'];
    for (const route of routes) {
      await page.goto(route);
      const geometry = await page.evaluate(() => {
        const bounds = (el: Element | null) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { left: rect.left, right: rect.right, width: rect.width };
        };
        return {
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          header: bounds(document.querySelector('header')),
          main: bounds(document.querySelector('main')),
          footer: bounds(document.querySelector('footer')),
          demoCard: bounds(document.querySelector('section[aria-labelledby="demo-title"] > div')),
          cad: bounds(document.querySelector('[aria-label="CAD drawing viewport"]')),
        };
      });
      expect(geometry.documentWidth, `document overflows at ${viewport.width}px on ${route}`).toBeLessThanOrEqual(viewport.width + 1);
      expect(geometry.bodyWidth, `body overflows at ${viewport.width}px on ${route}`).toBeLessThanOrEqual(viewport.width + 1);
      for (const [name, rect] of Object.entries({
        header: geometry.header, main: geometry.main, footer: geometry.footer,
        demoCard: geometry.demoCard, cad: geometry.cad,
      })) {
        if (!rect) continue;
        expect(rect.left, `${name} left on ${route}`).toBeGreaterThanOrEqual(-1);
        expect(rect.right, `${name} right on ${route}`).toBeLessThanOrEqual(viewport.width + 1);
        expect(rect.width, `${name} width on ${route}`).toBeGreaterThan(0);
      }
      if (route === '/demo') {
        await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
        await expect(page.getByRole('group', { name: 'CAD drawing viewport' })).toBeVisible();
        expect(geometry.demoCard!.width).toBeLessThanOrEqual(1600);
        if (viewport.width >= 1720) expect(geometry.demoCard!.width).toBeGreaterThan(1400);
      }
    }
  });
}

test('CAD lesson remains functional across mobile and wide-monitor resizing', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await page.getByRole('button', { name: 'Select Top Plane', exact: true }).click();
  await page.getByRole('button', { name: 'Start sketch', exact: true }).click();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.getByRole('button', { name: 'Draw rectangle', exact: true }).click();
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByRole('button', { name: 'Set 40 × 30 mm dimensions', exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
