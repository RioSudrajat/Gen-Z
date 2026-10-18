export function withImageRetry(src, attempt) {
  if (!attempt) return src;
  const [url, fragment] = src.split('#', 2);
  return `${url}${url.includes('?') ? '&' : '?'}retry=${encodeURIComponent(attempt)}${fragment ? '#' + fragment : ''}`;
}
