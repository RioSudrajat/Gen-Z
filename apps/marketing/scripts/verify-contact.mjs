import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';

const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4322';
const configured = process.env.CONFIGURED_MARKETING_ORIGIN;
const output = new URL('../../../.cache/guided-contact/', import.meta.url);
await mkdir(output, { recursive:true });
const checks = [];
const errors = [];
const audits = [];
const consoleErrors = [];
const browser = await puppeteer.launch({ executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true, args:['--no-proxy-server'] });
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
const pass = name => { checks.push(name); console.log('PASS ' + name); };
const click = selector => page.locator(selector).click();
async function load(query = '', base = origin) {
  await page.goto(base + '/contact/' + query, { waitUntil:'networkidle0' });
  await page.waitForFunction(() => !document.querySelector('.inquiry-topics').disabled);
  await page.evaluate(() => document.fonts.ready);
}
async function step(number) { await page.waitForFunction(value => document.querySelector('.inquiry-step-count')?.textContent === `Step ${value} of 3`, {}, number); }
async function details() {
  await page.type('#contact-name', 'QA Operator'); await page.type('#contact-email', 'operator@example.invalid');
  await click('button[type=submit]'); await step(2);
}
async function asset() {
  await page.select('#contact-assetCategory', 'energy'); await page.select('#contact-operationsState', 'operational');
  await page.type('#contact-region', 'West Java'); await page.type('#contact-message', 'Synthetic QA asset description. No real inquiry.');
}
async function overflow(label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, label);
  pass(label + ' no horizontal overflow');
}
async function audit(label) {
  const result = await new AxePuppeteer(page).analyze();
  audits.push({ label, violations:result.violations });
  assert.deepEqual(result.violations.map(item => ({ id:item.id, nodes:item.nodes.map(node => node.target) })), [], label);
  pass(label + ' axe: zero violations');
}
try {
  const reference = { width:1435, height:1096 };
  await page.setViewport({ width:reference.width, height:reference.height, deviceScaleFactor:1 });
  await load();
  await click('button[type=submit]');
  await page.waitForFunction(() => document.activeElement?.id === 'contact-name');
  assert.equal(await page.$$eval('.entry-error', nodes => nodes.length), 2);
  pass('details validation focuses first invalid field');
  await page.type('#contact-name', 'QA Operator'); await page.type('#contact-email', 'operator@example.invalid');
  await page.focus('#contact-email'); await page.keyboard.press('Enter'); await step(2);
  assert.equal(await page.$eval('.inquiry-form h2', node => node === document.activeElement), true);
  await page.$eval('.inquiry-form h2', node => node.blur());
  await page.screenshot({ path:fileURLToPath(new URL('desktop-asset.png', output)), fullPage:true });
  await audit('desktop asset');
  await click('button[type=submit]');
  await page.waitForFunction(() => document.activeElement?.id === 'contact-assetCategory');
  assert.equal(await page.$$eval('.entry-error', nodes => nodes.length), 4);
  pass('asset validation follows visual field order');
  await asset();
  await page.type('#contact-financingAmount', '1e6'); await click('button[type=submit]');
  await page.waitForSelector('#contact-error-financingAmount');
  await click('input[name=financingUnknown]');
  assert.equal(await page.$eval('#contact-financingAmount', node => node.disabled), true);
  await click('button[type=submit]'); await step(3);
  assert.match(await page.$eval('.message-review', node => node.textContent), /Not specified/);
  assert.equal(await page.$('.inquiry-review-actions .primary-button'), null);
  await audit('operator review disconnected');
  await click('.inquiry-privacy summary');
  assert.equal(await page.$eval('.inquiry-privacy', node => node.open), true);
  const exported = await page.$eval('[download]', async node => (await fetch(node.href)).text());
  assert.match(exported, /Country: Indonesia/); assert.match(exported, /Financing need: Not specified/);
  await click('.inquiry-review-actions button.secondary-button');
  assert.match(await page.$eval('.entry-feedback', node => node.textContent), /copied|download/i);
  pass('unknown financing maps to null; disconnected review exports without claiming success');
  await click('.inquiry-review-group:last-of-type button'); await step(2);
  await click('input[name=financingUnknown]');
  assert.equal(await page.$eval('#contact-financingAmount', node => node.value), '1e6');
  assert.equal(await page.$eval('.inquiry-steps li:last-child button', node => node.disabled), true);
  await page.$eval('#contact-financingAmount', node => { node.focus(); node.select(); });
  await page.type('#contact-financingAmount', '900719925474099312345');
  await click('button[type=submit]'); await step(3);
  const exact = await page.$eval('[download]', async node => (await fetch(node.href)).text());
  assert.match(exact, /900,719,925,474,099,312,345/);
  pass('edits invalidate forward progress and preserve exact large rupiah amounts');
  await click('input[name=role][value=investor]'); await step(1);
  assert.equal(await page.$eval('#contact-name', node => node.value), 'QA Operator');
  await click('button[type=submit]'); await step(2);
  assert.equal(await page.$('#contact-assetCategory'), null);
  await page.type('#contact-message', 'Synthetic investor mandate for QA only.');
  await click('input[name=role][value=partner]'); await click('button[type=submit]'); await step(2);
  await page.type('#contact-message', 'Synthetic partnership message for QA only.');
  await click('input[name=role][value=investor]'); await click('button[type=submit]'); await step(2);
  assert.equal(await page.$eval('#contact-message', node => node.value), 'Synthetic investor mandate for QA only.');
  await click('input[name=role][value=operator]'); await click('button[type=submit]'); await step(2);
  assert.match(await page.$eval('#contact-message', node => node.value), /Synthetic QA asset/);
  await click('.inquiry-actions .secondary-button'); await step(1);
  assert.equal(await page.$eval('#contact-email', node => node.value), 'operator@example.invalid');
  pass('Back, native role selection, shared contacts and separate context drafts retain answers');
  await click('button[type=submit]'); await step(2);
  for (const width of [320,390,768,1440]) {
    await page.setViewport({ width, height:900 }); await overflow('asset ' + width);
    if (width === 390) { await audit('mobile asset'); await page.screenshot({ path:fileURLToPath(new URL('mobile-asset.png', output)), fullPage:true }); }
  }
  await page.emulateMediaFeatures([{ name:'prefers-color-scheme', value:'dark' }, { name:'prefers-reduced-motion', value:'reduce' }]);
  assert.equal(await page.$eval('body', node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
  await page.setViewport({ width:720, height:550 }); await overflow('200 percent layout equivalent');
  await page.focus('#contact-assetCategory'); await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'contact-operationsState');
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  pass('light-only, reduced motion and visible keyboard focus');

  if (configured) {
    const attempts = [];
    let fail = true;
    let policyAvailable = false;
    await page.setRequestInterception(true);
    const intercept = async request => {
      if (!/\/api\/v1\/(inquiries|public\/inquiry-policy)$/.test(request.url())) return request.continue();
      const headers = { 'access-control-allow-origin':configured, 'access-control-allow-methods':'GET,POST,OPTIONS', 'access-control-allow-headers':'content-type,idempotency-key', 'content-type':'application/json' };
      if (request.method() === 'OPTIONS') return request.respond({ status:204, headers });
      if (request.url().endsWith('/public/inquiry-policy')) return request.respond({ status:policyAvailable ? 200 : 503, headers, body:JSON.stringify({ privacyNoticeVersionId:'12345678-1234-4234-8234-123456789012', noticeUrl:new URL('/privacy', request.url()).href, sensitiveUploadsAllowed:false, marketingOptIn:false }) });
      attempts.push({ key:request.headers()['idempotency-key'], body:JSON.parse(request.postData()) });
      await new Promise(resolve => setTimeout(resolve, 180));
      return request.respond({ status:fail ? 503 : 201, headers, body:JSON.stringify(fail ? { error:'Synthetic failure' } : { reference:'INQ-synthetic-guided' }) });
    };
    page.on('request', intercept);
    await load('', configured); await details(); await asset(); await click('button[type=submit]'); await step(3);
    assert.equal(await page.$('.inquiry-review-actions .primary-button'), null);
    policyAvailable = true;
    await click('.entry-preview-note button');
    try { await page.waitForSelector('#contact-privacyAcknowledged', { timeout:5000 }); }
    catch (error) { console.log({ consoleErrors, notice:await page.$eval('.entry-preview-note', node => node.textContent) }); throw error; }
    await click('.inquiry-review-actions .primary-button');
    await page.waitForFunction(() => document.activeElement?.id === 'contact-privacyAcknowledged');
    assert.equal(attempts.length, 0);
    await click('#contact-privacyAcknowledged'); await click('.inquiry-review-actions .primary-button');
    await page.waitForFunction(() => document.querySelector('.inquiry-review-actions .primary-button')?.textContent.startsWith('Retry sending'));
    fail = false; await click('.inquiry-review-actions .primary-button');
    await page.waitForFunction(() => document.querySelector('.inquiry-receipt strong')?.textContent === 'INQ-synthetic-guided');
    assert.equal(attempts.length, 2); assert.equal(attempts[0].key, attempts[1].key);
    assert.deepEqual(attempts[1].body.location, { countryCode:'ID', region:'West Java' });
    assert.equal(attempts[1].body.privacyAcknowledged, true);
    assert.equal(await page.$eval('.inquiry-topics', node => node.disabled), true);
    await audit('synthetic confirmed receipt');
    page.off('request', intercept); await page.setRequestInterception(false);
    pass('synthetic policy unavailable -> retry -> acknowledgement -> send failure -> same-key retry -> receipt');
  }
  assert.deepEqual(errors, []);
  assert.ok(!consoleErrors.some(message => /hydration|hydrated/i.test(message)));
  await writeFile(new URL('results.json', output), JSON.stringify({ checks, audits, errors, consoleErrors, configuredTransportTested:Boolean(configured), reference:{ width:reference.width, height:reference.height } }, null, 2));
  console.log(`Contact verification: ${checks.length} checks passed`);
} finally { await browser.close(); }
