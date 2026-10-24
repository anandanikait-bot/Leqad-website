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
  for (const [width, expectedHeight] of [[320, 49.28], [375, 49.28], [768, 53.76], [1024, 53.76], [1440, 53.76]] as const) {
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
    await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('href', '/assets/brand/leqad-official-favicon-v1.svg');
    await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('type', 'image/svg+xml');
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
  const preview = 'https://leqada.ai.studio/assets/leqad-home-share-v1.png';
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', preview);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', preview);
  const response = await page.request.get('/assets/leqad-home-share-v1.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\/png/);
  await page.goto('/demo');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://leqada.ai.studio/assets/cad-lesson-preview.png',
  );
});

test('tab icon uses the approved geometry on both light and dark themes', async ({ page }) => {
  await page.goto('/');
  const res = await page.request.get('/assets/brand/leqad-official-favicon-v1.svg');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/image\/svg\+xml/);
  const source = await res.text();
  expect(source).toContain('prefers-color-scheme: dark');
  expect(source).toContain('#0E2943');
  expect(source).toContain('#F5EFE7');
  expect(source).toContain('fill="#793327"');
  expect(source).toContain('<path');
  expect(source).not.toContain('feColorMatrix');
});

test('favicon actually renders legibly at 16px with transparent corners', async ({ page }) => {
  await page.goto('/');
  const pixels = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/assets/brand/leqad-official-favicon-v1.svg';
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
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://leqada.ai.studio/${route}`);
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
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://leqada.ai.studio${path}`);
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
        expect(await canvas.evaluate(element => getComputedStyle(element).maskImage)).toContain('84%');
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
