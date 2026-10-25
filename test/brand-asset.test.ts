import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function brandSvg(name: string): string {
  return readFileSync(new URL(`../public/assets/brand/leqad-official-${name}-v1.svg`, import.meta.url), 'utf8');
}

test('official artwork is vector and transparent with exact brand palette', () => {
  const light = brandSvg('horizontal-light');
  const dark = brandSvg('horizontal-dark');
  const lightSymbol = brandSvg('symbol-light');
  const darkSymbol = brandSvg('symbol-dark');
  for (const source of [light, dark, lightSymbol, darkSymbol]) {
    assert.match(source, /<svg /);
    assert.match(source, /<path /);
    assert.match(source, /fill="#793327"/); // Hay's Russet
    assert.doesNotMatch(source, /<image|data:image|feColorMatrix|<rect/);
  }
  assert.match(light, /fill="#0E2943"/);
  assert.match(dark, /fill="#F5EFE7"/);
  assert.match(light, /viewBox="275 120 1625 470"/);
  assert.match(lightSymbol, /viewBox="280 119 476 470"/);
});


test('logo presentations retain exact official paths and favicon already has dark/light variants', () => {
  const favicon = brandSvg('favicon');
  const symbol = brandSvg('symbol-light');
  assert.match(favicon, /viewBox="280 119 476 470"/);
  assert.match(favicon, /prefers-color-scheme: dark/);
  assert.match(favicon, /#0E2943/);
  assert.match(favicon, /#F5EFE7/);
  assert.match(favicon, /#793327/);
  // Symbol mask contours and russet center match the official symbol source.
  const paths = (source: string) => [...source.matchAll(/<path[^>]*d="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(paths(favicon), paths(symbol));
});


test('adaptive favicon preserves the exact approved symbol and tight tab framing', () => {
  const original = brandSvg('symbol-light');
  const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');

  // Reversing ONLY the media rule and ink-class assignment recovers the
  // approved SVG byte-for-byte (apart from the previously approved viewBox).
  const restored = favicon
    .replace(/<style>[\s\S]*?<\/style>\n/, '')
    .replace('class="leqad-favicon-ink"', 'fill="#0E2943"')
    .replace('viewBox="291 126 452 452"', 'viewBox="280 119 476 470"');
  assert.equal(restored, original, 'approved symbol geometry, russet, and metadata unchanged');
  assert.match(favicon, /viewBox="291 126 452 452"/);
  assert.match(favicon, /\.leqad-favicon-ink \{ fill: #0E2943; \}/);
  assert.match(favicon, /@media \(prefers-color-scheme: dark\)/);
  assert.match(favicon, /\.leqad-favicon-ink \{ fill: #F5EFE7; \}/);
  assert.match(favicon, /<path fill="#793327" fill-rule="evenodd"/);
  assert.doesNotMatch(favicon, /#FFFFFF|#fff\b|<rect|<image|<filter|feColorMatrix/);
  assert.equal((favicon.match(/<path /g) || []).length, 2);
  const [x, y, w, h] = [291, 126, 452, 452];
  assert.ok(294 > x && 740 < x + w && 133 > y && 571 < y + h);
});
