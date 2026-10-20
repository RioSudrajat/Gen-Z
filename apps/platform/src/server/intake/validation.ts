import { z } from "zod";

const contact = z.strictObject({
  name: z.string().trim().min(1).max(120),
  email: z
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  organization: z.string().trim().min(1).max(160).nullable(),
  phone: z.string().trim().min(1).max(40).nullable(),
});
const common = {
  contact,
  privacyNoticeVersionId: z.uuid(),
  privacyAcknowledged: z.literal(true),
};
export const inquiryRequest = z.union([
  z.strictObject({
    ...common,
    assetCategory: z.enum(["energy", "infrastructure"]),
    location: z.strictObject({
      countryCode: z.literal("ID"),
      region: z.string().trim().min(1).max(160),
    }),
    operationsState: z.enum([
      "operational",
      "maintenance",
      "planned",
      "unknown",
    ]),
    assetDescription: z.string().trim().min(10).max(4000),
    financingNeed: z
      .strictObject({
        currency: z.literal("IDR"),
        minorUnits: z.string().regex(/^[1-9][0-9]{0,77}$/),
        scale: z.literal(0),
      })
      .nullable(),
  }),
  z.strictObject({
    ...common,
    topic: z.enum(["investor", "partner"]),
    message: z.string().trim().min(10).max(2000),
  }),
]);
export type InquiryRequest = z.infer<typeof inquiryRequest>;
