import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createHeroMedia } from './hero-media.js';
import { createCapitalBridgeMotion } from './capital-bridge.js';
import { createThesisMotion } from './thesis-motion.js';
import { createSmoothScroll, scrollLandingTo } from './smooth-scroll.js';
import { createComparisonMotion } from './comparison-motion.js';
import { createScrollSettling } from './scroll-settling.js';
import { createSectionReveals } from './section-reveals.js';

gsap.registerPlugin(ScrollTrigger);
export function initializeLanding() {
const disposeSmoothScroll = createSmoothScroll();
const initialHash = location.hash;
document.documentElement.classList.add('js');
const film = createHeroMedia(document.querySelector('#hero-video'), document.querySelector('#media-state'));
const disposeCapitalBridge = createCapitalBridgeMotion(document.querySelector('#why'));
const thesisMotion = createThesisMotion(document.querySelector('#energy-context'));
const disposeComparison = createComparisonMotion(document.querySelector('.comparison-content'));
const disposeReveals = createSectionReveals(document.querySelector('main'));

const story = document.querySelector('.hero-story');
const first = document.querySelector('.title-first');
const last = document.querySelector('.title-last');
const settledFirst = document.querySelector('.settled-title-first');
const settledLast = document.querySelector('.settled-title-last');
const frame = document.querySelector('.hero-frame');
const heroVideo = document.querySelector('#hero-video');
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
    gsap.set('.hero-description,.hero-settled-headline', { opacity: 0 });
    gsap.set('#hero-title', { opacity: 1 });
    const corners = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
    gsap.set(frame, { scaleX: 1, scaleY: 1, ...Object.fromEntries(corners.map(corner => [corner, '0px 0px'])) });
    const videoRatio = heroVideo.videoWidth / heroVideo.videoHeight || 16 / 9;
    const videoWidth = Math.max(width, height * videoRatio);
    const videoHeight = videoWidth / videoRatio;
    gsap.set(heroVideo, { position: 'absolute', width: videoWidth, height: videoHeight, left: '50%', top: '50%', xPercent: -50, yPercent: -50, scaleX: 1, scaleY: 1 });
    const scaleX = card / width;
    const scaleY = card / height;
    const frameEnd = { scaleX, scaleY, ...Object.fromEntries(corners.map(corner => [corner, `${30 / scaleX}px ${30 / scaleY}px`])) };
    const setVideoScaleX = gsap.quickSetter(heroVideo, 'scaleX');
    const setVideoScaleY = gsap.quickSetter(heroVideo, 'scaleY');
    // Cover the changing frame without stretching the film or exposing side bars in portrait.
    const fitVideo = () => {
      const x = Number(gsap.getProperty(frame, 'scaleX'));
      const y = Number(gsap.getProperty(frame, 'scaleY'));
      const cover = Math.max(width * x / videoWidth, height * y / videoHeight);
      setVideoScaleX(cover / x);
      setVideoScaleY(cover / y);
    };
    const titleX = mobile ? 0 : card / 2 + 26;
    const mobileGap = height < 650 ? 24 : 36;
    const firstY = mobile ? card / 2 + mobileGap + first.getBoundingClientRect().height / 2 : 0;
    const lastY = mobile ? card / 2 + mobileGap + last.getBoundingClientRect().height / 2 : 0;
    const firstEnd = { x: -titleX, y: -firstY, width: sideWidth, fontSize, color: '#111827' };
    const lastEnd = { x: titleX, y: lastY, width: sideWidth, fontSize, color: '#111827' };
    gsap.set([settledFirst, settledLast], { fontSize, width: sideWidth, color: '#111827' });
    gsap.set(settledFirst, { xPercent: mobile ? -50 : 0, yPercent: mobile ? -50 : 0, x: 0, y: mobile ? -52 : 0 });
    gsap.set(settledLast, { xPercent: mobile ? -50 : 0, yPercent: mobile ? -50 : 0, x: 0, y: mobile ? 52 : 0 });
    const navEnd = {
      '--nav-width': (mobile ? width : Math.min(792, width - 32)) + 'px',
      '--nav-top': mobile ? '0px' : '12px', '--nav-fill': 1, '--nav-pad': mobile ? '16px' : '24px',
    };
    if (reduce) {
      gsap.set(story, { height });
      gsap.set('.hero-frame', frameEnd);
      fitVideo();
      gsap.set('#hero-title', { opacity: 0 });
      gsap.set('.hero-settled-headline', { opacity: 1 });
      gsap.set(settledFirst, firstEnd);
      gsap.set(settledLast, lastEnd);
      gsap.set(nav, navEnd);
      gsap.set('.hero-description', { opacity: 1 });
      gsap.set('.scroll-cue', { autoAlpha: 0 });
      gsap.set('.film-shade', { opacity: 0 });
      return;
    }
    const heroTimeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
    })
      .to(frame, { ...frameEnd, duration: 1, onUpdate: fitVideo }, 0)
      .to('#hero-title', { opacity: 0, duration: .55 }, 0)
      .to('.hero-settled-headline', { opacity: 1, duration: .34 }, .12)
      .to(settledFirst, { x: firstEnd.x, y: firstEnd.y, duration: 1 }, 0)
      .to(settledLast, { x: lastEnd.x, y: lastEnd.y, duration: 1 }, 0)
      .fromTo(nav, {
        '--nav-width': (mobile ? width : width - 104) + 'px',
        '--nav-top': '48px', '--nav-fill': 0, '--nav-pad': mobile ? '16px' : '0px',
      }, { ...navEnd, duration: .3, immediateRender: false }, 0)
      .to('.scroll-cue', { autoAlpha: 0, duration: .18 }, 0)
      .to('.film-shade', { opacity: 0, duration: .5 }, 0)
      .to('.hero-description', { opacity: 1, duration: .25 }, .75);
    const disposeSettling = createScrollSettling(heroTimeline.scrollTrigger);
    return disposeSettling;
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
  disposeReveals();
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
