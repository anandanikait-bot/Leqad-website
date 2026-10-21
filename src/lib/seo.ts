import { routeForPath } from './routes';

export const SITE_ORIGIN = 'https://leqada.ai.studio';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

// Shared by the build and client navigation. Initial HTML never needs JS for SEO.
export function renderHead(pathname: string): string {
  const route = routeForPath(pathname);
  const title = route?.title ?? 'Page not found — Leqad';
  const description = route?.description ?? 'The requested Leqad page could not be found.';
  const canonical = `${SITE_ORIGIN}${route?.path ?? '/'}`;
  const image = `${SITE_ORIGIN}/assets/cad-lesson-preview.png`;
  const imageAlt = 'Leqad CAD lesson preview with a reference plane and contextual teaching panel.';
  const tags = [
    `<title data-route-head>${escapeHtml(title)}</title>`,
    `<meta data-route-head name="description" content="${escapeHtml(description)}">`,
    `<meta data-route-head name="robots" content="${route ? 'index,follow' : 'noindex,follow'}">`,
    ...(route ? [`<link data-route-head rel="canonical" href="${canonical}">`] : []),
    ...Object.entries({ 'og:type': 'website', 'og:site_name': 'Leqad', 'og:title': title, 'og:description': description, 'og:url': canonical, 'og:image': image, 'og:image:alt': imageAlt, 'og:image:width': '1182', 'og:image:height': '520' })
      .map(([property, content]) => `<meta data-route-head property="${property}" content="${escapeHtml(content)}">`),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': image, 'twitter:image:alt': imageAlt })
      .map(([name, content]) => `<meta data-route-head name="${name}" content="${escapeHtml(content)}">`),
  ];
  if (route) {
    const data = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'Leqad', url: `${SITE_ORIGIN}/`, description: 'Independent early-stage CAD education project.' },
      { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Leqad', url: `${SITE_ORIGIN}/`, publisher: { '@id': `${SITE_ORIGIN}/#organization` } },
      { '@type': route.page === 'about' ? 'AboutPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { '@id': `${SITE_ORIGIN}/#website` } },
    ] };
    tags.push(`<script data-route-head type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n');
}
