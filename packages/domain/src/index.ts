import { z } from "zod";

export const offeringTabKeys = [
  "overview",
  "asset-operator",
  "deal-terms",
  "performance-data",
  "reports-updates",
  "risks",
  "documents",
] as const;

export const offeringTabSchema = z.enum(offeringTabKeys);
export type OfferingTabKey = z.infer<typeof offeringTabSchema>;

export const offeringTabLabels = {
  overview: "Overview",
  "asset-operator": "Asset & Operator",
  "deal-terms": "Deal Terms",
  "performance-data": "Performance & Data",
  "reports-updates": "Reports & Updates",
  risks: "Risks",
  documents: "Documents",
} as const satisfies Record<OfferingTabKey, string>;

export const environmentSchema = z.enum(["demo", "testnet", "live"]);
export type GenZEnvironment = z.infer<typeof environmentSchema>;

export function scaffoldStatus(
  service: "marketing" | "platform" | "operations",
  environment: GenZEnvironment,
) {
  return {
    service,
    environment,
    status: "scaffold",
    ready: false,
    financialTransactionsEnabled: false,
  } as const;
}
