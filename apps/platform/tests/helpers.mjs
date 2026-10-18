import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";
import { request } from "@playwright/test";

if (!process.env.GENZ_TEST_RUN?.startsWith("gen-z-platform-test-"))
  throw new Error(
    "Run npm run test:platform; never point tests at the app database.",
  );
export const origin = process.env.GENZ_APP_ORIGIN;
export const databaseUrl = process.env.GENZ_TEST_DATABASE_URL;
export const api = () =>
  request.newContext({ baseURL: origin, extraHTTPHeaders: { Origin: origin } });
export function wallet() {
  return privateKeyToAccount(generatePrivateKey());
}
export async function proof(challenge, signer, input) {
  const message = input ? createSiweMessage(input) : challenge.message;
  return {
    challengeId: challenge.challengeId,
    address: signer.address,
    message,
    signature: await signer.signMessage({ message }),
  };
}
export async function challenge(client, signer) {
  const response = await client.post("/api/v1/auth/challenges", {
    data: { address: signer.address, chainId: 84532 },
  });
  if (response.status() !== 200)
    throw new Error("Challenge request failed: " + response.status());
  return response.json();
}
