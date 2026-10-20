import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const origin = process.env.MARKETING_ORIGIN || 'http://127.0.0.1:4321';
const output = new URL('gesture-motion/', new URL(process.env.MARKETING_QA_ROOT || '../qa/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-proxy-server'] });
const checks = [];
const errors = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
const scenes = [
  { id: 'top', pin: '.hero-story', stop: 1 },
  { id: 'assets', pin: '.capital-scroll-pin', stop: .9 / 2.9 },
  { id: 'stack', pin: '.stack-scroll-pin', stop: .9 / 3.9 },
];
const pass = (name, evidence) => { checks.push({ name, evidence }); console.log('PASS ' + name); };
async function load(width = 1440, touch = false) {
  await page.setViewport({ width, height: touch ? 844 : 900, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
  await page.goto(origin, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.nav-shell');
  await page.mouse.move(Math.min(width - 30, 1100), 700);
}
async function enter(scene) {
  if (scene.id === 'top') return;
  await page.$eval('#' + scene.id, element => element.scrollIntoView({ behavior: 'instant' }));
  await page.waitForSelector('#' + scene.id + '.has-pinned-sequence');
  await delay(500);
  await page.$eval(scene.pin, element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY + 2, behavior: 'instant' }));
  await delay(200);
}
async function startSampling(scene, duration = 1700) {
  await page.evaluate(({ scene, duration }) => {
    const pin = document.querySelector(scene.pin);
    const start = scene.id === 'top' ? 0 : document.querySelector('#' + scene.id + ' .pin-spacer').getBoundingClientRect().top + scrollY;
    const end = scene.id === 'top' ? pin.offsetHeight - innerHeight : start + innerHeight * (scene.id === 'assets' ? 3 : 4) * .7;
    const begun = performance.now();
    window.motionSamples = [];
    function frame() {
      const progress = scene.id === 'top'
        ? 1 - (document.querySelector('.hero-frame').getBoundingClientRect().width - Math.min(440, innerHeight * .49, innerWidth * .34)) / (innerWidth - Math.min(440, innerHeight * .49, innerWidth * .34))
        : Number(pin.dataset.sequenceProgress);
      window.motionSamples.push({ t: performance.now() - begun, y: scrollY, progress, titleHeight: scene.id === 'top' ? document.querySelector('.settled-title-first').offsetHeight : null });
      if (performance.now() - begun < duration) requestAnimationFrame(frame);
    }
    window.motionRange = { start, end };
    requestAnimationFrame(frame);
  }, { scene, duration });
}
async function position(scene) {
  return page.evaluate(scene => scene.id === 'top' ? scrollY / (document.querySelector('.hero-story').offsetHeight - innerHeight) : Number(document.querySelector(scene.pin).dataset.sequenceProgress), scene);
}
async function wheel(deltaY) { await page.mouse.wheel({ deltaY }); }
try {
  const patterns = [
    ['small single input', [6], 16],
    ['mouse wheel', [120], 16],
    ['trackpad pulse burst', [4, 7, 12, 18, 24, 28, 26, 22, 18, 12, 8, 5, 3, 2, 1], 16],
    ['long momentum tail', [20, ...Array(35).fill(1)], 35],
  ];
  for (const scene of scenes) {
    for (const [name, deltas, gap] of patterns) {
      await load(); await enter(scene); await startSampling(scene);
      for (const delta of deltas) { await wheel(delta); await delay(gap); }
      await delay(Math.max(100, 1800 - deltas.length * gap));
      const samples = await page.evaluate(() => window.motionSamples);
      const first = samples.find(sample => sample.progress > .005);
      const complete = samples.find(sample => Math.abs(sample.progress - scene.stop) < .005);
      assert.ok(first && first.t < 160, JSON.stringify({ scene: scene.id, name, first }));
      assert.ok(complete && complete.t < 1250, JSON.stringify({ scene: scene.id, name, complete }));
      assert.ok(Math.abs(await position(scene) - scene.stop) < .005, 'one gesture must hold exactly one beat');
      assert.ok(samples.every((sample, index) => !index || sample.progress >= samples[index - 1].progress - .003), 'forward gesture must not jump backwards');
      const active = samples.filter(sample => sample.progress > .01 && sample.progress < scene.stop * .85);
      let lastChange = active[0]?.t || 0, longestPause = 0;
      for (let index = 1; index < active.length; index++) {
        if (active[index].progress - active[index - 1].progress > .0005) lastChange = active[index].t;
        else longestPause = Math.max(longestPause, active[index].t - lastChange);
      }
      assert.ok(longestPause < 100, 'no stalled render sample during the transition');
      if (scene.id === 'top') assert.equal(new Set(samples.map(sample => sample.titleHeight)).size, 1, 'settled title must not rewrap during motion');
      pass(scene.id + ': ' + name + ' starts promptly and completes once', { firstMotionMs: Math.round(first.t), completeMs: Math.round(complete.t), finalProgress: await position(scene) });
    }
    await load(); await enter(scene);
    await wheel(60); await delay(180); await wheel(-60); await delay(1100);
    assert.ok(await position(scene) < .005, 'opposite input should return to opening without waiting');
    pass(scene.id + ': opposite gesture interrupts immediately', 'returned to opening');
    await wheel(60); await delay(100); await wheel(-1); await wheel(1); await delay(1100);
    assert.ok(Math.abs(await position(scene) - scene.stop) < .005, 'tiny direction noise must not cancel the transition');
    pass(scene.id + ': one-pixel direction noise does not break motion', 'first beat completes');
    await load(); await enter(scene); await wheel(60); await delay(100);
    await page.mouse.wheel({ deltaX: 8, deltaY: 1 }); await delay(1100);
    assert.ok(Math.abs(await position(scene) - scene.stop) < .005, 'diagonal tail must not hand control back to Lenis mid-transition');
    pass(scene.id + ': diagonal trackpad tail does not cancel motion', 'first beat completes');
    await page.screenshot({ path: fileURLToPath(new URL(scene.id + '-settled.png', output)) });
    await load(); await enter(scene); await page.keyboard.press('PageDown'); await delay(1100);
    assert.ok(Math.abs(await position(scene) - scene.stop) < .005);
    pass(scene.id + ': PageDown advances one beat', 'no parallel native page jump');
    if (scene.id !== 'top') {
      const count = scene.id === 'assets' ? 3 : 4;
      for (let index = 1; index < count; index++) { await wheel(60); await delay(1050); }
      const end = await page.evaluate(() => scrollY);
      await wheel(120); await delay(700);
      assert.ok(await page.evaluate(() => scrollY) > end + 50, 'last beat must release ordinary scrolling');
      pass(scene.id + ': final beat releases scroll', 'no scroll trap');
    }
  }
  await load();
  await page.evaluate(() => {
    const nested = document.createElement('div');
    nested.id = 'gesture-nested-test'; nested.dataset.lenisPrevent = '';
    nested.style.cssText = 'position:fixed;z-index:99999;top:200px;left:200px;width:200px;height:100px;overflow:auto';
    nested.innerHTML = '<div style="height:800px">Scrollable test content</div>'; document.body.append(nested);
  });
  await page.mouse.move(250, 250); await wheel(100); await delay(300);
  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.ok(await page.$eval('#gesture-nested-test', element => element.scrollTop) > 0);
  pass('nested scroll remains independent', 'page stays at zero while nested content scrolls');
  await page.$eval('#gesture-nested-test', element => element.remove());
  await page.mouse.move(1100, 700); await wheel(60); await delay(100);
  await page.$eval('.scroll-cue', element => element.click()); await delay(1200);
  assert.ok(Math.abs(await position(scenes[0]) - 1) < .005);
  pass('anchor navigation replaces an active gesture', 'navigation completes at hero copy');
  await load(); await wheel(60); await delay(120);
  await page.evaluate(() => {
    const dialog = document.createElement('dialog');
    dialog.id = 'gesture-dialog-test'; dialog.textContent = 'Motion dialog test';
    document.body.append(dialog); dialog.showModal();
  });
  await delay(120);
  const lockedY = await page.evaluate(() => scrollY);
  await delay(250);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - lockedY) < 2);
  await page.$eval('#gesture-dialog-test', dialog => { dialog.close(); dialog.remove(); });
  await delay(80); await wheel(60); await delay(1100);
  assert.ok(Math.abs(await position(scenes[0]) - 1) < .005);
  pass('dialog interrupts motion and closing releases the next gesture', 'no stale moving state');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await delay(150);
  assert.equal(await page.$$('.has-pinned-sequence').then(elements => elements.length), 0);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await wheel(60); await delay(300);
  assert.ok(await page.evaluate(() => scrollY > 0 && scrollY < 200));
  pass('reduced motion releases native scroll', 'no automatic narrative jump');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  for (const scene of scenes) {
    await load(390, true); await enter(scene);
    const cdp = await page.createCDPSession();
    const swipe = async direction => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 600 }] });
      for (let index = 1; index <= 5; index++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 600 - direction * index * 10 }] }); await delay(20);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await delay(1100);
    };
    await swipe(1);
    assert.ok(Math.abs(await position(scene) - scene.stop) < .01, scene.id + ' touch forward');
    if (scene.id === 'top') {
      const geometry = await page.evaluate(() => {
        const frame = document.querySelector('.hero-frame');
        const video = document.querySelector('#hero-video');
        const frameBox = frame.getBoundingClientRect(), videoBox = video.getBoundingClientRect();
        const style = getComputedStyle(frame);
        return { frameRatio: frameBox.width / frameBox.height, videoRatio: videoBox.width / videoBox.height, originalRatio: video.offsetWidth / video.offsetHeight, covered: videoBox.width >= frameBox.width - 1 && videoBox.height >= frameBox.height - 1, corners: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius] };
      });
      assert.ok(Math.abs(geometry.frameRatio - 1) < .01);
      assert.ok(Math.abs(geometry.videoRatio - geometry.originalRatio) < .01, 'video must not stretch');
      assert.ok(geometry.covered, 'video must fill the frame without letterboxing');
      assert.equal(new Set(geometry.corners).size, 1, 'all four frame corners must match');
      await page.screenshot({ path: fileURLToPath(new URL('top-mobile-settled.png', output)) });
      pass('hero transform preserves video aspect ratio and four rounded corners', geometry);
    }
    await swipe(-1);
    assert.ok(await position(scene) < .01, scene.id + ' touch reverse');
    await page.screenshot({ path: fileURLToPath(new URL(scene.id + '-mobile.png', output)) });
    await cdp.detach();
    pass(scene.id + ': native touch swipe advances and reverses', 'one short 50px swipe each way');
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const width of [320, 768, 1440, 1920]) {
    await load(width);
    const geometry = await page.evaluate(() => {
      const frame = document.querySelector('.hero-frame').getBoundingClientRect();
      const video = document.querySelector('#hero-video').getBoundingClientRect();
      return { covered: video.width >= frame.width - 1 && video.height >= frame.height - 1, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    assert.ok(geometry.covered && !geometry.overflow, JSON.stringify(geometry));
    pass('hero cover and layout at ' + width, geometry);
  }
  assert.deepEqual(errors, []);
} finally {
  await writeFile(new URL('report.json', output), JSON.stringify({ origin, checks, errors }, null, 2));
  await browser.close();
}
