import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { request as httpRequest } from 'node:http';
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
    // The production server canonicalizes only the known alternate hostnames.
    // This can redirect the old ai.studio address if Google forwards its Host
    // header to the same Cloud Run service; runtime verification is still needed.
    // Native fetch may normalize/replace the Host header. Send an actual HTTP
    // request so the server sees precisely the hostname being tested.
    const requestFrom = (host: string, path: string) => new Promise<{ status: number; location?: string }>((resolve, reject) => {
      const req = httpRequest({ hostname: '127.0.0.1', port: address.port, path, headers: { Host: host } }, res => {
        res.resume();
        res.once('end', () => resolve({ status: res.statusCode ?? 0, location: res.headers.location }));
      });
      req.once('error', reject);
      req.end();
    });
    const oldDomain = await requestFrom('leqada.ai.studio', '/demo?ref=old');
    assert.equal(oldDomain.status, 308);
    assert.equal(oldDomain.location, 'https://leqad.com/demo?ref=old');

    const wwwDomain = await requestFrom('www.leqad.com', '/about?ref=www');
    assert.equal(wwwDomain.status, 308);
    assert.equal(wwwDomain.location, 'https://leqad.com/about?ref=www');

    const exactDomain = await requestFrom('leqad.com', '/demo');
    assert.equal(exactDomain.status, 200);
    const runAppHost = await requestFrom('leqad-123.us-west1.run.app', '/demo');
    assert.equal(runAppHost.status, 200);

    const demo = await fetch(`${origin}/demo`);
    assert.equal(demo.status, 200);
    assert.match(await demo.text(), /CAD walkthrough/);
    const redirect = await fetch(`${origin}/demo/?source=test`, { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get('location'), '/demo?source=test');
    const alias = await fetch(`${origin}/demo/index.html?source=alias`, { redirect: 'manual' });
    assert.equal(alias.status, 308);
    assert.equal(alias.headers.get('location'), '/demo?source=alias');
    assert.equal((await fetch(`${origin}/404.html`)).status, 404);
    for (const path of ['/missing', '/assets/missing.js']) assert.equal((await fetch(origin + path)).status, 404);
    assert.equal((await fetch(`${origin}/assets/app.js`)).status, 200);
    assert.equal((await fetch(`${origin}/demo`, { method: 'HEAD' })).status, 200);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  }
});
