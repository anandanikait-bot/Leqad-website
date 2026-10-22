import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`homepage stays centered and artwork remains reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('header, footer')).toHaveCount(0);
    const heading = page.getByRole('heading', { name: 'Learn CAD by', exact: true });
    await expect(heading).toHaveCSS('text-align', 'center');
    await expect(page.locator('main p').first()).toHaveCSS('text-align', 'center');
    const hero = (await page.locator('main > section').boundingBox())!;
    expect(hero.y).toBe(0);
    const column = (await heading.locator('..').locator('..').boundingBox())!;
    const links = await page.locator('main a').all();
    const first = (await links[0].boundingBox())!;
    const last = (await links[1].boundingBox())!;
    // Allow subpixel rounding introduced by the decorative 3D CTA transform.
    expect(Math.abs((first.x + last.x + last.width) / 2 - (column.x + column.width / 2))).toBeLessThan(3);
    const artwork = page.getByLabel('Interactive 3D CAD Geometry Visualization', { exact: true });
    const box = (await artwork.boundingBox())!;
    if (width >= 1024) {
      expect(box.x).toBeGreaterThan(column.x + column.width - 1);
      expect(Math.abs(box.y + box.height / 2 - (column.y + column.height / 2))).toBeLessThan(2);
      expect(hero.height).toBe(900);
    } else expect(box.y).toBeGreaterThanOrEqual(last.y + last.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await artwork.scrollIntoViewIfNeeded();
    await artwork.click();
    // The existing hero interaction changes the 3D/2D view on a tap/click.
    await expect(artwork).toContainText('2D SKETCH');
  });
}

for (const route of ['/about', '/partners']) {
  test(`${route} parallax moves only approved visual layers and disables at runtime`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const layers = page.locator('[data-parallax-travel]');
    await expect(layers).toHaveCount(route === '/about' ? 3 : 2);
    await expect(page.locator('p[data-parallax-travel], button[data-parallax-travel], a[data-parallax-travel]')).toHaveCount(0);
    for (const layer of await layers.all()) {
      await layer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100); // Existing entrance animation completes before measurement.
      const before = await layer.evaluate(element => ({
        transform: getComputedStyle(element).transform,
        top: element.parentElement!.getBoundingClientRect().top + scrollY,
        height: element.parentElement!.getBoundingClientRect().height,
      }));
      await page.evaluate(() => scrollBy(0, 240));
      await expect.poll(() => layer.evaluate(element => getComputedStyle(element).transform)).not.toBe(before.transform);
      const after = await layer.evaluate(element => ({
        y: new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        top: element.parentElement!.getBoundingClientRect().top + scrollY,
        height: element.parentElement!.getBoundingClientRect().height,
        travel: Number((element as HTMLElement).dataset.parallaxTravel),
      }));
      expect(Math.abs(after.y)).toBeLessThanOrEqual(after.travel / 2);
      expect(after.travel).toBeLessThanOrEqual(24);
      expect(after.top).toBeCloseTo(before.top, 1);
      expect(after.height).toBe(before.height);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const layer of await layers.all()) await expect(layer).toHaveCSS('transform', 'none');
    await page.evaluate(() => scrollBy(0, -300));
    for (const layer of await layers.all()) await expect(layer).toHaveCSS('transform', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect.poll(() => layers.first().evaluate(element => getComputedStyle(element).transform)).not.toBe('none');
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Interactive Demo', exact: true }).click();
    await expect(page.locator('[data-parallax-travel]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
    expect(await page.locator('[data-lenis-prevent]').first().evaluate(element => getComputedStyle(element).transform)).toBe('none');
  });
}

for (const route of ['/about', '/partners']) {
  test(`${route} decorative layers slide in opposite directions without moving CTA text`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const anchor = page.locator('[data-parallax-anchor]').last();
    const fastTravel = route === '/about' ? '12' : '20';
    const fast = anchor.locator(`[data-parallax-travel="${fastTravel}"]`);
    const slow = anchor.locator('[data-parallax-direction="-1"]');
    await expect(fast).toHaveCount(1);
    await expect(slow).toHaveCount(1);
    await anchor.scrollIntoViewIfNeeded();
    const offsets = async () => anchor.evaluate((node, travel) => {
      const first = node.querySelector(`[data-parallax-travel="${travel}"]`) as HTMLElement;
      const second = node.querySelector('[data-parallax-direction="-1"]') as HTMLElement;
      const y = (element: HTMLElement) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;
      const title = node.querySelector('h2')!;
      return { fast: y(first), slow: y(second), titlePosition: title.getBoundingClientRect().top + scrollY };
    }, fastTravel);
    const before = await offsets();
    await page.evaluate(() => window.scrollBy(0, -180));
    await expect.poll(async () => (await offsets()).fast).not.toBe(before.fast);
    const after = await offsets();
    expect((after.fast - before.fast) * (after.slow - before.slow)).toBeLessThan(0);
    expect(after.titlePosition).toBeCloseTo(before.titlePosition, 1);
    expect(Math.abs(after.fast)).toBeLessThanOrEqual(route === '/about' ? 6 : 10);
    expect(Math.abs(after.slow)).toBeLessThanOrEqual(route === '/about' ? 2 : 4);
  });
}

test('layered movement is limited on narrow screens and leaves the demo untouched', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/about');
  const preview = page.locator('#product-preview img[data-parallax-travel]');
  await preview.scrollIntoViewIfNeeded();
  const offset = await preview.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42);
  expect(Math.abs(offset)).toBeLessThanOrEqual(6);
  // At 375px desktop navigation is collapsed; use the real product-preview CTA.
  await page.locator('#product-preview').getByRole('link', { name: 'Explore Full Demo' }).click();
  await expect(page.locator('[data-parallax-travel]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start walkthrough' })).toBeVisible();
});

test('reduced-motion pages show complete, stationary visual layers on first load', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of ['/about', '/partners']) {
    await page.goto(route);
    const layers = page.locator('[data-parallax-travel]');
    await expect(layers).toHaveCount(route === '/about' ? 3 : 2);
    for (const layer of await layers.all()) await expect(layer).toHaveCSS('transform', 'none');
    if (route === '/about') expect(await page.locator('#product-preview img').evaluate(element => (element as HTMLImageElement).complete)).toBe(true);
  }
  await context.close();
});

test('About reduces decoration and avoids repeated conversion prompts', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('#product-preview img')).toHaveAttribute('data-parallax-travel', '12');
  await expect(page.locator('[data-parallax-anchor]').last().locator('[data-parallax-direction="-1"]'))
    .toHaveAttribute('data-parallax-travel', '4');
  await expect(page.getByRole('link', { name: 'Launch Interactive Demo' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore Full Demo' })).toHaveAttribute('href', '/demo');
  await expect(page.getByRole('heading', { name: /Exploring collaboration with CAD teams and educators/ })).toBeVisible();
});
