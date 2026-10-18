import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { allowedReturnTo, platformOrigin, platformAuthUrl, legacyReturnTo } from '../src/application/platform-links.mjs';
import { validateInquiry, inquiryDraft, inquiryPayload } from '../src/application/inquiry.mjs';
import { submitInquiry } from '../src/infrastructure/inquiry-client.mjs';

const valid = { role:'operator', name:'Test Operator', company:'Demo', email:'operator@example.invalid', message:'Illustrative inquiry for automated verification.' };

test('platform config rejects credential-bearing, external path and non-HTTPS destinations', () => {
  assert.equal(platformOrigin(''), '');
  assert.equal(platformOrigin('https://platform.example.invalid/'), 'https://platform.example.invalid');
  assert.equal(platformOrigin('http://127.0.0.1:3000'), 'http://127.0.0.1:3000');
  for (const value of ['javascript:alert(1)', '//evil.invalid', 'http://external.invalid', 'https://user:secret@example.invalid', 'https://example.invalid/auth', 'https://example.invalid/?redirect=1']) assert.throws(() => platformOrigin(value));
});

test('auth returnTo accepts only known app resource paths', () => {
  assert.equal(allowedReturnTo('/app/assets/solar-hybrid-demo'), '/app/assets/solar-hybrid-demo');
  for (const value of ['//evil.invalid', 'https://evil.invalid', '/admin', '/api/v1/assets', '/app/assets/../../admin', '/app?role=admin', '/app/%2fadmin', undefined]) assert.equal(allowedReturnTo(value), '/app');
  assert.equal(platformAuthUrl('', '/app'), '');
  const target = new URL(platformAuthUrl('https://platform.example.invalid', '//evil.invalid'));
  assert.equal(target.pathname, '/auth');
  assert.equal(target.searchParams.get('returnTo'), '/app');
});

test('legacy private routes retain only the authorized destination, without private data', () => {
  assert.equal(legacyReturnTo('/dashboard/'), '/app');
  assert.equal(legacyReturnTo('/assets/'), '/app/assets');
  assert.equal(legacyReturnTo('/assets/solar-hybrid-demo/'), '/app/assets/solar-hybrid-demo');
  for (const value of ['/assets/private.pdf', '/admin', '/assets/../../admin', '/contact/', '/assets/gen-z-symbol.svg']) assert.equal(legacyReturnTo(value), null);
});

test('inquiry validation rejects missing, oversized, malformed and unsupported inputs', () => {
  assert.deepEqual(validateInquiry(valid), {});
  const errors = validateInquiry({ role:'admin', name:' ', email:'wrong', company:'x'.repeat(121), message:'short' });
  assert.deepEqual(Object.keys(errors).sort(), ['company','email','message','name','role']);
  assert.equal(Object.hasOwn(validateInquiry({ ...valid, message:'x'.repeat(2001) }), 'message'), true);
  assert.equal(inquiryPayload({ ...valid, name:' Operator ' }).name, 'Operator');
  assert.match(inquiryDraft(valid), /Asset owner \/ operator/);
});

test('missing inquiry endpoint never claims submission success', async () => {
  await assert.rejects(submitInquiry('', valid, 'request-1', () => assert.fail('must not call network')), /not connected/);
});

test('inquiry transport sends stable idempotency, no app cookie, and requires committed reference', async () => {
  const calls = [];
  const request = async (url, options) => { calls.push({ url, options }); return Response.json({ reference:'INQ-test-123' }, { status:201 }); };
  const receipt = await submitInquiry('https://platform.example.invalid/api/v1/inquiries', valid, 'same-request', request);
  await submitInquiry('https://platform.example.invalid/api/v1/inquiries', valid, 'same-request', request);
  assert.equal(receipt.reference, 'INQ-test-123');
  assert.equal(calls[0].options.headers['Idempotency-Key'], calls[1].options.headers['Idempotency-Key']);
  assert.equal(calls[0].options.credentials, 'omit');
  assert.deepEqual(JSON.parse(calls[0].options.body), valid);
  await assert.rejects(submitInquiry('/api', valid, 'id', async () => Response.json({ ok:true })), /valid reference/);
});

test('inquiry handles rate limits, server failure, malformed receipt and network uncertainty', async () => {
  for (const status of [400, 429, 500, 503]) await assert.rejects(submitInquiry('/api', valid, 'id', async () => new Response('', { status })));
  await assert.rejects(submitInquiry('/api', valid, 'id', async () => { throw new TypeError('Network unavailable'); }), /Network/);
  await assert.rejects(submitInquiry('/api', valid, 'id', async () => Response.json({ reference:'<script>' })), /valid reference/);
});

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes:true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory() ? (await files(new URL(`${entry.name}/`, directory))).map(child => `${entry.name}/${child}`) : [entry.name]))).flat();
}

test('original source assets and font licenses retain their migration fingerprints without the retired app', async () => {
  const assets = JSON.parse(await readFile(new URL('./fixtures/migrated-assets.json', import.meta.url), 'utf8'));
  for (const asset of assets.filter(asset => asset.path.startsWith('assets/'))) {
    const hash = createHash('sha256').update(await readFile(new URL('../' + asset.location, import.meta.url))).digest('hex');
    assert.equal(hash, asset.sha256, asset.path);
  }
  assert.equal(assets.length, 39);
});

test('marketing source does not depend on legacy, platform implementation, session login, or a second React root', async () => {
  const source = new URL('../src/', import.meta.url);
  for (const name of (await files(source)).filter(name => /\.(?:jsx?|tsx?|mjs|astro)$/.test(name))) {
    const text = await readFile(new URL(name, source), 'utf8');
    assert.doesNotMatch(text, /from\s+['"][^'"]*(?:landing\/|platform\/src)|sessionStorage|createRoot\(/, name);
  }
  const form = await readFile(new URL('../src/features/contact/ContactForm.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(form, /from\s+['"][^'"]*infrastructure|fetch\(|import\.meta\.env/);
});
