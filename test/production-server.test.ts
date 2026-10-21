import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.mjs';

test('production serves route-specific HTML, canonical redirects, and real missing-page statuses', async () => {
  const root = await mkdtemp(join(tmpdir(), 'leqad-host-'));
  await mkdir(join(root, 'demo'));
  await mkdir(join(root, 'assets'));
  await writeFile(join(root, 'routes.json'), JSON.stringify({ '/': 'index.html', '/demo': 'demo/index.html' }));
  await writeFile(join(root, 'index.html'), '<h1>Home</h1>');
  await writeFile(join(root, 'demo/index.html'), '<h1>CAD walkthrough</h1>');
  await writeFile(join(root, '404.html'), '<h1>Page not found</h1>');
  await writeFile(join(root, 'assets/app.js'), 'console.log("app")');
  const server = createApp(root).listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    const demo = await fetch(`${origin}/demo`);
    assert.equal(demo.status, 200);
    assert.match(await demo.text(), /CAD walkthrough/);
    const redirect = await fetch(`${origin}/demo/?source=test`, { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get('location'), '/demo?source=test');
    for (const path of ['/missing', '/assets/missing.js']) assert.equal((await fetch(origin + path)).status, 404);
    assert.equal((await fetch(`${origin}/assets/app.js`)).status, 200);
    assert.equal((await fetch(`${origin}/demo`, { method: 'HEAD' })).status, 200);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  }
});
