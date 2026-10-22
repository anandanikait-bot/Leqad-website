import { test, expect, type Page } from '@playwright/test';

async function startSketch(page: Page, selection: 'tree' | 'viewport' = 'tree', width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  if (selection === 'tree') await page.getByRole('button', { name: 'Top Plane feature item', exact: true }).click();
  else await page.getByRole('button', { name: 'Select Top Plane in viewport', exact: true }).click();
  await page.getByRole('button', { name: 'Sketch tool', exact: true }).click();
}

test('rectangle tool arms drawing and requires two corners before completing the action', async ({ page }) => {
  await startSketch(page);
  await expect(page.getByText('Select Corner Rectangle in the toolbar, then draw in the viewport.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Corner Rectangle tool', exact: true }).click();
  await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Use guided rectangle', exact: true })).toBeVisible();
  const guided = page.getByRole('button', { name: 'Use guided rectangle', exact: true });
  expect(await guided.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  expect((await guided.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const svg = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  const point = async (x: number, y: number) => svg.evaluate((element, p) => {
    const svg = element as SVGSVGElement;
    const world = svg.createSVGPoint(); world.x = p.x; world.y = p.y;
    const screen = world.matrixTransform(svg.getScreenCTM()!);
    return { x: screen.x, y: screen.y };
  }, { x, y });
  const origin = await point(0, 0);
  const empty = await point(-50, -120);
  await page.mouse.click(empty.x, empty.y);
  await expect(page.getByRole('img', { name: 'Rectangle drawing preview', exact: true })).toHaveCount(0);
  await page.mouse.click(origin.x, origin.y);
  const corner = await point(135, -96);
  await page.mouse.move(corner.x, corner.y);
  await expect(page.getByLabel('Cursor coordinates')).toContainText('+45.0');
  await page.mouse.move(5, 5);
  await expect(page.getByLabel('Cursor coordinates')).toHaveText(/X: —\s*\|\s*Y: — mm/);
  await page.mouse.move(corner.x, corner.y);
  await expect(page.getByRole('img', { name: 'Rectangle drawing preview', exact: true })).toBeVisible();
  await page.mouse.click(corner.x, corner.y);
  await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label', 'Rectangle 45 by 32 millimeters');
  await expect(page.getByLabel('Width (mm)', { exact: true })).toHaveValue('45');
  await expect(page.getByLabel('Height (mm)', { exact: true })).toHaveValue('32');
});

test('viewport plane selection and guided rectangle alternative share the real lesson state', async ({ page }) => {
  await startSketch(page, 'viewport');
  await page.getByRole('button', { name: 'Use guided rectangle', exact: true }).click();
  await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label', 'Rectangle 40 by 30 millimeters');
  const width = page.getByLabel('Width (mm)', { exact: true });
  await width.fill('');
  await expect(width).toHaveValue('');
  await expect(page.getByRole('button', { name: /Set .* dimensions/ })).toBeDisabled();
  await width.fill('48');
  await page.getByLabel('Height (mm)', { exact: true }).fill('36');
  await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label', 'Rectangle 48 by 36 millimeters');
  await page.getByRole('button', { name: 'Set 48 × 36 mm dimensions', exact: true }).click();
  await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  const depth = page.getByLabel('Depth (mm)', { exact: true });
  await depth.fill('');
  await expect(depth).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Create solid', exact: true })).toBeDisabled();
  await depth.fill('50');
  await expect(page.getByText('Extrude preview · 48 × 36 × 50 mm', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel Extrude', exact: true }).click();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  await expect(page.getByLabel('Depth (mm)', { exact: true })).toHaveValue('10');
  await page.getByLabel('Depth (mm)', { exact: true }).fill('12');
  await page.getByRole('button', { name: 'Create solid', exact: true }).click();
  await expect(page.getByText('Part 1 created · 48 × 36 × 12 mm', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'View Front', exact: true }).click();
  const front = await page.getByTestId('extruded-solid').innerHTML();
  await page.getByRole('button', { name: 'View Right', exact: true }).click();
  expect(await page.getByTestId('extruded-solid').innerHTML()).not.toEqual(front);
});

test('cursor readout updates do not move the drawing target at the narrow desktop breakpoint', async ({ page }) => {
  await startSketch(page, 'viewport', 1024);
  await page.getByRole('button', { name: 'Corner Rectangle tool', exact: true }).click();
  const viewport = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  const origin = () => viewport.evaluate(element => {
    const svg = element as SVGSVGElement;
    const point = svg.createSVGPoint().matrixTransform(svg.getScreenCTM()!);
    return { x: point.x, y: point.y };
  });
  const before = await origin();
  await page.mouse.move(before.x, before.y);
  await expect(page.getByLabel('Cursor coordinates')).toContainText('+0.0');
  const after = await origin();
  expect(Math.abs(before.y - after.y)).toBeLessThan(1);
  await page.mouse.click(before.x, before.y);
  await expect(page.getByText('Select the opposite corner above and to the right. Escape cancels drawing.', { exact: true })).toBeVisible();
});

test('returning to dimensions resets an abandoned invalid draft without leaving the action locked', async ({ page }) => {
  await startSketch(page);
  await page.getByRole('button', { name: 'Use guided rectangle', exact: true }).click();
  await page.getByLabel('Width (mm)', { exact: true }).fill('');
  await expect(page.getByRole('button', { name: /Set .* dimensions/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await page.getByRole('button', { name: 'Review next step', exact: true }).click();
  await expect(page.getByLabel('Width (mm)', { exact: true })).toHaveValue('40');
  await expect(page.getByRole('button', { name: 'Set 40 × 30 mm dimensions', exact: true })).toBeEnabled();
});

test('desktop model framing is eighteen percent larger without changing geometry', async ({ page }) => {
  await startSketch(page);
  for (const name of ['Use guided rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch', 'Start Extrude']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  const height = await page.getByRole('group', { name: 'CAD drawing viewport', exact: true })
    .evaluate(element => (element as SVGSVGElement).viewBox.baseVal.height);
  expect(380 / height).toBeCloseTo(1.18, 2);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`largest sketch and depth remain visible and settings do not cover the model at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
    for (const name of ['Select Top Plane', 'Start sketch', 'Use guided rectangle']) await page.getByRole('button', { name, exact: true }).click();
    await page.getByLabel('Width (mm)', { exact: true }).fill('50');
    await page.getByLabel('Height (mm)', { exact: true }).fill('40');
    await page.getByRole('button', { name: 'Set 50 × 40 mm dimensions', exact: true }).click();
    await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
    await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
    await page.getByLabel('Depth (mm)', { exact: true }).fill('50');
    for (const viewName of ['Top', 'Isometric', 'Front', 'Right']) {
      await page.getByRole('button', { name: `View ${viewName}`, exact: true }).click();
      const model = page.getByTestId(viewName === 'Top' ? 'solid-top-view' : 'extruded-solid');
      const fits = await model.evaluate(element => {
      const box = (element as SVGGraphicsElement).getBBox();
      const view = (element as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal;
      return box.x >= view.x && box.y >= view.y && box.x + box.width <= view.x + view.width && box.y + box.height <= view.y + view.height;
    });
      expect(fits, `${viewName} includes geometry and labels at ${width}px`).toBe(true);
    }
    await page.getByRole('button', { name: 'View Isometric', exact: true }).click();
    const settings = (await page.getByLabel('Extrude 1 settings', { exact: true }).boundingBox())!;
    const viewport = (await page.getByRole('group', { name: 'CAD drawing viewport', exact: true }).boundingBox())!;
    expect(settings.y + settings.height).toBeLessThanOrEqual(viewport.y + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Create solid', exact: true }).click();
    await expect(page.getByText('Part 1 created · 50 × 40 × 50 mm', { exact: true })).toBeVisible();
  });
}

test('drawing cancellation and sketch cancellation leave no completed geometry', async ({ page }) => {
  await startSketch(page);
  await page.keyboard.press('g');
  await expect(page.getByRole('button', { name: 'Corner Rectangle tool', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Corner Rectangle tool', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
  await page.getByRole('button', { name: 'Use guided rectangle', exact: true }).click();
  await page.getByLabel('Width (mm)', { exact: true }).fill('48');
  await page.getByRole('button', { name: 'Cancel Sketch', exact: true }).click();
  await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start sketch', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Start sketch', exact: true }).click();
  await page.getByRole('button', { name: 'Use guided rectangle', exact: true }).click();
  await expect(page.getByLabel('Width (mm)', { exact: true })).toHaveValue('40');
  await page.getByRole('heading', { name: 'Apply dimensions', exact: true }).click();
  await page.keyboard.press('d');
  await expect(page.getByRole('button', { name: 'Finish sketch', exact: true })).toBeEnabled();
});

test('a mobile visitor can draw with two viewport taps', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/demo');
  for (const name of ['Start walkthrough', 'Select Top Plane', 'Start sketch']) await page.getByRole('button', { name, exact: true }).tap();
  await page.getByRole('button', { name: 'Corner Rectangle tool', exact: true }).tap();
  const viewport = page.getByRole('group', { name: 'CAD drawing viewport', exact: true });
  await viewport.scrollIntoViewIfNeeded();
  const coords = await viewport.evaluate(element => {
    const svg = element as SVGSVGElement;
    return [[0, 0], [135, -96]].map(([x, y]) => {
      const p = svg.createSVGPoint(); p.x = x; p.y = y;
      const screen = p.matrixTransform(svg.getScreenCTM()!);
      return { x: screen.x, y: screen.y };
    });
  });
  await page.touchscreen.tap(coords[0].x, coords[0].y);
  await page.touchscreen.tap(coords[1].x, coords[1].y);
  await expect(page.getByLabel('Width (mm)', { exact: true })).toHaveValue('45');
  await expect(page.getByLabel('Height (mm)', { exact: true })).toHaveValue('32');
  await page.getByLabel('Width (mm)', { exact: true }).fill('48');
  await page.getByLabel('Height (mm)', { exact: true }).fill('36');
  for (const name of ['Set 48 × 36 mm dimensions', 'Finish sketch', 'Start Extrude']) await page.getByRole('button', { name, exact: true }).tap();
  await page.getByLabel('Depth (mm)', { exact: true }).fill('18');
  await page.getByRole('button', { name: 'Cancel Extrude', exact: true }).tap();
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).tap();
  await expect(page.getByLabel('Depth (mm)', { exact: true })).toHaveValue('10');
  await page.getByLabel('Depth (mm)', { exact: true }).fill('12');
  await page.getByRole('button', { name: 'Create solid', exact: true }).tap();
  await expect(page.getByText('Part 1 created · 48 × 36 × 12 mm', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Restart walkthrough', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await context.close();
});
