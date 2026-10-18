import test from 'node:test';
import assert from 'node:assert/strict';
import { withImageRetry } from '../src/assets/image-url.mjs';

test('image retry preserves Astro dev transform parameters and works with production asset paths', () => {
  const source = '/_image?href=%2Fsrc%2Fassets%2Fsolar.webp&w=800&q=80';
  assert.equal(withImageRetry(source, 0), source);
  const retry = new URL(withImageRetry(source, 2), 'https://fixture.invalid');
  assert.equal(retry.searchParams.get('href'), '/src/assets/solar.webp');
  assert.equal(retry.searchParams.get('w'), '800');
  assert.equal(retry.searchParams.get('q'), '80');
  assert.equal(retry.searchParams.get('retry'), '2');
  assert.equal(withImageRetry('/_astro/solar.hash.webp', 1), '/_astro/solar.hash.webp?retry=1');
});
