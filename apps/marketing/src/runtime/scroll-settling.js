import { gsap } from 'gsap';
import { scrollLandingTo } from './smooth-scroll.js';

// Only user input arms settling. Scroll events from the settling animation cannot advance another beat.
export function createScrollSettling(trigger, stops = [0, 1]) {
  let direction = 1;
  let distance = 0;
  let lastInput = 0;
  let touchY;
  let cancelScroll;

  function blocked(target) {
    return document.hidden || document.body.style.overflow === 'hidden' || document.querySelector('dialog[open]') ||
      target instanceof Element && !!target.closest('[data-lenis-prevent],input,textarea,select,[contenteditable="true"]');
  }
  function clear() {
    settle.pause();
    cancelScroll?.();
    cancelScroll = undefined;
    distance = 0;
  }
  function snap() {
    if (blocked() || !trigger.isActive || distance < 12) return;
    distance = 0;
    const epsilon = 4 / (trigger.end - trigger.start);
    const progress = trigger.progress;
    if (stops.some(point => Math.abs(point - progress) <= epsilon)) return;
    const target = direction > 0 ? stops.find(point => point > progress) : stops.slice().reverse().find(point => point < progress);
    if (target === undefined) return;
    const pixels = Math.abs(target - progress) * (trigger.end - trigger.start);
    cancelScroll = scrollLandingTo(trigger.start + target * (trigger.end - trigger.start), {
      duration: gsap.utils.clamp(.8, 1.2, .75 + pixels / Math.max(innerHeight, 1) * .35),
      easing: progress => .5 - Math.cos(Math.PI * progress) / 2,
      purpose: 'settling',
      onComplete: () => { cancelScroll = undefined; },
    });
  }
  const settle = gsap.delayedCall(.22, snap).pause();
  function input(delta, target) {
    if (!delta || blocked(target) || (!trigger.isActive && (scrollY < trigger.start - 2 || scrollY > trigger.end + 2))) return;
    const now = performance.now();
    if (now - lastInput > 250 || Math.sign(delta) !== direction) distance = 0;
    lastInput = now;
    direction = Math.sign(delta);
    cancelScroll?.();
    cancelScroll = undefined;
    distance += Math.abs(delta);
    settle.restart(true);
  }
  const wheel = event => {
    if (!event.ctrlKey) input(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1), event.target);
  };
  const touchStart = event => { clear(); touchY = event.touches.length === 1 ? event.touches[0].clientY : undefined; };
  const touchEnd = event => {
    if (touchY !== undefined && event.changedTouches.length === 1) input(touchY - event.changedTouches[0].clientY, event.target);
    touchY = undefined;
  };
  const key = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || blocked(event.target)) return;
    if (event.target instanceof Element && event.target.closest('button,a,[role="tab"]')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(event.key);
    const up = ['ArrowUp', 'PageUp'].includes(event.key) || event.key === ' ' && event.shiftKey;
    if (down || up) input(up ? -40 : 40, event.target);
    else clear();
  };
  window.addEventListener('wheel', wheel, { passive: true });
  window.addEventListener('touchstart', touchStart, { passive: true });
  window.addEventListener('touchend', touchEnd, { passive: true });
  window.addEventListener('keydown', key);
  window.addEventListener('pointerdown', clear);
  window.addEventListener('genz:scroll-navigation', clear);
  document.addEventListener('visibilitychange', clear);
  return () => {
    clear(); settle.kill();
    window.removeEventListener('wheel', wheel);
    window.removeEventListener('touchstart', touchStart);
    window.removeEventListener('touchend', touchEnd);
    window.removeEventListener('keydown', key);
    window.removeEventListener('pointerdown', clear);
    window.removeEventListener('genz:scroll-navigation', clear);
    document.removeEventListener('visibilitychange', clear);
  };
}
