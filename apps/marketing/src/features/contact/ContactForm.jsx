import React, { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react';
import { inquiryRoles, assetCategories, operatingStates, emptyContact, emptyContext, validateInquiry, inquiryDraft, inquiryPayload } from '../../application/inquiry.mjs';

const detailsFields = ['name', 'email', 'company', 'phone'];
const contextHeadings = { operator:'About your asset', investor:'Your investment mandate', partner:'About your partnership' };

function Field({ name, label, optional = false, error, children, hint }) {
  return <div className="inquiry-field">
    <label htmlFor={`contact-${name}`}>{label}{optional && <span> (optional)</span>}</label>
    {children}
    {hint && <p className="field-hint" id={`contact-hint-${name}`}>{hint}</p>}
    {error && <p className="entry-error" id={`contact-error-${name}`}>{error}</p>}
  </div>;
}

function ReviewGroup({ title, rows, onEdit, disabled }) {
  return <section className="inquiry-review-group">
    <div className="inquiry-review-heading"><h3>{title}</h3><button type="button" className="inquiry-text-button" onClick={onEdit} disabled={disabled}>Edit <span className="sr-only">{title.toLowerCase()}</span></button></div>
    <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </section>;
}

export function ContactForm({ policy = null, policyState = 'unavailable', canRetryPolicy = false, onRetryPolicy, onSend, operatorImage }) {
  const [role, setRole] = useState('operator');
  const [contact, setContact] = useState(emptyContact);
  const [contexts, setContexts] = useState(() => Object.fromEntries(Object.keys(inquiryRoles).map(key => [key, emptyContext()])));
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [errors, setErrors] = useState({});
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [download, setDownload] = useState('');
  const [status, setStatus] = useState('idle');
  const [reference, setReference] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const form = useRef(null);
  const heading = useRef(null);
  const pendingFocus = useRef(null);
  const requestKey = useRef(null);
  const inFlight = useRef(false);
  const values = { ...contact, ...contexts[role], role, privacyAcknowledged };
  const locked = status === 'sending' || status === 'sent';
  const draft = step === 3 ? inquiryDraft(values) : '';
  const steps = ['Your details', role === 'operator' ? 'Asset & financing' : role === 'investor' ? 'Investment mandate' : 'Partnership details', 'Review inquiry'];

  useEffect(() => {
    const topic = new URLSearchParams(location.search).get('role');
    if (Object.hasOwn(inquiryRoles, topic)) setRole(topic);
    setHydrated(true);
  }, []);
  useEffect(() => {
    document.title = `Step ${step} of 3: ${steps[step - 1]} | Contact Gen-Z`;
  }, [step, role]);
  useEffect(() => {
    if (!pendingFocus.current) return;
    const field = pendingFocus.current;
    pendingFocus.current = null;
    if (field === 'heading') heading.current?.focus();
    else form.current?.elements.namedItem(field)?.focus();
  }, [step, errors, role]);
  useEffect(() => {
    if (!draft) { setDownload(''); return; }
    const url = URL.createObjectURL(new Blob([draft], { type:'text/plain;charset=utf-8' }));
    setDownload(url);
    return () => URL.revokeObjectURL(url);
  }, [draft]);
  useEffect(() => { setPrivacyAcknowledged(false); requestKey.current = null; }, [policy?.versionId]);

  function resetReceipt() {
    setFeedback(''); setStatus('idle'); setReference(''); requestKey.current = null;
  }
  function change(event) {
    const { name, value, type, checked } = event.target;
    if (detailsFields.includes(name)) setContact(current => ({ ...current, [name]:value }));
    else setContexts(current => ({ ...current, [role]:{ ...current[role], [name]:type === 'checkbox' ? checked : value } }));
    setErrors(current => ({ ...current, [name]:null, ...(name === 'financingUnknown' ? { financingAmount:null } : {}) }));
    setFurthest(current => Math.min(current, step));
    setPrivacyAcknowledged(false); resetReceipt();
  }
  function chooseRole(event) {
    if (locked) return;
    setRole(event.target.value); setStep(1); setFurthest(1); setErrors({});
    setPrivacyAcknowledged(false); resetReceipt();
  }
  function move(next) {
    if (locked) return;
    pendingFocus.current = 'heading'; setErrors({}); setStep(next); setFeedback('');
  }
  function validate(scope = 'all') {
    const next = validateInquiry(values, scope);
    const first = Object.keys(next)[0];
    if (first) {
      pendingFocus.current = first;
      setStep(detailsFields.includes(first) ? 1 : 2);
      setErrors(next);
      return false;
    }
    return true;
  }
  function submit(event) {
    event.preventDefault();
    if (locked || step === 3 || !validate(step === 1 ? 'details' : 'all')) return;
    const next = step + 1;
    setFurthest(current => Math.max(current, next)); move(next);
  }
  async function send() {
    if (inFlight.current || status === 'sent' || role !== 'operator' || !policy || !validate()) return;
    if (!privacyAcknowledged) {
      pendingFocus.current = 'privacyAcknowledged';
      setErrors({ privacyAcknowledged:'Read the privacy notice and confirm before sending.' });
      return;
    }
    inFlight.current = true; setStatus('sending'); setFeedback('Sending your inquiry…');
    try {
      requestKey.current ??= crypto.randomUUID();
      const receipt = await onSend(values, requestKey.current);
      setReference(receipt.reference); setStatus('sent');
      setFeedback('Your inquiry has been received. Keep the reference for follow-up.');
    } catch (error) {
      setStatus('error');
      setFeedback(error.name === 'TimeoutError' ? 'Confirmation timed out. Retry the same inquiry; your draft is still here.' : error.message);
    } finally { inFlight.current = false; }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setFeedback('Inquiry copied.'); }
    catch { setFeedback('Copy is unavailable. Download your inquiry instead.'); }
  }
  function control(name, hint = false) {
    return { id:`contact-${name}`, name, value:values[name], onChange:change, 'aria-invalid':Boolean(errors[name]),
      'aria-describedby':[errors[name] && `contact-error-${name}`, hint && `contact-hint-${name}`].filter(Boolean).join(' ') || undefined };
  }
  const clean = step === 3 ? inquiryPayload(values) : null;

  return <div className="guided-inquiry">
    <div className="inquiry-intro">
      <h1>{role === 'operator' ? <>Let’s discuss your <span>asset.</span></> : role === 'investor' ? <>Let’s discuss your <span>investment.</span></> : <>Let’s explore a <span>partnership.</span></>}</h1>
      <p>A few details to help us prepare the right conversation.</p>
    </div>
    <fieldset className="inquiry-topics" disabled={!hydrated || locked}>
      <legend className="sr-only">Choose your conversation topic</legend>
      {Object.entries(inquiryRoles).map(([id, label]) => <label key={id} className={role === id ? 'is-selected' : ''}>
        <input type="radio" name="role" value={id} checked={role === id} onChange={chooseRole} />{label}
      </label>)}
    </fieldset>
    <div className="inquiry-layout">
      <aside className="inquiry-sidebar" aria-label="Inquiry progress">
        <ol className="inquiry-steps">{steps.map((label, index) => <li key={index} aria-current={step === index + 1 ? 'step' : undefined}>
          <button type="button" onClick={() => move(index + 1)} disabled={!hydrated || locked || index + 1 > furthest || step === index + 1}>
            <span className="inquiry-step-marker" aria-hidden="true">{index + 1 < step ? <CheckIcon size={18} weight="bold" /> : index + 1}</span>
            <span>{label}<small>{index === 0 ? 'Contact information' : index === 1 ? (role === 'operator' ? 'Tell us about your asset' : 'Share a little context') : 'Check and prepare to send'}</small></span>
          </button>
        </li>)}</ol>
        <figure className="inquiry-context-image"><img src={operatorImage} alt="" width="280" height="225" loading="lazy" /><figcaption>Illustrative infrastructure.</figcaption></figure>
        <p className="inquiry-sidebar-note">We’ll review your inquiry before discussing next steps.</p>
      </aside>
      <form className="contact-page-form inquiry-form" ref={form} onSubmit={submit} method="post" noValidate aria-busy={status === 'sending'}>
        <p className="inquiry-step-count">Step {step} of 3</p>
        <h2 ref={heading} tabIndex={-1}>{step === 1 ? 'Your details' : step === 2 ? contextHeadings[role] : status === 'sent' ? 'Inquiry received' : 'Review your inquiry'}</h2>
        <fieldset className="inquiry-stage" disabled={!hydrated || locked}>
          <legend className="sr-only">{steps[step - 1]}</legend>
          {step === 1 && <>
            <div className="inquiry-field-grid">
              <Field name="name" label="Full name" error={errors.name}><input {...control('name')} autoComplete="name" maxLength={120} required placeholder="Your full name" /></Field>
              <Field name="email" label="Work email" error={errors.email}><input {...control('email')} type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com" /></Field>
              <Field name="company" label="Company" optional error={errors.company}><input {...control('company')} autoComplete="organization" maxLength={160} placeholder="Your company" /></Field>
              <Field name="phone" label="Phone" optional error={errors.phone}><input {...control('phone')} type="tel" autoComplete="tel" maxLength={40} placeholder="Include country code" /></Field>
            </div>
          </>}
          {step === 2 && <>
            {role === 'operator' && <div className="inquiry-field-grid">
              <Field name="assetCategory" label="Asset category" error={errors.assetCategory}><select {...control('assetCategory')} required><option value="">Select category</option>{Object.entries(assetCategories).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></Field>
              <Field name="operationsState" label="Operating status" error={errors.operationsState}><select {...control('operationsState')} required><option value="">Select status</option>{Object.entries(operatingStates).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></Field>
              <Field name="country" label="Country"><input id="contact-country" value="Indonesia" readOnly autoComplete="off" /></Field>
              <Field name="region" label="Province / region" error={errors.region}><input {...control('region')} maxLength={160} autoComplete="address-level1" required placeholder="Enter province or region" /></Field>
            </div>}
            <Field name="message" label={role === 'operator' ? 'Asset description' : role === 'investor' ? 'What are you looking to invest in?' : 'What would you like to work on together?'} error={errors.message}>
              <textarea {...control('message')} rows={3} maxLength={role === 'operator' ? 4000 : 2000} required placeholder={role === 'operator' ? 'Describe the asset, its operations and your role.' : role === 'investor' ? 'Share your investment focus, preferred assets and goals.' : 'Tell us about your organisation and the partnership you have in mind.'} />
            </Field>
            {role === 'operator' && <section className="inquiry-financing" aria-labelledby="financing-heading">
              <h3 id="financing-heading">Financing need <span>(optional)</span></h3>
              <div className="inquiry-financing-row">
                <Field name="financingAmount" label="Amount (IDR)" error={errors.financingAmount} hint="Whole rupiah, without commas or decimal places.">
                  <div className="inquiry-amount"><span aria-hidden="true">IDR</span><input {...control('financingAmount', true)} type="text" inputMode="numeric" maxLength={78} disabled={values.financingUnknown} placeholder="Enter amount" /></div>
                </Field>
                <label className="inquiry-checkbox"><input type="checkbox" name="financingUnknown" checked={values.financingUnknown} onChange={change} />Not sure yet</label>
              </div>
            </section>}
          </>}
          {step === 3 && <div className="message-review">
            <ReviewGroup title="Your details" disabled={locked} onEdit={() => move(1)} rows={[
              ['Full name',clean.name], ['Work email',clean.email], ['Company',clean.company || 'Not provided'], ['Phone',clean.phone || 'Not provided']]} />
            <ReviewGroup title={role === 'operator' ? 'Asset & financing' : steps[1]} disabled={locked} onEdit={() => move(2)} rows={role === 'operator' ? [
              ['Asset category',assetCategories[clean.assetCategory]], ['Country','Indonesia'], ['Province / region',clean.region], ['Operating status',operatingStates[clean.operationsState]],
              ['Financing need',clean.financingNeed ? 'IDR ' + clean.financingNeed.minorUnits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Not specified'], ['Asset description',clean.message]] : [['Message',clean.message]]} />
            <details className="inquiry-privacy" id="inquiry-privacy"><summary>How your inquiry details are used</summary><p>Gen-Z uses your contact and inquiry details to review and respond to your request. Your inquiry does not subscribe you to marketing updates. Please leave sensitive documents out of this form.</p></details>
            {policy && role === 'operator' && <div className="inquiry-privacy-ack">
              <label className="inquiry-checkbox"><input id="contact-privacyAcknowledged" type="checkbox" name="privacyAcknowledged" checked={privacyAcknowledged} onChange={event => { setPrivacyAcknowledged(event.target.checked); setErrors({}); }} aria-invalid={Boolean(errors.privacyAcknowledged)} aria-describedby={errors.privacyAcknowledged ? 'contact-error-privacyAcknowledged' : undefined} />I have read the inquiry privacy notice.</label>
              <a href={policy.noticeUrl} target="_blank" rel="noopener noreferrer">Read privacy notice <span className="sr-only">(opens in a new tab)</span></a>
              {errors.privacyAcknowledged && <p className="entry-error" id="contact-error-privacyAcknowledged">{errors.privacyAcknowledged}</p>}
            </div>}
          </div>}
          {step < 3 && <div className="inquiry-actions">
            {step > 1 && <button className="secondary-button" type="button" onClick={() => move(step - 1)}>Back</button>}
            <button className="primary-button" type="submit">{step === 1 ? 'Continue' : 'Review inquiry'}<ArrowRightIcon size={18} aria-hidden="true" /></button>
          </div>}
        </fieldset>
        {step === 3 && <>
          <div className="inquiry-review-actions">
            {policy && role === 'operator' && <button type="button" className="primary-button" disabled={locked} onClick={send}>{status === 'sending' ? 'Sending…' : status === 'sent' ? 'Inquiry received' : status === 'error' ? 'Retry sending' : 'Send inquiry'}<ArrowRightIcon size={18} aria-hidden="true" /></button>}
            <button type="button" className="secondary-button" onClick={copy}>Copy inquiry</button>
            {download && <a className="secondary-button" href={download} download="gen-z-message.txt">Download inquiry</a>}
          </div>
          {status !== 'sent' && (!policy || role !== 'operator') && <p className="entry-preview-note">{policyState === 'loading' && role === 'operator' ? 'Checking inquiry availability…' : 'Sending is currently unavailable. Copy or download your inquiry to keep it.'}{canRetryPolicy && role === 'operator' && policyState === 'unavailable' && <button type="button" className="inquiry-text-button" onClick={onRetryPolicy}>Check availability</button>}</p>}
          {reference && <p className="inquiry-receipt">Reference: <strong>{reference}</strong></p>}
        </>}
        {step === 2 && <p className="inquiry-sensitive-note">Please leave sensitive documents out of this form.</p>}
        <p className={'entry-feedback' + (status === 'error' ? ' entry-error' : '')} role="status" aria-live="polite">{feedback}</p>
      </form>
    </div>
  </div>;
}
