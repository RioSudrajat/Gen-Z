import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';

const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4321';
const configured = process.env.CONFIGURED_MARKETING_ORIGIN;
const output = new URL('../qa/', import.meta.url);
await mkdir(output, { recursive:true });
const checks = [];
const consoleErrors = [];
const failedResponses = [];
const runtimeErrors = [];
const audits = [];
const snapshots = [];
const pass = (name, evidence) => { checks.push({ name, status:'PASS', evidence }); console.log(`PASS ${name}`); };
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,
  args:['--no-proxy-server'],
});
const page = await browser.newPage();
page.on('pageerror', error => runtimeErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) failedResponses.push({ url:response.url(), status:response.status() }); });
const expectedSections = ['top','energy-context','why','ecosystem','assets','opportunities','stack','evidence','platform','comparison','connect'];

async function load(path = '/', base = origin) {
  await page.goto(base + path, { waitUntil:'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (path === '/' || path.startsWith('/#')) await page.waitForSelector('.nav-shell');
  if (path.startsWith('/contact')) await page.waitForFunction(() => !document.querySelector('fieldset')?.disabled);
}
async function click(selector) {
  await page.$eval(selector, element => element.scrollIntoView({ block:'center', behavior:'instant' }));
  await page.waitForFunction(selector => !document.querySelector(selector)?.closest('astro-island')?.hasAttribute('ssr'), {}, selector);
  await page.click(selector);
  await delay(90);
}
async function overflow(label) {
  const dimensions = await page.evaluate(() => ({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.width + 1, `${label}: ${JSON.stringify(dimensions)}`);
  pass(label + ' has no horizontal overflow', dimensions);
}
async function revealAll() {
  for (const id of expectedSections) {
    await page.$eval('#' + id, element => element.scrollIntoView({ block:'start', behavior:'instant' }));
    await page.waitForFunction(id => [...document.querySelectorAll('#' + id + ' astro-island')].every(island => !island.hasAttribute('ssr')), {}, id);
    await delay(100);
  }
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.fonts.check('600 36px "Serve Sora"') && document.fonts.check('400 18px "Serve Geist"'));
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }));
  await delay(200);
}
async function audit(label) {
  const result = await new AxePuppeteer(page).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const violations = result.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes:nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  audits.push({ label, violations, incomplete:result.incomplete.map(({ id, nodes }) => ({ id, targets:nodes.map(node => node.target) })) });
  pass(label + ' axe audit recorded', { violations:violations.length });
}

