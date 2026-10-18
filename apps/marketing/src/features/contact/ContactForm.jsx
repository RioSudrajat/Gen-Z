import React, { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon as ArrowRight } from '@phosphor-icons/react';
import { inquiryRoles as roles, validateInquiry, inquiryDraft, inquiryPayload } from '../../application/inquiry.mjs';

export function ContactForm({ deliveryEnabled = false, onSend }) {
  const [values, setValues] = useState({ role: 'operator', name: '', company: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [download, setDownload] = useState('');
  const [status, setStatus] = useState('idle');
  const [reference, setReference] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const form = useRef(null);
  const result = useRef(null);
  const requestKey = useRef(null);
  const inFlight = useRef(false);
  useEffect(() => {
    setHydrated(true);
    const role = new URLSearchParams(location.search).get('role');
    if (Object.hasOwn(roles, role)) setValues(current => ({ ...current, role }));
  }, []);
  useEffect(() => {
    if (!draft) { setDownload(''); return; }
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    setDownload(url);
    result.current?.focus();
    return () => URL.revokeObjectURL(url);
  }, [draft]);

  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: null }));
    setDraft(''); setFeedback(''); setStatus('idle'); setReference(''); requestKey.current = null;
  }
  function submit(event) {
    event.preventDefault();
    const next = validateInquiry(values);
    setErrors(next);
    if (Object.keys(next).length) { form.current.elements[Object.keys(next)[0]]?.focus(); return; }
    setDraft(inquiryDraft(values));
  }
  async function send() {
    if (inFlight.current || status === 'sent') return;
    inFlight.current = true;
    setStatus('sending'); setFeedback('');
    try {
      requestKey.current ??= crypto.randomUUID();
      const receipt = await onSend(inquiryPayload(values), requestKey.current);
      setReference(receipt.reference); setStatus('sent');
      setFeedback('Your inquiry has been received. Keep the reference below for follow-up.');
    } catch (error) {
      setStatus('error');
      setFeedback(error.name === 'TimeoutError' ? 'Confirmation timed out. Retry the same message; your draft is still here.' : error.message);
    } finally { inFlight.current = false; }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setFeedback('Message copied.'); }
    catch { setFeedback('Copy is unavailable. You can download the message instead.'); }
  }
  return <div className="contact-page-form">
    <h2>Start the conversation.</h2><p>Share a little context so the next conversation starts in the right place.</p>
    <form ref={form} onSubmit={submit} method="post" noValidate aria-busy={status === 'sending'}>
      <fieldset disabled={!hydrated || status === 'sending' || status === 'sent'}>
        <legend className="sr-only">Your conversation with Gen-Z</legend>
        <label htmlFor="contact-role">I’d like to discuss</label><select id="contact-role" name="role" value={values.role} onChange={change}>{Object.entries(roles).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
        <div className="entry-form-pair">{[['name','Name','text',true],['company','Company','text',false]].map(([name,label,type,required]) => <div key={name}>
          <label htmlFor={'contact-'+name}>{label}{!required && <small> (optional)</small>}</label><input id={'contact-'+name} name={name} type={type} autoComplete={name === 'name' ? 'name' : 'organization'} value={values[name]} onChange={change} maxLength={120} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? 'contact-error-'+name : undefined} />{errors[name] && <p className="entry-error" id={'contact-error-'+name}>{errors[name]}</p>}
        </div>)}</div>
        <label htmlFor="contact-email">Work email</label><input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={change} maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-error-email' : undefined} />{errors.email && <p className="entry-error" id="contact-error-email">{errors.email}</p>}
        <label htmlFor="contact-message">What would you like to discuss?</label><textarea id="contact-message" name="message" rows={5} maxLength={2000} value={values.message} onChange={change} required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-error-message' : undefined} />{errors.message && <p className="entry-error" id="contact-error-message">{errors.message}</p>}
        <button className="primary-button" type="submit">Review message <ArrowRight size={18} aria-hidden="true" /></button>
      </fieldset>
      {!deliveryEnabled && <p className="entry-preview-note">Prepare a message to copy or download.</p>}
    </form>
    {draft && <section className="message-review" ref={result} tabIndex={-1} aria-labelledby="message-review-title">
      <h3 id="message-review-title">{status === 'sent' ? 'Your inquiry is received.' : 'Your message is ready.'}</h3><pre>{draft}</pre>
      <div>{deliveryEnabled && <button className="primary-button" disabled={status === 'sending' || status === 'sent'} onClick={send}>{status === 'sending' ? 'Sending…' : status === 'sent' ? 'Inquiry received' : status === 'error' ? 'Retry sending' : 'Send inquiry'}</button>}<button className="secondary-button" onClick={copy}>Copy message</button>{download && <a className="secondary-button" href={download} download="gen-z-message.txt">Download message</a>}</div>
      {reference && <p>Reference: <strong>{reference}</strong></p>}
    </section>}
    <p className={'entry-feedback' + (status === 'error' ? ' entry-error' : '')} role="status">{feedback}</p>
  </div>;
}
