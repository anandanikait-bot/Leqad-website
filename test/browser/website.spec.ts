import { test, expect } from '@playwright/test';

test('landing contains only the hero and its CTA links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toHaveCount(0);
  await expect(page.locator('main h1')).toHaveText('Learn CAD by');
  await expect(page.getByText('INTERACTIVE CAD LEARNING', { exact: true })).toHaveCount(0);
  await expect(page.getByText('8 Steps', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toHaveCount(0);
  await expect(page.getByText('Early-stage extension prototype · Independent project')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore Interactive Demo', exact: true })).toHaveAttribute('href', '/demo');
  await expect(page.locator('footer nav')).toHaveCount(0);
  await expect(page.getByText('Prepare an Inquiry', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Back to top', { exact: false })).toHaveCount(0);
  await expect(page.locator('footer')).toHaveCount(0);
  await expect(page.locator('main').getByRole('link', { name: 'Learn About Leqad' })).toHaveAttribute('href', '/about');
});

test('official horizontal brand remains prominent in unchanged 64px navbar', async ({ page }) => {
  for (const [width, expectedHeight] of [[320, 56], [375, 56], [768, 56], [1024, 56], [1440, 56]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const img = page.locator('header img[alt="Leqad logo"]');
    const imageBox = await img.boundingBox();
    expect(imageBox).not.toBeNull();
    expect(imageBox!.height).toBeCloseTo(expectedHeight, 1); // Browser rounds to 1/64px.
    // The new approved symbol + entire wordmark is intentionally wider than
    // the old 44px square emblem; it must stay legible and not overflow.
    expect(imageBox!.width).toBeGreaterThan(expectedHeight * 3);
    expect(imageBox!.width).toBeLessThan(expectedHeight * 4);
    const headerBox = await page.locator('header').boundingBox();
    expect(headerBox).not.toBeNull();
    expect(headerBox!.height).toBe(65); // 64px content + 1px bottom border
    await expect(page.locator('main h1')).toContainText('CAD guidance, right where you design');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('only Demo, About and Partners have the halftone Leqad footer', async ({ page }) => {
  for (const path of ['/demo', '/about', '/partners']) {
    await page.goto(path);
    await expect(page.locator('footer canvas')).toHaveCount(1);
    // Official logo is never faded at the bottom or scattered on hover.
    await expect(page.locator('footer .hwf-official-lockup canvas')).toHaveCSS('mask-image', 'none');
    await expect(page.locator('footer').getByText('LEQAD / CAD LEARNING')).toHaveCount(0);
    await expect(page.locator('footer').getByText('© 2026 Leqad', { exact: true })).toBeVisible();
    await expect(page.locator('footer').getByText('Leqad is independently developed and is not affiliated with or endorsed by Onshape.')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link')).toHaveCount(3);
    await expect(page.locator('footer').getByText('CURRICULUM /')).toHaveCount(0);
  }
  await page.goto('/');
  await expect(page.locator('footer')).toHaveCount(0);
});

test('approved brand logo, favicon, and unique browser title across routes', async ({ page }) => {
  const titles: Record<string, string> = {
    '/': 'Leqad',
    '/demo': 'Leqad Demo',
    '/about': 'About Leqad',
    '/partners': 'Leqad Partners',
  };
  for (const path of ['/', '/demo', '/about', '/partners']) {
    await page.goto(path);
    await expect(page).toHaveTitle(titles[path]);
    await expect(page.locator('head link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg?v=20261026-1');
    await expect(page.locator('head link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('type', 'image/svg+xml');
    if (path === '/') {
      await expect(page.locator('header')).toHaveCount(0);
      await expect(page.locator('footer')).toHaveCount(0);
    } else {
      await expect(page.locator('header img[alt="Leqad logo"]')).toHaveAttribute('src', '/assets/brand/leqad-official-horizontal-light-v1.svg');
      await expect(page.locator('header img[alt="Leqad logo"]')).toHaveCSS('mix-blend-mode', 'normal');
      await expect(page.locator('footer img[alt="Leqad CAD education mark"]')).toHaveAttribute('src', '/assets/brand/leqad-official-symbol-dark-v1.svg');
    }
  }
});

test('homepage prerender contains correct social preview and serves the actual image', async ({ page }) => {
  await page.goto('/');
  const preview = 'https://leqad.com/assets/leqad-home-share-v2.png?v=20261025';
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', preview);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', preview);
  await expect(page.locator('meta[property="og:image:secure_url"]')).toHaveAttribute('content', preview);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://leqad.com/');
  const response = await page.request.get('/assets/leqad-home-share-v2.png?v=20261025');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\/png/);
  const png = await response.body();
  // Verify this URL returns actual image bytes and the declared dimensions,
  // not an HTML fallback or a blank/unavailable social-preview endpoint.
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(png.readUInt32BE(16)).toBe(1440);
  expect(png.readUInt32BE(20)).toBe(900);
  expect(png.length).toBeGreaterThan(50_000);
  const rendered = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/assets/leqad-home-share-v2.png?v=20261025';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 70;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0, 100, 70);
    const pixels = context.getImageData(0, 0, 100, 70).data;
    let colored = 0;
    for(let i=0;i<pixels.length;i+=4) if(pixels[i]<210 || pixels[i+1]<210 || pixels[i+2]<210) colored++;
    return {width:image.naturalWidth,height:image.naturalHeight,colored};
  });
  expect(rendered).toMatchObject({width: 1440,height: 900});
  expect(rendered.colored).toBeGreaterThan(500);
  await page.goto('/demo');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://leqad.com/assets/cad-lesson-preview.png?v=20261025',
  );
});

test('tab icon uses the approved geometry on both light and dark themes', async ({ page }) => {
  await page.goto('/');
  const res = await page.request.get('/favicon.svg');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/image\/svg\+xml/);
  const source = await res.text();
  // Only the approved ink color responds to the browser color scheme;
  // geometry, russet center and transparency are unchanged.
  expect(source).toContain('prefers-color-scheme: dark');
  expect(source).toContain('#0E2943');
  expect(source).toContain('#F5EFE7');
  expect(source).not.toContain('<rect');
  expect(source).toContain('fill="#793327"');
  expect(source).toContain('<path');
  expect(source).not.toContain('feColorMatrix');
});

test('favicon actually renders legibly at 16px with transparent corners', async ({ page }) => {
  await page.goto('/');
  const pixels = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/favicon.svg';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas is unavailable');
    ctx.drawImage(image, 0, 0, 16, 16);
    const data = ctx.getImageData(0, 0, 16, 16).data;
    let visible = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 60) visible++;
    return { visible, topLeftAlpha: data[3], bottomRightAlpha: data[data.length - 1] };
  });
  expect(pixels.visible).toBeGreaterThan(15);
  expect(pixels.topLeftAlpha).toBeLessThan(30);
  expect(pixels.bottomRightAlpha).toBeLessThan(30);
});

test('About contains a static preview instead of a second live lesson', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/CAD guidance, right where you design/);
  await expect(page.getByRole('button', { name: 'Start sketch', exact: true })).toHaveCount(0);
  await expect(page.locator('#product-preview').getByRole('link', { name: 'Try the interactive demo', exact: true })).toHaveAttribute('href', '/demo');
});

