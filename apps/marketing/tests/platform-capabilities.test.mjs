import test from 'node:test';
import assert from 'node:assert/strict';
import { platformAuthUrl, platformInquiryEndpoint } from '../src/application/platform-links.mjs';

test('wallet auth handoff does not imply the inquiry backend exists', () => {
  const origin = 'http://localhost:3001';
  assert.equal(platformAuthUrl(origin), 'http://localhost:3001/auth?returnTo=%2Fapp');
  assert.equal(platformInquiryEndpoint(origin), '');
  assert.equal(platformInquiryEndpoint(origin, false), '');
  assert.equal(platformInquiryEndpoint(origin, true), 'http://localhost:3001/api/v1/inquiries');
  assert.equal(platformInquiryEndpoint('', true), '');
});
