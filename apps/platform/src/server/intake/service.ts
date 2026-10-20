import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { eq, lt, sql } from "drizzle-orm";
import { orm } from "../database";
import { inquiries, inquiryOutbox, inquiryRateLimits } from "../db/schema";
import { AuthError } from "../auth/service";
import { privacyNoticeVersionId } from "./policy";
import type { InquiryRequest } from "./validation";

const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export async function receiveInquiry(payload: InquiryRequest, key: string) {
  if (payload.privacyNoticeVersionId !== privacyNoticeVersionId)
    throw new AuthError(
      409,
      "STATE_CONFLICT",
      "The privacy notice has changed. Reload the contact page before sending.",
    );
  const keyHash = hash(key);
  const requestHash = hash(JSON.stringify(payload));
  return orm().transaction(async (tx) => {
    const id = randomUUID();
    const [created] = await tx
      .insert(inquiries)
      .values({
        id,
        reference: `INQ-${id.replaceAll("-", "")}`,
        keyHash,
        requestHash,
        topic: "topic" in payload ? payload.topic : "operator",
        payload,
        privacyNoticeVersionId,
      })
      .onConflictDoNothing({ target: inquiries.keyHash })
      .returning();
    const row =
      created ??
      (
        await tx.select().from(inquiries).where(eq(inquiries.keyHash, keyHash))
      )[0];
    if (!row || row.requestHash !== requestHash)
      throw new AuthError(
        409,
        "IDEMPOTENCY_CONFLICT",
        "This request key was already used for a different inquiry.",
      );
    if (created) {
      for (const [bucket, limit] of [
        ["inquiry-global", 60],
        [`inquiry-email-${hash(payload.contact.email)}`, 3],
      ] as const) {
        const [rate] = await tx
          .insert(inquiryRateLimits)
          .values({
            bucket,
            minute: sql`date_trunc('minute', CURRENT_TIMESTAMP)`,
            attempts: 1,
          })
          .onConflictDoUpdate({
            target: [inquiryRateLimits.bucket, inquiryRateLimits.minute],
            set: { attempts: sql`${inquiryRateLimits.attempts} + 1` },
          })
          .returning();
        if (!rate || rate.attempts > limit)
          throw new AuthError(
            429,
            "TOO_MANY_ATTEMPTS",
            "Too many inquiries. Wait a minute before sending again.",
          );
      }
      await tx
        .insert(inquiryOutbox)
        .values({ id: randomUUID(), inquiryId: row.id });
      await tx
        .delete(inquiryRateLimits)
        .where(
          lt(
            inquiryRateLimits.minute,
            sql`CURRENT_TIMESTAMP - INTERVAL '1 day'`,
          ),
        );
    }
    const [notification] = await tx
      .select()
      .from(inquiryOutbox)
      .where(eq(inquiryOutbox.inquiryId, row.id));
    if (!notification) throw new Error("INQUIRY_OUTBOX_MISSING");
    return {
      id: row.id,
      reference: row.reference,
      receivedAt: row.receivedAt.toISOString(),
      state: "received" as const,
      notificationState: notification.state,
    };
  });
}
