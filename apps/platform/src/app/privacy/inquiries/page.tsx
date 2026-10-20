import { privacyNoticeVersionId } from "@/server/intake/policy";

export const metadata = { title: "Inquiry privacy notice" };
export default function InquiryPrivacyPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl px-6 py-16"
    >
      <h1 className="mb-6 text-4xl">Inquiry privacy notice</h1>
      <article
        id={privacyNoticeVersionId}
        className="space-y-5 text-base leading-relaxed"
      >
        <p>
          Gen-Z uses the contact details and context you submit to review your
          inquiry and respond about your asset, investment mandate or
          partnership.
        </p>
        <p>
          Your inquiry is stored by Gen-Z. Submitting an inquiry does not
          subscribe you to marketing, open an investment account or authorize a
          transaction. Do not include identity documents, bank details, private
          keys or other sensitive documents.
        </p>
        <p>
          Gen-Z’s inquiry policy is to delete inquiries that do not proceed 90
          days after the last meaningful interaction, and review active
          inquiries every 90 days. Notification retries do not extend that
          period.
        </p>
        <p>
          Keep your inquiry reference for follow-up. To request a correction or
          deletion, contact Gen-Z through the contact form and include that
          reference without repeating sensitive information.
        </p>
        <p className="text-sm text-muted-foreground">
          Notice version: 20 October 2026 · {privacyNoticeVersionId}
        </p>
      </article>
    </main>
  );
}
