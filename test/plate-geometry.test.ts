import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plateVertices, projectPlate } from '../src/lib/plate-geometry.js';

test('plate vertices preserve edited sketch dimensions and extrusion depth in one closed model', () => {
  const v = plateVertices({ width: 48, height: 36, depth: 12 });
  assert.equal(v.length, 8);
  assert.equal(v[1].x - v[0].x, 48);
  assert.equal(v[3].y - v[0].y, 36);
  for (let i = 0; i < 4; i++) {
    assert.equal(v[i + 4].x, v[i].x);
    assert.equal(v[i + 4].y, v[i].y);
    assert.equal(v[i + 4].z - v[i].z, 12);
  }
});

test('Top, Front and Right views show the actual model proportions', () => {
  const dimensions = { width: 48, height: 36, depth: 12 };
  const top = projectPlate(dimensions, 'top');
  assert.equal(top[1].x - top[0].x, 144);
  assert.equal(top[0].y - top[3].y, 108);
  const front = projectPlate(dimensions, 'front');
  const right = projectPlate(dimensions, 'right');
  assert.equal(front[1].x - front[0].x, 144);
  assert.equal(front[0].y - front[4].y, 36);
  assert.equal(right[3].x - right[0].x, 108);
  assert.notDeepEqual(front, right);
});

test('isometric transition begins on the same planar profile and stays finite at limits', () => {
  const dimensions = { width: 50, height: 40, depth: 50 };
  assert.deepEqual(projectPlate(dimensions, 'iso', 0), projectPlate({ ...dimensions, depth: 0 }, 'top'));
  for (const progress of [0, .25, .5, .75, 1]) {
    for (const p of projectPlate(dimensions, 'iso', progress)) {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
    }
  }
});
