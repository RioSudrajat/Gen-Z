import { Pool } from "pg";
import { localEnv } from "./local.mjs";

export async function doctor(settings = localEnv()) {
  const origin = new URL(settings.GENZ_APP_ORIGIN || "http://localhost:3001");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  if (
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password ||
    (origin.protocol !== "https:" && !(origin.protocol === "http:" && local)) ||
    !["demo", "testnet"].includes(settings.GENZ_ENVIRONMENT || "demo") ||
    (settings.GENZ_EVM_CHAIN_ID || "84532") !== "84532" ||
    (settings.GENZ_MANAGED_DATABASE === "1" &&
      (settings.GENZ_ENVIRONMENT || "demo") !== "demo")
  )
    throw new Error("Invalid app origin");
  const pool = new Pool({
    connectionString: settings.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 5000,
  });
  try {
    const { rows } = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'identity' AND table_name = 'wallet_accounts' AND column_name = 'namespace') AS accounts,
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'identity' AND table_name = 'wallet_sessions' AND column_name = 'proof_method') AS sessions,
        to_regclass('identity.wallet_challenges') AS challenges`,
    );
    if (!rows[0].accounts || !rows[0].sessions || !rows[0].challenges)
      throw new Error("Wallet migrations missing");
    console.log(
      "PASS Gen-Z origin, Base Sepolia, PostgreSQL identity namespace, SIWE challenges and sessions.",
    );
  } finally {
    await pool.end();
  }
}

if (process.argv[1]?.endsWith("doctor.mjs")) {
  try {
    await doctor();
  } catch {
    console.error(
      "Gen-Z database/config check failed. Run npm run setup:platform.",
    );
    process.exitCode = 1;
  }
}
