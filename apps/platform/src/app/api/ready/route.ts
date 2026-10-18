import { scaffoldStatus } from "@gen-z/domain";
import { readEnvironment } from "../../../server/config";
import { database } from "../../../server/database";
import { authConfig } from "../../../server/auth/config";

export const dynamic = "force-dynamic";

export async function GET() {
  let walletAuthenticationReady = false;
  try {
    authConfig();
    const { rows } = await database().query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'identity' AND table_name = 'wallet_accounts' AND column_name = 'namespace')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'identity' AND table_name = 'wallet_sessions' AND column_name = 'proof_method') AS sessions`,
    );
    walletAuthenticationReady = Boolean(rows[0]?.sessions);
  } catch {
    /* Overall readiness stays false when PostgreSQL is unavailable. */
  }
  return Response.json(
    {
      ...scaffoldStatus("platform", readEnvironment()),
      status: "foundation",
      code: "PLATFORM_FEATURES_NOT_IMPLEMENTED",
      walletAuthenticationReady,
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
