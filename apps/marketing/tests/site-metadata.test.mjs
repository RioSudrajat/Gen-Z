import test from 'node:test';
import assert from 'node:assert/strict';
import { marketingOrigin, publicMetadata, robotsText } from '../src/application/site-metadata.mjs';

test('marketing deployment URLs reject invalid origins and never invent a production domain', () => {
  assert.equal(marketingOrigin(), '');
  assert.equal(publicMetadata('', '/'), null);
  assert.equal(marketingOrigin(' https://marketing.example.invalid/ '), 'https://marketing.example.invalid');
  assert.equal(marketingOrigin('http://127.0.0.1:4321'), 'http://127.0.0.1:4321');
  for (const value of ['//evil.invalid', 'javascript:alert(1)', 'http://marketing.example.invalid', 'https://name:secret@example.invalid', 'https://example.invalid/path', 'https://example.invalid/?x=1', 'https://example.invalid/#test']) assert.throws(() => marketingOrigin(value));
});

test('canonical and crawler metadata include only public marketing routes', () => {
  const origin = 'https://marketing.example.invalid';
  assert.equal(publicMetadata(origin, '/contact').canonical, origin + '/contact/');
  assert.equal(publicMetadata(origin, '/insights').canonical, origin + '/insights/');
  assert.equal(publicMetadata(origin, '/insights/energy-demand/').canonical, origin + '/insights/energy-demand/');
  assert.equal(publicMetadata(origin, '/').image, origin + '/assets/gen-z-video-poster.webp');
  for (const route of ['/auth/', '/dashboard/', '/assets/', '/app', '/404.html']) assert.equal(publicMetadata(origin, route), null);
  assert.equal(publicMetadata(origin, '/', true), null);
  assert.match(robotsText(origin), /Sitemap: https:\/\/marketing\.example\.invalid\/sitemap-index.xml/);
  assert.doesNotMatch(robotsText(), /Sitemap|example|localhost/);
});
