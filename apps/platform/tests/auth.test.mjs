import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { request } from "@playwright/test";
import { parseSiweMessage } from "viem/siwe";
import { migrate } from "../scripts/migrations.mjs";
import {
  api,
  origin,
  databaseUrl,
  wallet,
  challenge,
  proof,
} from "./helpers.mjs";

test("connection alone cannot log in; real SIWE proof creates a scoped opaque session", async () => {
  const client = await api();
  const signer = wallet();
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const input = await challenge(client, signer);
    const message = parseSiweMessage(input.message);
    assert.equal(message.chainId, 84532);
    assert.equal(message.domain, new URL(origin).host);
    assert.deepEqual(message.resources, ["urn:gen-z:environment:demo"]);
    assert.equal((await client.get("/api/v1/session")).status(), 401);
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: await proof(input, signer),
        })
      ).status(),
      200,
    );
    const session = await (await client.get("/api/v1/session")).json();
    assert.equal(session.address, signer.address);
    assert.equal(session.chainId, 84532);
    assert.equal(session.namespace, "eip155");
    assert.equal(session.proofMethod, "siwe-eoa");
    assert.deepEqual(session.workspaces, []);
    assert.equal(session.role, undefined);
    const cookie = (await client.storageState()).cookies.find(
      (c) => c.name === "genz_session",
    );
    assert.equal(cookie.httpOnly, true);
    assert.equal(cookie.sameSite, "Lax");
    const stored = (
      await pool.query(
        "SELECT s.token_hash, a.address, a.namespace, a.chain_id FROM identity.wallet_sessions s JOIN identity.wallet_accounts a ON a.id=s.account_id WHERE a.id=$1",
        [session.accountId],
      )
    ).rows[0];
    assert.notEqual(stored.token_hash, cookie.value);
    assert.equal(stored.address, signer.address.toLowerCase());
    assert.equal(stored.namespace, "eip155");
    assert.equal(stored.chain_id, "84532");
    const privateResponse = await client.get("/api/v1/session");
    assert.match(
      privateResponse.headers()["cache-control"],
      /private.*no-store/,
    );
  } finally {
    await pool.end();
    await client.dispose();
  }
});

test("concurrent nonce replay yields one session and replay stays rejected", async () => {
  const client = await api();
  try {
    const signer = wallet();
    const body = await proof(await challenge(client, signer), signer);
    const responses = await Promise.all([
      client.post("/api/v1/auth/verify", { data: body }),
      client.post("/api/v1/auth/verify", { data: body }),
    ]);
    assert.deepEqual(responses.map((r) => r.status()).sort(), [200, 401]);
    assert.equal(
      (await client.post("/api/v1/auth/verify", { data: body })).status(),
      401,
    );
  } finally {
    await client.dispose();
  }
});

test("signed domain, URI, chain, nonce, intent, time and environment must match the exact issued challenge", async () => {
  const signer = wallet();
  for (const mutate of [
    (input) => ({ ...input, domain: "evil.example" }),
    (input) => ({ ...input, uri: "https://evil.example" }),
    (input) => ({ ...input, chainId: 8453 }),
    (input) => ({ ...input, nonce: "AnotherNonce123456" }),
    (input) => ({ ...input, statement: "Approve an investment" }),
    (input) => ({ ...input, issuedAt: new Date(Date.now() - 3600000) }),
    (input) => ({ ...input, expirationTime: new Date(Date.now() + 3600000) }),
    (input) => ({ ...input, resources: ["urn:gen-z:environment:live"] }),
    (input) => ({ ...input, requestId: randomUUID() }),
  ]) {
    const client = await api();
    try {
      const issued = await challenge(client, signer);
      const body = await proof(
        issued,
        signer,
        mutate(parseSiweMessage(issued.message)),
      );
      assert.equal(
        (await client.post("/api/v1/auth/verify", { data: body })).status(),
        401,
      );
    } finally {
      await client.dispose();
    }
  }
});

test("signature, account and browser binding are enforced; arbitrary contract bytes cannot log in without RPC", async () => {
  const client = await api(),
    other = await api();
  const signer = wallet();
  try {
    const issued = await challenge(client, signer);
    const body = await proof(issued, signer);
    assert.equal(
      (await other.post("/api/v1/auth/verify", { data: body })).status(),
      401,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: await proof(issued, wallet()),
        })
      ).status(),
      401,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: { ...body, signature: "0x" + "00".repeat(65) },
        })
      ).status(),
      401,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: { ...body, signature: "0x1234" },
        })
      ).status(),
      401,
    );
    assert.equal((await client.get("/api/v1/session")).status(), 401);
  } finally {
    await client.dispose();
    await other.dispose();
  }
});

