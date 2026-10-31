import type { PageRoute } from '../types';

export const PUBLIC_ROUTES: { path: string; page: PageRoute; title: string; ogTitle: string; description: string }[] = [
  { path: '/', page: 'home', title: 'Leqad — Learn CAD by Building', ogTitle: 'Leqad — Learn CAD by Building', description: 'Learn CAD with guided practice. Leqad is building a browser extension, starting with Onshape. Try the first-sketch website demo.' },
  { path: '/demo', page: 'demo', title: 'Interactive CAD Walkthrough — Leqad', ogTitle: 'Interactive CAD Walkthrough — Leqad', description: 'Try an eight-step illustrated CAD lesson: select a plane, sketch a rectangle, edit dimensions, and preview an extrusion. An interactive simulation, not a live CAD connection.' },
  { path: '/about', page: 'about', title: 'About Leqad — Guided CAD Education', ogTitle: 'About Leqad — Guided CAD Education', description: 'Learn how Leqad aims to make CAD easier for beginners, what the demo offers, and what remains in development.' },
  { path: '/partners', page: 'partners', title: 'For Partners & Educators — Leqad', ogTitle: 'For Partners & Educators — Leqad', description: 'Help explore better CAD learning with Leqad. We welcome conversations with educators, robotics teams, and CAD platform teams.' },
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
