import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4321';
const output = new URL('comparison-motion/', new URL(process.env.MARKETING_QA_ROOT || '../qa/', import.meta.url));
await mkdir(output, { recursive: true });
const checks = [];
const errors = [];
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-proxy-server'],
});
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
const pass = (name, evidence) => {
  checks.push({ name, evidence });
  console.log(`PASS ${name}`);
};
async function load(path = '/') {
  await page.goto(origin + path, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => !document.querySelector('#comparison astro-island')?.hasAttribute('ssr'));
  await page.evaluate(() => document.fonts.ready);
}
async function sample() {
  return page.evaluate(() => {
    const panels = document.querySelector('.comparison-panels');
    const read = selector => {
      const element = document.querySelector(selector);
      const style = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(style.transform);
      return { x: matrix.m41, y: matrix.m42, opacity: Number(style.opacity), width: element.getBoundingClientRect().width };
    };
    return {
      top: panels.getBoundingClientRect().top,
      traditional: read('.comparison-traditional'),
      connected: read('.comparison-connected'),
      rows: [...document.querySelectorAll('.comparison-connected .comparison-row')].map(row => Number(getComputedStyle(row).opacity)),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
}
async function position(ratio) {
  await page.evaluate(ratio => {
    const panels = document.querySelector('.comparison-panels');
    window.scrollTo({ top: panels.getBoundingClientRect().top + scrollY - innerHeight * ratio, behavior: 'instant' });
  }, ratio);
  await delay(700);
  return sample();
}
async function desktop(label) {
  const initial = await position(1.1);
  assert.ok(initial.traditional.x > initial.traditional.width * 0.5, `${label} direct entry starts stacked: ${JSON.stringify(initial)}`);
  // Downstream measurements remain stable after independently hydrated islands settle.
  await page.$eval('#ecosystem', element => element.scrollIntoView({ behavior: 'instant' }));
  await page.waitForFunction(() => document.fonts.check('500 36px "GenZ Display"') && document.fonts.check('500 18px "GenZ UI"'));
  await page.evaluate(() => window.dispatchEvent(new Event('genz:layout-ready')));
  const closed = await position(1.1);
  assert.ok(closed.traditional.x > closed.traditional.width * 0.5, `${label} starts stacked: ${JSON.stringify(closed)}`);
  assert.equal(closed.connected.opacity, 0);
  const middle = await position(0.65);
  assert.ok(middle.traditional.x > 0 && middle.traditional.x < closed.traditional.x);
  assert.ok(middle.connected.opacity > 0 && middle.connected.opacity < 1);
  await page.screenshot({ path: fileURLToPath(new URL(`${label}-opening.png`, output)) });
  const opened = await position(0.2);
  assert.ok(Math.abs(opened.traditional.x) < 1 && Math.abs(opened.connected.x) < 1);
  assert.equal(opened.connected.opacity, 1);
  assert.ok(opened.rows.every(opacity => opacity === 1));
  assert.equal(opened.overflow, false);
  const reverse = await position(0.65);
  assert.ok(Math.abs(reverse.traditional.x - middle.traditional.x) < 2);
  assert.ok(Math.abs(reverse.connected.opacity - middle.connected.opacity) < 0.02);
  await position(1.1);
  await page.mouse.wheel({ deltaY: Math.round(await page.evaluate(() => innerHeight * 0.45)) });
  await delay(1400);
  const wheel = await sample();
  assert.ok(wheel.connected.opacity > 0 && wheel.connected.opacity < 1, 'Lenis wheel opens the panels');
  await page.mouse.wheel({ deltaY: -Math.round(await page.evaluate(() => innerHeight * 0.45)) });
  await delay(1400);
  assert.equal((await sample()).connected.opacity, 0, 'wheel reverses the opening');
  pass(label + ' stacked → opening → open → reverse, including wheel and late layout refresh', { closed, middle, opened, reverse, wheel });
}
try {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1176, height: 1339 }, { width: 768, height: 1024 }]) {
    await page.setViewport(viewport);
    await load();
    await desktop(`${viewport.width}x${viewport.height}`);
  }
  await load('/#comparison');
  await desktop('deep-link');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await delay(400);
  for (const ratio of [1.1, 0.65, 0.2]) {
    const state = await position(ratio);
    assert.ok(Math.abs(state.traditional.x) < 1 && Math.abs(state.connected.x) < 1);
    assert.equal(state.connected.opacity, 1);
    assert.ok(state.rows.every(opacity => opacity === 1));
  }
  pass('live reduced-motion change restores readable static panels', await sample());
  for (const width of [390, 320]) {
    await page.setViewport({ width, height: 844 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await load();
    await page.$eval('.comparison-traditional', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.comparison-traditional')).opacity === '1', { timeout: 5000 });
    let state = await sample();
    assert.equal(state.traditional.x, 0);
    assert.equal(state.traditional.opacity, 1);
    await page.$eval('.comparison-connected', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.comparison-connected')).opacity === '1', { timeout: 5000 });
    state = await sample();
    assert.equal(state.connected.x, 0);
    assert.equal(state.connected.opacity, 1);
    assert.equal(state.overflow, false);
    await page.screenshot({ path: fileURLToPath(new URL(`mobile-${width}.png`, output)) });
    pass(`mobile ${width} vertical reveal and readable panels`, state);
  }
  await page.setViewport({ width: 1440, height: 900 });
  await delay(700);
  await desktop('resize-mobile-to-desktop');
  assert.deepEqual(errors, []);
  pass('no runtime or hydration errors', errors);
} finally {
  await writeFile(new URL('results.json', output), JSON.stringify({ origin, checks, errors }, null, 2));
  await browser.close();
}
