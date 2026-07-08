import { describe, expect, it, vi } from "vitest";

import { B20_DEFAULT_CHAIN_ID, scanB20 } from "@/lib/api/b20";
import { fetchApi } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { B20ScanResult } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

// A minimal but shape-complete success payload (mirrors the schema doc).
const RESULT: B20ScanResult = {
  token: "0x1111111111111111111111111111111111111111",
  chain_id: 84532,
  variant: "ASSET",
  name: "Example",
  symbol: "EXM",
  decimals: 18,
  currency_code: null,
  trust_score: 72,
  raw_score: 80,
  grade: "B",
  rated: true,
  multiplier: 1.0,
  unrated_dimensions: [],
  is_critical: false,
  critical_reasons: [],
  dimensions: {
    issuer_control: { score: 20, weight: 25, findings: [] },
  },
  issuer_powers: {
    can_freeze: false,
    can_seize: null,
    can_pause: true,
    can_mint_unbounded: false,
    supply_cap: "1000000",
    admin_addresses: ["0x2222222222222222222222222222222222222222"],
    admin_is_multisig: true,
    mint_role_holders: [],
    pause_role_holders: [],
  },
  deployed_via_factory: null,
  scanner_version: "0.1.0",
  scanned_at: "2026-07-08T00:00:00Z",
};

const ADDR = "0x1111111111111111111111111111111111111111";

describe("scanB20", () => {
  it("POSTs {address, chain_id} to /api/b20/scan and returns the typed result", async () => {
    fetchApiMock.mockResolvedValue(RESULT);
    const out = await scanB20({ address: ADDR, chain_id: 8453 });
    expect(out).toBe(RESULT);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/b20/scan", {
      method: "POST",
      body: JSON.stringify({ address: ADDR, chain_id: 8453 }),
    });
  });

  it("defaults chain_id to Base Sepolia when omitted", async () => {
    fetchApiMock.mockResolvedValue(RESULT);
    await scanB20({ address: ADDR });
    expect(B20_DEFAULT_CHAIN_ID).toBe(84532);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/b20/scan", {
      method: "POST",
      body: JSON.stringify({ address: ADDR, chain_id: 84532 }),
    });
  });

  // Each backend error code surfaces as the existing ApiError, unchanged, with
  // the code readable on `.body.error` (the client must not swallow/transform).
  it.each([
    ["invalid_address", 400],
    ["unsupported_chain", 400],
    ["not_b20", 400],
    ["rpc_unreachable", 503],
  ] as const)("propagates ApiError for %s (%d)", async (code, status) => {
    fetchApiMock.mockRejectedValue(
      new ApiError(status, { error: code, detail: "nope" }, code),
    );
    await expect(scanB20({ address: ADDR })).rejects.toMatchObject({
      name: "ApiError",
      status,
      body: { error: code },
    });
  });

  it("propagates ApiError on a malformed/non-JSON response (null body)", async () => {
    fetchApiMock.mockRejectedValue(new ApiError(503, null, "Status 503"));
    await expect(scanB20({ address: ADDR })).rejects.toMatchObject({
      status: 503,
      body: null,
    });
  });

  it("propagates ApiError on network failure (status 0)", async () => {
    fetchApiMock.mockRejectedValue(new ApiError(0, null, "Network error"));
    await expect(scanB20({ address: ADDR })).rejects.toMatchObject({
      status: 0,
      message: "Network error",
    });
  });
});
