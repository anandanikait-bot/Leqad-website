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

test('each public route has unique crawlable metadata, an absolute canonical, and document title Leqad', () => {
  const ogTitles = new Set<string>();
  const descriptions = new Set<string>();
  assert.deepEqual(PUBLIC_ROUTES.map(route => route.path), ['/', '/demo', '/about', '/partners']);
  for (const route of PUBLIC_ROUTES) {
    const head = renderHead(route.path);
    // Tab title is strictly "Leqad" on every route
    assert.match(head, /<title data-route-head>Leqad<\/title>/);
    assert.ok(head.includes(`href="https://leqada.ai.studio${route.path === '/' ? '/' : route.path}"`));
    assert.match(head, /property="og:url"/);
    assert.ok(head.includes('property="og:image" content="https://leqada.ai.studio/assets/cad-lesson-preview.png"'));
    assert.match(head, /name="twitter:title"/);
    assert.match(head, /application\/ld\+json/);
    assert.equal(route.title, 'Leqad');
    ogTitles.add(route.ogTitle);
    descriptions.add(route.description);
  }
  assert.equal(ogTitles.size, 4);
  assert.equal(descriptions.size, 4);
});

test('unknown routes are excluded from indexing', () => {
  assert.match(renderHead('/missing'), /name="robots" content="noindex/);
});
