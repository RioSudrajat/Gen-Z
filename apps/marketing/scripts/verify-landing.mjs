import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';

const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4321';
const output = new URL('landing-consistency/', new URL(process.env.MARKETING_QA_ROOT || '../qa/', import.meta.url));
await mkdir(output, { recursive: true });
const checks = [];
const errors = [];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-proxy-server'] });
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
const pass = (name, evidence) => { checks.push({ name, evidence }); console.log('PASS ' + name); };
async function load(path = '/') {
  await page.goto(origin + path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (path === '/') await page.waitForSelector('.nav-shell');
}
async function screenshot(name) { await page.screenshot({ path: fileURLToPath(new URL(name + '.png', output)) }); }
async function overflow() {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'horizontal page overflow');
}
async function audit(name) {
  const result = await new AxePuppeteer(page).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  assert.deepEqual(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) })), [], name);
  pass(name, 'axe reports no A/AA violations; manual checks supplement automation');
}
try {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewport({ width, height: 900 }); await load();
    await page.$eval('#ecosystem', element => element.scrollIntoView());
    await page.waitForFunction(() => !document.querySelector('#ecosystem astro-island')?.hasAttribute('ssr'));
    const rails = await page.$$eval('main>.landing-section>.page-container', elements => elements.map(element => {
      const box = element.getBoundingClientRect(); return { section: element.closest('section').id, left: box.left, right: box.right };
    }));
    assert.ok(rails.every(rail => Math.abs(rail.left - rails[0].left) < 1 && Math.abs(rail.right - rails[0].right) < 1), JSON.stringify(rails));
    const fonts = await page.$$eval('#ecosystem-title,.serve-copy h3,.serve-description,.serve-cta', elements => elements.map(element => getComputedStyle(element).fontFamily));
    assert.ok(fonts.every(font => font.includes('GenZ')), JSON.stringify(fonts));
    await overflow(); await screenshot('audience-' + width);
    pass('shared container and Gen-Z fonts at ' + width, rails);
    for (const route of ['/insights/', '/insights/energy-demand/']) {
      await load(route); await overflow();
      assert.equal(await page.$$eval('h1', elements => elements.length), 1);
      if (width === 390 || width === 1440) { await screenshot((route === '/insights/' ? 'insights-' : 'article-') + width); await audit(route + ' ' + width); }
    }
  }
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await load();
  await page.mouse.move(1100, 700);
  await page.mouse.wheel({ deltaY: 60 }); await delay(2100);
  const hero = await page.$eval('.hero-story', element => ({ end: element.offsetHeight - innerHeight, y: scrollY, frame: document.querySelector('.hero-frame').getBoundingClientRect().width }));
  assert.ok(Math.abs(hero.y - hero.end) < 5 && hero.frame < 600, JSON.stringify(hero));
  await screenshot('hero-settled'); pass('one short wheel input settles hero', hero);
  await page.mouse.wheel({ deltaY: -60 }); await delay(2100);
  assert.ok(await page.evaluate(() => scrollY < 5));
  await page.mouse.wheel({ deltaY: 60 }); await delay(550);
  await page.mouse.wheel({ deltaY: -100 }); await delay(2200);
  assert.ok(await page.evaluate(() => scrollY < 5), 'reverse input interrupts hero settling');
  pass('hero reverses and accepts interruption', 'returns to opening state');

  for (const [id, pin, count] of [['assets', '.capital-scroll-pin', 3], ['stack', '.stack-scroll-pin', 4]]) {
    await page.$eval('#' + id, element => element.scrollIntoView({ behavior: 'instant' }));
    await page.waitForSelector('#' + id + '.has-pinned-sequence');
    await delay(700);
    await page.$eval('#' + id + ' ' + pin, element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY + 2, behavior: 'instant' }));
    await delay(700);
    await page.waitForFunction(pin => Number(document.querySelector(pin).dataset.sequenceProgress) > 0, {}, pin);
    await page.mouse.wheel({ deltaY: 60 }); await delay(2300);
    const progress = await page.$eval(pin, element => Number(element.dataset.sequenceProgress));
    assert.ok(Math.abs(progress - .9 / (count - .1)) < .025, `${id}: ${progress}`);
    await delay(900);
    assert.ok(Math.abs(await page.$eval(pin, element => Number(element.dataset.sequenceProgress)) - progress) < .005, 'settling must not trigger another beat');
    await screenshot(id + '-first-beat');
    await page.mouse.wheel({ deltaY: 60 }); await delay(2300);
    assert.ok(Math.abs(await page.$eval(pin, element => Number(element.dataset.sequenceProgress)) - 1.9 / (count - .1)) < .025);
    await page.mouse.wheel({ deltaY: -60 }); await delay(2300);
    assert.ok(Math.abs(await page.$eval(pin, element => Number(element.dataset.sequenceProgress)) - .9 / (count - .1)) < .025);
    pass(id + ' settles one beat, holds for reading, advances and reverses', progress);
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await delay(400);
  assert.equal(await page.$$('.has-pinned-sequence').then(elements => elements.length), 0);
  assert.equal(await page.$eval('#energy-thesis-film', film => film.paused), true);
  pass('live reduced-motion switch removes pinning and pauses media', 'static content remains available');

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await load();
  await page.$eval('#energy-context', element => element.scrollIntoView());
  await page.waitForFunction(() => !document.querySelector('#energy-thesis-film').paused);
  await page.focus('#thesis-toggle'); await page.keyboard.press('Enter');
  assert.equal(await page.$eval('#energy-thesis-film', film => film.paused), true);
  assert.equal(await page.$eval('#thesis-toggle', button => button.textContent), 'Play film');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => !document.querySelector('#energy-thesis-film').paused);
  pass('adjacent film pause and play work from keyboard', 'same controller as Resources menu');
  await page.setRequestInterception(true);
  const failFilm = request => request.url().includes('gen-z-energy-thesis-v2.mp4') ? request.respond({ status: 503, body: '' }) : request.continue();
  page.on('request', failFilm); await page.setCacheEnabled(false); await load();
  await page.$eval('#energy-context', element => element.scrollIntoView());
  await page.waitForFunction(() => !document.querySelector('#thesis-film-status').hidden);
  assert.ok(await page.$('.thesis-reading-link a[href="/insights/energy-demand/"]'));
  await screenshot('film-fallback');
  pass('failed film retains a visible route to transcript and data', '503 -> static fallback and article link');
  page.off('request', failFilm); await page.setRequestInterception(false);
  await page.setViewport({ width: 720, height: 450 });
  await load('/insights/energy-demand/'); await overflow();
  await screenshot('article-zoom-equivalent');
  pass('article reflows at 200-percent desktop zoom equivalent', '720 by 450 CSS viewport');
  assert.deepEqual(errors, []);
} finally {
  await writeFile(new URL('report.json', output), JSON.stringify({ checks, errors }, null, 2));
  await browser.close();
}
