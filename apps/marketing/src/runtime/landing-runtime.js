import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createHeroMedia } from './hero-media.js';
import { createCapitalBridgeMotion } from './capital-bridge.js';
import { createThesisMotion } from './thesis-motion.js';
import { createSmoothScroll, scrollLandingTo } from './smooth-scroll.js';
import { createComparisonMotion } from './comparison-motion.js';

gsap.registerPlugin(ScrollTrigger);
export function initializeLanding() {
const disposeSmoothScroll = createSmoothScroll();
const initialHash = location.hash;
document.documentElement.classList.add('js');
const film = createHeroMedia(document.querySelector('#hero-video'), document.querySelector('#media-state'));
const disposeCapitalBridge = createCapitalBridgeMotion(document.querySelector('#why'));
const thesisMotion = createThesisMotion(document.querySelector('#energy-context'));
const disposeComparison = createComparisonMotion(document.querySelector('.comparison-content'));

const story = document.querySelector('.hero-story');
const first = document.querySelector('.title-first');
const last = document.querySelector('.title-last');
const nav = document.querySelector('.site-navigation');
let motion;
let resizeTimer;

function buildMotion() {
  motion?.revert();
  motion = gsap.matchMedia();
  motion.add({
    desktop: '(min-width: 768px)',
    mobile: '(max-width: 767px)',
    reduce: '(prefers-reduced-motion: reduce)',
  }, ({ conditions }) => {
    const { mobile, reduce } = conditions;
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;
    const card = mobile ? Math.min(300, width - 48, height * (height < 650 ? .30 : .36)) : Math.min(440, height * .49, width * .34);
    const fontSize = mobile ? (height < 650 ? 28 : 40) : Math.min(48, (width - 64) / 24.5);
    const sideWidth = mobile ? width - 48 : (width - card) / 2 - 48;
    gsap.set(nav, {
      '--nav-width': (mobile ? width : width - 104) + 'px',
      '--nav-top': '48px', '--nav-fill': 0, '--nav-pad': mobile ? '16px' : '0px',
    });
    gsap.set([first, last], { fontSize, width: mobile ? width - 48 : 'max-content', color: '#ffffff' });
    if (mobile) {
      gsap.set(first, { xPercent: -50, yPercent: -50, x: 0, y: -52 });
      gsap.set(last, { xPercent: -50, yPercent: -50, x: 0, y: 52 });
    } else {
      const firstWidth = first.getBoundingClientRect().width;
      const lastWidth = last.getBoundingClientRect().width;
      gsap.set(first, { xPercent: 0, yPercent: 0, x: 0, y: 0, width: Math.ceil(firstWidth) + 1 });
      gsap.set(last, { xPercent: 0, yPercent: 0, x: 0, y: 0, width: Math.ceil(lastWidth) + 1 });
    }
    gsap.set('.hero-description', { opacity: 0 });
    const frameEnd = { width: card, height: card, left: (width - card) / 2, top: (height - card) / 2, borderRadius: 30 };
    const titleX = mobile ? 0 : card / 2 + 26;
    const mobileGap = height < 650 ? 24 : 36;
    const firstY = mobile ? card / 2 + mobileGap + first.getBoundingClientRect().height / 2 : 0;
    const lastY = mobile ? card / 2 + mobileGap + last.getBoundingClientRect().height / 2 : 0;
    const firstEnd = { x: -titleX, y: -firstY, width: sideWidth, fontSize, color: '#111827' };
    const lastEnd = { x: titleX, y: lastY, width: sideWidth, fontSize, color: '#111827' };
    const navEnd = {
      '--nav-width': (mobile ? width : Math.min(792, width - 32)) + 'px',
      '--nav-top': mobile ? '0px' : '12px', '--nav-fill': 1, '--nav-pad': mobile ? '16px' : '24px',
    };
    if (reduce) {
      gsap.set(story, { height });
      gsap.set('.hero-frame', frameEnd);
      gsap.set(first, firstEnd);
      gsap.set(last, lastEnd);
      gsap.set(nav, navEnd);
      gsap.set('.hero-description', { opacity: 1 });
      gsap.set('.scroll-cue', { autoAlpha: 0 });
      gsap.set('.film-shade', { opacity: 0 });
      return;
    }
    // Use the full sticky travel with linear motion so reversing scroll keeps the same weight.
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true },
    })
      .to('.hero-frame', { ...frameEnd, duration: 1 }, 0)
      .to(first, { ...firstEnd, duration: 1 }, 0)
      .to(last, { ...lastEnd, duration: 1 }, 0)
      .fromTo(nav, {
        '--nav-width': (mobile ? width : width - 104) + 'px',
        '--nav-top': '48px', '--nav-fill': 0, '--nav-pad': mobile ? '16px' : '0px',
      }, { ...navEnd, duration: .3, immediateRender: false }, 0)
      .to('.scroll-cue', { autoAlpha: 0, duration: .18 }, 0)
      .to('.film-shade', { opacity: 0, duration: .5 }, 0)
      .to('.hero-description', { opacity: 1, duration: .25 }, .75);
  });
  ScrollTrigger.refresh();
}
buildMotion();
document.fonts.load('500 48px "GenZ Display"').then(buildMotion, () => {});
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
    if (!initialHash || location.hash !== initialHash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(initialHash.slice(1))); }
    catch { return; }
    if (target) scrollLandingTo(target, { immediate: true });
});
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildMotion, 150);
}
window.addEventListener('resize', onResize);
const onLayoutReady = () => ScrollTrigger.refresh();
window.addEventListener('genz:layout-ready', onLayoutReady);
function onScrollCue(event) {
  event.preventDefault();
  document.querySelector('#hero-copy').focus({ preventScroll: true });
  scrollLandingTo(story.offsetTop + story.offsetHeight - window.innerHeight);
}
document.querySelector('.scroll-cue').addEventListener('click', onScrollCue);
window.addEventListener('pagehide', film.pause);
function dispose() {
  motion?.revert(); film.dispose();
  disposeCapitalBridge();
  disposeComparison();
  thesisMotion.dispose();
  disposeSmoothScroll();
  document.querySelector('.scroll-cue')?.removeEventListener('click', onScrollCue);
  document.documentElement.classList.remove('js');
  window.removeEventListener('genz:layout-ready', onLayoutReady);
  clearTimeout(resizeTimer); window.removeEventListener('resize', onResize); window.removeEventListener('pagehide', film.pause);
}
if (import.meta.hot) import.meta.hot.dispose(dispose);
return { media: film, sectionMedia: thesisMotion, dispose };
}
