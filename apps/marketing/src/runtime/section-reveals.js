import { gsap } from 'gsap';

export function createSectionReveals(root) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const tweens = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (entry.boundingClientRect.top < 0) continue;
        // Content stays visible before observation; animate semantic groups only as they enter view.
        const heading = entry.target;
        const intro = heading.nextElementSibling?.matches('.section-intro') ? heading.nextElementSibling : null;
        const tween = gsap.fromTo([heading, intro].filter(Boolean), { y: 18, opacity: .3 }, {
          y: 0, opacity: 1, duration: .65, stagger: .08, ease: 'power2.out', clearProps: 'transform,opacity',
        });
        tweens.add(tween);
      }
    }, { threshold: .15 });
    root.querySelectorAll('.landing-section h2').forEach(heading => observer.observe(heading));
    const revealFocus = () => { tweens.forEach(tween => tween.progress(1)); };
    root.addEventListener('focusin', revealFocus);
    return () => {
      observer.disconnect();
      root.removeEventListener('focusin', revealFocus);
      tweens.forEach(tween => tween.revert());
    };
  });
  return () => media.revert();
}
