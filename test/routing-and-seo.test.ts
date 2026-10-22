import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyDestination, PUBLIC_ROUTES } from '../src/lib/routes.js';
import { renderHead } from '../src/lib/seo.js';

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
    assert.ok(head.includes(`<title data-route-head>${route.title}</title>`));
    assert.ok(head.includes(`href="https://leqada.ai.studio${route.path === '/' ? '/' : route.path}"`));
    assert.match(head, /property="og:url"/);
    const isDemo = route.path === '/demo';
    const imagePath = isDemo ? 'cad-lesson-preview.png' : 'leqad-home-share-v1.png';
    assert.ok(head.includes(`property="og:image" content="https://leqada.ai.studio/assets/${imagePath}"`));
    assert.ok(head.includes(`name="twitter:image" content="https://leqada.ai.studio/assets/${imagePath}"`));
    assert.ok(head.includes(`property="og:image:width" content="${isDemo ? '1182' : '1440'}"`));
    assert.ok(head.includes(`property="og:image:height" content="${isDemo ? '534' : '1000'}"`));
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
  assert.match(home, /assets\/leqad-home-share-v1\.png/);
  assert.doesNotMatch(home, /assets\/cad-lesson-preview\.png/);
  assert.match(demo, /assets\/cad-lesson-preview\.png/);
  assert.doesNotMatch(demo, /assets\/leqad-home-share-v1\.png/);
});

test('unknown routes are excluded from indexing', () => {
  assert.match(renderHead('/missing'), /name="robots" content="noindex/);
});
