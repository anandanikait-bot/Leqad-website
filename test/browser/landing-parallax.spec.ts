import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`editorial homepage aligns copy and keeps its CAD artwork reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('header, footer')).toHaveCount(0);

    const heading = page.getByRole('heading', { name: 'Learn CAD by building.', exact: true });
    await expect(heading).toHaveCSS('text-align', 'left');
    const rotatingPhrase = page.locator('main span.font-serif');
    await expect(rotatingPhrase).toHaveCSS('font-style', 'italic');
    await expect(rotatingPhrase).toHaveCSS('font-family', /Instrument Serif/);
    await expect(rotatingPhrase).toHaveText('building, not just watching.');
    await expect(page.locator('main p').first()).toHaveCSS('text-align', 'left');
    const hero = (await page.locator('main > section').boundingBox())!;
    expect(hero.y).toBe(0);

    const column = (await heading.locator('..').locator('..').boundingBox())!;
    const links = await page.locator('main a').all();
    expect(links.length).toBe(2);
    const primary = (await links[0].boundingBox())!;
    const secondary = (await links[1].boundingBox())!;
    // Editorial CTA row begins at the text column, not the old center line.
    expect(Math.abs(primary.x - column.x)).toBeLessThan(5);
    expect(Math.abs(secondary.x - column.x) < 5 ||
      secondary.x >= primary.x + primary.width - 2).toBe(true);
    expect(primary.height).toBeGreaterThanOrEqual(44);
    expect(secondary.height).toBeGreaterThanOrEqual(44);
    // Assert actual CSS heights, not GPU-transformed bounding boxes on the metallic CTA.
    // The latter can differ slightly during its 3D perspective transition.
    await expect(page.locator('[data-metallic-cta] a[aria-label="Explore Interactive Demo"]')).toHaveCSS('height', '44px');
    await expect(page.getByRole('link', { name: 'Learn About Leqad' })).toHaveCSS('height', '44px');
    expect(Math.abs(primary.height - secondary.height)).toBeLessThanOrEqual(2);
    await expect(page.locator('[data-metallic-cta] a[aria-label="Explore Interactive Demo"]')).toHaveCSS('border-radius', '8px');
    await expect(page.locator('[data-metallic-face]')).toHaveCSS('border-radius', '8px');
    await expect(page.locator('[data-metallic-rim]')).toHaveCSS('border-radius', '8px');
    await expect(page.locator('.metallic-button-canvas')).toHaveCSS('border-radius', '8px');
    await expect(page.getByRole('link', { name: 'Learn About Leqad' })).toHaveCSS('border-radius', '8px');

    const artwork = page.getByLabel('Interactive 3D CAD Geometry Visualization', { exact: true });
    const box = (await artwork.boundingBox())!;
    if (width >= 1024) {
      expect(box.x).toBeGreaterThanOrEqual(column.x + column.width - 1);
      expect(box.y).toBeGreaterThanOrEqual(hero.y);
      expect(box.y + box.height).toBeLessThanOrEqual(hero.y + hero.height + 2);
      expect(hero.height).toBe(900);
    } else {
      expect(box.y).toBeGreaterThanOrEqual(secondary.y + secondary.height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await artwork.scrollIntoViewIfNeeded();
    await artwork.click();
    // The hero interaction still changes the 3D/2D view on click.
    await expect(artwork).toContainText('2D SKETCH');
  });
}

test('homepage rotating serif headline continues cycling with motion enabled', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const phrase = page.locator('main span.font-serif');
  await expect(phrase).toHaveText('building, not just watching.');
  await page.clock.runFor(4500);
  await expect(phrase).toHaveText('designing with guidance.');
});

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
      // A layer near the end of the page may already be at the maximum
      // scroll position. Scroll toward whichever direction has room, then
      // verify actual scroll movement before asserting parallax movement.
      const scroll = await page.evaluate(() => ({
        start: window.scrollY,
        max: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      }));
      const delta = scroll.max - scroll.start >= 180 ? 240 : -240;
      await page.evaluate(amount => window.scrollBy(0, amount), delta);
      await expect.poll(() => page.evaluate(() => window.scrollY)).not.toBe(scroll.start);
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
    // The demo should not be a parallax layer or a Lenis-excluded scroll region.
    await expect(page.locator('[data-lenis-prevent]')).toHaveCount(0);
    expect(await page.getByRole('group', { name: 'CAD drawing viewport', exact: true })
      .evaluate(element => getComputedStyle(element).transform)).toBe('none');
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
  // At 375px desktop navigation is collapsed; activate the screenshot link.
  await page.locator('#product-preview').getByRole('link', { name: 'Open the interactive CAD demo from this static screenshot' }).click();
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
  await expect(page.locator('#product-preview').getByRole('link', { name: 'Open the interactive CAD demo from this static screenshot' })).toHaveAttribute('href', '/demo');
  await expect(page.getByRole('heading', { name: /Interested in evaluating guided CAD learning/ })).toBeVisible();
});

test('desktop navigation underlines hovered, focused, and active pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const active = nav.getByRole('link', { name: 'About' });
  const demo = nav.getByRole('link', { name: 'Interactive Demo' });
  await expect(active).toHaveAttribute('aria-current', 'page');
  const underlineScale = (link: typeof active) =>
    link.evaluate(node => getComputedStyle(node, '::before').scale);
  const initialScale = await underlineScale(demo);
  expect(await underlineScale(active)).not.toBe(initialScale);
  await demo.hover();
  await expect.poll(() => underlineScale(demo)).not.toBe(initialScale);
  await demo.click();
  await expect(nav.getByRole('link', { name: 'Interactive Demo' })).toHaveAttribute('aria-current', 'page');
});

test('mobile menu shows the active route and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/about');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  await mobileNav.getByRole('link', { name: 'For Partners' }).click();
  await expect(mobileNav).toHaveCount(0);
  await expect(page).toHaveURL(/\/partners$/);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'For Partners' })).toHaveAttribute('aria-current', 'page');
});
