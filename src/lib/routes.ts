import type { PageRoute } from '../types';

export const PUBLIC_ROUTES: { path: string; page: PageRoute; title: string; description: string }[] = [
  { path: '/', page: 'home', title: 'Leqad — Learn CAD by Building', description: 'Explore Leqad, an early-stage CAD education project. Learn through guided lessons, contextual tool hints, and an interactive CAD illustration.' },
  { path: '/demo', page: 'demo', title: 'Interactive CAD Walkthrough — Leqad', description: 'Try an eight-step illustrated CAD lesson: select a plane, sketch a rectangle, and apply dimensions. An interactive simulation, not a live CAD connection.' },
  { path: '/about', page: 'about', title: 'About Leqad — Guided CAD Education', description: 'Discover the idea behind Leqad: CAD lessons and contextual guidance inside the design workflow. See the current prototype and plans for future development.' },
  { path: '/partners', page: 'partners', title: 'For Partners & Educators — Leqad', description: 'Explore educational collaboration and technical alignment with Leqad, an independent early-stage CAD learning project for engineering educators and platforms.' },
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
