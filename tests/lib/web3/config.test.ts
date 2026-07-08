import { describe, expect, it } from "vitest";

import { wagmiConfig } from "@/lib/web3/config";

describe("wagmiConfig", () => {
  it("configures Base Sepolia (84532) only for V1", () => {
    expect(wagmiConfig.chains.map((c) => c.id)).toEqual([84532]);
  });

  it("registers the injected + coinbaseWallet connectors", () => {
    const types = wagmiConfig.connectors.map((c) => c.type);
    expect(types).toContain("injected");
    expect(types).toContain("coinbaseWallet");
    // No WalletConnect / RainbowKit for V1.
    expect(types).not.toContain("walletConnect");
  });

  it("uses SSR-safe cookie storage", () => {
    // `storage` is only defined when createStorage was supplied (cookieStorage).
    expect(wagmiConfig.storage).toBeDefined();
  });

  it("has a transport for Base Sepolia", () => {
    expect(wagmiConfig._internal.transports).toHaveProperty("84532");
  });
});
