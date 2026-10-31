import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const routes = ['/', '/demo', '/about', '/partners'];
const publicOrigin = 'https://leqad.com';

test.describe('crawler-visible production documents', () => {
  test.use({ javaScriptEnabled: false });

  test('every direct route has distinct rendered content and complete metadata without JavaScript', async ({ page, request }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const socialTitles = new Set<string>();
    const headings = new Set<string>();

    for (const route of routes) {
      const response = await page.goto(route + '?production-check=1');
      expect(response?.status(), route).toBe(200);
      expect(response?.headers()['content-type']).toMatch(/^text\/html\b/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('main h1')).toBeVisible();
      expect((await page.locator('main').innerText()).trim().length).toBeGreaterThan(150);
      headings.add((await page.locator('main h1').innerText()).trim());

      const canonical = publicOrigin + route;
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /\bindex\b/);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      const socialTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(title.trim()).not.toBe('');
      expect(description?.trim().length).toBeGreaterThan(30);
      expect(socialTitle?.trim()).toBeTruthy();
      titles.add(title);
      descriptions.add(description!);
      socialTitles.add(socialTitle!);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', socialTitle!);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

      const image = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(image).toBeTruthy();
      const imageUrl = new URL(image!);
      expect(imageUrl.origin).toBe(publicOrigin);
      await expect(page.locator('meta[property="og:image:secure_url"]')).toHaveAttribute('content', image!);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', image!);
      await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png');
      expect((await page.locator('meta[property="og:image:alt"]').getAttribute('content'))?.trim()).toBeTruthy();
      const imageResponse = await request.get(imageUrl.pathname + imageUrl.search);
      expect(imageResponse.status()).toBe(200);
      expect(imageResponse.headers()['content-type']).toMatch(/^image\/png\b/);
      const png = await imageResponse.body();
      expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
      expect(png.length).toBeGreaterThan(24);
      for (const [dimension, offset] of [['width', 16], ['height', 20]] as const) {
        const declared = Number(await page.locator(`meta[property="og:image:${dimension}"]`).getAttribute('content'));
        expect(declared).toBeGreaterThan(0);
        expect(png.readUInt32BE(offset), `${route} image ${dimension}`).toBe(declared);
      }

      const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      expect(structuredData['@context']).toBe('https://schema.org');
      const graph = structuredData['@graph'];
      expect(Array.isArray(graph)).toBe(true);
      expect(graph.some((node: Record<string, string>) => node['@type'] === 'Organization')).toBe(true);
      expect(graph.some((node: Record<string, string>) => node['@type'] === 'WebSite')).toBe(true);
      const webPage = graph.find((node: Record<string, string>) => ['WebPage', 'AboutPage'].includes(node['@type']));
      expect(webPage?.url).toBe(canonical);
      expect(webPage?.name).toBe(socialTitle);
      expect(webPage?.description).toBe(description);
      expect(graph.some((node: Record<string, string>) => node['@id'] === webPage?.isPartOf?.['@id'])).toBe(true);
    }
    for (const values of [titles, descriptions, socialTitles, headings]) expect(values.size).toBe(routes.length);
  });

  test('robots advertises a valid sitemap containing exactly the public canonical pages', async ({ page, request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(robots.headers()['content-type']).toMatch(/^text\/plain\b/);
    const directives = await robots.text();
    expect(directives).toMatch(/^User-agent:\s*\*\s*$/m);
    expect(directives).not.toMatch(/^Disallow:\s*\/\s*$/m);
    const sitemapUrl = directives.match(/^Sitemap:\s*(\S+)\s*$/mi)?.[1];
    expect(sitemapUrl).toBe(publicOrigin + '/sitemap.xml');
    const sitemap = await request.get(new URL(sitemapUrl!).pathname);
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()['content-type']).toMatch(/^(?:application|text)\/xml\b/);
    const parsed = await page.evaluate(xml => {
      const document = new DOMParser().parseFromString(xml, 'application/xml');
      return {
        errors: document.getElementsByTagName('parsererror').length,
        namespace: document.documentElement.namespaceURI,
        urls: [...document.getElementsByTagName('loc')].map(node => node.textContent),
      };
    }, await sitemap.text());
    expect(parsed.errors).toBe(0);
    expect(parsed.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(parsed.urls.sort()).toEqual(routes.map(route => publicOrigin + route).sort());
  });

  test('HTML aliases and trailing slashes preserve queries while redirecting to canonical paths', async ({ request }) => {
    for (const route of routes) {
      const aliases = [route === '/' ? '/index.html' : route + '/index.html'];
      if (route !== '/') aliases.push(route + '/');
      for (const alias of aliases) {
        const response = await request.get(alias + '?from=share&value=a%20b', { maxRedirects: 0 });
        expect(response.status(), alias).toBe(308);
        expect(response.headers().location).toBe(route + '?from=share&value=a%20b');
        const destination = await request.get(response.headers().location);
        expect(destination.status()).toBe(200);
      }
    }
  });

  test('unknown pages and missing assets return nonindexable 404 documents', async ({ page }) => {
    for (const path of ['/missing-production-page', '/assets/missing-production.js', '/404.html']) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /\bnoindex\b/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('main a[href="/"]')).toBeVisible();
    }
  });
});

