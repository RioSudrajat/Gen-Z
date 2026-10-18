import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema";

const processDatabase = globalThis as typeof globalThis & { genzPool?: Pool };

export function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!processDatabase.genzPool) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
    pool.on("error", () =>
      console.error("Gen-Z database connection interrupted"),
    );
    processDatabase.genzPool = pool;
  }
  return processDatabase.genzPool;
}

export function orm() {
  return drizzle({ client: database(), schema });
}
