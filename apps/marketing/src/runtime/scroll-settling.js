import { registerScrollGesture, scrollLandingTo } from './smooth-scroll.js';

// A gesture starts one transition; its momentum must not restart or advance that transition.
export function createScrollSettling(trigger, stops = [0, 1]) {
  let direction = 0;
  let distance = 0;
  let lastInput = -Infinity;
  let claimed = false;
  let moving = false;
  let motionDirection = 0;
  let cancelScroll;
  let touchDistance = 0;

  function blocked(target) {
    return document.hidden || document.body.style.overflow === 'hidden' || document.querySelector('dialog[open]') ||
      target instanceof Element && !!target.closest('dialog,[data-lenis-prevent],[data-lenis-prevent-vertical],input,textarea,select,[contenteditable="true"]');
  }
  function cancelMotion() {
    cancelScroll?.();
    cancelScroll = undefined;
    moving = false;
  }
  function clear() {
    cancelMotion();
    claimed = false;
    distance = touchDistance = direction = 0;
    lastInput = -Infinity;
  }
  function input(delta, target, fresh = false) {
    if (!delta || blocked(target)) return false;
    const now = performance.now();
    const nextDirection = Math.sign(delta);
    const reversed = nextDirection !== direction;
    if (fresh || reversed || now - lastInput > 180) {
      claimed = false;
      distance = 0;
    }
    lastInput = now;
    direction = nextDirection;
    if (claimed) return true;
    if (moving && direction === motionDirection) {
      claimed = true;
      return true;
    }
    const { start, end } = trigger;
    const y = window.scrollY;
    if (end <= start || y < start - (direction > 0 ? 48 : 2) || y > end + (direction < 0 ? 48 : 2)) return false;
    const progress = Math.max(0, Math.min(1, (y - start) / (end - start)));
    const epsilon = 2 / (end - start);
    const point = direction > 0
      ? stops.find(stop => stop > progress + epsilon)
      : stops.slice().reverse().find(stop => stop < progress - epsilon);
    distance += Math.abs(delta);
    // Consume the first small pulses too, before native scroll can start a second motion.
    if (distance < 6) return point !== undefined || moving;
    if (moving) cancelMotion();
    if (point === undefined) return false;
    claimed = moving = true;
    motionDirection = direction;
    const pixels = Math.abs(start + point * (end - start) - y);
    cancelScroll = scrollLandingTo(start + point * (end - start), {
      duration: Math.max(.65, Math.min(.95, .65 + pixels / Math.max(innerHeight, 1) * .25)),
      easing: progress => 1 - Math.pow(1 - progress, 3),
      purpose: 'settling',
      onComplete: () => { moving = false; cancelScroll = undefined; },
    });
    return true;
  }
  const disposeGesture = registerScrollGesture(({ deltaX, deltaY, event }) => {
    if (event.ctrlKey || event.metaKey || blocked(event.target)) return false;
    if (event.type === 'touchstart') {
      claimed = false; distance = touchDistance = 0; lastInput = -Infinity;
      return false;
    }
    if (event.touches?.length > 1) { clear(); return false; }
    if (event.type === 'touchend') return claimed || input(touchDistance, event.target);
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (moving || claimed && performance.now() - lastInput < 180) {
        lastInput = performance.now();
        return true;
      }
      return false;
    }
    if (event.type === 'touchmove') {
      touchDistance += deltaY;
      if (!event.cancelable) return false;
    }
    return input(deltaY, event.target);
  });
  const key = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || blocked(event.target)) return;
    if (event.target instanceof Element && event.target.closest('button,a,[role="tab"]')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(event.key);
    const up = ['ArrowUp', 'PageUp'].includes(event.key) || event.key === ' ' && event.shiftKey;
    if (down || up) {
      if (input(up ? -40 : 40, event.target, !event.repeat)) event.preventDefault();
    } else clear();
  };
  window.addEventListener('keydown', key);
  window.addEventListener('pointerdown', clear);
  window.addEventListener('touchcancel', clear);
  window.addEventListener('genz:scroll-navigation', clear);
  document.addEventListener('visibilitychange', clear);
  return () => {
    clear(); disposeGesture();
    window.removeEventListener('keydown', key);
    window.removeEventListener('pointerdown', clear);
    window.removeEventListener('touchcancel', clear);
    window.removeEventListener('genz:scroll-navigation', clear);
    document.removeEventListener('visibilitychange', clear);
  };
}
