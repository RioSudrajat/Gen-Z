export const publicPagePaths = Object.freeze(['/', '/contact/']);

export function marketingOrigin(value = '') {
  if (!value.trim()) return '';
  const url = new URL(value.trim());
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('PUBLIC_SITE_ORIGIN must be an HTTPS origin without a path, credentials, query, or fragment. HTTP loopback is allowed locally.');
  }
  return url.origin;
}

export function publicMetadata(origin, pathname, noindex = false) {
  const base = marketingOrigin(origin);
  const path = pathname === '/contact' ? '/contact/' : pathname;
  if (!base || noindex || !publicPagePaths.includes(path)) return null;
  return {
    canonical: new URL(path, base).href,
    image: new URL('/assets/gen-z-video-poster.webp', base).href,
    organization: {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'Gen-Z',
      url: new URL('/', base).href,
      logo: new URL('/assets/gen-z-symbol.svg', base).href,
    },
  };
}

export function robotsText(origin = '') {
  const base = marketingOrigin(origin);
  return 'User-agent: *\nAllow: /\n' + (base ? `\nSitemap: ${base}/sitemap-index.xml\n` : '');
}
