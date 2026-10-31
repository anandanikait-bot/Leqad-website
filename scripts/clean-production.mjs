import { rm } from 'node:fs/promises';

// Keep design handoffs and historical reference images in the repository,
// without publishing Vite's public-directory copies in the production build.
const references = [
  'assets/aistudio/',
  'assets/brand/official-kit/',
  'assets/brand/BRAND_BASELINE.md',
  'assets/brand/brand-review.png',
  'assets/brand/leqad-approved.png',
  'assets/brand/leqad-navbar.png',
];

for (const reference of references) {
  await rm(new URL(`../dist/${reference}`, import.meta.url), { recursive: true, force: true });
}