test('clean links, old hash replacement, refreshes and browser history work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Interactive Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'For Partners', exact: true }).click();
  await expect(page).toHaveURL(/\/partners$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/demo$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/partners$/);
  for (const route of ['demo', 'about', 'partners']) {
    await page.goto(`/?source=legacy#/${route}`);
    await expect(page).toHaveURL(new RegExp(`/${route}\\?source=legacy$`));
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://leqad.com/${route}`);
  }
  expect(errors).toEqual([]);
});

test('lesson actions, optional help, highlighting, completion and restart remain functional', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/demo');
  const snapshot = (name: string) => page.locator('section[aria-labelledby="demo-title"] > div').screenshot({ path: `test-results/${name}.png` });
  await snapshot('demo-01-intro');
  const help = page.locator('details');
  await expect(help).not.toHaveAttribute('open');
  await page.getByText('Need help?', { exact: true }).click();
  await page.getByRole('button', { name: 'Get a hint', exact: true }).click();
  await expect(page.getByText('HINT 1:', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Why?', exact: true }).click();
  await expect(page.getByText('Engineering Concept', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await snapshot('demo-02-select-plane');
  await expect(help).not.toHaveAttribute('open');
  await page.getByRole('button', { name: 'Show me where', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hide tool highlight', exact: true })).toHaveAttribute('aria-pressed', 'true');
  // A future lesson may be previewed, but cannot manufacture a solid.
  await page.getByRole('button', { name: 'All steps', exact: true }).click();
  await page.getByRole('navigation', { name: 'Walkthrough steps', exact: true })
    .getByRole('button', { name: '8 Confirm solid', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Create solid', exact: true })).toBeDisabled();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Walkthrough steps', exact: true })
    .getByRole('button', { name: '2 Select reference plane', exact: true }).click();

  for (const [index, label] of ['Select Top Plane', 'Start sketch', 'Draw rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch'].entries()) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await snapshot(`demo-0${index + 3}-${['start-sketch', 'draw-rectangle', 'dimensions', 'finish-sketch', 'extrude-ready'][index]}`);
  }
  await expect(page.getByText('Sketch accepted · Choose Extrude')).toBeVisible();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  await expect(page.getByTestId('extruded-solid')).toHaveAttribute('aria-label', '3D extrusion preview');
  await snapshot('demo-08-extrude-preview');
  const depth = page.getByLabel('Depth (mm)');
  await expect(depth).toHaveValue('10');
  await depth.fill('12');
  await expect(page.getByText('Extrude preview · 40 × 30 × 12 mm')).toBeVisible();
  await page.getByRole('button', { name: 'Create solid', exact: true }).click();
  await expect(page.getByRole('heading', { name: "You've completed the interactive walkthrough." })).toBeVisible();
  await expect(page.getByTestId('extruded-solid')).toHaveAttribute('aria-label', 'Created 3D rectangular plate');
  await snapshot('demo-09-confirmed-solid');
  await page.getByRole('button', { name: 'Restart walkthrough', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'All steps', exact: true }).click();
  await page.getByRole('navigation', { name: 'Walkthrough steps', exact: true }).getByRole('button', { name: '8 Confirm solid', exact: true }).click();
  await expect(page.getByText("You've completed the interactive walkthrough.", { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
});

test('editing dimensions resizes sketch and the accepted 3D plate', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  for (const name of ['Select Top Plane', 'Start sketch', 'Draw rectangle']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  const profile = page.getByTestId('sketch-profile');
  await expect(profile).toHaveAttribute('aria-label', 'Rectangle 40 by 30 millimeters');
  await page.getByRole('spinbutton', { name: 'Width (mm)' }).fill('48');
  await page.getByRole('spinbutton', { name: 'Height (mm)' }).fill('36');
  await expect(profile).toHaveAttribute('aria-label', 'Rectangle 48 by 36 millimeters');
  await expect(profile.locator('rect').last()).toHaveAttribute('width', '144');
  await expect(profile.locator('rect').last()).toHaveAttribute('height', '108');
  await page.getByRole('button', { name: 'Set 48 × 36 mm dimensions', exact: true }).click();
  await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  await expect(page.getByText('Extrude preview · 48 × 36 × 10 mm')).toBeVisible();
  await page.getByRole('button', { name: 'Create solid', exact: true }).click();
  await expect(page.getByText('Part 1 created · 48 × 36 × 10 mm')).toBeVisible();
  await page.getByRole('button', { name: 'Restart walkthrough', exact: true }).click();
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  for (const name of ['Select Top Plane', 'Start sketch', 'Draw rectangle']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  await expect(page.getByRole('spinbutton', { name: 'Width (mm)' })).toHaveValue('40');
  await expect(page.getByRole('spinbutton', { name: 'Height (mm)' })).toHaveValue('30');
});

test('cancel extrusion returns to accepted sketch without inventing a solid', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough' }).click();
  for (const label of ['Select Top Plane', 'Start sketch', 'Draw rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch']) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel Extrude' }).click();
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  await expect(page.getByText('Sketch accepted · Choose Extrude')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Extrude', exact: true })).toBeEnabled();
});

test('CAD feature preview has responsive view and depth controls', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough' }).click();
  for (const label of ['Select Top Plane', 'Start sketch', 'Draw rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch']) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Start Extrude' }).click();
  await expect(page.getByLabel('Extrude 1 settings')).toBeVisible();
  const bands = await page.evaluate(() => {
    const toolbar = document.querySelector('[role="toolbar"][aria-label="CAD tools"]')!.getBoundingClientRect();
    const views = document.querySelector('[role="group"][aria-label="Model view"]')!.getBoundingClientRect();
    return { toolbarBottom: toolbar.bottom, modelViewTop: views.top };
  });
  expect(bands.modelViewTop, 'view buttons must not overlap the CAD toolbar').toBeGreaterThanOrEqual(bands.toolbarBottom - 1);
  await page.getByRole('button', { name: 'View Top' }).click();
  await expect(page.getByTestId('solid-top-view')).toBeVisible();
  await page.getByRole('button', { name: 'View Iso (Isometric)', exact: true }).click();
  await expect(page.getByTestId('extruded-solid')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('prerendered public content and metadata work with JavaScript disabled', async ({ browser }) => {
  const titles: Record<string, string> = {
    '/': 'Leqad',
    '/demo': 'Leqad Demo',
    '/about': 'About Leqad',
    '/partners': 'Leqad Partners',
  };
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const ogTitles = new Set<string>();
  for (const path of ['/', '/demo', '/about', '/partners']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('header')).toHaveCount(path === '/' ? 0 : 1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect((await page.locator('main').innerText()).length).toBeGreaterThan(150);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://leqad.com${path}`);
    expect(await page.title()).toBe(titles[path]);
    const ogTitle = await page.locator('head meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    ogTitles.add(ogTitle!);
    expect(JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())['@graph']).toHaveLength(3);
  }
  expect(ogTitles.size).toBe(4);
  await context.close();
});

test('Lenis respects reduced motion and does not isolate the CAD demo from scrolling', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.goto('/demo');
  // Only independently scrollable overlays (such as the contact dialog)
  // should opt out of Lenis, not the full CAD demo.
  await expect(page.locator('[data-lenis-prevent]')).toHaveCount(0);
  await page.goto('/about');
  await page.mouse.move(100, 400);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Interactive Demo', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  for (const route of ['/', '/demo', '/about', '/partners']) {
    test(`${route} fits ${width}px without overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (route === '/') {
        await expect(page.locator('header')).toHaveCount(0);
        await expect(page.locator('footer')).toHaveCount(0);
      } else {
        await expect(page.locator('header')).toHaveCount(1);
        const canvas = page.locator('footer canvas');
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        expect(box!.width).toBeLessThanOrEqual(width);
        expect(box!.height).toBeGreaterThanOrEqual(148);
        expect(box!.height).toBeLessThanOrEqual(346);
        expect(await canvas.evaluate(element => getComputedStyle(element).maskImage)).toBe('none');
      }
      if (route === '/demo' && width < 1024) {
        const panel = await page.getByText('Leqad Teaching Panel', { exact: true }).boundingBox();
        const workspace = await page.getByRole('toolbar', { name: 'CAD tools' }).boundingBox();
        expect(panel!.y).toBeLessThan(workspace!.y);
      }
      expect(errors).toEqual([]);
    });
  }
}

test('reduced-motion artwork settles without an endless animation loop', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.closest('[aria-label="Interactive 3D CAD Geometry Visualization"]')) {
        this.canvas.dataset.frames = String(Number(this.canvas.dataset.frames || 0) + 1);
      }
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  const canvas = page.locator('[aria-label="Interactive 3D CAD Geometry Visualization"] canvas');
  await expect(canvas).toHaveAttribute('data-frames', /\d+/);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  const before = Number(await canvas.getAttribute('data-frames'));
  await page.waitForTimeout(250);
  const after = Number(await canvas.getAttribute('data-frames'));
  expect(after - before).toBeLessThanOrEqual(1);
  await context.close();
});

test('desktop halftone lettering has space above its ascenders', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  const canvas = page.locator('footer canvas');
  await canvas.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const inkAtTop = await canvas.evaluate(element => {
    const canvas = element as HTMLCanvasElement;
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, 3).data;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 150 && pixels[i + 1] > 150) count++;
    return count;
  });
  expect(inkAtTop).toBe(0);
});

test('footer animation also stops when reduced motion is enabled at runtime', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.closest('footer')) this.canvas.dataset.frames = String(Number(this.canvas.dataset.frames || 0) + 1);
      return original.apply(this, args);
    };
  });
  await page.goto('/about');
  const canvas = page.locator('footer canvas');
  await canvas.scrollIntoViewIfNeeded();
  await page.locator('footer .hwf-art').hover();
  await expect(canvas).toHaveAttribute('data-frames', /\d+/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  const before = Number(await canvas.getAttribute('data-frames'));
  await page.waitForTimeout(250);
  expect(Number(await canvas.getAttribute('data-frames')) - before).toBeLessThanOrEqual(1);
});

test('mobile navigation and native touch scrolling remain usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Interactive Demo', exact: true }).tap();
  await expect(page).toHaveURL(/\/demo$/);
  await page.getByRole('button', { name: 'Open navigation menu', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Close navigation menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).getByRole('link', { name: 'About', exact: true }).tap();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('navigation', { name: 'Mobile navigation', exact: true })).toHaveCount(0);
  const client = await context.newCDPSession(page);
  // Chromium's synthetic gesture omits touchMove here; send the real touch sequence.
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 650 }] });
  for (let y = 630; y >= 250; y -= 20) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y }] });
    await page.waitForTimeout(16);
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await context.close();
});


test('approved full Leqad wordmark stays sharp, readable and unclipped on all screens', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const hero = page.getByRole('img', { name: 'Leqad logo' });
    await expect(hero).toHaveAttribute('src', '/assets/brand/leqad-official-horizontal-light-v1.svg');
    const heroBox = await hero.boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.height).toBeCloseTo(width >= 1024 ? 64 : width >= 640 ? 60 : 56, 1);
    expect(heroBox!.width / heroBox!.height).toBeCloseTo(1625 / 470, 2);
    expect(heroBox!.x).toBeGreaterThanOrEqual(0);
    expect(heroBox!.x + heroBox!.width).toBeLessThanOrEqual(width + 1);
    await expect(hero).toHaveCSS('filter', 'none');
    await expect(hero).toHaveCSS('mix-blend-mode', 'normal');
    await expect(hero).toHaveCSS('transform', 'none');
    await expect(hero).toHaveCSS('opacity', '1');
    await page.goto('/about');
    const header = page.locator('header');
    const logo = header.getByRole('img', { name: 'Leqad logo' });
    const rect = await logo.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.height).toBeCloseTo(56, 1);
    expect(rect!.width / rect!.height).toBeCloseTo(1625 / 470, 2);
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
    await expect(header).toHaveCSS('background-color', 'rgb(250, 248, 244)');
    await expect(logo).toHaveCSS('filter', 'none');
    await expect(logo).toHaveCSS('mix-blend-mode', 'normal');
    await expect(logo).toHaveCSS('transform', 'none');
    await expect(logo).toHaveCSS('opacity', '1');
    const link = header.getByRole('link', { name: 'Leqad Home' });
    await expect(link).toHaveCSS('flex-shrink', '0');
    const navToggle = header.getByRole('button', { name: 'Open navigation menu' });
    if (width < 1024) {
      const toggle = (await navToggle.boundingBox())!;
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(toggle.x - 4);
    }
    expect(rect!.y).toBeGreaterThanOrEqual(2);
    const headerBounds = (await header.boundingBox())!;
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(headerBounds.y + headerBounds.height - 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('address-bar favicon is one crisp, transparent official symbol, not a white-background fallback', async ({ page }) => {
  for (const route of ['/', '/demo', '/about', '/partners']) {
    await page.goto(route);
    const icons = page.locator('head link[rel="icon"]');
    await expect(icons).toHaveCount(1);
    await expect(icons).toHaveAttribute('href', '/favicon.svg?v=20261026-1');
    await expect(icons).toHaveAttribute('type', 'image/svg+xml');
    await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href', '/assets/brand/leqad-favicon-180-v1.png',
    );
  }
  const response = await page.request.get('/favicon.svg');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/image\/svg\+xml/);
  const symbol = await page.request.get('/assets/brand/leqad-official-symbol-light-v1.svg');
  // Compare actual approved logo artwork instead of the tighter viewBox.
  const newSvg = await response.text();
  const originalSvg = await symbol.text();
  const restored = newSvg
    .replace(/<style>[\s\S]*?<\/style>\n/, '')
    .replace('class="leqad-favicon-ink"', 'fill="#0E2943"')
    .replace('viewBox="293 128 448 448"', 'viewBox="280 119 476 470"');
  expect(restored).toBe(originalSvg);

  const pixels = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/favicon.svg';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);
    ctx.drawImage(image, 0, 0, 128, 128);
    const data = ctx.getImageData(0, 0, 128, 128).data;
    let ink = 0, russet = 0, white = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 250) continue;
      if (Math.abs(r - 14) <= 3 && Math.abs(g - 41) <= 3 && Math.abs(b - 67) <= 3) ink++;
      if (Math.abs(r - 121) <= 3 && Math.abs(g - 51) <= 3 && Math.abs(b - 39) <= 3) russet++;
      if (r > 220 && g > 220 && b > 220) white++;
    }
    return {
      ink, russet, white,
      topLeftAlpha: data[3],
      bottomRightAlpha: data[data.length - 1],
    };
  });
  expect(pixels.ink).toBeGreaterThan(500);
  expect(pixels.russet).toBeGreaterThan(30);
  expect(pixels.white).toBe(0);
  expect(pixels.topLeftAlpha).toBeLessThan(30);
  expect(pixels.bottomRightAlpha).toBeLessThan(30);
  // A favicon is displayed in a browser-controlled slot (often 16 px).
  // The new viewBox should fill more of that slot, without cropping artwork.
  const coverage = await page.evaluate(async () => {
    const load = async (src: string) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return image;
    };
    const [now, before] = await Promise.all([
      load('/favicon.svg?v=20261026-1'),
      load('/assets/brand/leqad-official-symbol-light-v1.svg'),
    ]);
    const bounds = (image: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0, 128, 128);
      const alpha = context.getImageData(0, 0, 128, 128).data;
      let minX = 128, minY = 128, maxX = -1, maxY = -1;
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        if (alpha[(y * 128 + x) * 4 + 3] < 128) continue;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      return { width: maxX - minX + 1, height: maxY - minY + 1 };
    };
    return { before: bounds(before), after: bounds(now) };
  });
  expect(coverage.after.width).toBeGreaterThanOrEqual(coverage.before.width + 3);
  expect(coverage.after.height).toBeGreaterThanOrEqual(coverage.before.height + 3);
});

test('approved favicon switches only ink color in light and dark browser modes', async ({ browser }) => {
  const render = async (scheme: 'light' | 'dark') => {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg?v=20261026-1');
      return await page.evaluate(async () => {
        const image = new Image();
        image.src = (document.querySelector('link[rel="icon"]') as HTMLLinkElement).href;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(image, 0, 0, 128, 128);
        const data = ctx.getImageData(0, 0, 128, 128).data;
        let navy = 0, ivory = 0, russet = 0, alphaSum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
          alphaSum += a;
          if (a < 250) continue;
          if (Math.abs(r - 14) < 4 && Math.abs(g - 41) < 4 && Math.abs(b - 67) < 4) navy++;
          if (Math.abs(r - 245) < 4 && Math.abs(g - 239) < 4 && Math.abs(b - 231) < 4) ivory++;
          if (Math.abs(r - 121) < 4 && Math.abs(g - 51) < 4 && Math.abs(b - 39) < 4) russet++;
        }
        return {
          navy, ivory, russet, alphaSum,
          transparentCorners: [data[3], data[(128 * 128 - 1) * 4 + 3]],
        };
      });
    } finally {
      await context.close();
    }
  };
  const light = await render('light');
  const dark = await render('dark');
  expect(light.navy).toBeGreaterThan(500);
  expect(light.ivory).toBe(0);
  expect(dark.ivory).toBeGreaterThan(500);
  expect(dark.navy).toBe(0);
  expect(light.russet).toBeGreaterThan(30);
  expect(dark.russet).toBe(light.russet);
  // No cropping, scaling or reworking of icon shape occurs between themes.
  expect(dark.alphaSum).toBe(light.alphaSum);
  expect(light.transparentCorners.every(alpha => alpha < 30)).toBe(true);
  expect(dark.transparentCorners.every(alpha => alpha < 30)).toBe(true);
});
