'use client';

import React, { useState } from 'react';
import { site } from '../../config/site';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon as ArrowRight, FileTextIcon as FileText, ReceiptIcon as Receipt, WalletIcon as Wallet, BuildingsIcon as Buildings, ClipboardTextIcon as ClipboardText, UsersIcon as Users } from '@phosphor-icons/react';
import '../../styles/refihub-sections.css';

const records = [
  { title: 'Power Purchase Agreements (PPAs)', label: 'Energy sales and contracted revenue', Icon: FileText, description: 'Understand the energy sales agreements that underpin the project’s revenue.' },
  { title: 'Project Agreements & Investor Rights', label: 'Participation terms and payment arrangements', Icon: Wallet, description: 'See how the financing is structured and what participation means for investors.' },
  { title: 'Energy Production & Billing Records', label: 'Production reports, invoices, and payment records', Icon: Receipt, description: 'Connect operating performance with billing and payments received.' },
];

function RecordSummary({ selected }) {
  const reduced = useReducedMotion();
  return <LazyMotion features={domAnimation}><AnimatePresence mode="wait">
    <m.p key={selected} className="standards-record-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .14 }}>{records[selected].description}</m.p>
  </AnimatePresence></LazyMotion>;
}

export function ProjectStandards({ skyline }) {
  const [selected, setSelected] = useState(0);
  return <div className="standards-grid">
    <article className="standards-main standards-card">
      <div className="standards-intro">
        <h2 id="evidence-title" tabIndex={-1}>The foundation for<br /><span className="text-teal">energy asset financing.</span></h2>
        <p>Bring energy contracts, investor agreements, and operating records into one clear project view.</p>
        <div aria-live="polite"><RecordSummary selected={selected} /></div>
        <a className="standards-cta" href={site.platformAuthUrl}>Launch app <ArrowRight size={20} aria-hidden="true" /></a>
      </div>
      <div className="standards-documents" role="group" aria-label="Project evidence records">
        {records.map(({ title, label, Icon }, index) => <button key={title} className="standards-document" aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <span className="standards-document-icon"><Icon size={24} aria-hidden="true" /></span>
          <span><strong>{title}</strong><small>{label}</small></span>
        </button>)}
      </div>
    </article>
    <aside className="standards-status standards-card" aria-label="Gen-Z readiness">
      <span className="standards-stage">Project information</span>
      <h3>A clearer view of the underlying asset.</h3>
      <p>Connect the physical infrastructure with the agreements and records behind it.</p>
      <FileText className="standards-shield" size={72} weight="light" aria-hidden="true" />
    </aside>
    <article className="standards-rights standards-card">
      <h3>Clear agreements. Defined participation.</h3>
      <p>Understand the project’s financing structure, investor rights, and payment arrangements alongside the infrastructure behind them.</p>
      <img src={skyline.src} srcSet={skyline.srcSet} sizes={skyline.sizes} width={skyline.width} height={skyline.height} loading="lazy" decoding="async" alt="" />
      <a className="standards-text-link" href="/contact/?role=operator">Discuss your asset <ArrowRight size={18} aria-hidden="true" /></a>
    </article>
    <article className="standards-review standards-card">
      <h3>From asset review to investor access.</h3>
      <p>We review operating records and revenue agreements, structure the financing terms, and prepare the project for investor assessment.</p>
      <ol className="standards-review-steps">
        {[{ Icon: Buildings, title: 'Asset & Revenue Reviewed' }, { Icon: ClipboardText, title: 'Project Terms Structured' }, { Icon: Users, title: 'Prepared for Investor Review' }].map(({ Icon, title }, index) => <li key={title}><Icon size={24} aria-hidden="true" /><span><span className="standards-step-index">{index + 1}.</span> {title}</span></li>)}
      </ol>
    </article>
  </div>;
}
