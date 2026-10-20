export const inquiryRoles = Object.freeze({ operator: 'Asset operator', investor: 'Investor', partner: 'Partnership' });
export const assetCategories = Object.freeze({ energy:'Energy', infrastructure:'Infrastructure' });
export const operatingStates = Object.freeze({ operational:'Operational', maintenance:'Under maintenance', planned:'Planned', unknown:'Not sure' });
export const emptyContact = () => ({ name:'', company:'', email:'', phone:'' });
export const emptyContext = () => ({ assetCategory:'', region:'', operationsState:'', message:'', financingAmount:'', financingUnknown:false });

export function validateInquiry(values, scope = 'all') {
  const errors = {};
  if (!Object.hasOwn(inquiryRoles, values.role)) errors.role = 'Choose a discussion topic.';
  if (scope !== 'context') {
    if (!values.name?.trim() || values.name.trim().length > 120) errors.name = 'Enter your name (up to 120 characters).';
    if (typeof values.email !== 'string' || values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
    if ((values.company?.trim().length ?? 0) > 160) errors.company = 'Use up to 160 characters.';
    if ((values.phone?.trim().length ?? 0) > 40) errors.phone = 'Use up to 40 characters.';
  }
  if (scope !== 'details') {
    const limit = values.role === 'operator' ? 4000 : 2000;
    if (values.role === 'operator') {
      if (!Object.hasOwn(assetCategories, values.assetCategory)) errors.assetCategory = 'Choose an asset category.';
      if (!Object.hasOwn(operatingStates, values.operationsState)) errors.operationsState = 'Choose the current operating status.';
      if (!values.region?.trim() || values.region.trim().length > 160) errors.region = 'Enter the province or region (up to 160 characters).';
    }
    if (!values.message?.trim() || values.message.trim().length < 10 || values.message.length > limit) errors.message = `Tell us a little more, between 10 and ${limit.toLocaleString('en')} characters.`;
    if (values.role === 'operator' && !values.financingUnknown && values.financingAmount?.trim() && !/^[1-9][0-9]{0,77}$/.test(values.financingAmount.trim())) errors.financingAmount = 'Enter a positive amount in whole rupiah, without commas or decimal places.';
  }
  return errors;
}

export function inquiryPayload(values) {
  const common = { role:values.role, name:values.name.trim(), company:values.company?.trim() || '', email:values.email.trim(), phone:values.phone?.trim() || '', message:values.message.trim() };
  return values.role === 'operator' ? { ...common, assetCategory:values.assetCategory, region:values.region.trim(), operationsState:values.operationsState,
    financingNeed:values.financingUnknown || !values.financingAmount?.trim() ? null : { currency:'IDR', minorUnits:values.financingAmount.trim(), scale:0 } } : common;
}

export function operatorInquiryPayload(values, policyVersionId) {
  if (values.role !== 'operator' || Object.keys(validateInquiry(values)).length || !values.privacyAcknowledged || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(policyVersionId || '')) {
    throw new Error('Review your details and the privacy notice before sending.');
  }
  const clean = inquiryPayload(values);
  return { contact:{ name:clean.name, email:clean.email, organization:clean.company || null, phone:clean.phone || null }, assetCategory:clean.assetCategory,
    location:{ countryCode:'ID', region:clean.region }, operationsState:clean.operationsState, assetDescription:clean.message, financingNeed:clean.financingNeed,
    privacyNoticeVersionId:policyVersionId, privacyAcknowledged:true };
}

export function inquiryDraft(values) {
  const clean = inquiryPayload(values);
  return ['Gen-Z inquiry', '', `Topic: ${inquiryRoles[clean.role]}`, `Name: ${clean.name}`, `Company: ${clean.company || 'Not provided'}`, `Email: ${clean.email}`, `Phone: ${clean.phone || 'Not provided'}`,
    ...(clean.role === 'operator' ? ['', `Asset category: ${assetCategories[clean.assetCategory]}`, 'Country: Indonesia', `Province / region: ${clean.region}`, `Operating status: ${operatingStates[clean.operationsState]}`,
      `Financing need: ${clean.financingNeed ? 'IDR ' + clean.financingNeed.minorUnits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Not specified'}`] : []), '', clean.message].join('\n');
}

export function contactInquiryPayload(values, policyVersionId) {
  if (values.role === 'operator') return operatorInquiryPayload(values, policyVersionId);
  if (!['investor', 'partner'].includes(values.role) || Object.keys(validateInquiry(values)).length || !values.privacyAcknowledged || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(policyVersionId || '')) {
    throw new Error('Review your details and the privacy notice before sending.');
  }
  const clean = inquiryPayload(values);
  return { topic:clean.role, contact:{ name:clean.name, email:clean.email, organization:clean.company || null, phone:clean.phone || null }, message:clean.message, privacyNoticeVersionId:policyVersionId, privacyAcknowledged:true };
}