test('production output excludes source maps, archives and environment files', async () => {
  const output = resolve('dist');
  async function filesIn(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => entry.isDirectory()
      ? filesIn(join(directory, entry.name))
      : [relative(output, join(directory, entry.name))]));
    return files.flat();
  }
  const files = await filesIn(output);
  expect(files).toContain('index.html');
  const unwanted = files.filter(file => /(?:^|\/)\.env(?:\.|$)|\.(?:map|zip|tar|tgz|gz|7z|rar)$/i.test(file));
  expect(unwanted, 'Only deployable website assets should be published').toEqual([]);
  expect(files.filter(file => /^(?:assets\/aistudio\/|assets\/brand\/official-kit\/|\.prerender\/|test\/|docs\/)|^assets\/brand\/(?:BRAND_BASELINE\.md|brand-review\.png|leqad-approved\.png|leqad-navbar\.png)$/i.test(file)), 'Reference material stays in the repository, outside dist').toEqual([]);
});

test('a drawn sketch remains accessible throughout the full demo page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await page.getByRole('button', { name: 'Select Top Plane', exact: true }).click();
  await page.getByRole('button', { name: 'Start sketch', exact: true }).click();
  await page.getByRole('button', { name: /^(?:Use guided rectangle|Draw rectangle)$/ }).click();
  await expect(page.getByTestId('sketch-profile')).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations.map(violation => ({
    id: violation.id,
    description: violation.description,
    targets: violation.nodes.map(node => node.target),
  }))).toEqual([]);
  await expect(page.getByRole('img', { name: /Rectangle \d+ by \d+ millimeters/ })).toBeVisible();
});

test('direct loads, refreshes and client navigation produce no runtime or hydration errors', async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  const origin = new URL(baseURL!).origin;
  page.on('pageerror', error => errors.push('pageerror: ' + error.message));
  page.on('console', message => {
    if (message.type() === 'error' || /hydration|hydrating|server.rendered HTML/i.test(message.text())) {
      errors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('response', response => {
    if (new URL(response.url()).origin === origin && response.status() >= 400) {
      errors.push(`${response.status()}: ${response.url()}`);
    }
  });
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === origin && request.failure()?.errorText !== 'net::ERR_ABORTED') {
      errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`);
    }
  });

  for (const route of routes) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect((await page.reload())?.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', publicOrigin + route);
    await page.evaluate(() => document.fonts.ready);
  }

  await page.goto('/');
  await page.locator('main a[href="/demo"]').first().click();
  for (const route of ['/demo', '/about', '/partners', '/']) {
    if (route !== '/demo') await page.locator(`header nav[aria-label="Main navigation"] a[href="${route}"]`).click();
    await expect(page).toHaveURL(new URL(route, baseURL!).href);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', publicOrigin + route);
  }
  await page.evaluate(() => document.fonts.ready);
  expect(errors).toEqual([]);
});
