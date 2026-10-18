import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createPublicClient, getAddress, http, verifyMessage } from "viem";
import { baseSepolia } from "viem/chains";
import {
  createSiweMessage,
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from "viem/siwe";
import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { orm } from "../database";
import {
  authRateLimits,
  walletAccounts,
  walletChallenges,
  walletSessions,
} from "../db/schema";
import { authConfig } from "./config";
import type { WalletProof } from "./validation";

export class AuthError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const randomToken = () => randomBytes(32).toString("base64url");

async function rateLimit(bucket: string, limit: number) {
  const [row] = await orm()
    .insert(authRateLimits)
    .values({
      bucket,
      minute: sql`date_trunc('minute', CURRENT_TIMESTAMP)`,
      attempts: 1,
    })
    .onConflictDoUpdate({
      target: [authRateLimits.bucket, authRateLimits.minute],
      set: { attempts: sql`${authRateLimits.attempts} + 1` },
    })
    .returning({ attempts: authRateLimits.attempts });
  if ((row?.attempts ?? limit + 1) > limit) {
    throw new AuthError(
      429,
      "TOO_MANY_ATTEMPTS",
      "Too many sign-in attempts. Wait a minute and try again.",
    );
  }
}

export async function createChallenge(
  address: `0x${string}`,
  existingBinding?: string,
) {
  const config = authConfig();
  const binding = existingBinding?.match(/^[A-Za-z0-9_-]{43}$/)
    ? existingBinding
    : randomToken();
  await rateLimit("challenge-global", 120);
  await rateLimit(`challenge-${tokenHash(binding)}`, 6);
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60_000);
  const fields: SiweMessage = {
    domain: config.domain,
    address,
    statement:
      "Sign in to Gen-Z. This does not authorize a transaction or investment.",
    uri: config.origin,
    version: "1",
    chainId: config.chainId,
    nonce: randomBytes(24).toString("hex"),
    issuedAt: new Date(),
    expirationTime: expiresAt,
    requestId: id,
    resources: [`urn:gen-z:environment:${config.environment}`],
  };
  const message = createSiweMessage(fields);
  const input = {
    message,
    address,
    chainId: config.chainId,
    namespace: "eip155",
  };
  const db = orm();
  await db.insert(walletChallenges).values({
    id,
    browserBindingHash: tokenHash(binding),
    input,
    environment: config.environment,
    expiresAt,
  });
  await db
    .delete(walletChallenges)
    .where(
      lt(walletChallenges.expiresAt, sql`CURRENT_TIMESTAMP - INTERVAL '1 day'`),
    );
  await db
    .delete(authRateLimits)
    .where(
      lt(authRateLimits.minute, sql`CURRENT_TIMESTAMP - INTERVAL '1 day'`),
    );
  return { id, message, chainId: config.chainId, binding };
}

