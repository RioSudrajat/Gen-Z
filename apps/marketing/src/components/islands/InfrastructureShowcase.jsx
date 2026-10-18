'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, XIcon as X } from '@phosphor-icons/react';
import '../../styles/infrastructure-showcase.css';
import { withImageRetry } from '../../assets/image-url.mjs';

const assetCategories = [
  {
    id: 'generation', category: 'Renewable generation', title: 'Where energy begins.',
    description: 'Solar, wind, and renewable generation. The starting point is an operating asset, its commercial agreements, and evidence of collected revenue.',
    focus: 'Solar & wind', image: 'generation',
    alt: 'Illustrative industrial rooftop solar installation surrounded by tropical greenery',
    review: ['Operating history and generation records', 'Power purchase agreements and customer payments', 'Project rights, issuer obligations, and risks'],
    detail: 'Energy sales connect productive generation with revenue. Project review brings the operator, power purchase agreements, operating history, and payments received into view.',
  },
  {
    id: 'storage', category: 'Energy storage', title: 'Keep energy moving.',
    description: 'Battery systems that support energy supply. Each future project needs a clear operating model, service agreements, and its own payment evidence.',
    focus: 'Battery systems', image: 'storage',
    alt: 'Illustrative modular battery storage installation in a tropical industrial setting',
    review: ['System condition and operating records', 'Service contracts and collected payments', 'Maintenance costs and project-specific risks'],
    detail: 'Battery infrastructure supports energy supply and flexibility. Its financing starts with the operating model, service agreements, system condition, and sources of revenue.',
  },
  {
    id: 'infrastructure', category: 'Electrification infrastructure', title: 'Connect energy to use.',
    description: 'Charging, mobility, and connected energy demand. Review the infrastructure behind the service, who operates it, and how project cash is collected.',
    focus: 'Charging & mobility', image: 'infrastructure',
    alt: 'Illustrative electric cargo vans at a solar-canopy charging depot',
    review: ['Infrastructure ownership and operator authority', 'Service usage, billing, and collection records', 'Project terms separate from loyalty programmes'],
    detail: 'Charging and mobility infrastructure connects energy with everyday demand. Project information covers the operator, service usage, revenue agreements, and operating costs.',
  },
];

function AssetImage({ asset, imageSource }) {
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const image = useRef(null);
  useEffect(() => {
    setStatus('loading');
    if (image.current?.complete) setStatus(image.current.naturalWidth ? 'ready' : 'error');
  }, [asset.image, attempt]);
  return <figure className="showcase-image" data-state={status}>
    {status !== 'error' && <img key={attempt} ref={image} src={withImageRetry(imageSource.src, attempt)}
      srcSet={attempt ? undefined : imageSource.srcSet} sizes={imageSource.sizes}
      width={imageSource.width} height={imageSource.height} loading="lazy" decoding="async" alt={asset.alt} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />}
    {status === 'loading' && <p className="showcase-image-status" role="status">Loading infrastructure illustration…</p>}
    {status === 'error' && <div className="showcase-image-status"><p role="status">The infrastructure illustration is unavailable.</p>
      <button className="secondary-button" onClick={() => { setStatus('loading'); setAttempt(value => value + 1); }}>Retry image</button></div>}
  </figure>;
}

export function InfrastructureShowcase({ assets = assetCategories, images }) {
  const [active, setActive] = useState(0);
  const dialog = useRef(null);
  const asset = assets[active] || assets[0];
  useEffect(() => {
    const choose = event => { const index=assets.findIndex(item=>item.id===event.detail); if(index>=0)setActive(index); };
    window.addEventListener('genz:asset-category',choose);
    return () => window.removeEventListener('genz:asset-category',choose);
  },[assets]);
  function select(index) { setActive((index + assets.length) % assets.length); }
  function inquire(event) {
    event.preventDefault();
    window.location.assign('/contact/?role=operator');
  }
  return <div className="infrastructure-showcase">
    <header className="showcase-heading">
      <h2 id="opportunities-title" tabIndex={-1}>The infrastructure behind<br />the opportunity.</h2>
      <p className="section-intro">From renewable generation to storage and the infrastructure that puts energy to work.</p>
    </header>
    {!asset ? <div className="showcase-empty"><h3>Let’s discuss your infrastructure.</h3><p>Tell us about the asset you operate and the funding you are looking for.</p><a className="primary-button" href="/contact/?role=operator" onClick={inquire}>Discuss your asset</a></div> : <>
      <div className="showcase-panel" role="region" aria-roledescription="carousel" aria-label="Infrastructure categories">
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{asset.category}, category {active + 1} of {assets.length}.</p>
        <div className="showcase-slide" key={asset.id} role="group" aria-roledescription="slide" aria-label={(active + 1) + ' of ' + assets.length + ': ' + asset.category}>
          <AssetImage asset={asset} imageSource={images[asset.image]} />
          <div className="showcase-summary">
            <div className="showcase-category-row"><p>{asset.category}</p></div>
            <div className="showcase-copy"><h3>{asset.title}</h3><p>{asset.description}</p></div>
            <dl className="showcase-facts"><div><dt>Asset focus</dt><dd>{asset.focus}</dd></div><div><dt>Initial market</dt><dd>Indonesia</dd></div></dl>
            <button className="showcase-detail-button" onClick={() => dialog.current.showModal()}>View asset category <ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
        {assets.length > 1 && <div className="showcase-controls">
          <div className="showcase-arrows"><button aria-label="Previous asset category" onClick={() => select(active - 1)}><ArrowLeft size={20} aria-hidden="true" /></button><button aria-label="Next asset category" onClick={() => select(active + 1)}><ArrowRight size={20} aria-hidden="true" /></button></div>
          <div className="showcase-pagination" role="group" aria-label="Choose an asset category">{assets.map((item, index) => <button key={item.id} aria-label={item.category} aria-pressed={active === index} onClick={() => select(index)}><span /></button>)}</div>
          <span className="showcase-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(assets.length).padStart(2, '0')}</span>
        </div>}
      </div>
      <dialog className="showcase-dialog" ref={dialog} aria-labelledby="showcase-dialog-title" aria-describedby="showcase-dialog-description">
        <button className="showcase-dialog-close" aria-label="Close asset category" onClick={() => dialog.current.close()}><X size={22} aria-hidden="true" /></button>
        <p className="showcase-dialog-stage">Energy infrastructure</p><h3 id="showcase-dialog-title">{asset.category}</h3>
        <p id="showcase-dialog-description">{asset.detail}</p><h4>Inside the project review</h4><ul>{asset.review.map(item => <li key={item}>{item}</li>)}</ul>
        <a className="primary-button" href="/contact/?role=operator" onClick={event => { dialog.current.close(); inquire(event); }}>Discuss your asset</a>
      </dialog>
    </>}
    {asset && <div className="showcase-footnote"><p>Operating infrastructure. Project-specific opportunities.</p><a href="/contact/?role=operator" onClick={inquire}>Discuss your asset <ArrowRight size={18} aria-hidden="true" /></a></div>}
  </div>;
}
