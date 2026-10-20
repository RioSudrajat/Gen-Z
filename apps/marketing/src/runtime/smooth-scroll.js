import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let scroller;
let activeScroll;
const gestureHandlers = new Set();

export function registerScrollGesture(handler) {
  gestureHandlers.add(handler);
  return () => gestureHandlers.delete(handler);
}

export function scrollLandingTo(target, { offset = 0, immediate = false, duration = 1.1, easing = progress => 1 - Math.pow(1 - progress, 4), onComplete, purpose = 'navigation' } = {}) {
  if (scroller?.isStopped) return () => {};
  if (purpose === 'navigation') window.dispatchEvent(new Event('genz:scroll-navigation'));
  const operation = {};
  activeScroll = operation;
  const complete = () => {
    if (activeScroll !== operation) return;
    activeScroll = undefined;
    onComplete?.();
  };
  if (scroller) {
    scroller.resize();
    scroller.scrollTo(target, {
      offset, immediate, lerp: 0, duration, easing, onComplete: complete,
    });
    return () => {
      if (activeScroll !== operation) return;
      activeScroll = undefined;
      scroller?.scrollTo(scroller.actualScroll, { immediate: true });
    };
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + offset, behavior: 'instant' });
  complete();
  return () => {};
}

export function createSmoothScroll() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let tick;

  function syncDialogLock() {
    if (!scroller) return;
    if (document.body.style.overflow === 'hidden' || document.querySelector('dialog[open]')) {
      if (!scroller.isStopped) window.dispatchEvent(new Event('genz:scroll-navigation'));
      scroller.stop();
    } else scroller.start();
  }

  function configure() {
    if (tick) gsap.ticker.remove(tick);
    scroller?.destroy();
    scroller = undefined;
    tick = undefined;
    if (reduced.matches) return;

    scroller = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      virtualScroll(data) {
        if (data.event.defaultPrevented || data.event.ctrlKey || data.event.metaKey) return false;
        for (const handler of gestureHandlers) {
          if (!handler(data)) continue;
          if (data.event.cancelable) data.event.preventDefault();
          return false;
        }
      },
      // Dialogs and nested project views retain their own native scrolling.
      prevent: (node) => node.tagName === 'DIALOG' || node.hasAttribute('data-lenis-prevent'),
    });
    scroller.on('scroll', ScrollTrigger.update);
    tick = (seconds) => scroller?.raf(seconds * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    syncDialogLock();
  }

  function navigateAnchor(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); }
    catch { return; }
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, '', url.hash);
    const heading = target.matches('h1,h2,[tabindex]') ? target : target.querySelector('h1,h2');
    heading?.focus({ preventScroll: true });
    scrollLandingTo(target);
  }

  configure();
  const bodyObserver = new MutationObserver(syncDialogLock);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
  const dialogObserver = new MutationObserver(syncDialogLock);
  dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  reduced.addEventListener('change', configure);
  document.addEventListener('click', navigateAnchor);

  return () => {
    dialogObserver.disconnect();
    bodyObserver.disconnect();
    reduced.removeEventListener('change', configure);
    document.removeEventListener('click', navigateAnchor);
    if (tick) gsap.ticker.remove(tick);
    scroller?.destroy();
    scroller = undefined;
  };
}
