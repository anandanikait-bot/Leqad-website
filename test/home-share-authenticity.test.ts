import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('social preview uses identical bytes to the existing approved homepage screenshot', () => {
  const source=readFileSync('docs/screenshots/quality-pass/after/home-1440.png');
  const publicImage=readFileSync('public/assets/leqad-home-share-v2.png');
  assert.ok(source.equals(publicImage), 'share preview must be the original real homepage screenshot, not generated artwork');
  assert.deepEqual([...publicImage.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(publicImage.readUInt32BE(16),1440);
  assert.equal(publicImage.readUInt32BE(20),900);
});