export async function verifyWalletProof(
  proof: WalletProof,
  binding?: string,
  oldToken?: string,
) {
  const config = authConfig();
  if (!binding?.match(/^[A-Za-z0-9_-]{43}$/)) throw invalidProof();
  await rateLimit("verify-global", 180);
  await rateLimit(`verify-${tokenHash(binding)}`, 12);
  const db = orm();
  const challengeFilter = and(
    eq(walletChallenges.id, proof.challengeId),
    eq(walletChallenges.browserBindingHash, tokenHash(binding)),
    eq(walletChallenges.environment, config.environment),
    isNull(walletChallenges.consumedAt),
    gt(walletChallenges.expiresAt, sql`CURRENT_TIMESTAMP`),
  );
  const [challenge] = await db
    .select({ input: walletChallenges.input })
    .from(walletChallenges)
    .where(challengeFilter)
    .limit(1);
  const input = challenge?.input;
  if (
    !input ||
    input.namespace !== "eip155" ||
    input.message !== proof.message ||
    input.address !== proof.address ||
    input.chainId !== config.chainId
  )
    throw invalidProof();
  const parsed = parseSiweMessage(proof.message);
  if (
    parsed.chainId !== config.chainId ||
    parsed.uri !== config.origin ||
    parsed.requestId !== proof.challengeId ||
    !validateSiweMessage({
      message: parsed,
      address: proof.address,
      domain: config.domain,
    })
  )
    throw invalidProof();

  let verified = false;
  try {
    verified = await verifyMessage({
      address: proof.address,
      message: proof.message,
      signature: proof.signature,
    });
  } catch {
    /* Non-ECDSA signatures require contract-account verification. */
  }
  let proofMethod = "siwe-eoa";
  if (!verified && config.rpcUrl) {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(config.rpcUrl, { timeout: 5000, retryCount: 0 }),
    });
    if ((await client.getChainId()) !== config.chainId)
      throw new AuthError(
        503,
        "WRONG_RPC_CHAIN",
        "Wallet verification is unavailable. Please try again later.",
      );
    verified = await client.verifySiweMessage({
      address: proof.address,
      domain: config.domain,
      nonce: parsed.nonce,
      message: proof.message,
      signature: proof.signature,
    });
    proofMethod = "siwe-contract";
  }
  if (!verified) throw invalidProof();

  const token = randomToken();
  const sessionSeconds =
    proofMethod === "siwe-contract" ? 3600 : config.sessionSeconds;
  const expiresAt = new Date(Date.now() + sessionSeconds * 1000);
  return db.transaction(async (tx) => {
    // This conditional write consumes a nonce once, including concurrent submissions.
    const [consumed] = await tx
      .update(walletChallenges)
      .set({ consumedAt: sql`CURRENT_TIMESTAMP` })
      .where(challengeFilter)
      .returning({ id: walletChallenges.id });
    if (!consumed) throw invalidProof();
    const [account] = await tx
      .insert(walletAccounts)
      .values({
        id: randomUUID(),
        address: proof.address.toLowerCase(),
        namespace: "eip155",
        chainId: String(config.chainId),
      })
      .onConflictDoUpdate({
        target: [
          walletAccounts.namespace,
          walletAccounts.chainId,
          walletAccounts.address,
        ],
        set: { address: proof.address.toLowerCase() },
      })
      .returning({
        id: walletAccounts.id,
        disabledAt: walletAccounts.disabledAt,
      });
    if (!account || account.disabledAt) throw invalidProof();
    if (oldToken)
      await tx
        .delete(walletSessions)
        .where(eq(walletSessions.tokenHash, tokenHash(oldToken)));
    await tx.insert(walletSessions).values({
      tokenHash: tokenHash(token),
      accountId: account.id,
      environment: config.environment,
      expiresAt,
      proofMethod,
    });
    return { token, expiresAt, address: proof.address, sessionSeconds };
  });
}

function invalidProof() {
  return new AuthError(
    401,
    "INVALID_WALLET_PROOF",
    "This wallet proof is invalid or expired. Connect your wallet and sign in again.",
  );
}

export async function readSession(token?: string) {
  if (!token?.match(/^[A-Za-z0-9_-]{43}$/)) return null;
  const config = authConfig();
  const [row] = await orm()
    .select({
      accountId: walletSessions.accountId,
      address: walletAccounts.address,
      expiresAt: walletSessions.expiresAt,
      proofMethod: walletSessions.proofMethod,
    })
    .from(walletSessions)
    .innerJoin(walletAccounts, eq(walletAccounts.id, walletSessions.accountId))
    .where(
      and(
        eq(walletSessions.tokenHash, tokenHash(token)),
        eq(walletSessions.environment, config.environment),
        eq(walletAccounts.namespace, "eip155"),
        eq(walletAccounts.chainId, String(config.chainId)),
        sql`${walletSessions.proofMethod} IN ('siwe-eoa', 'siwe-contract')`,
        gt(walletSessions.expiresAt, sql`CURRENT_TIMESTAMP`),
        isNull(walletAccounts.disabledAt),
      ),
    )
    .limit(1);
  return row
    ? {
        accountId: row.accountId,
        address: getAddress(row.address),
        namespace: "eip155",
        chainId: config.chainId,
        proofMethod: row.proofMethod,
        expiresAt: row.expiresAt.toISOString(),
      }
    : null;
}

export async function revokeSession(token?: string, binding?: string) {
  const db = orm();
  if (token)
    await db
      .delete(walletSessions)
      .where(eq(walletSessions.tokenHash, tokenHash(token)));
  if (binding)
    await db
      .update(walletChallenges)
      .set({ consumedAt: sql`CURRENT_TIMESTAMP` })
      .where(
        and(
          eq(walletChallenges.browserBindingHash, tokenHash(binding)),
          isNull(walletChallenges.consumedAt),
        ),
      );
}
