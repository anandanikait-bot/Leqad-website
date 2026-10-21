import express from 'express';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function createApp(distDir = resolve(dirname(fileURLToPath(import.meta.url)), 'dist')) {
  const root = resolve(distDir);
  const routes = JSON.parse(readFileSync(resolve(root, 'routes.json'), 'utf8'));
  const app = express();
  app.disable('x-powered-by');
  app.use((request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    const alias = Object.entries(routes).find(([, file]) => request.path === `/${file}`);
    if (alias) {
      const query = request.originalUrl.slice(request.path.length);
      return response.redirect(308, alias[0] + query);
    }
    const clean = request.path.replace(/\/+$/, '') || '/';
    if (!Object.hasOwn(routes, clean)) return next();
    if (request.path !== clean) {
      const query = request.originalUrl.slice(request.path.length);
      return response.redirect(308, clean + query);
    }
    response.set('Cache-Control', 'no-cache');
    return response.sendFile(resolve(root, routes[clean]));
  });
  app.use((request, response, next) => {
    // Generated HTML must pass through canonical route handling, including 404.html.
    if (/\.html$/i.test(request.path)) return next();
    return express.static(root, { index: false, redirect: false })(request, response, next);
  });
  app.use((_request, response) => response.status(404).sendFile(resolve(root, '404.html')));
  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, '0.0.0.0', () => console.log(`Leqad production server listening on port ${port}`));
}
