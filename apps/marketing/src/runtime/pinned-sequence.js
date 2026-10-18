import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollLandingTo } from './smooth-scroll.js';

gsap.registerPlugin(ScrollTrigger);

// Each beat has an entrance followed by a reading pause, before the next scroll.
export function createPinnedSequence({ id, pin, count, onUpdate = undefined }) {
  const duration = count - 0.28;
  const stops = Array.from({ length: count }, (_, index) => (index + 0.72) / duration);
  const clock = { time: 0 };
  let settling = false;
  let direction = 1;
  const timeline = gsap.timeline({
    onUpdate() {
      pin.dataset.sequenceProgress = this.progress().toFixed(4);
      onUpdate?.(this.time());
    },
    scrollTrigger: {
      id,
      trigger: pin,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * count * 0.85),
      pin: true,
      // Astro islands hydrate independently; measure pin spacing before downstream reveals.
      refreshPriority: 1,
      scrub: 0.3,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline.to(clock, { time: duration, duration, ease: 'none' }, 0);

  function snap() {
    const trigger = timeline.scrollTrigger;
    if (settling || !trigger?.isActive || document.querySelector('dialog[open]')) return;
    const points = [0, ...stops];
    if (points.some(point => Math.abs(point - trigger.progress) < 0.002)) return;
    const target = direction > 0
      ? points.find(point => point > trigger.progress)
      : points.slice().reverse().find(point => point < trigger.progress);
    if (target === undefined) return;
    settling = true;
    // Lenis owns both wheel easing and snapping; competing window tweens lose gestures.
    scrollLandingTo(trigger.start + (trigger.end - trigger.start) * target, {
      duration: 0.5,
      onComplete: () => { settling = false; },
    });
  }
  const settle = gsap.delayedCall(0.18, snap).pause();
  const onWheel = (event) => {
    if (event.ctrlKey || !event.deltaY) return;
    direction = Math.sign(event.deltaY);
    settling = false;
    settle.restart(true);
  };
  const onTouchEnd = () => {
    direction = timeline.scrollTrigger.direction;
    settling = false;
    settle.restart(true);
  };
  const onKeyUp = (event) => {
    if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(event.key)) return;
    direction = ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 1;
    settling = false;
    settle.restart(true);
  };
  const onScrollEnd = () => {
    if (settling || settle.isActive()) return;
    direction = timeline.scrollTrigger.direction;
    settle.restart(true);
  };
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keyup', onKeyUp);
  ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);

  return {
    timeline,
    dispose() {
      settle.kill();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keyup', onKeyUp);
      ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
      delete pin.dataset.sequenceProgress;
    },
    reveal(index) {
      const trigger = timeline.scrollTrigger;
      const progress = stops[index];
      if (!trigger || progress === undefined || timeline.progress() >= progress) return;
      // Focusing a future label must reveal its layer before the next paint.
      scrollLandingTo(trigger.start + (trigger.end - trigger.start) * progress, { immediate: true });
      timeline.progress(progress);
      ScrollTrigger.update();
    },
  };
}
