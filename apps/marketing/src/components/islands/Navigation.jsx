import React, { useEffect, useRef, useState } from 'react';
import { site } from '../../config/site';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon as ArrowLeft, ArrowUpRightIcon as ArrowUpRight, BatteryChargingIcon as BatteryCharging, BuildingsIcon as Buildings, CaretRightIcon as CaretRight, ChartLineIcon as ChartLine, FileTextIcon as FileText, LightningIcon as Lightning, ListIcon as List, NetworkIcon as Network, PauseIcon as Pause, PlayIcon as Play, UsersIcon as Users, WalletIcon as Wallet, XIcon as X } from '@phosphor-icons/react';
import { goToSection } from '../../runtime/landing-navigation.js';
import { gsap } from 'gsap';

const destinations = { generation:'opportunities', infrastructure:'opportunities', finance:'assets', reporting:'evidence', network:'stack', services:'ecosystem', operators:'ecosystem-operator', investors:'ecosystem-investor', rights:'evidence', overview:'why', contact:'/contact/' };

const menus = {
  Products: [
    { heading: 'Energy assets', entries: [['generation', 'Generation', 'Solar, wind, and renewable energy', Lightning], ['infrastructure', 'Infrastructure', 'Storage, mobility, and connected demand', BatteryCharging]] },
    { heading: 'Platforms & finance', entries: [['finance', 'Project finance', 'From asset review to investor access', Wallet], ['reporting', 'Project reporting', 'Energy contracts and operating records', ChartLine]] },
    { heading: 'Infrastructure', entries: [['network', 'Gen-Z network', 'Connect the physical and financial layers', Network], ['contact', 'Partnerships', 'Build the connection with Gen-Z', Users]] },
  ],
  Resources: [
    { entries: [['reporting', 'Project information', 'Contracts, investor agreements, and records', FileText], ['motion', 'Background film', 'Control background motion', Pause], ['thesis-motion', 'Section motion', 'Choose an animated or static energy thesis', Pause]] },
  ],
  Ecosystem: [
    { entries: [['operators', 'Asset operators', 'Connect operating assets with capital', Buildings], ['investors', 'Investors', 'Understand projects and their potential', Wallet]] },
  ],
  About: [
    { entries: [['overview', 'Our purpose', 'Energy infrastructure meets global capital', Lightning], ['contact', 'Contact Gen-Z', 'Discuss an asset, mandate, or partnership', Users], ['network', 'The Gen-Z stack', 'How the physical and financial layers connect', Network]] },
  ],
};

function Brand({ iconOnly = false, onClick }) {
  return <a className={iconOnly ? 'brand icon-only' : 'brand'} href="#top" aria-label="Gen-Z home" onClick={onClick}>
    <img src="/assets/gen-z-symbol.svg" width="32" height="32" alt="" /><span>Gen-Z</span>
  </a>;
}

function useNativeDialog(open, onClose, fallback) {
  const ref = useRef(null);
  const callback = useRef(onClose);
  callback.current = onClose;
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previous = fallback?.current || document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const cancel = (event) => { event.preventDefault(); callback.current(); };
    const trap = (event) => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter((element) => element.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('cancel', cancel);
    dialog.addEventListener('keydown', trap);
    return () => {
      dialog.removeEventListener('cancel', cancel);
      dialog.removeEventListener('keydown', trap);
      dialog.close();
      document.body.style.overflow = overflow;
      const target = previous?.isConnected ? previous : fallback?.current;
      target?.focus({ preventScroll: true });
    };
  }, [open]);
  return ref;
}

