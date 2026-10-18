import { platformOrigin, platformAuthUrl, platformInquiryEndpoint } from '../application/platform-links.mjs';

const origin = platformOrigin(import.meta.env.PUBLIC_PLATFORM_ORIGIN?.trim() ?? '');

export const site = Object.freeze({
  platformOrigin: origin,
  platformAuthUrl: platformAuthUrl(origin) || '/auth/',
  inquiryEndpoint: platformInquiryEndpoint(origin, import.meta.env.PUBLIC_PLATFORM_INQUIRIES_ENABLED === 'true'),
});