test("expired proofs and sessions, disabled accounts and cross-chain stored sessions are denied", async () => {
  const pool = new Pool({ connectionString: databaseUrl }),
    client = await api(),
    signer = wallet();
  try {
    const expired = await challenge(client, signer);
    await pool.query(
      "UPDATE identity.wallet_challenges SET expires_at=CURRENT_TIMESTAMP-INTERVAL '1 minute' WHERE id=$1",
      [expired.challengeId],
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: await proof(expired, signer),
        })
      ).status(),
      401,
    );
    const login = async () =>
      client.post("/api/v1/auth/verify", {
        data: await proof(await challenge(client, signer), signer),
      });
    assert.equal((await login()).status(), 200);
    const session = await (await client.get("/api/v1/session")).json();
    await pool.query(
      "UPDATE identity.wallet_sessions SET expires_at=CURRENT_TIMESTAMP-INTERVAL '1 minute' WHERE account_id=$1",
      [session.accountId],
    );
    assert.equal((await client.get("/api/v1/session")).status(), 401);
    assert.equal((await login()).status(), 200);
    await pool.query(
      "UPDATE identity.wallet_accounts SET chain_id='8453' WHERE id=$1",
      [session.accountId],
    );
    assert.equal((await client.get("/api/v1/session")).status(), 401);
    await pool.query(
      "UPDATE identity.wallet_accounts SET chain_id='84532', disabled_at=CURRENT_TIMESTAMP WHERE id=$1",
      [session.accountId],
    );
    assert.equal((await client.get("/api/v1/session")).status(), 401);
    assert.equal((await login()).status(), 401);
  } finally {
    await pool.end();
    await client.dispose();
  }
});

test("address casing uses one EVM identity; switching accounts rotates the session without linking", async () => {
  const client = await api(),
    first = wallet(),
    second = wallet();
  try {
    await client.post("/api/v1/auth/verify", {
      data: await proof(await challenge(client, first), first),
    });
    const initial = await (await client.get("/api/v1/session")).json();
    const oldCookie = (await client.storageState()).cookies.find(
      (c) => c.name === "genz_session",
    );
    const lower = { ...first, address: first.address.toLowerCase() };
    const lowerProof = await proof(await challenge(client, lower), lower);
    assert.equal(
      (await client.post("/api/v1/auth/verify", { data: lowerProof })).status(),
      200,
    );
    assert.equal(
      (await (await client.get("/api/v1/session")).json()).accountId,
      initial.accountId,
    );
    await client.post("/api/v1/auth/verify", {
      data: await proof(await challenge(client, second), second),
    });
    const next = await (await client.get("/api/v1/session")).json();
    assert.equal(next.address, second.address);
    assert.notEqual(next.accountId, initial.accountId);
    const replay = await request.newContext({
      baseURL: origin,
      extraHTTPHeaders: { Cookie: `genz_session=${oldCookie.value}` },
    });
    try {
      assert.equal((await replay.get("/api/v1/session")).status(), 401);
    } finally {
      await replay.dispose();
    }
    const nextCookie = (await client.storageState()).cookies.find(
      (c) => c.name === "genz_session",
    );
    assert.equal((await client.post("/api/v1/auth/logout")).status(), 204);
    const loggedOut = await request.newContext({
      baseURL: origin,
      extraHTTPHeaders: { Cookie: `genz_session=${nextCookie.value}` },
    });
    try {
      assert.equal((await loggedOut.get("/api/v1/session")).status(), 401);
    } finally {
      await loggedOut.dispose();
    }
  } finally {
    await client.dispose();
  }
});

test("strict origin, network, payload and size validation reject alternate auth and grants", async () => {
  const client = await api(),
    noOrigin = await request.newContext({ baseURL: origin }),
    signer = wallet();
  const valid = { address: signer.address, chainId: 84532 };
  try {
    assert.equal(
      (
        await noOrigin.post("/api/v1/auth/challenges", { data: valid })
      ).status(),
      403,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/challenges", {
          data: valid,
          headers: { Origin: "https://evil.example" },
        })
      ).status(),
      403,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/logout", {
          headers: { Origin: "https://evil.example" },
        })
      ).status(),
      403,
    );
    for (const data of [
      { ...valid, role: "admin" },
      { ...valid, chainId: 1 },
      { ...valid, chainId: 8453 },
      { address: signer.address },
      { ...valid, address: "11111111111111111111111111111111" },
    ])
      assert.equal(
        (await client.post("/api/v1/auth/challenges", { data })).status(),
        422,
      );
    assert.equal(
      (
        await client.post("/api/v1/auth/verify", {
          data: {
            ...(await proof(await challenge(client, signer), signer)),
            role: "admin",
          },
        })
      ).status(),
      422,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/challenges", {
          headers: { "Content-Type": "application/json" },
          data: Buffer.from("{"),
        })
      ).status(),
      400,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/challenges", {
          headers: { "Content-Type": "application/json" },
          data: "x".repeat(9000),
        })
      ).status(),
      413,
    );
    assert.equal(
      (
        await client.post("/api/v1/auth/challenges", {
          headers: { "Content-Type": "text/plain" },
          data: "{}",
        })
      ).status(),
      415,
    );
    for (const path of [
      "/sign-in",
      "/sign-up",
      "/api/auth/sign-up/email",
      "/api/notes",
      "/api/admin/notes",
    ])
      assert.equal((await client.get(path)).status(), 404);
  } finally {
    await client.dispose();
    await noOrigin.dispose();
  }
});

