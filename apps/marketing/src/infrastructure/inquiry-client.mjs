export async function loadInquiryPolicy(endpoint, signal, request = fetch) {
  const url = new URL(endpoint);
  url.pathname = '/api/v1/public/inquiry-policy';
  const response = await request(url.href, { credentials:'omit', signal });
  if (!response.ok) throw new Error('Inquiry sending is currently unavailable.');
  const policy = await response.json();
  const notice = new URL(policy.noticeUrl);
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(policy.privacyNoticeVersionId || '') ||
    policy.sensitiveUploadsAllowed !== false || policy.marketingOptIn !== false ||
    (notice.protocol !== 'https:' && !(notice.protocol === 'http:' && notice.origin === url.origin))) {
    throw new Error('The inquiry privacy notice is unavailable.');
  }
  if (notice.username || notice.password) throw new Error('The inquiry privacy notice is unavailable.');
  return { versionId:policy.privacyNoticeVersionId, noticeUrl:notice.href };
}

/** Success is acknowledged only after the platform returns a committed reference. */
export async function submitInquiry(endpoint, payload, idempotencyKey, request = fetch) {
  if (!endpoint) throw new Error('Message delivery is not connected. Your draft remains available below.');
  const response = await request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    credentials: 'omit',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    if (response.status === 429) throw new Error('Too many requests. Please wait before retrying. Your draft is still here.');
    throw new Error('Your message could not be confirmed. Retry without changing the message to reuse the same reference request.');
  }
  const receipt = await response.json();
  if (typeof receipt.reference !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(receipt.reference)) {
    throw new Error('The server did not return a valid reference. Your message has not been confirmed.');
  }
  return { reference: receipt.reference };
}
