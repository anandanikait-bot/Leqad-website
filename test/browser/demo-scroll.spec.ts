import { test, expect } from '@playwright/test';

// A wheel over the large CAD surface must scroll the *page*, not get swallowed.
// The surface is not independently scrollable and still needs mouse/touch input.
for (const size of [
  { width: 375, height: 667 },
  { width: 768, height: 800 },
  { width: 1440, height: 720 },
  { width: 1920, height: 900 },
]) {
  test(`mouse wheel scrolls through CAD canvas at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/demo');
    const canvas = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
    await canvas.scrollIntoViewIfNeeded();
    const rect = await canvas.boundingBox();
    expect(rect).not.toBeNull();
    // Stay inside the visible CAD drawing even if most of the SVG is offscreen.
    const top = Math.max(rect!.y + 8, 85);
    const bottom = Math.min(rect!.y + rect!.height - 8, size.height - 20);
    expect(bottom).toBeGreaterThan(top);
    await page.mouse.move(rect!.x + rect!.width / 2, (top + bottom) / 2);

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 420);
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 })
      .toBeGreaterThan(before + 20);
    const after = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, -420);
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 })
      .toBeLessThan(after - 20);
  });
}

test('wheel over the teaching panel also scrolls the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  await page.goto('/demo');
  const heading = page.getByText('Leqad Teaching Panel', { exact: true });
  const rect = await heading.boundingBox();
  expect(rect).not.toBeNull();
  await page.mouse.move(rect!.x + rect!.width / 2, rect!.y + rect!.height / 2);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 })
    .toBeGreaterThan(before + 20);
});

test('mouse interaction still works after scrolling through CAD workspace', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  await page.goto('/demo');
  const canvas = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  const rect = await canvas.boundingBox();
  expect(rect).not.toBeNull();
  await page.mouse.move(rect!.x + rect!.width / 2, Math.min(rect!.y + 100, 680));
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 })
    .toBeGreaterThan(20);
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await page.getByRole('button', { name: 'Select Top Plane', exact: true }).click();
  await page.getByRole('button', { name: 'Start sketch', exact: true }).click();
  await page.getByRole('button', { name: 'Draw rectangle', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Set 40 × 30 mm dimensions', exact: true })).toBeEnabled();
});
