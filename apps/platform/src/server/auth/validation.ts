import { z } from "zod";
import { getAddress, isAddress, type Address, type Hex } from "viem";
import { baseSepoliaChainId } from "../../lib/base";

export const walletAddress = z
  .string()
  .refine((value) => isAddress(value), "Invalid EVM address")
  .transform((value) => getAddress(value) as Address);
export const challengeRequest = z
  .object({
    address: walletAddress,
    chainId: z.literal(baseSepoliaChainId),
  })
  .strict();
export const proofRequest = z
  .object({
    challengeId: z.uuid(),
    address: walletAddress,
    message: z.string().min(1).max(2048),
    signature: z
      .string()
      .min(4)
      .max(4098)
      .regex(/^0x(?:[0-9a-fA-F]{2})+$/)
      .transform((value) => value as Hex),
  })
  .strict();
export type WalletProof = z.infer<typeof proofRequest>;
