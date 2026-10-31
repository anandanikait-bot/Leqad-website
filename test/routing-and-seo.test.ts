import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyDestination, PUBLIC_ROUTES } from '../src/lib/routes.js';
import { renderHead, SITE_ORIGIN } from '../src/lib/seo.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// These exercise production redirect/metadata functions, not a copied routing model.
test('known legacy hash URLs are replaced by their clean destinations', () => {
  for (const route of ['demo', 'about', 'partners']) {
    assert.equal(legacyDestination(`#/${route}`), `/${route}`);
    assert.equal(legacyDestination(`#${route}`), `/${route}`);
  }
  assert.equal(legacyDestination('#/'), '/');
  assert.equal(legacyDestination('#section'), null);
  assert.equal(legacyDestination(''), null);
});

test('each public route has unique crawlable metadata and a route-specific browser title', () => {
  const ogTitles = new Set<string>();
  const pageTitles = new Set<string>();
  const descriptions = new Set<string>();
  assert.deepEqual(PUBLIC_ROUTES.map(route => route.path), ['/', '/demo', '/about', '/partners']);
  for (const route of PUBLIC_ROUTES) {
    const head = renderHead(route.path);
    assert.equal(head.match(/<title data-route-head>(.*?)<\/title>/)?.[1].replaceAll('&amp;', '&'), route.title);
    assert.ok(head.includes(`href="https://leqad.com${route.path === '/' ? '/' : route.path}"`));
    assert.match(head, /property="og:url"/);
    const isDemo = route.path === '/demo';
    const imagePath = isDemo ? 'cad-lesson-preview.png' : 'leqad-home-share-v2.png';
    assert.ok(head.includes(`property="og:image" content="https://leqad.com/assets/${imagePath}?v=20261025"`));
    assert.ok(head.includes(`property="og:image:secure_url" content="https://leqad.com/assets/${imagePath}?v=20261025"`));
    assert.ok(head.includes('property="og:image:type" content="image/png"'));
    assert.ok(head.includes('name="twitter:card" content="summary_large_image"'));
    assert.ok(head.includes(`name="twitter:image" content="https://leqad.com/assets/${imagePath}?v=20261025"`));
    assert.ok(head.includes(`property="og:image:width" content="${isDemo ? '1182' : '1440'}"`));
    assert.ok(head.includes(`property="og:image:height" content="${isDemo ? '534' : '900'}"`));
    assert.match(head, /name="twitter:title"/);
    assert.match(head, /application\/ld\+json/);
    pageTitles.add(route.title);
    ogTitles.add(route.ogTitle);
    descriptions.add(route.description);
  }
  assert.equal(ogTitles.size, 4);
  assert.equal(pageTitles.size, 4);
  assert.equal(descriptions.size, 4);
});

test('homepage social image is branded and distinct from the interactive demo', () => {
  const home = renderHead('/');
  const demo = renderHead('/demo');
  assert.match(home, /assets\/leqad-home-share-v2\.png/);
  assert.doesNotMatch(home, /assets\/cad-lesson-preview\.png/);
  assert.match(demo, /assets\/cad-lesson-preview\.png/);
  assert.doesNotMatch(demo, /assets\/leqad-home-share-v2\.png/);
});

test('unknown routes are excluded from indexing', () => {
  assert.match(renderHead('/missing'), /name="robots" content="noindex/);
});

test('leqad.com is the single canonical public origin in head and crawler resources', () => {
  assert.equal(SITE_ORIGIN, 'https://leqad.com');
  const robots = readFileSync(resolve('public/robots.txt'), 'utf8');
  const sitemap = readFileSync(resolve('public/sitemap.xml'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/leqad\.com\/sitemap\.xml/);
  for (const route of PUBLIC_ROUTES) {
    const url = `https://leqad.com${route.path}`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
    const head = renderHead(route.path);
    assert.ok(head.includes(`rel="canonical" href="${url}"`));
    assert.ok(head.includes(`property="og:url" content="${url}"`));
    assert.ok(head.includes('https://leqad.com/assets/'));
    assert.ok(head.includes(`"url":"https://leqad.com/"`));
    assert.ok(!head.includes('leqada.ai.studio'));
  }
  assert.doesNotMatch(robots + sitemap, /leqada\.ai\.studio/);
});
