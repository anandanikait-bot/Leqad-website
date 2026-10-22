import { test, expect } from '@playwright/test';

test('normal homepage keeps original rust CTA and never mounts metallic shader', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-metallic-cta]')).toHaveCount(0);
  const link = page.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
  await expect(link).toHaveAttribute('href', '/demo');
  await expect(link).toHaveCSS('background-color', 'rgb(183, 75, 33)');
  // Both the CAD artwork and sonar background own canvases; only the experimental shader must be absent.
  await expect(page.locator('[data-metallic-cta] canvas')).toHaveCount(0);
});

for (const width of [320, 375, 1440]) {
  test(`metallic CTA works at ${width}px without clipping or duplicating navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/?metallic=1');
    const button = page.locator('[data-metallic-cta]');
    await expect(button).toBeVisible();
    const link = button.getByRole('link', { name: 'Explore Interactive Demo', exact: true });
    await expect(link).toHaveAttribute('href', '/demo');
    await expect(button.locator('canvas')).toHaveCount(1);
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

test('metallic CTA is readable with reduced motion and still navigates', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?metallic=1');
  const link = page.locator('[data-metallic-cta]').getByRole('link', { name: 'Explore Interactive Demo' });
  await expect(link).toBeVisible();
  await expect(page.locator('[data-metallic-cta] canvas')).toHaveCount(1);
  await link.click();
  await expect(page).toHaveURL(/\/demo$/);
});
