import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createComparisonMotion(root) {
  if (!root) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({
    desktop: '(min-width: 768px)',
    mobile: '(max-width: 767px)',
    reduce: '(prefers-reduced-motion: reduce)',
  }, ({ conditions }) => {
    if (conditions.reduce) return;
    const select = gsap.utils.selector(root);
    gsap.from(select('.comparison-heading > *'), {
      y: 22, opacity: 0, stagger: 0.12, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: select('.comparison-heading')[0], start: 'top 88%', toggleActions: 'play none none reverse' },
    });
    if (conditions.desktop) {
      const open = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: select('.comparison-panels')[0], start: 'top 88%', end: 'top 38%', scrub: true, invalidateOnRefresh: true },
      });
      open.from(select('.comparison-traditional'), { xPercent: 52, duration: 1 }, 0)
        .from(select('.comparison-connected'), { xPercent: -52, opacity: 0, duration: 1 }, 0)
        .from(select('.comparison-connected .comparison-row'), { y: 12, opacity: 0, stagger: 0.12, duration: 0.45 }, 0.35);
    } else {
      select('.comparison-panel').forEach(panel => gsap.from(panel, {
        y: 24, opacity: 0, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: panel, start: 'top 92%', toggleActions: 'play none none reverse' },
      }));
    }
  }, root);
  return () => media.revert();
}
