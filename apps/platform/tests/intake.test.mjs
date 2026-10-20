import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { origin, databaseUrl } from "./helpers.mjs";

const marketing = "http://127.0.0.1:4340";
const headers = { Origin: marketing, "Content-Type": "application/json" };
async function policy() {
  const response = await fetch(`${origin}/api/v1/public/inquiry-policy`, {
    headers,
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), marketing);
  return response.json();
}
const payload = (version, topic = "operator") => ({
  contact: {
    name: "Synthetic QA",
    email: `${randomUUID()}@example.invalid`,
    organization: null,
    phone: null,
  },
  ...(topic === "operator"
    ? {
        assetCategory: "energy",
        location: { countryCode: "ID", region: "West Java" },
        operationsState: "operational",
        assetDescription: "Synthetic inquiry for isolated testing only.",
        financingNeed: {
          currency: "IDR",
          scale: 0,
          minorUnits: "900719925474099312345",
        },
      }
    : { topic, message: "Synthetic investment or partnership inquiry." }),
  privacyNoticeVersionId: version,
  privacyAcknowledged: true,
});
const send = (body, key = randomUUID(), extra = {}) =>
  fetch(`${origin}/api/v1/inquiries`, {
    method: "POST",
    headers: { ...headers, "Idempotency-Key": key, ...extra },
    body: JSON.stringify(body),
  });

test("public intake stores every topic with one receipt/outbox and immutable retention across concurrent retries", async () => {
  const { privacyNoticeVersionId, noticeUrl } = await policy();
  assert.equal((await fetch(noticeUrl)).status, 200);
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    for (const topic of ["operator", "investor", "partner"]) {
      const data = payload(privacyNoticeVersionId, topic),
        key = randomUUID();
      const responses = await Promise.all([send(data, key), send(data, key)]);
      assert.deepEqual(
        responses.map((response) => response.status),
        [201, 201],
      );
      const [one, two] = await Promise.all(
        responses.map((response) => response.json()),
      );
      assert.deepEqual(one, two);
      assert.equal(one.notificationState, "pending");
      const stored = await pool.query(
        "SELECT i.*, o.state AS notification_state FROM intake.inquiries i JOIN intake.notification_outbox o ON o.inquiry_id=i.id WHERE i.id=$1",
        [one.id],
      );
      assert.equal(stored.rowCount, 1);
      assert.equal(stored.rows[0].topic, topic);
      assert.equal(stored.rows[0].payload.contact.email, data.contact.email);
      if (topic === "operator")
        assert.equal(
          stored.rows[0].payload.financingNeed.minorUnits,
          data.financingNeed.minorUnits,
        );
      assert.equal(
        stored.rows[0].retention_due_at - stored.rows[0].last_interaction_at,
        90 * 86400000,
      );
      await pool.query(
        "UPDATE intake.notification_outbox SET state='failed' WHERE inquiry_id=$1",
        [one.id],
      );
      const retry = await send(data, key);
      assert.equal(retry.status, 201);
      assert.equal((await retry.json()).notificationState, "failed");
      assert.equal(
        (
          await send(
            { ...data, contact: { ...data.contact, name: "Changed" } },
            key,
          )
        ).status,
        409,
      );
      const after = (
        await pool.query(
          "SELECT received_at,last_interaction_at,retention_due_at FROM intake.inquiries WHERE id=$1",
          [one.id],
        )
      ).rows[0];
      for (const field of Object.keys(after))
        assert.equal(+after[field], +stored.rows[0][field]);
    }
  } finally {
    await pool.end();
  }
});

test("intake validates Origin, consent, policy, JSON limits, financing precision and CORS without creating records", async () => {
  const { privacyNoticeVersionId } = await policy();
  const good = payload(privacyNoticeVersionId);
  for (const originHeader of [
    "https://evil.invalid",
    "http://127.0.0.1.evil.invalid:4340",
    "null",
    "",
  ]) {
    const response = await send(good, randomUUID(), { Origin: originHeader });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  }
  const preflight = await fetch(`${origin}/api/v1/inquiries`, {
    method: "OPTIONS",
    headers: {
      Origin: marketing,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,idempotency-key",
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Credentials"), null);
  for (const [data, code] of [
    [{ ...good, privacyAcknowledged: false }, 422],
    [{ ...good, privacyNoticeVersionId: randomUUID() }, 409],
    [
      {
        ...good,
        financingNeed: { currency: "IDR", minorUnits: "1.2", scale: 0 },
      },
      422,
    ],
    [{ ...good, role: "admin" }, 422],
    [{ ...good, assetDescription: "x".repeat(33000) }, 413],
  ])
    assert.equal((await send(data)).status, code);
  assert.equal((await send(good, "invalid")).status, 422);
  assert.equal(
    (await send(good, randomUUID(), { "Content-Type": "text/plain" })).status,
    415,
  );
  assert.equal(
    (
      await fetch(`${origin}/api/v1/inquiries`, {
        method: "POST",
        headers: { ...headers, "Idempotency-Key": randomUUID() },
        body: "{",
      })
    ).status,
    400,
  );
  assert.equal((await fetch(`${origin}/api/v1/inquiries`)).status, 405);
});

test("email rate limit rolls back inquiry and outbox; replay still succeeds", async () => {
  const data = payload((await policy()).privacyNoticeVersionId),
    key = randomUUID();
  assert.equal((await send(data, key)).status, 201);
  assert.equal((await send(data)).status, 201);
  assert.equal((await send(data)).status, 201);
  const limited = await send(data);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Access-Control-Allow-Origin"), marketing);
  assert.equal((await send(data, key)).status, 201);
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM intake.inquiries WHERE payload->'contact'->>'email'=$1",
      [data.contact.email],
    );
    assert.equal(Number(rows[0].count), 3);
  } finally {
    await pool.end();
  }
});

test("an outbox persistence failure rolls back the inquiry and never acknowledges receipt", async () => {
  const data = payload((await policy()).privacyNoticeVersionId);
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query(
      "CREATE FUNCTION intake.reject_test_outbox() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic isolated outbox failure'; END $$",
    );
    await pool.query(
      "CREATE TRIGGER reject_test_outbox BEFORE INSERT ON intake.notification_outbox FOR EACH ROW EXECUTE FUNCTION intake.reject_test_outbox()",
    );
    assert.equal((await send(data)).status, 503);
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM intake.inquiries WHERE payload->'contact'->>'email'=$1",
      [data.contact.email],
    );
    assert.equal(Number(rows[0].count), 0);
  } finally {
    await pool.query(
      "DROP TRIGGER IF EXISTS reject_test_outbox ON intake.notification_outbox",
    );
    await pool.query("DROP FUNCTION IF EXISTS intake.reject_test_outbox()");
    await pool.end();
  }
});
