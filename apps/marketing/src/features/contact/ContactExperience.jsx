import React, { useCallback } from 'react';
import { ContactForm } from './ContactForm.jsx';
import { submitInquiry } from '../../infrastructure/inquiry-client.mjs';

/** Composition boundary: the form receives a gateway, never an HTTP implementation. */
export function ContactExperience({ endpoint = '' }) {
  const send = useCallback((payload, key) => submitInquiry(endpoint, payload, key), [endpoint]);
  return <ContactForm deliveryEnabled={Boolean(endpoint)} onSend={send} />;
}
