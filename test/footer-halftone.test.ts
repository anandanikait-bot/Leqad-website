import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hwfOfficialDotRadius } from '../components/ui/halftone-wordmark-footer';

test('official SVG halftone uses uniformly sized, rounded dots with no partial-edge speckles', () => {
  assert.equal(hwfOfficialDotRadius(0, 4), 0);
  assert.equal(hwfOfficialDotRadius(0.59, 4), 0);
  assert.equal(hwfOfficialDotRadius(0.6, 4), 1.62);
  assert.equal(hwfOfficialDotRadius(0.8, 4), hwfOfficialDotRadius(1, 4));
  assert.ok(hwfOfficialDotRadius(1, 4) < 2, 'neighbouring dots must not overlap');
  assert.equal(hwfOfficialDotRadius(1, -4), 0);
});
