import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const label = process.argv[2] || 'after';
assert.match(label, /^[a-z-]+$/);
const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4321';
const output = new URL('../qa/astro-optimization/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true, args: ['--no-proxy-server'],
});
const results = { label, origin, pages: [], sections: [] };
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const route of ['/', '/contact/']) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.setCacheEnabled(false);
      await page.evaluateOnNewDocument(() => {
        window.__metrics = { lcp: 0, cls: 0 };
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(origin + route, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await delay(1200);
      results.pages.push(await page.evaluate(({ route, viewport }) => {
        const resources = performance.getEntriesByType('resource');
        const scripts = resources.filter(resource => /\.m?js(?:\?|$)/.test(resource.name));
        return {
          route, viewport, ...window.__metrics,
          javascriptBytes: scripts.reduce((sum, resource) => sum + resource.encodedBodySize, 0),
          scripts: scripts.map(resource => ({ name: new URL(resource.name).pathname, bytes: resource.encodedBodySize })),
          fonts: resources.filter(resource => /\.(?:woff2?|ttf)(?:\?|$)/.test(resource.name)).map(resource => ({ name: new URL(resource.name).pathname, bytes: resource.encodedBodySize })),
          htmlBytes: new TextEncoder().encode(document.documentElement.outerHTML).length,
          cssBytes: [...document.querySelectorAll('style')].reduce((sum, element) => sum + new TextEncoder().encode(element.textContent).length, 0),
          islands: [...document.querySelectorAll('astro-island')].map(element => ({ name: element.getAttribute('component-export'), client: element.getAttribute('client'), hydrated: !element.hasAttribute('ssr') })),
        };
      }, { route, viewport }));
      if (route === '/') {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        for (const id of await page.$$eval('main>section', sections => sections.map(section => section.id))) {
          await page.$eval('#' + id, element => element.scrollIntoView({ behavior: 'instant' }));
          await delay(250);
        }
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
        await page.evaluate(() => document.fonts.ready);
        const sections = await page.$$eval('main>section', sections => sections.map(section => ({ id: section.id, text: section.innerText.replace(/Loading [^\n]+|Loading image…/g, '').replace(/\s+/g, ' ').trim() })));
        if (viewport.width === 1440) results.sections = sections;
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await delay(300);
        await page.screenshot({ path: fileURLToPath(new URL(`${label}-${viewport.width}.png`, output)), fullPage: true });
      }
      await page.close();
    }
  }
  if (label === 'after') {
    const before = JSON.parse(await readFile(new URL('before.json', output), 'utf8'));
    assert.deepEqual(results.sections, before.sections, 'all section copy must remain identical');
    console.log('PASS all public section copy matches the pre-optimization baseline');
  }
  await writeFile(new URL(`${label}.json`, output), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.pages.map(({ scripts, islands, ...page }) => ({ ...page, hydrated: islands.filter(island => island.hydrated).length, islands: islands.length })), null, 2));
} finally { await browser.close(); }
