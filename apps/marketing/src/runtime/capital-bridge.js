import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Reveal the connection once, without pinning or changing the reading order. */
export function createCapitalBridgeMotion(section) {
  if (!section) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const scene = section.querySelector('.bridge-scene');
  const image = scene.querySelector('img');
  let disposed = false;

  function start() {
    if (disposed || !image.naturalWidth) return;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const portrait = window.matchMedia('(max-width: 600px)').matches;
      gsap.fromTo(scene,
        { clipPath: portrait ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.15,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: scene, start: 'top 85%', once: true },
        },
      );
    });
  }

  if (image.complete) start();
  else image.addEventListener('load', start, { once: true });

  return () => {
    disposed = true;
    image.removeEventListener('load', start);
    media.revert();
  };
}
