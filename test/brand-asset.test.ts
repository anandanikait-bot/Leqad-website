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
