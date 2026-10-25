import { routeForPath } from './routes';

export const SITE_ORIGIN = 'https://leqad.com';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

// Shared by the build and client navigation. Initial HTML never needs JS for SEO.
export function renderHead(pathname: string): string {
  const route = routeForPath(pathname);
  // Use the same route title for prerendered HTML and client-side navigation.
  const documentTitle = route?.title ?? 'Page not found — Leqad';
  const metaTitle = route?.ogTitle ?? route?.title ?? 'Page not found — Leqad';
  const description = route?.description ?? 'The requested Leqad page could not be found.';
  const canonical = `${SITE_ORIGIN}${route?.path ?? '/'}`;
  // Social cards are fetched without JavaScript by messaging and link-preview bots.
  // Homepage/general pages use the branded home hero, not the CAD lesson canvas.
  // Give the replacement image its own URL so caches can fetch the new asset.
  const isDemo = route?.page === 'demo';
  // A versioned URL prompts social-card caches to request a fresh image after the
  // switch from the old ai.studio hostname. The file remains a real PNG.
  const image = `${SITE_ORIGIN}/assets/${isDemo ? 'cad-lesson-preview.png' : 'leqad-home-share-v2.png'}?v=20261025`;
  const imageAlt = isDemo
    ? 'Leqad interactive CAD lesson showing a sketch and contextual teaching panel.'
    : 'Leqad — Learn CAD by building. A navy, ivory and russet CAD design concept illustration.';
  const imageWidth = isDemo ? '1182' : '1200';
  const imageHeight = isDemo ? '534' : '630';
  const tags = [
    `<title data-route-head>${escapeHtml(documentTitle)}</title>`,
    `<meta data-route-head name="description" content="${escapeHtml(description)}">`,
    `<meta data-route-head name="robots" content="${route ? 'index,follow' : 'noindex,follow'}">`,
    ...(route ? [`<link data-route-head rel="canonical" href="${canonical}">`] : []),
    ...Object.entries({ 'og:type': 'website', 'og:site_name': 'Leqad', 'og:title': metaTitle, 'og:description': description, 'og:url': canonical, 'og:image': image, 'og:image:secure_url': image, 'og:image:type': 'image/png', 'og:image:alt': imageAlt, 'og:image:width': imageWidth, 'og:image:height': imageHeight })
      .map(([property, content]) => `<meta data-route-head property="${property}" content="${escapeHtml(content)}">`),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': metaTitle, 'twitter:description': description, 'twitter:image': image, 'twitter:image:alt': imageAlt })
      .map(([name, content]) => `<meta data-route-head name="${name}" content="${escapeHtml(content)}">`),
  ];
  if (route) {
    const data = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'Leqad', url: `${SITE_ORIGIN}/`, description: 'Independent early-stage CAD education project.' },
      { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Leqad', url: `${SITE_ORIGIN}/`, publisher: { '@id': `${SITE_ORIGIN}/#organization` } },
      { '@type': route.page === 'about' ? 'AboutPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: metaTitle, description, isPartOf: { '@id': `${SITE_ORIGIN}/#website` } },
    ] };
    tags.push(`<script data-route-head type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n');
}
