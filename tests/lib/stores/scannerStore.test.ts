import { beforeEach, describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/errors";
import type {
  OnchainCheckResponse,
  ScannerScanResponse,
} from "@/lib/api/types";
import { useScannerStore } from "@/lib/stores/scannerStore";

const state = () => useScannerStore.getState();

const SCAN: ScannerScanResponse = {
  ok: true,
  data: {
    agent_name: "TestAgent",
    band: "SECURE",
    verdict: "",
    final_score: 80,
    controls: [],
  },
};

const ONCHAIN: OnchainCheckResponse = {
  ok: true,
  data: {
    contract: "0x238E",
    wallet: "0xabc",
    registered: true,
    log_count: 1,
    block_from: 0,
    block_to: 1,
    rpc_url: "https://rpc",
    error: null,
  },
};

beforeEach(() => state().reset());

describe("scannerStore", () => {
  it("has the correct initial state", () => {
    expect(state().handle).toBe("");
    expect(state().scanMode).toBe("root"); // matches HTML lama default
    expect(state().scanResult).toBeNull();
    expect(state().onchainStatus).toBeNull();
    expect(state().isScanning).toBe(false);
    expect(state().scanError).toBeNull();
  });

  it("setHandle updates handle", () => {
    state().setHandle("@aixbt_agent");
    expect(state().handle).toBe("@aixbt_agent");
  });

  it("setScanMode updates scanMode (root ↔ exact)", () => {
    state().setScanMode("exact");
    expect(state().scanMode).toBe("exact");
    state().setScanMode("root");
    expect(state().scanMode).toBe("root");
  });

  it("setScanResult stores the scan response (6.2b)", () => {
    state().setScanResult(SCAN);
    expect(state().scanResult).toBe(SCAN);
    state().setScanResult(null);
    expect(state().scanResult).toBeNull();
  });

  it("setOnchainStatus stores the on-chain response (6.2b)", () => {
    state().setOnchainStatus(ONCHAIN);
    expect(state().onchainStatus).toBe(ONCHAIN);
  });

  it("setScanning toggles the scanning flag", () => {
    state().setScanning(true);
    expect(state().isScanning).toBe(true);
    state().setScanning(false);
    expect(state().isScanning).toBe(false);
  });

  it("setScanError stores an ApiError", () => {
    const err = new ApiError(500, null, "boom");
    state().setScanError(err);
    expect(state().scanError).toBe(err);
  });

  it("reset clears all state back to initial", () => {
    state().setHandle("@x");
    state().setScanMode("exact");
    state().setScanResult(SCAN);
    state().setOnchainStatus(ONCHAIN);
    state().setScanning(true);
    state().setScanError(new ApiError(0, null, "net"));

    state().reset();

    expect(state().handle).toBe("");
    expect(state().scanMode).toBe("root");
    expect(state().scanResult).toBeNull();
    expect(state().onchainStatus).toBeNull();
    expect(state().isScanning).toBe(false);
    expect(state().scanError).toBeNull();
  });
});
