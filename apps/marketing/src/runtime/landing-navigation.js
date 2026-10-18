import { scrollLandingTo } from './smooth-scroll.js';

export function goToSection(id, event) {
  event?.preventDefault();
  const section = document.getElementById(id);
  if (!section) return;
  const heading = section.querySelector('h2, h3') || section;
  heading.focus({ preventScroll: true });
  history.replaceState(null, '', '#' + id);
  const offset = -(parseFloat(getComputedStyle(section).scrollMarginTop) || 0);
  scrollLandingTo(section, { offset });
}

export function prepareRole(role, event) {
  event?.preventDefault();
  window.location.assign('/contact/?role=' + encodeURIComponent(role));
}
