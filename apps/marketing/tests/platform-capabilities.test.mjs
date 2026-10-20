import test from 'node:test';
import assert from 'node:assert/strict';
import { platformAuthUrl, platformInquiryEndpoint, browserPlatformOrigin } from '../src/application/platform-links.mjs';

test('wallet auth handoff does not imply the inquiry backend exists', () => {
  const origin = 'http://localhost:3001';
  assert.equal(platformAuthUrl(origin), 'http://localhost:3001/auth?returnTo=%2Fapp');
  assert.equal(platformInquiryEndpoint(origin), '');
  assert.equal(platformInquiryEndpoint(origin, false), '');
  assert.equal(platformInquiryEndpoint(origin, true), 'http://localhost:3001/api/v1/inquiries');
  assert.equal(platformInquiryEndpoint('', true), '');
});

test('local previews recover the platform address without inventing a deployed origin', () => {
  for (const page of ['http://localhost:4340', 'http://127.0.0.1:4341', 'http://[::1]:4321']) assert.equal(browserPlatformOrigin('', page), 'http://localhost:3001');
  for (const page of ['https://marketing.example.invalid', 'http://localhost.evil.invalid:4340', 'http://192.168.1.10']) assert.equal(browserPlatformOrigin('', page), '');
  assert.equal(browserPlatformOrigin('https://app.example.invalid', 'http://localhost:4340'), 'https://app.example.invalid');
});
