import { build } from 'vite';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PUBLIC_ROUTES } from '../src/lib/routes';
import { renderHead } from '../src/lib/seo';

const output = resolve('dist');
const template = await readFile(resolve(output, 'index.html'), 'utf8');
await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'dist/.prerender', emptyOutDir: true } });
const { renderPage } = await import(pathToFileURL(resolve(output, '.prerender/entry-server.js')).href);
const manifest: Record<string, string> = {};
for (const path of [...PUBLIC_ROUTES.map(route => route.path), '/404']) {
  const file = path === '/' ? 'index.html' : path === '/404' ? '404.html' : `${path.slice(1)}/index.html`;
  const html = template.replace('<!--route-head-->', renderHead(path))
    .replace('<div id="root"></div>', `<div id="root" data-route="${path}">${renderPage(path)}</div>`);
  await mkdir(dirname(resolve(output, file)), { recursive: true });
  await writeFile(resolve(output, file), html);
  if (path !== '/404') manifest[path] = file;
  console.log(`Prerendered ${path} → ${file}`);
}
await writeFile(resolve(output, 'routes.json'), JSON.stringify(manifest, null, 2));
await rm(resolve(output, '.prerender'), { recursive: true, force: true });
