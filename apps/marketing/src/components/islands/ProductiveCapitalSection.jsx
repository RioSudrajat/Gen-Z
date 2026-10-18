'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WindTurbine } from './WindTurbine.jsx';
import { createPinnedSequence } from '../../runtime/pinned-sequence.js';

const steps = [
  { title: 'Verify.', body: 'Bring operating records, energy sales agreements, and payment history into a structured asset review.' },
  { title: 'Structure & tokenise.', body: 'Define the financing terms and investor rights, with on-chain records supporting participation and reporting.' },
  { title: 'Connect to capital.', body: 'Present the project to suitable investors with the information they need to assess the opportunity.' },
];

function CapitalSteps() {
  return <ol className="capital-steps">
      {steps.map((step, index) => <li key={step.title} className={'capital-step capital-step-' + (index + 1)}>
        <div>
          <span className="capital-step-number" aria-hidden="true">{'0' + (index + 1)}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </div>
      </li>)}
    </ol>;
}

export function ProductiveCapitalSection() {
  const stage = useRef(null);
  const pin = useRef(null);
  const rotor = useRef({ angle: 0, render: null });
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const section = stage.current.closest('#assets');
    const preference = gsap.matchMedia();
    preference.add({
      normal: '(prefers-reduced-motion: no-preference) and (min-height: 640px)',
      reduced: '(prefers-reduced-motion: reduce)',
      compact: '(max-width: 1023px)',
    }, ({ conditions }) => {
      section.dataset.reducedMotion = String(conditions.reduced);
      rotor.current.angle = 0;
      rotor.current.render?.(0);
      section.dataset.rotorAngle = '0';
      if (conditions.reduced || !conditions.normal) return;
      section.classList.add('has-pinned-sequence');
      const items = Array.from(stage.current.querySelectorAll('.capital-step'));
      gsap.set(items, { autoAlpha: 0, y: conditions.compact ? 64 : 160 });
      const sequence = createPinnedSequence({ id: 'capital-sequence', pin: pin.current, count: items.length });
      const { timeline } = sequence;
      items.forEach((item, index) => {
        timeline.to(item, { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power2.out' }, index);
        timeline.to(rotor.current, {
          angle: (index + 1) * Math.PI * 2 / 3,
          duration: 0.68,
          ease: 'power1.inOut',
          onUpdate: () => {
            section.dataset.rotorAngle = rotor.current.angle.toFixed(4);
            rotor.current.render?.(rotor.current.angle);
          },
        }, index);
        if (conditions.compact && index > 0) {
          timeline.to(items[index - 1], { autoAlpha: 0, y: -24, duration: 0.18 }, index);
        }
      });
      return () => {
        sequence.dispose();
        section.classList.remove('has-pinned-sequence');
      };
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      preference.revert();
      delete section.dataset.rotorAngle;
      delete section.dataset.reducedMotion;
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNearby(true);
      observer.disconnect();
    }, { rootMargin: '500px' });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return <div className="capital-experience">
    <div className="capital-scroll-pin" ref={pin}>
    <div className="capital-stage" ref={stage}>
      <header className="capital-heading">
        <h2 id="assets-title" tabIndex={-1}>Connect your energy assets to <span>global capital.</span></h2>
        <p>Bring operating infrastructure, project information, and investor participation into one financing workflow.</p>
      </header>
      <WindTurbine active={nearby} rotor={rotor} />
      <CapitalSteps />
    </div>
    </div>
    <div className="capital-footnote">
      <p>From operating infrastructure to an opportunity investors can understand.</p>
      <a href="/contact/?role=operator">Discuss your asset</a>
    </div>
  </div>;
}
