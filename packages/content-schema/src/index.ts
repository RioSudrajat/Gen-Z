import { offeringTabSchema } from "@gen-z/domain";
import { z } from "zod";

const referenceId = z.string().min(1).max(160);

export const editorialBlockSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1).max(240),
  }),
  z.strictObject({
    type: z.literal("paragraph"),
    text: z.string().min(1).max(10000),
  }),
  z.strictObject({
    type: z.literal("media-reference"),
    mediaId: referenceId,
    alt: z.string().min(1).max(500),
    caption: z.string().max(1000).optional(),
  }),
  z.strictObject({
    type: z.literal("document-reference"),
    documentVersionId: referenceId,
  }),
  z.strictObject({
    type: z.literal("metric-reference"),
    metricId: referenceId,
    datasetVersionId: referenceId,
  }),
]);

export const tabContentDraftSchema = z.strictObject({
  schemaVersion: z.literal(1),
  offeringId: referenceId,
  tab: offeringTabSchema,
  locale: z.enum(["en", "id"]),
  blocks: z.array(editorialBlockSchema).max(100),
});

export type EditorialBlock = z.infer<typeof editorialBlockSchema>;
export type TabContentDraft = z.infer<typeof tabContentDraftSchema>;
