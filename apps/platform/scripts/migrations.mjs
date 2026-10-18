import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { Pool } from "pg";
import { appRoot } from "./local.mjs";

export async function migrate(connectionString) {
  if (!connectionString)
    throw new Error("DATABASE_URL is missing. Run npm run setup:platform.");
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 5000,
  });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(647391025)");
    await client.query(
      "CREATE TABLE IF NOT EXISTS public.genz_schema_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)",
    );
    for (const file of readdirSync(resolve(appRoot, "db/migrations"))
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      const sql = readFileSync(resolve(appRoot, "db/migrations", file), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const applied = await client.query(
        "SELECT checksum FROM public.genz_schema_migrations WHERE name = $1",
        [file],
      );
      if (applied.rows[0]) {
        if (applied.rows[0].checksum !== checksum)
          throw new Error(
            `Applied migration ${file} was changed. Add a new migration instead.`,
          );
        continue;
      }
      await client.query(sql);
      await client.query(
        "INSERT INTO public.genz_schema_migrations (name, checksum) VALUES ($1, $2)",
        [file, checksum],
      );
    }
    await client.query("COMMIT");
    console.log("Gen-Z SQL migrations applied; existing records preserved.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
