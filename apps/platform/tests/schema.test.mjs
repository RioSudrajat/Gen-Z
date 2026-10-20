import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { Pool } from "pg";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import * as schema from "../src/server/db/schema.ts";
import { databaseUrl } from "./helpers.mjs";
import { repoRoot } from "../scripts/local.mjs";

async function readSnapshot(directory) {
  const file = (await readdir(directory))
    .filter((name) => name.endsWith("_snapshot.json"))
    .sort()
    .at(-1);
  assert.ok(file, "A migration snapshot must exist");
  return JSON.parse(await readFile(join(directory, file), "utf8"));
}

test("Drizzle schema matches the latest committed migration snapshot", async () => {
  const previous = await readSnapshot(resolve("db/migrations/meta"));
  const current = generateDrizzleJson(schema, previous.id, ["identity", "intake"]);
  assert.deepEqual(await generateMigration(previous, current), []);
});

async function introspect(directory, name, url) {
  const output = join(directory, name);
  const config = join(directory, `${name}.config.mjs`);
  await writeFile(
    config,
    `export default {
    dialect: "postgresql", schemaFilter: ["identity", "intake"],
    out: ${JSON.stringify(output)},
    dbCredentials: { url: process.env.GENZ_SCHEMA_COMPARE_URL }
  };`,
  );
  // Pull only reads the isolated database; credentials never appear in arguments.
  execFileSync(
    process.execPath,
    [
      resolve(repoRoot, "node_modules/drizzle-kit/bin.cjs"),
      "pull",
      "--config",
      config,
    ],
    {
      stdio: "pipe",
      windowsHide: true,
      env: { ...process.env, GENZ_SCHEMA_COMPARE_URL: url },
    },
  );
  return readSnapshot(join(output, "meta"));
}

test("SQL migrations and Drizzle definitions produce equivalent PostgreSQL schemas", async () => {
  const directory = await mkdtemp(join(tmpdir(), "gen-z-schema-test-"));
  const pool = new Pool({ connectionString: databaseUrl });
  const referenceUrl = new URL(databaseUrl);
  referenceUrl.pathname = "/genz_schema_reference";
  const reference = new Pool({ connectionString: referenceUrl.href });
  let created = false;
  try {
    await pool.query("CREATE DATABASE genz_schema_reference");
    created = true;
    const ddl = await generateMigration(
      generateDrizzleJson({}),
      generateDrizzleJson(schema),
    );
    await reference.query(ddl.join("\n"));
    // Round-trip both through PostgreSQL to canonicalize equivalent CHECK/index syntax.
    const actual = await introspect(directory, "migrated", databaseUrl);
    const expected = await introspect(directory, "drizzle", referenceUrl.href);
    assert.deepEqual(await generateMigration(actual, expected), []);
  } finally {
    await reference.end();
    if (created)
      await pool.query("DROP DATABASE genz_schema_reference WITH (FORCE)");
    await pool.end();
    await rm(directory, { recursive: true, force: true });
  }
});
