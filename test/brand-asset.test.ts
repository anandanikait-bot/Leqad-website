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

test('browser tab favicon embeds original approved navbar pixels, without editing the source asset', () => {
  const navbar = readFileSync(new URL('../public/assets/brand/leqad-navbar.png', import.meta.url));
  const svg = readFileSync(new URL('../public/assets/brand/leqad-tab-v1.svg', import.meta.url), 'utf8');
  const image = svg.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  assert.ok(image, 'favicon must embed the exact approved navbar PNG');
  assert.deepEqual(Buffer.from(image[1], 'base64'), navbar);
  assert.match(svg, /prefers-color-scheme: dark/);
  assert.match(svg, /prefers-color-scheme: light/);
  assert.match(svg, /feColorMatrix/);
});
