import React, { useCallback, useEffect, useState } from 'react';
import { ContactForm } from './ContactForm.jsx';
import { loadInquiryPolicy, submitInquiry } from '../../infrastructure/inquiry-client.mjs';
import { contactInquiryPayload } from '../../application/inquiry.mjs';
import { browserPlatformOrigin, platformInquiryEndpoint } from '../../application/platform-links.mjs';

/** Composition boundary: the form receives a gateway, never an HTTP implementation. */
export function ContactExperience({ endpoint:configuredEndpoint = '', enabled = true, operatorImage }) {
  const [endpoint, setEndpoint] = useState(configuredEndpoint);
  const [policy, setPolicy] = useState(null);
  const [policyState, setPolicyState] = useState('unavailable');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!configuredEndpoint && enabled) setEndpoint(platformInquiryEndpoint(browserPlatformOrigin('', location.origin), true));
  }, [configuredEndpoint, enabled]);
  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    setPolicy(null); setPolicyState('loading');
    loadInquiryPolicy(endpoint, AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]))
      .then(value => { if (!controller.signal.aborted) { setPolicy(value); setPolicyState('ready'); } })
      .catch(() => { if (!controller.signal.aborted) setPolicyState('unavailable'); });
    return () => controller.abort();
  }, [endpoint, attempt]);
  const send = useCallback((values, key) => {
    if (!policy) throw new Error('Inquiry sending is currently unavailable. Your draft is still here.');
    return submitInquiry(endpoint, contactInquiryPayload(values, policy.versionId), key);
  }, [endpoint, policy]);
  return <ContactForm policy={policy} policyState={policyState} canRetryPolicy={Boolean(endpoint)} onRetryPolicy={() => setAttempt(value => value + 1)} onSend={send} operatorImage={operatorImage} />;
}
