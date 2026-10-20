import "server-only";
import { authConfig } from "../auth/config";

export const privacyNoticeVersionId = "db884c12-f529-43df-b955-c7b2ed3e40e1";
export function inquiryPolicy() {
  return {
    privacyNoticeVersionId,
    noticeUrl: new URL(
      `/privacy/inquiries#${privacyNoticeVersionId}`,
      authConfig().origin,
    ).href,
    sensitiveUploadsAllowed: false,
    marketingOptIn: false,
  };
}
