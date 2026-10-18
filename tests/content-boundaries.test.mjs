import assert from "node:assert/strict";
import test from "node:test";
import { editorialBlockSchema, tabContentDraftSchema } from "@gen-z/content-schema";

test("editorial metrics reference canonical data rather than editable amounts or formulas", () => {
  const reference = { type: "metric-reference", metricId: "production", datasetVersionId: "v1" };
  assert.equal(editorialBlockSchema.safeParse(reference).success, true);
  for (const extra of [{ amount: 100 }, { formula: "cash * 0.3" }, { yield: "10%" }]) {
    assert.equal(editorialBlockSchema.safeParse({ ...reference, ...extra }).success, false);
  }
  assert.equal(editorialBlockSchema.safeParse({ type: "formula", expression: "1 + 1" }).success, false);
  assert.equal(editorialBlockSchema.safeParse({ type: "html", html: "<script>run()</script>" }).success, false);
});

test("a content draft cannot declare itself approved or override the tab taxonomy", () => {
  const draft = { schemaVersion: 1, offeringId: "offering-1", tab: "deal-terms", locale: "en", blocks: [] };
  assert.equal(tabContentDraftSchema.safeParse(draft).success, true);
  assert.equal(tabContentDraftSchema.safeParse({ ...draft, approved: true }).success, false);
  assert.equal(tabContentDraftSchema.safeParse({ ...draft, tab: "arbitrary-tab" }).success, false);
});