export function Navigation({ media, sectionMedia }) {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(null);
  const [mediaState, setMediaState] = useState(media.getState());
  const [sectionState, setSectionState] = useState(sectionMedia.getState());
  const navigation = useRef(null);
  const menuButton = useRef(null);
  const reduced = useReducedMotion();
  const mobileDialog = useNativeDialog(mobileOpen, () => setMobileOpen(false), menuButton);
  useEffect(() => {
    const motion = gsap.matchMedia();
    motion.add({ reduce:'(prefers-reduced-motion: reduce)', normal:'(prefers-reduced-motion: no-preference)' }, ({ conditions }) => {
      const announcement = navigation.current.querySelector('.announcement');
      if (conditions.reduce) gsap.set(announcement, { autoAlpha:0 });
      else gsap.to(announcement, { autoAlpha:0, ease:'none', scrollTrigger:{ trigger:'.hero-story', start:'top top', end:() => '+=' + (document.querySelector('.hero-story').offsetHeight - window.innerHeight) * .15, scrub:.65, invalidateOnRefresh:true } });
    });
    return () => motion.revert();
  }, []);
  useEffect(() => media.subscribe(setMediaState), [media]);
  useEffect(() => sectionMedia.subscribe(setSectionState), [sectionMedia]);
  useEffect(() => {
    if (!mobileOpen) return;
    const focusTimer = setTimeout(() => {
      mobileDialog.current.querySelector(mobileCategory ? '.drawer-back' : '.drawer-categories button')?.focus({ preventScroll: true });
    }, 180);
    return () => clearTimeout(focusTimer);
  }, [mobileOpen, mobileCategory]);
  useEffect(() => {
    const outside = (event) => { if (!navigation.current.contains(event.target)) setOpen(null); };
    const escape = (event) => {
      if (event.key === 'Escape' && open) {
        navigation.current.querySelector('[aria-expanded="true"]')?.focus();
        setOpen(null);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  useEffect(() => {
    const desktop = matchMedia('(min-width: 768px)');
    const close = () => { setMobileOpen(false); setMobileCategory(null); setOpen(null); };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  function navigate(key, event) {
    event?.preventDefault();
    const target = destinations[key];
    setOpen(null); setMobileOpen(false); setMobileCategory(null);
    if (target.startsWith('/')) { window.location.assign(target); return; }
    if(key==='generation' || key==='infrastructure') window.dispatchEvent(new CustomEvent('genz:asset-category',{detail:key==='generation' ? 'generation' : 'storage'}));
    requestAnimationFrame(() => goToSection(target));
  }
  function renderEntries(category) {
    return menus[category].map((group, index) => <div className="menu-group" key={index}>
      {group.heading && <p className="menu-heading">{group.heading}</p>}
      {group.entries.map(([key, title, description, Icon]) => {
        const motionItem = key === 'motion';
        const sectionItem = key === 'thesis-motion';
        const mediaItem = motionItem || sectionItem;
        const mediaLabel = mediaState === 'playing' ? 'Pause background film' : mediaState === 'error' ? 'Retry background film' : 'Play background film';
        const sectionLabel = !sectionState.canAnimate ? 'Section follows device preferences' : sectionState.enabled ? 'Use static energy section' : 'Animate energy section';
        const ItemIcon = motionItem ? (mediaState === 'playing' ? Pause : Play) : sectionItem ? (sectionState.enabled ? Pause : Play) : Icon;
        const Entry = mediaItem ? 'button' : 'a';
        return <Entry className="menu-entry" key={key} disabled={sectionItem && !sectionState.canAnimate} href={mediaItem ? undefined : destinations[key].startsWith('/') ? destinations[key] : '#'+destinations[key]} onClick={(event) => motionItem ? media.toggle() : sectionItem ? sectionMedia.toggleMotion() : navigate(key,event)}>
          <span className="menu-entry-icon"><ItemIcon size={22} /></span>
          <span className="menu-entry-copy"><span>{motionItem ? mediaLabel : sectionItem ? sectionLabel : title}</span><small>{motionItem ? 'Forward, then backward · silent' : sectionItem ? 'Accessibility preference for the thesis section' : description}</small></span>
          <ArrowUpRight size={15} className="entry-arrow" aria-hidden="true" />
        </Entry>;
      })}
    </div>);
  }

  return <LazyMotion features={domAnimation}><div className="navigation-content" ref={navigation}>
    <div className="announcement">
      <span>Energy infrastructure. Global capital.</span>
      <a href="/contact/">Contact Gen-Z <CaretRight size={14} aria-hidden="true" /></a>
    </div>
    <nav className={'nav-shell' + (open ? ' menu-is-open' : '')} aria-label="Main navigation">
      <Brand onClick={() => setOpen(null)} />
      <div className="nav-links">
        {Object.keys(menus).map((name) => <div className="nav-item" key={name}>
          <button aria-expanded={open === name} aria-controls={'menu-' + name.toLowerCase()}
            onClick={() => setOpen((current) => current === name ? null : name)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault(); setOpen(name);
                requestAnimationFrame(() => document.querySelector('#menu-' + name.toLowerCase() + ' .menu-entry')?.focus());
              }
            }}>{name}</button>
        </div>)}
      </div>
      <div className="nav-actions">
        <a className="launch-button" href={site.platformAuthUrl}>Launch app</a>
        <button className="mobile-toggle icon-button" ref={menuButton} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={mobileOpen}
          onClick={() => { setMobileCategory(null); setMobileOpen(true); }}><List size={24} /></button>
      </div>
    </nav>
    <AnimatePresence>
      {open && <m.div key={open} id={'menu-' + open.toLowerCase()} className="mega-menu"
        initial={{ opacity: 0, y: reduced ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : .16 }} aria-label={open}>
        <div className="menu-list">{renderEntries(open)}</div>
        {open !== 'Resources' && <div className="menu-preview" aria-hidden="true"><img src="/assets/gen-z-video-poster.webp" alt="" /><span>One electrification ecosystem.</span></div>}
      </m.div>}
    </AnimatePresence>
    <dialog className="mobile-drawer" ref={mobileDialog} aria-label="Navigation">
      <div className="drawer-top"><Brand iconOnly onClick={() => setMobileOpen(false)} /><div className="nav-actions">
        <a className="launch-button" href={site.platformAuthUrl}>Launch app</a>
        <button className="icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={24} /></button>
      </div></div>
      <AnimatePresence mode="wait">
        {mobileCategory ? <m.div key={mobileCategory} className="drawer-category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .15 }}>
          <button className="drawer-back" onClick={() => setMobileCategory(null)}><ArrowLeft size={20} />{mobileCategory}</button>
          {renderEntries(mobileCategory)}
        </m.div> : <m.div key="categories" className="drawer-categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .15 }}>
          {Object.keys(menus).map((name) => <button key={name} onClick={() => setMobileCategory(name)}>{name}<CaretRight size={22} /></button>)}
        </m.div>}
      </AnimatePresence>
    </dialog>
  </div></LazyMotion>;
}
