import type { PageRoute } from '../types';

export const PUBLIC_ROUTES: { path: string; page: PageRoute; title: string; ogTitle: string; description: string }[] = [
  { path: '/', page: 'home', title: 'Leqad', ogTitle: 'Leqad — Learn CAD by Building', description: 'Leqad is developing guided lessons and contextual hints alongside browser-based CAD for beginners. The website demo is a separate illustration.' },
  { path: '/demo', page: 'demo', title: 'Leqad Demo', ogTitle: 'Interactive CAD Walkthrough — Leqad', description: 'Try an eight-step illustrated CAD lesson: select a plane, sketch a rectangle, edit dimensions, and preview an extrusion. An interactive simulation, not a live CAD connection.' },
  { path: '/about', page: 'about', title: 'About Leqad', ogTitle: 'About Leqad — Guided CAD Education', description: 'Learn about Leqad's guided CAD teaching prototype, illustrated demo, and potential future development.' },
  { path: '/partners', page: 'partners', title: 'Leqad Partners', ogTitle: 'For Partners & Educators — Leqad', description: 'Explore educational collaboration and technical alignment with Leqad, an independent early-stage CAD learning project for engineering educators and platforms.' },
];

export function legacyDestination(hash: string): string | null {
  if (!hash.startsWith('#')) return null;
  if (hash === '#/' || hash === '#') return '/';
  const page = hash.replace(/^#\/?/, '');
  return PUBLIC_ROUTES.find(route => route.path === `/${page}`)?.path ?? null;
}

export function routeForPath(path: string) {
  return PUBLIC_ROUTES.find(route => route.path === (path.replace(/\/+$/, '') || '/'));
}
