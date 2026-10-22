import { test, expect } from '@playwright/test';

test('homepage uses the Leqad metallic CTA by default', async ({ page }) => {
  await page.goto('/');
  const wrapper = page.locator('[data-metallic-cta]');
  await expect(wrapper).toBeVisible();
  await expect(wrapper).toHaveAttribute('data-theme', 'leqad');
  await expect(wrapper.locator('[data-metallic-face]')).toHaveCSS('background-image', /183, 75, 33/);
  await expect(wrapper.getByRole('link', { name: 'Explore Interactive Demo', exact: true })).toHaveAttribute('href', '/demo');
  await expect(page.getByRole('link', { name: 'Explore Interactive Demo', exact: true })).toHaveCount(1);
  await expect(page.locator('header, footer')).toHaveCount(0);
});

test('rust metallic rim moves while idle without hovering', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const button = page.locator('[data-metallic-cta]');
  const rim = button.locator('[data-metallic-rim]');
  await expect(rim).toBeVisible();
  await expect(rim).toHaveCSS('animation-name', 'leqad-metallic-rim-spin');
  await expect(rim).toHaveCSS('animation-play-state', 'running');
  await expect(rim).toHaveCSS('mask-composite', 'exclude');
  // The actual angle changes over time with no pointer activity.
  const angle = () => rim.evaluate(node =>
    getComputedStyle(node).getPropertyValue('--leqad-rim-angle').trim());
  const first = await angle();
  await expect.poll(angle, { timeout: 3000 }).not.toBe(first);
  await expect(button.locator('[data-metallic-face]')).toHaveCSS('background-image', /183, 75, 33/);
  await expect(button.getByRole('link', { name: 'Explore Interactive Demo' })).toHaveAttribute('href', '/demo');
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test('default metallic CTA fits and navigates at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const button = page.locator('[data-metallic-cta]');
    await expect(button).toBeVisible();
    const link = button.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
    await expect(link).toHaveAttribute('href', '/demo');
    const rect = await button.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.width).toBeGreaterThan(140);
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/demo$/);
    await expect(page.getByRole('button', { name: 'Start walkthrough' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('WebGL2-disabled browsers still display a static rust CTA that navigates', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type === 'webgl2') return null;
        return Reflect.apply(original, this, [type, ...args]);
      },
    });
  });
  await page.goto('/');
  const button = page.locator('[data-metallic-cta]');
  await expect(button).toHaveAttribute('data-shader-status', 'fallback');
  await expect(button.locator('canvas')).toHaveCount(0);
  await expect(button.locator('[data-metallic-face]')).toHaveCSS('background-image', /183, 75, 33/);
  const link = button.getByRole('link', { name: 'Explore Interactive Demo' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/demo$/);
});

test('reduced motion keeps the metallic CTA readable and navigable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = page.locator('[data-metallic-cta]');
  const link = button.getByRole('link', { name: 'Explore Interactive Demo' });
  await expect(link).toBeVisible();
  await expect(button.locator('[data-metallic-face]')).toBeVisible();
  await expect(button.locator('[data-metallic-rim]')).toHaveCSS('animation-name', 'none');
  await link.click();
  await expect(page).toHaveURL(/\/demo$/);
});
