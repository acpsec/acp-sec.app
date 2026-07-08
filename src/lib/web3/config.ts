import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

/**
 * wagmi config for the /b20 route (Task 7.2a foundation).
 *
 * Scope notes:
 * - **Base Sepolia (84532) only** for V1 (Base mainnet added later, when B20
 *   activates there). The acpsec-app scaffold ships both chains; we intentionally
 *   narrow to Sepolia per the V1 decision.
 * - Connectors mirror the scaffold: `injected()` (MetaMask / Coinbase default)
 *   + `coinbaseWallet`. No WalletConnect, no RainbowKit.
 * - **SSR-safe**: `cookieStorage` + `ssr: true` (Next.js App Router). The /b20
 *   scanner is read-only and never connects a wallet, so there is no persisted
 *   account to hydrate — this config is wired for future wallet-enabled pages.
 */
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected(), coinbaseWallet({ appName: "ACP-SEC" })],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});
