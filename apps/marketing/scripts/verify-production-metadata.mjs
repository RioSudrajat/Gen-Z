import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const workspace = fileURLToPath(new URL('../../../', import.meta.url));
const output = new URL('../../../.cache/marketing-metadata/', import.meta.url);
const origin = 'https://marketing.example.invalid';
await mkdir(output, { recursive: true });
const args = [fileURLToPath(new URL('../../../node_modules/astro/bin/astro.mjs', import.meta.url)), 'build', '--root', 'apps/marketing', '--outDir', fileURLToPath(output)];
const child = spawn(process.execPath, args, {
  cwd: workspace, windowsHide: true,
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', PUBLIC_SITE_ORIGIN: origin, PUBLIC_PLATFORM_ORIGIN: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
child.stdout.on('data', data => { log += data; });
child.stderr.on('data', data => { log += data; });
await new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(log.slice(-5000))));
});
const html = path => readFile(new URL(path, output), 'utf8');
const home = await html('index.html');
const contact = await html('contact/index.html');
assert.ok(home.includes(`rel="canonical" href="${origin}/"`));
assert.ok(contact.includes(`rel="canonical" href="${origin}/contact/"`));
assert.ok(home.includes(`property="og:image" content="${origin}/assets/gen-z-video-poster.webp"`));
assert.ok(home.includes('application/ld+json') && home.includes('"@type":"Organization"'));
for (const path of ['auth', 'assets', 'dashboard']) {
  const page = await html(`${path}/index.html`);
  assert.ok(page.includes('noindex, nofollow'));
  assert.ok(!page.includes('rel="canonical"'));
}
const sitemap = await html('sitemap-0.xml');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(locations.sort(), [`${origin}/`, `${origin}/contact/`].sort());
assert.match(await html('robots.txt'), /Sitemap: https:\/\/marketing\.example\.invalid\/sitemap-index.xml/);
const report = { fixtureOrigin: origin, publicPages: locations, privateRoutesExcluded: true, canonical: true, socialImage: true, organization: true, robots: true };
await mkdir(new URL('../qa/astro-optimization/', import.meta.url), { recursive: true });
await writeFile(new URL('../qa/astro-optimization/metadata.json', import.meta.url), JSON.stringify(report, null, 2));
console.log('PASS configured production metadata, sitemap, robots and noindex handoff boundaries (synthetic .invalid origin)');
