const privatePaths = [
  /^\/app\/?$/,
  /^\/app\/(?:assets(?:\/[a-z0-9-]+)?|portfolio(?:\/[a-z0-9-]+)?|rewards|points|gen-z|activity|account|support)\/?$/,
];

export function allowedReturnTo(value) {
  return typeof value === 'string' && privatePaths.some(pattern => pattern.test(value)) ? value : '/app';
}

export function platformOrigin(value) {
  if (!value) return '';
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('PUBLIC_PLATFORM_ORIGIN must be an HTTPS origin (HTTP loopback is allowed in development), without path or credentials.');
  }
  return url.origin;
}

export function platformAuthUrl(origin, returnTo = '/app') {
  const trustedOrigin = platformOrigin(origin);
  if (!trustedOrigin) return '';
  const url = new URL('/auth', trustedOrigin);
  url.searchParams.set('returnTo', allowedReturnTo(returnTo));
  return url.href;
}

export function platformInquiryEndpoint(origin, enabled = false) {
  const trustedOrigin = platformOrigin(origin);
  return trustedOrigin && enabled ? new URL('/api/v1/inquiries', trustedOrigin).href : '';
}

export function legacyReturnTo(pathname) {
  if (/^\/(?:dashboard|app)\/?$/.test(pathname)) return '/app';
  const match = /^\/(?:app\/)?assets(?:\/([a-z0-9-]+))?\/?$/.exec(pathname);
  if (match) return '/app/assets' + (match[1] ? '/' + match[1] : '');
  return null;
}
