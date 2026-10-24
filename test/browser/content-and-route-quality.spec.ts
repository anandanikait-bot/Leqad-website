import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/demo', '/about', '/partners'] as const;

for (const width of [320, 375, 768, 1024, 1440]) {
  test('all pages render and refresh without errors at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    const failedAssets: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|React error.*419|uncaught/i.test(message.text())) {
        errors.push(message.text());
      }
    });
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin === new URL(page.url()).origin &&
          response.status() >= 400 && /\.(?:png|jpe?g|svg|css|js|woff2?)(?:\?|$)/i.test(url.pathname)) {
        failedAssets.push(url.pathname + ': ' + response.status());
      }
    });

    for (const route of ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), 'Route ' + route + ' must be directly served').toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        'Horizontal overflow on ' + route + ' at ' + width + 'px').toBe(true);
      const headingsFit = await page.locator('main h1, main h2, main h3').evaluateAll(headings =>
        headings.filter(node => !node.classList.contains('sr-only'))
          .every(node => node.scrollWidth <= node.clientWidth + 2));
      expect(headingsFit, 'A heading overflows its box on ' + route).toBe(true);

      if (route === '/') {
        await expect(page.locator('header, footer')).toHaveCount(0);
        await expect(page.getByRole('link', { name: 'Explore Interactive Demo' })).toHaveAttribute('href', '/demo');
      } else {
        await expect(page.locator('header')).toHaveCount(1);
        await expect(page.locator('footer')).toHaveCount(1);
      }
      if (route === '/about') {
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('CAD guidance, right where you design.');
        await expect(page.locator('#product-preview img')).toHaveAttribute('src', '/assets/cad-lesson-illustration.svg');
      }
      if (route === '/partners') {
        await expect(page.locator('[data-evaluation-disclosure]')).not.toHaveAttribute('open', '');
        await expect(page.locator('[data-pilot-planner]')).toBeHidden();
      }
      if (route === '/demo') {
        await expect(page.getByRole('button', { name: 'Start walkthrough' })).toBeVisible();
        await expect(page.getByText('Simulation · Not connected to live CAD')).toBeVisible();
      }
      if (width === 320 || width === 1440) {
        await page.reload();
        await expect(page.locator('main h1')).toHaveCount(1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
    expect(failedAssets).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('About retains a concise explanation without redundant comparison cards', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('#how-it-works')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Different ways to practice CAD' })).toHaveCount(0);
  await expect(page.locator('[data-comparison-question]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/40% time|zero window-switch latency|45 minutes average|lasting mechanical design intuition/i);
});

test('lesson explains a simulated CAD process without universal or verified claims', async ({ page }) => {
  await page.goto('/demo');
  const panel = page.locator('main');
  await expect(panel).toContainText('In this simulated lesson');
  await page.getByRole('button', { name: 'Need help?' }).count();
  const allLessonText = await page.evaluate(() => document.querySelector('main')?.textContent || '');
  expect(allLessonText).not.toMatch(/Every 3D mechanical model begins with a 2D sketch/);
  await page.goto('/about');
  await expect(page.getByText('Interactive Demo Preview', { exact: true })).toBeVisible();
  await expect(page.locator('#product-status')).toContainText('Live Onshape compatibility remains unverified');
  await expect(page.locator('#product-status')).toContainText('separate eight-step simulation');
  await expect(page.locator('main')).not.toContainText(/automated|Tested|library of lessons/i);
  await page.goto('/partners');
  await expect(page.getByRole('heading', { name: 'Technical compatibility' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Educational evaluation' })).toBeVisible();
  await expect(page.locator('main')).not.toContainText(/automated tests|instructor workload/i);
  await expect(page.getByText('Controlled Automated Testing')).toHaveCount(0);
  await expect(page.getByText('Ribbon Recognition')).toHaveCount(0);
});
