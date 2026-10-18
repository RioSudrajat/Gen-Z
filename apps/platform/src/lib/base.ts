export const baseChainId = 8453;
export const baseSepoliaChainId = 84532;

export function isBaseChainId(value: number): value is 8453 | 84532 {
  return value === baseChainId || value === baseSepoliaChainId;
}

export const baseAssets = {
  8453: {
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      testOnly: false,
    },
    IDRX: {
      address: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
      decimals: 2,
      testOnly: false,
    },
  },
  84532: {
    USDC: {
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
      testOnly: true,
    },
  },
} as const;

// Mock IDRX has no address until its own testnet deployment is reviewed.
export const financialTransactionsEnabled = false;
