import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollLandingTo } from './smooth-scroll.js';
import { createScrollSettling } from './scroll-settling.js';

gsap.registerPlugin(ScrollTrigger);

// Each beat has an entrance followed by a reading pause, before the next scroll.
export function createPinnedSequence({ id, pin, count, onUpdate = undefined }) {
  const duration = count - 0.1;
  const stops = Array.from({ length: count }, (_, index) => (index + 0.9) / duration);
  const clock = { time: 0 };
  const timeline = gsap.timeline({
    onUpdate() {
      pin.dataset.sequenceProgress = this.progress().toFixed(4);
      onUpdate?.(this.time());
    },
    scrollTrigger: {
      id,
      trigger: pin,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * count * 0.7),
      pin: true,
      // Astro islands hydrate independently; measure pin spacing before downstream reveals.
      refreshPriority: 1,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline.to(clock, { time: duration, duration, ease: 'none' }, 0);

  const disposeSettling = createScrollSettling(timeline.scrollTrigger, [0, ...stops]);

  return {
    timeline,
    dispose() {
      disposeSettling();
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