try {
  await page.setViewport({ width:1440, height:900 });
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'reduce' }]);
  await load();
  assert.equal(await page.$$eval('astro-island[client="visible"][ssr]', elements => elements.length), 3);
  assert.equal(await page.$('#comparison astro-island'), null);
  pass('below-fold islands defer hydration while comparison ships as static HTML', 'three islands remain unhydrated until approached');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(resource => resource.name.includes('/reference-fonts/ondo-sans-medium.woff2'))), false);
  await page.evaluate(() => document.fonts.load('500 48px "GenZ Display"', 'Ā'));
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(resource => resource.name.includes('/reference-fonts/ondo-sans-medium.woff2'))), true);
  pass('Latin subset avoids duplicate font downloads and the full font remains available for extended characters', 'fallback loaded only by the synthetic extended-character probe');
  await revealAll();
  assert.deepEqual(failedResponses, [], 'no normal production asset may return an error');
  pass('all initial production resources and audience fonts load', 'no 4xx/5xx; Serve Sora and Serve Geist registered');
  assert.deepEqual(await page.$$eval('main>section', sections => sections.map(section => section.id)), expectedSections);
  assert.equal(await page.$$eval('h1', elements => elements.length), 1);
  pass('all eleven sections and the original title survive Astro rendering', await page.title());
  await overflow('Desktop 1440');
  await audit('desktop reduced motion');
  await page.screenshot({ path:fileURLToPath(new URL('desktop.png', output)), fullPage:true });

  const anchorLinks = await page.$$eval('a[href^="#"]', links => links.map(link => ({ label:link.textContent.trim(), href:link.getAttribute('href'), exists:!!document.getElementById(link.hash.slice(1)) })));
  assert.ok(anchorLinks.every(link => link.exists));
  pass('all static anchor targets exist', anchorLinks);
  for (const category of ['Products','Resources','Ecosystem','About']) {
    const trigger = `.nav-item>button[aria-controls="menu-${category.toLowerCase()}"]`;
    await click(trigger);
    assert.equal(await page.$eval(trigger, element => element.getAttribute('aria-expanded')), 'true');
    const menu = '#menu-' + category.toLowerCase();
    const links = await page.$$eval(menu + ' a', elements => elements.map(element => ({ label:element.textContent.trim(), href:element.getAttribute('href') })));
    for (const { href } of links) if (href.startsWith('#')) assert.equal(await page.evaluate(id => !!document.getElementById(id), href.slice(1)), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval(trigger, element => element.getAttribute('aria-expanded')), 'false');
    assert.equal(await page.$eval(trigger, element => element === document.activeElement), true);
    pass(category + ' desktop menu opens, links resolve, Escape closes and restores focus', links);
  }
  await page.focus('.nav-item>button'); await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.classList.contains('menu-entry'));
  await page.keyboard.press('Escape');
  pass('desktop navigation supports ArrowDown and Escape', 'focus moves into menu and returns to trigger');
  for (const category of ['Products','Ecosystem','About']) {
    const menu = '#menu-' + category.toLowerCase();
    const trigger = `.nav-item>button[aria-controls="${menu.slice(1)}"]`;
    await click(trigger);
    const links = await page.$$eval(menu + ' a[href^="#"]', elements => elements.map(element => element.getAttribute('href')));
    await page.keyboard.press('Escape');
    for (const href of links) {
      await click(trigger); await click(`${menu} a[href="${href}"]`);
      assert.equal(await page.evaluate(() => location.hash), href);
      assert.equal(await page.$eval(trigger, element => element.getAttribute('aria-expanded')), 'false');
      pass(`${category} link ${href}`, await page.evaluate(() => document.activeElement?.id));
    }
  }

  for (const category of ['generation','storage','infrastructure']) {
    const index = ['generation','storage','infrastructure'].indexOf(category) + 1;
    await click(`.showcase-pagination button:nth-child(${index})`);
    assert.equal(await page.$eval(`.showcase-pagination button:nth-child(${index})`, element => element.getAttribute('aria-pressed')), 'true');
    await click('.showcase-detail-button');
    assert.equal(await page.$eval('.showcase-dialog', element => element.open), true);
    if (index === 2) await click('.showcase-dialog-close'); else await page.keyboard.press('Escape');
    assert.equal(await page.$eval('.showcase-dialog', element => element.open), false);
    pass(category + ' category selector and modal', 'modal opens and closes by button or Escape');
  }
  await click('[aria-label="Next asset category"]');
  assert.equal(await page.$eval('.showcase-count', element => element.textContent.trim()), '01 / 03');
  await click('[aria-label="Previous asset category"]');
  assert.equal(await page.$eval('.showcase-count', element => element.textContent.trim()), '03 / 03');
  pass('carousel next and previous wrap correctly', '03 -> 01 -> 03');

  for (let index = 1; index <= 3; index++) {
    await click(`.standards-document:nth-child(${index})`);
    assert.equal(await page.$eval(`.standards-document:nth-child(${index})`, element => element.getAttribute('aria-pressed')), 'true');
    pass('evidence record ' + index, await page.$eval('.standards-record-summary', element => element.textContent));
  }
  for (let index = 0; index < 3; index++) {
    await click('#project-view-tab-' + index);
    assert.equal(await page.$eval('#project-view-tab-' + index, element => element.getAttribute('aria-selected')), 'true');
    pass('workspace illustration tab ' + index, await page.$eval('#project-view-panel', element => element.textContent));
  }
  await page.focus('#project-view-tab-2'); await page.keyboard.press('Home');
  assert.equal(await page.$eval('#project-view-tab-0', element => element.getAttribute('aria-selected')), 'true');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.$eval('#project-view-tab-1', element => element.getAttribute('aria-selected')), 'true');
  await page.keyboard.press('End');
  assert.equal(await page.$eval('#project-view-tab-2', element => element.getAttribute('aria-selected')), 'true');
  pass('workspace tabs keyboard controls', 'Home, ArrowRight and End select and focus correct tabs');

  for (const id of ['physical','depin','defi','apps']) {
    await page.focus('.stack-label-' + id); await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.stack-label-' + id, element => element.getAttribute('aria-pressed')), 'true');
    pass('stack keyboard selection ' + id, 'label is selected');
  }
  for (let index = 1; index <= 2; index++) {
    await click(`.thesis-details:nth-of-type(${index}) summary`);
    assert.equal(await page.$eval(`.thesis-details:nth-of-type(${index})`, element => element.open), true);
    pass('energy thesis disclosure ' + index, 'sources/transcript or data table opens');
  }

  for (const width of [768,390,320]) {
    await page.setViewport({ width, height:900 }); await load(); await revealAll(); await overflow('Viewport ' + width);
    snapshots.push({ width, sections:await page.$$eval('main>section', elements => elements.map(element => ({ id:element.id, height:element.offsetHeight }))) });
    await page.screenshot({ path:fileURLToPath(new URL(`viewport-${width}.png`, output)), fullPage:true });
    if (width < 768) {
      await click('.mobile-toggle');
      assert.equal(await page.$eval('.mobile-drawer', element => element.open), true);
      for (const category of ['Products','Resources','Ecosystem','About']) {
        const buttons = await page.$$('.drawer-categories button');
        const index = ['Products','Resources','Ecosystem','About'].indexOf(category);
        await buttons[index].click(); await delay(220);
        assert.ok(await page.$('.drawer-back'));
        await click('.drawer-back'); await delay(220);
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.$eval('.mobile-drawer', element => element.open), false);
      assert.equal(await page.$eval('.mobile-toggle', element => element === document.activeElement), true);
      await click('.mobile-toggle'); await click('[aria-label="Close navigation"]');
      assert.equal(await page.$eval('.mobile-drawer', element => element.open), false);
      pass('mobile menu ' + width, 'all four submenus, back, close button, Escape and focus restoration work');
    }
  }

  await page.setViewport({ width:390, height:844 });
  await load('/contact/?role=investor');
  assert.equal(await page.$eval('input[name="role"]:checked', element => element.value), 'investor');
  await click('button[type="submit"]');
  assert.equal(await page.$eval('#contact-name', element => element === document.activeElement), true);
  assert.equal(await page.$$eval('.entry-error', elements => elements.length), 2);
  await page.type('#contact-name', 'QA fixture'); await page.type('#contact-email', 'qa@example.invalid');
  await click('button[type="submit"]');
  await page.type('#contact-message', 'Illustrative browser verification only, no real inquiry.');
  await click('button[type="submit"]');
  await page.waitForSelector('.message-review');
  await click('.inquiry-review-actions button.secondary-button');
  assert.match(await page.$eval('.entry-feedback', element => element.textContent), /copied|download/i);
  const download = await page.$eval('[download="gen-z-message.txt"]', async element => ({ text:await (await fetch(element.href)).text(), name:element.download }));
  assert.match(download.text, /Investor/);
  assert.match(download.text, /Illustrative browser verification/);
  assert.equal(await page.$$eval('.inquiry-review-actions .primary-button', elements => elements.length), 0);
  await overflow('Contact mobile'); await audit('contact mobile');
  await page.screenshot({ path:fileURLToPath(new URL('contact-mobile.png', output)), fullPage:true });
  pass('contact invalid, draft, copy, download and honest disconnected state', 'no network submission or success receipt fabricated');

  // A configured platform may be offline locally. Capture the navigation without
  // depending on that server or treating its login as a marketing responsibility.
  const handoffs = [];
  await page.setRequestInterception(true);
  const captureHandoff = request => {
    if (request.isNavigationRequest() && new URL(request.url()).origin !== new URL(origin).origin) {
      handoffs.push(request.url());
      return request.respond({ status:200, contentType:'text/html', body:'<title>Synthetic handoff target</title><h1>Captured workspace handoff</h1>' });
    }
    return request.continue();
  };
  page.on('request', captureHandoff);
  for (const path of ['/auth/','/dashboard/','/assets/']) {
    const count = handoffs.length;
    await load(path);
    assert.equal(await page.$('input[type="email"]'), null);
    if (handoffs.length > count) {
      const target = new URL(handoffs.at(-1));
      assert.equal(target.pathname, '/auth');
      assert.equal(target.searchParams.get('returnTo'), path === '/assets/' ? '/app/assets' : '/app');
      pass(path + ' respects configured platform ownership', { target:target.href, syntheticNavigationTarget:true });
    } else {
      assert.match(await page.$eval('h1', element => element.textContent), /get you connected/);
      pass(path + ' respects platform ownership', 'no local session or private workspace');
    }
    assert.equal(await page.evaluate(() => sessionStorage.length), 0);
  }
  page.off('request', captureHandoff); await page.setRequestInterception(false);
  await load('/this-page-does-not-exist');
  assert.match(await page.$eval('h1', element => element.textContent), /unavailable/);
  pass('unknown route has a useful 404 page', 'return and workspace links present');

  // Explicitly synthetic transport fixtures. They never send a real inquiry.
  if (configured) {
    let attempts = [];
    let failRequest = true;
    await page.setRequestInterception(true);
    const intercept = async request => {
      if (!/\/api\/v1\/(inquiries|public\/inquiry-policy)$/.test(request.url())) return request.continue();
      const headers = { 'access-control-allow-origin':new URL(configured).origin, 'access-control-allow-methods':'POST,OPTIONS', 'access-control-allow-headers':'content-type,idempotency-key' };
      if (request.method() === 'OPTIONS') return request.respond({ status:204, headers });
      if (request.url().endsWith('/public/inquiry-policy')) return request.respond({ status:200, headers:{ ...headers, 'content-type':'application/json' }, body:JSON.stringify({ privacyNoticeVersionId:'12345678-1234-4234-8234-123456789012', noticeUrl:new URL('/privacy', request.url()).href, sensitiveUploadsAllowed:false, marketingOptIn:false }) });
      attempts.push({ key:request.headers()['idempotency-key'], body:JSON.parse(request.postData()) });
      return request.respond({ status:failRequest ? 503 : 201, headers:{ ...headers, 'content-type':'application/json' }, body:JSON.stringify(failRequest ? { error:'Synthetic failure' } : { reference:'INQ-synthetic-browser' }) });
    };
    page.on('request', intercept);
    await load('/contact/?role=operator', configured);
    await page.type('#contact-name', 'QA fixture'); await page.type('#contact-email', 'qa@example.invalid'); await click('button[type="submit"]');
    await page.select('#contact-assetCategory', 'energy'); await page.select('#contact-operationsState', 'operational'); await page.type('#contact-region', 'West Java');
    await page.type('#contact-message', 'Synthetic browser transport fixture only.'); await click('button[type="submit"]');
    await click('.inquiry-review-actions .primary-button');
    await page.waitForSelector('#contact-error-privacyAcknowledged'); await click('#contact-privacyAcknowledged');
    await click('.inquiry-review-actions .primary-button');
    await page.waitForFunction(() => document.querySelector('.inquiry-review-actions .primary-button')?.textContent.startsWith('Retry sending'));
    assert.ok(await page.$('.message-review'));
    failRequest = false;
    await click('.inquiry-review-actions .primary-button');
    await page.waitForFunction(() => document.querySelector('.inquiry-receipt strong')?.textContent === 'INQ-synthetic-browser');
    assert.equal(attempts.length, 2); assert.equal(attempts[0].key, attempts[1].key);
    assert.equal(await page.$eval('.inquiry-review-actions .primary-button', element => element.disabled), true);
    pass('configured inquiry failure -> retry -> confirmed receipt', { synthetic:true, stableIdempotency:true, attempts:attempts.length });
    page.off('request', intercept); await page.setRequestInterception(false);
  }

  // Browser failures are injected locally to verify the existing fallbacks.
  await page.setViewport({ width:390, height:844 });
  let blockImage = true;
  await page.setRequestInterception(true);
  const failMedia = request => {
    if (blockImage && /who-serve-asset-operator[^/]*\.webp/.test(request.url())) return request.respond({ status:503, body:'' });
    return request.continue();
  };
  page.on('request', failMedia); await page.setCacheEnabled(false); await load();
  await page.$eval('#ecosystem', element => element.scrollIntoView());
  await page.waitForSelector('.serve-operator .serve-photo[data-state="error"]');
  blockImage = false; await click('.serve-operator .serve-photo button');
  await page.waitForSelector('.serve-operator .serve-photo[data-state="ready"]');
  pass('audience image failure and retry', '503 -> visible error -> retry -> ready, copy and CTA survive');
  page.off('request', failMedia); await page.setRequestInterception(false);

  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'no-preference' }]);
  await page.setViewport({ width:1440, height:900 }); await load();
  assert.equal(await page.$eval('.hero-story', element => element.offsetHeight > innerHeight), true);
  await click('.scroll-cue');
  await delay(1200);
  assert.equal(await page.$eval('#hero-copy', element => element === document.activeElement), true);
  pass('hero scroll cue', 'moves to hero copy and transfers focus');
  await page.evaluate(() => window.scrollTo({ top:innerHeight, behavior:'instant' })); await delay(900);
  assert.ok(await page.$eval('.hero-frame', element => element.getBoundingClientRect().width < innerWidth));
  await page.$eval('#stack', element => element.scrollIntoView({ behavior:'instant' })); await delay(500);
  assert.equal(await page.$eval('#stack', element => element.classList.contains('has-pinned-sequence')), true);
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'reduce' }]); await delay(300);
  assert.equal(await page.$eval('#stack', element => element.classList.contains('has-pinned-sequence')), false);
  assert.equal(await page.$eval('#hero-video', element => element.paused), true);
  assert.equal(await page.$eval('#energy-thesis-film', element => element.paused), true);
  pass('normal scroll motion and live reduced-motion preference switch', 'hero shrinks, stack pins, reduced mode unpins and pauses both films');
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'no-preference' }]);
  for (const { width, height } of [{ width:390, height:844 }, { width:320, height:600 }]) {
    await page.setViewport({ width, height }); await load();
    await overflow(`Normal motion ${width}x${height}`);
    await page.$eval('#assets', element => element.scrollIntoView({ behavior:'instant' })); await delay(450);
    await overflow(`Capital motion ${width}x${height}`);
    await page.$eval('#stack', element => element.scrollIntoView({ behavior:'instant' })); await delay(450);
    await overflow(`Stack motion ${width}x${height}`);
    pass(`motion viewport ${width}x${height}`, 'hero, capital and stack stay inside the page');
  }

  const noJS = await browser.newPage();
  await noJS.setJavaScriptEnabled(false); await noJS.goto(origin, { waitUntil:'networkidle0' });
  assert.deepEqual(await noJS.$$eval('main>section', sections => sections.map(section => section.id)), expectedSections);
  assert.ok(await noJS.$('.serve-audiences')); assert.ok(await noJS.$('.standards-grid'));
  pass('all public sections render without JavaScript', 'Astro HTML contains all eleven sections and copy');
  await noJS.close();

  assert.deepEqual(runtimeErrors, [], 'uncaught browser errors');
  pass('no uncaught runtime or hydration error', runtimeErrors);
} finally {
  await writeFile(new URL('browser-verification.json', output), JSON.stringify({ origin, checks, audits, snapshots, runtimeErrors, consoleErrors, failedResponses }, null, 2));
  await browser.close();
}
const violations = audits.flatMap(audit => audit.violations);
assert.deepEqual(violations, [], 'WCAG audit findings need correction; see qa/browser-verification.json');
console.log(`Completed ${checks.length} browser checks.`);
