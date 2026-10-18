import "server-only";
import { z } from "zod";
import { readEnvironment } from "../config";
import { baseSepoliaChainId } from "../../lib/base";

export function authConfig() {
  const origin = new URL(
    process.env.GENZ_APP_ORIGIN ?? "http://localhost:3001",
  );
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  if (
    origin.origin !== origin.href.replace(/\/$/, "") ||
    origin.username ||
    origin.password ||
    (origin.protocol !== "https:" && !(origin.protocol === "http:" && local))
  ) {
    throw new Error("INVALID_APP_ORIGIN");
  }
  const environment = readEnvironment();
  // Live transactions and production wallet policy need their own engineering review.
  if (environment === "live") throw new Error("LIVE_ENVIRONMENT_NOT_ENABLED");
  if (process.env.GENZ_MANAGED_DATABASE === "1" && environment !== "demo")
    throw new Error("LOCAL_DATABASE_IS_DEMO_ONLY");
  const chainId = z.coerce
    .number()
    .int()
    .parse(process.env.GENZ_EVM_CHAIN_ID ?? baseSepoliaChainId);
  if (chainId !== baseSepoliaChainId)
    throw new Error("ONLY_BASE_SEPOLIA_AUTH_ENABLED");
  const rpcUrl = process.env.GENZ_BASE_RPC_URL
    ? z.url().parse(process.env.GENZ_BASE_RPC_URL)
    : undefined;
  if (rpcUrl) {
    const rpc = new URL(rpcUrl);
    if (
      rpc.protocol !== "https:" &&
      !(
        rpc.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(rpc.hostname)
      )
    )
      throw new Error("INVALID_BASE_RPC_URL");
  }
  return {
    origin: origin.origin,
    domain: origin.host,
    environment,
    chainId: baseSepoliaChainId,
    rpcUrl,
    secure: origin.protocol === "https:",
    sessionSeconds: 8 * 60 * 60,
  };
}

export const sessionCookie = "genz_session";
export const challengeCookie = "genz_login";
