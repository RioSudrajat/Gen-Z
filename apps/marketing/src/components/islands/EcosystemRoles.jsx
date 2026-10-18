import React, { useEffect, useRef, useState } from 'react';
import { site } from '../../config/site';
import '../../styles/who-we-serve.css';
import { withImageRetry } from '../../assets/image-url.mjs';

const assetTypes = ['Solar Farm', 'Solar PV', 'EV Charging', 'Energy Storage', 'Data Center'];
const investorNeeds = [
  'Stable monthly income backed by real assets',
  'Live data to verify performance before and after investing',
  'Regulated and compliant investment structure',
];

function AudiencePhoto({ source, label, alt }) {
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const image = useRef(null);
  useEffect(() => {
    if (image.current?.complete) setStatus(image.current.naturalWidth ? 'ready' : 'error');
  }, [attempt]);
  return <figure className="serve-photo" data-state={status}>
    {status !== 'error' && <img key={attempt} ref={image}
      src={withImageRetry(source.src, attempt)}
      srcSet={attempt ? undefined : source.srcSet} sizes={source.sizes}
      width={source.width} height={source.height} loading="lazy" decoding="async" alt={alt}
      onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />}
    <figcaption className="serve-role">{label}</figcaption>
    {status === 'loading' && <p className="serve-photo-status" role="status">Loading image…</p>}
    {status === 'error' && <div className="serve-photo-status">
      <p role="status">The image is unavailable.</p>
      <button type="button" className="secondary-button" onClick={() => {
        setStatus('loading'); setAttempt(value => value + 1);
      }}>Retry image</button>
    </div>}
  </figure>;
}

export function EcosystemRoles({ images }) {
  const root = useRef(null);
  useEffect(() => {
    let alive = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      import('../../styles/audience-fonts.css?inline').then(async ({ default:css }) => {
        if (!document.getElementById('genz-audience-fonts')) {
          const style = document.createElement('style');
          style.id = 'genz-audience-fonts';
          style.textContent = css;
          document.head.append(style);
        }
        await Promise.all([
          document.fonts.load('600 36px "Serve Sora"'),
          document.fonts.load('400 18px "Serve Geist"'),
          document.fonts.load('600 14px "Serve Geist"'),
        ]);
      }).then(() => {
        if (alive) window.dispatchEvent(new Event('genz:layout-ready'));
      }).catch(() => {});
    }, { rootMargin:'1000px' });
    observer.observe(root.current);
    return () => { alive = false; observer.disconnect(); };
  }, []);
  return <div className="serve-audiences" ref={root}>
    <article id="ecosystem-operator" className="serve-row serve-operator" aria-labelledby="serve-operator-title">
      <AudiencePhoto source={images.operator} label="Asset Operators" alt="Energy asset operator inspecting solar infrastructure" />
      <div className="serve-copy">
        <div>
          <h3 id="serve-operator-title" tabIndex={-1}>Your energy asset generates real cashflow. Gen-Z puts it on-chain.</h3>
          <p className="serve-description">Operating energy infrastructure generates stable, long-term cashflow from signed offtake agreements. Gen-Z puts that cashflow on-chain and connects your asset to a global pool of institutional capital.</p>
        </div>
        <div className="serve-support">
          <p className="serve-support-label">Asset types</p>
          <ul className="serve-asset-types" aria-label="Asset types">{assetTypes.map(type => <li key={type}>{type}</li>)}</ul>
          <a className="primary-button serve-cta" href="/contact/?role=operator">Discuss your asset</a>
        </div>
      </div>
    </article>
    <article id="ecosystem-investor" className="serve-row serve-investor" aria-labelledby="serve-investor-title">
      <AudiencePhoto source={images.investor} label="Investors" alt="Green energy investor reviewing infrastructure performance data" />
      <div className="serve-copy">
        <div>
          <h3 id="serve-investor-title" tabIndex={-1}>Access tokenised energy assets backed by live on-chain production data.</h3>
          <p className="serve-description">Gen-Z gives investors on-chain access to operating energy assets with structured yield instruments backed by real production data and long-term energy contracts.</p>
        </div>
        <div className="serve-support">
          <p className="serve-support-label">What investors look for</p>
          <ul className="serve-investor-needs">{investorNeeds.map(need => <li key={need}>{need}</li>)}</ul>
          <a className="primary-button serve-cta" href={site.platformAuthUrl}>Launch app</a>
        </div>
      </div>
    </article>
  </div>;
}
