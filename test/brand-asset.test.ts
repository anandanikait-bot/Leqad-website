import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('approved logo source is intact and the navbar derivative supports 3x display density', () => {
  const source = readFileSync(new URL('../public/assets/brand/leqad-approved.png', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), 'ca9cb8ffd5c6643db19756cbd4d2e71b02565283a0d0a21227655336957c17e1');
  const navbar = readFileSync(new URL('../public/assets/brand/leqad-navbar.png', import.meta.url));
  assert.equal(navbar.readUInt32BE(16), 144);
  assert.equal(navbar.readUInt32BE(20), 144);
  assert.ok(navbar.length < 50_000);
});

test('browser tab links use explicit native PNG sizes and a versioned ICO fallback', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /rel="icon"[^>]*image\/svg\+xml/);
  for (const size of [16, 32, 48]) {
    assert.match(html, new RegExp(`sizes="${size}x${size}" href="/assets/favicons/leqad-${size}-v2.png"`));
  }
  assert.match(html, /href="\/assets\/favicons\/leqad-v2.ico"/);
});

test('ICO contains the three native-size PNG frames without resampling', () => {
  const ico = readFileSync(new URL('../public/assets/favicons/leqad-v2.ico', import.meta.url));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (const [index, size] of [16, 32, 48].entries()) {
    const entry = 6 + index * 16;
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    const png = readFileSync(new URL(`../public/assets/favicons/leqad-${size}-v2.png`, import.meta.url));
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
    assert.deepEqual(ico.subarray(offset, offset + length), png);
  }
});
