import React, { useState } from 'react';
import { site } from '../../config/site';
import { BuildingsIcon as Buildings, ChartLineIcon as ChartLine, FileTextIcon as FileText, WalletIcon as Wallet } from '@phosphor-icons/react';
import '../../styles/refihub-sections.css';

const views = ['Asset overview', 'Performance', 'Payments'];
export function WorkspaceScroll({ image }) {
  const [active, setActive] = useState(0);
  function navigateTabs(event, index) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? views.length - 1 : (index + delta + views.length) % views.length;
    setActive(next); document.getElementById('project-view-tab-' + next)?.focus();
  }
  return <div className="investor-experience">
    <header className="investor-heading"><h2 id="platform-title" tabIndex={-1}>Understand the opportunity.<br /><span className="text-teal">Follow its performance.</span></h2><p className="section-intro">A connected view of the project, its operating performance, and the payments you receive.</p></header>
    <div className="investor-benefits">
      <div><Buildings size={26} aria-hidden="true" /><h3>Know the asset.</h3><p>Understand the infrastructure, its revenue sources, and the terms behind the opportunity.</p></div>
      <div><ChartLine size={26} aria-hidden="true" /><h3>Follow performance.</h3><p>See project updates and operating records alongside the investment.</p></div>
      <div><Wallet size={26} aria-hidden="true" /><h3>See your payments.</h3><p>Keep the payments you receive connected to the project behind them.</p></div>
    </div>
    <div className="project-interface">
      <div className="project-interface-header"><span><img src="/assets/gen-z-symbol.svg" width="25" height="25" alt="" /> Gen-Z workspace</span></div>
      <div className="project-view-tabs" role="tablist" aria-label="Project view">{views.map((label,index) => <button key={label} id={'project-view-tab-'+index} role="tab" aria-selected={active===index} tabIndex={active===index ? 0 : -1} aria-controls="project-view-panel" onClick={() => setActive(index)} onKeyDown={event => navigateTabs(event,index)}>{label}</button>)}</div>
      <div className="project-view-panel" id="project-view-panel" role="tabpanel" aria-labelledby={'project-view-tab-'+active} tabIndex={0}>
        {active===0 && <div className="project-overview"><img src={image.src} srcSet={image.srcSet} sizes={image.sizes} width={image.width} height={image.height} alt="Illustrative rooftop solar infrastructure" loading="lazy" decoding="async" /><div><p className="project-view-category">Renewable generation</p><h3>The asset behind the opportunity.</h3><p>Bring the infrastructure, revenue model, and project agreements into focus.</p><dl><div><dt>Infrastructure</dt><dd>Rooftop solar</dd></div><div><dt>Revenue source</dt><dd>Energy sales</dd></div><div><dt>Project information</dt><dd>Operating records & agreements</dd></div></dl></div></div>}
        {active===1 && <div className="project-record-view"><ChartLine size={38} aria-hidden="true" /><h3>A clearer picture of project performance.</h3><p>Read production, billing, and operating updates together.</p><div className="project-record-rows">{[['Energy production','Output and operating performance'],['Billing records','Energy sales and customer invoices'],['Operator updates','Maintenance, availability, and project developments']].map(([title,body]) => <div key={title}><FileText size={22} aria-hidden="true" /><span><strong>{title}</strong><small>{body}</small></span></div>)}</div></div>}
        {active===2 && <div className="project-record-view"><Wallet size={38} aria-hidden="true" /><h3>Your payment history in one place.</h3><p>Follow the payment date, amount received, and project reference.</p><div className="payment-preview-empty"><p>Payment history will appear here.</p></div></div>}
      </div>
    </div>
    <div className="investor-launch"><p>Energy infrastructure, with the information to understand it.</p><a className="primary-button" href={site.platformAuthUrl}>Launch app</a></div>
  </div>;
}
