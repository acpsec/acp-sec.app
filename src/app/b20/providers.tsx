"use client";

import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/lib/web3/config";

/**
 * /b20-scoped wagmi provider (Task 7.2a).
 *
 * Nested inside the app-level QueryClientProvider (src/app/providers.tsx), so
 * wagmi's internal react-query hooks reuse that single client — no isolated
 * QueryClient is needed. The /b20 scanner is read-only and does not connect a
 * wallet; this wires wagmi for future wallet-enabled pages.
 */
export function B20Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}
