import { test, expect } from '@playwright/test';

test('landing contains only the intended navigation and hero CTA', async ({ page }) => {
  await page.goto('/');
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

test('only Demo, About and Partners have the halftone Leqad footer', async ({ page }) => {
  for (const path of ['/demo', '/about', '/partners']) {
    await page.goto(path);
    await expect(page.locator('footer canvas')).toHaveCount(1);
    await expect(page.locator('footer').getByText('Leqad CAD', { exact: true })).toBeVisible();
    await expect(page.locator('footer').getByText('© 2026 · In-workflow CAD education')).toBeVisible();
  }
  await page.goto('/');
  await expect(page.locator('footer')).toHaveCount(0);
});

test('approved brand logo, favicon, and Leqad document title across all routes', async ({ page }) => {
  for (const path of ['/', '/demo', '/about', '/partners']) {
    await page.goto(path);
    await expect(page).toHaveTitle('Leqad');
    await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('href', '/assets/brand/leqad-approved.png');
    await expect(page.locator('header img[alt="Leqad logo"]')).toHaveAttribute('src', '/assets/brand/leqad-approved.png');
    if (path === '/') {
      await expect(page.locator('footer')).toHaveCount(0);
    } else {
      await expect(page.locator('footer img[alt="Leqad CAD education mark"]')).toHaveAttribute('src', '/assets/brand/leqad-approved.png');
    }
  }
});

test('About contains a static preview instead of a second live lesson', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Learn CAD by building/);
  await expect(page.getByRole('button', { name: 'Start sketch', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore Full Demo', exact: true })).toHaveAttribute('href', '/demo');
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
  await page.goto('/demo');
  const help = page.locator('details');
  await expect(help).not.toHaveAttribute('open');
  await page.getByText('Need help?', { exact: true }).click();
  await page.getByRole('button', { name: 'Get a hint', exact: true }).click();
  await expect(page.getByText('HINT 1:', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Why?', exact: true }).click();
  await expect(page.getByText('Engineering Concept', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await expect(help).not.toHaveAttribute('open');
  await page.getByRole('button', { name: 'Show me where', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hide tool highlight', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const label of ['Select Top Plane', 'Start sketch', 'Draw rectangle', 'Set 40 × 30 mm dimensions', 'Finish sketch', 'Continue to practice', 'Finish walkthrough']) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: "You've completed the interactive walkthrough." })).toBeVisible();
  await page.getByRole('button', { name: 'Restart walkthrough', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'All steps', exact: true }).click();
  await page.getByRole('navigation', { name: 'Walkthrough steps', exact: true }).getByRole('button', { name: '8 Independent practice', exact: true }).click();
  await expect(page.getByText("You've completed the interactive walkthrough.", { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
});

test('prerendered public content and metadata work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const ogTitles = new Set<string>();
  for (const path of ['/', '/demo', '/about', '/partners']) {
    const response = await page.goto(`http://127.0.0.1:4173${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect((await page.locator('main').innerText()).length).toBeGreaterThan(150);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://leqada.ai.studio${path}`);
    expect(await page.title()).toBe('Leqad');
    const ogTitle = await page.locator('head meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    ogTitles.add(ogTitle!);
    expect(JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())['@graph']).toHaveLength(3);
  }
  expect(ogTitles.size).toBe(4);
  await context.close();
});

test('Lenis respects reduced motion and leaves CAD wheel events native', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.goto('/demo');
  const prevented = await page.locator('[data-lenis-prevent]').first().evaluate(element => {
    const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
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
        await expect(page.locator('footer')).toHaveCount(0);
      } else {
        const canvas = page.locator('footer canvas');
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        expect(box!.width).toBeLessThanOrEqual(width);
        expect(box!.height).toBeGreaterThanOrEqual(220);
        expect(box!.height).toBeLessThanOrEqual(310);
        expect(await canvas.evaluate(element => getComputedStyle(element).maskImage)).toContain('70%');
      }
      if (route === '/demo' && width < 1024) {
        const panel = await page.getByText('Leqad Teaching Panel', { exact: true }).boundingBox();
        const workspace = await page.locator('[data-lenis-prevent]').first().boundingBox();
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
  await page.goto('http://127.0.0.1:4173/');
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
  await page.goto('http://127.0.0.1:4173/');
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
