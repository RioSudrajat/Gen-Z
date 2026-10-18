export const inquiryRoles = Object.freeze({ operator: 'Asset owner / operator', investor: 'Investor', partner: 'Partnership' });

export function validateInquiry(values) {
  const errors = {};
  if (!Object.hasOwn(inquiryRoles, values.role)) errors.role = 'Choose a discussion topic.';
  if (!values.name?.trim() || values.name.trim().length > 120) errors.name = 'Enter your name (up to 120 characters).';
  if (typeof values.email !== 'string' || values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if ((values.company?.trim().length ?? 0) > 120) errors.company = 'Use up to 120 characters.';
  if (!values.message?.trim() || values.message.trim().length < 10 || values.message.length > 2000) errors.message = 'Tell us a little more, between 10 and 2,000 characters.';
  return errors;
}

export function inquiryPayload(values) {
  return { role: values.role, name: values.name.trim(), company: values.company.trim(), email: values.email.trim(), message: values.message.trim() };
}

export function inquiryDraft(values) {
  const clean = inquiryPayload(values);
  return ['Gen-Z conversation', '', `Interest: ${inquiryRoles[clean.role]}`, `Name: ${clean.name}`, `Company: ${clean.company || 'Not provided'}`, `Email: ${clean.email}`, '', clean.message].join('\n');
}
