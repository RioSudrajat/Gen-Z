"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createConfig,
  createStorage,
  http,
  injected,
  noopStorage,
  WagmiProvider,
} from "wagmi";
import { baseSepolia } from "viem/chains";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [config] = useState(() =>
    createConfig({
      chains: [baseSepolia],
      connectors: [injected()],
      multiInjectedProviderDiscovery: true,
      transports: { [baseSepolia.id]: http() },
      ssr: true,
      storage: createStorage({ storage: noopStorage }),
    }),
  );
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