test("challenge rate limiting persists server-side", async () => {
  const client = await api(),
    signer = wallet();
  try {
    for (let i = 0; i < 6; i++)
      assert.equal(
        (
          await client.post("/api/v1/auth/challenges", {
            data: { address: signer.address, chainId: 84532 },
          })
        ).status(),
        200,
      );
    assert.equal(
      (
        await client.post("/api/v1/auth/challenges", {
          data: { address: signer.address, chainId: 84532 },
        })
      ).status(),
      429,
    );
  } finally {
    await client.dispose();
  }
});

test("cutover preserves legacy accounts, revokes old proofs and does not rerun on EVM sessions", async () => {
  const admin = new Pool({ connectionString: databaseUrl });
  const legacyUrl = new URL(databaseUrl);
  legacyUrl.pathname = "/genz_legacy_migration";
  const pool = new Pool({ connectionString: legacyUrl.href });
  let created = false;
  try {
    await admin.query("CREATE DATABASE genz_legacy_migration");
    created = true;
    const oldSql = await readFile(
      new URL("../db/migrations/0001_wallet_identity.sql", import.meta.url),
      "utf8",
    );
    await pool.query(oldSql);
    await pool.query(
      "CREATE TABLE public.genz_schema_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)",
    );
    await pool.query(
      "INSERT INTO public.genz_schema_migrations(name,checksum) VALUES($1,$2)",
      [
        "0001_wallet_identity.sql",
        createHash("sha256").update(oldSql).digest("hex"),
      ],
    );
    const id = randomUUID(),
      challengeId = randomUUID();
    await pool.query(
      "INSERT INTO identity.wallet_accounts(id,address) VALUES($1,$2)",
      [id, "11111111111111111111111111111111"],
    );
    await pool.query(
      "INSERT INTO identity.wallet_sessions(token_hash,account_id,environment,expires_at) VALUES($1,$2,'demo',CURRENT_TIMESTAMP+INTERVAL '1 hour')",
      ["a".repeat(64), id],
    );
    await pool.query(
      "INSERT INTO identity.wallet_challenges(id,browser_binding_hash,input,environment,expires_at) VALUES($1,$2,$3,'demo',CURRENT_TIMESTAMP+INTERVAL '1 hour')",
      [challengeId, "b".repeat(64), { chainId: "solana:devnet" }],
    );
    await migrate(legacyUrl.href);
    const saved = (
      await pool.query(
        "SELECT id,address,namespace,chain_id FROM identity.wallet_accounts WHERE id=$1",
        [id],
      )
    ).rows[0];
    assert.deepEqual(saved, {
      id,
      address: "11111111111111111111111111111111",
      namespace: "solana",
      chain_id: "legacy",
    });
    assert.equal(
      (await pool.query("SELECT count(*)::int n FROM identity.wallet_sessions"))
        .rows[0].n,
      0,
    );
    assert.ok(
      (
        await pool.query(
          "SELECT consumed_at FROM identity.wallet_challenges WHERE id=$1",
          [challengeId],
        )
      ).rows[0].consumed_at,
    );
    const evm = wallet(),
      evmId = randomUUID();
    await pool.query(
      "INSERT INTO identity.wallet_accounts(id,address,namespace,chain_id) VALUES($1,$2,'eip155','84532')",
      [evmId, evm.address.toLowerCase()],
    );
    await pool.query(
      "INSERT INTO identity.wallet_sessions(token_hash,account_id,environment,expires_at,proof_method) VALUES($1,$2,'demo',CURRENT_TIMESTAMP+INTERVAL '1 hour','siwe-eoa')",
      ["c".repeat(64), evmId],
    );
    await migrate(legacyUrl.href);
    assert.equal(
      (await pool.query("SELECT count(*)::int n FROM identity.wallet_sessions"))
        .rows[0].n,
      1,
    );
    await assert.rejects(
      pool.query(
        "INSERT INTO identity.wallet_accounts(id,address,namespace,chain_id) VALUES($1,$2,'eip155','84532')",
        [randomUUID(), evm.address.toLowerCase()],
      ),
    );
  } finally {
    await pool.end();
    if (created)
      await admin.query("DROP DATABASE genz_legacy_migration WITH (FORCE)");
    await admin.end();
  }
});
