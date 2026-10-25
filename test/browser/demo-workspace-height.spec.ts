import { expect, test } from '@playwright/test';

// Height used to jump when Sketch 1 appeared: an unconstrained SVG with a
// different viewBox aspect ratio expanded the flex/grid row and the panel.
const viewportCases = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
];

for (const viewport of viewportCases) {
  test(`sketch keeps the CAD workspace compact at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/demo');
    const canvas = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });

    const measure = () => canvas.evaluate(element => {
      const svg = element as SVGSVGElement;
      const outer = svg.closest('div.rounded-xl')!;
      const box = outer.getBoundingClientRect();
      const drawing = svg.getBoundingClientRect();
      const point = svg.createSVGPoint();
      point.x = 0; point.y = 0;
      const screen = point.matrixTransform(svg.getScreenCTM()!);
      return {
        height: box.height,
        drawingHeight: drawing.height,
        drawingWidth: drawing.width,
        originX: (screen.x - drawing.left) / drawing.width,
        originY: (screen.y - drawing.top) / drawing.height,
      };
    });

    const introductory = await measure();
    expect(introductory.height).toBeGreaterThanOrEqual(410);
    expect(introductory.height).toBeLessThanOrEqual(602);

    for (const action of ['Start walkthrough', 'Select Top Plane', 'Start sketch'] as const) {
      await page.getByRole('button', { name: action, exact: true }).click();
    }
    const sketch = await measure();
    expect(Math.abs(sketch.height - introductory.height), 'starting Sketch must not stretch the workspace').toBeLessThanOrEqual(2);
    expect(sketch.drawingHeight).toBeGreaterThan(175);
    expect(sketch.originX).toBeGreaterThan(0.10);
    expect(sketch.originX).toBeLessThan(0.50);
    expect(sketch.originY).toBeGreaterThan(0.35);
    expect(sketch.originY).toBeLessThan(0.68);

    await page.getByRole('button', { name: 'Draw rectangle', exact: true }).click();
    await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label', 'Rectangle 40 by 30 millimeters');
    const drawn = await measure();
    expect(Math.abs(drawn.height - introductory.height), 'drawing a rectangle must not stretch the workspace').toBeLessThanOrEqual(2);

    await page.getByRole('button', { name: 'Set 40 × 30 mm dimensions', exact: true }).click();
    const dimensioned = await measure();
    expect(Math.abs(dimensioned.height - introductory.height), 'dimensioning must not stretch the workspace').toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
}

test('extrusion and completed lesson do not expand the bounded drawing surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/demo');
  const canvas = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  const height = () => canvas.evaluate(svg => svg.closest('div.rounded-xl')!.getBoundingClientRect().height);
  const original = await height();

  for (const name of [
    'Start walkthrough', 'Select Top Plane', 'Start sketch', 'Draw rectangle',
    'Set 40 × 30 mm dimensions', 'Finish sketch', 'Start Extrude', 'Create solid',
  ]) await page.getByRole('button', { name, exact: true }).click();
  await expect(page.getByRole('heading', { name: "You've completed the interactive walkthrough." })).toBeVisible();
  expect(Math.abs((await height()) - original)).toBeLessThanOrEqual(2);
  await expect(page.getByRole('group', { name: 'CAD drawing viewport' })).toBeVisible();
});
