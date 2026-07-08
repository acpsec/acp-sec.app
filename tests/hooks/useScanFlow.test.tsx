import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { onchainCheck } from "@/lib/api/onchain";
import { scannerLookup, scannerScan } from "@/lib/api/scanner";
import { createScore } from "@/lib/api/score";
import type {
  OnchainCheckResponse,
  ScannerLookupResponse,
  ScannerScanResponse,
} from "@/lib/api/types";
import { useScanFlow } from "@/lib/hooks/useScanFlow";
import { useScannerStore } from "@/lib/stores/scannerStore";

vi.mock("@/lib/api/scanner", () => ({
  scannerLookup: vi.fn(),
  scannerScan: vi.fn(),
  scannerBulk: vi.fn(),
}));
vi.mock("@/lib/api/onchain", () => ({ onchainCheck: vi.fn() }));
vi.mock("@/lib/api/score", () => ({
  createScore: vi.fn(),
  createScoreManual: vi.fn(),
  deleteScore: vi.fn(),
}));

const lookupMock = vi.mocked(scannerLookup);
const scanMock = vi.mocked(scannerScan);
const onchainMock = vi.mocked(onchainCheck);
const createScoreMock = vi.mocked(createScore);

const LOOKUP: ScannerLookupResponse = {
  ok: true,
  data: {
    username: "aixbt_agent",
    display_name: "aixbt",
    bio: "an agent",
    website: "https://aixbt.tech",
    avatar_url: "",
    source: "nitter",
  },
};

const SCAN: ScannerScanResponse = {
  ok: true,
  data: {
    agent_name: "aixbt",
    band: "SECURE",
    verdict: "ok",
    final_score: 82,
    controls: [],
  },
};

const ONCHAIN: OnchainCheckResponse = {
  ok: true,
  data: {
    contract: "0x238E",
    wallet: "0x1111111111111111111111111111111111111111",
    registered: true,
    log_count: 1,
    block_from: 0,
    block_to: 1,
    rpc_url: "https://rpc",
    error: null,
  },
};

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  useScannerStore.getState().reset();
  localStorage.clear();
  vi.clearAllMocks();
});

describe("useScanFlow", () => {
  it("runLookup advances to the confirm step, seeding fields", async () => {
    lookupMock.mockResolvedValue(LOOKUP);
    useScannerStore.getState().setHandle("@aixbt_agent");
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runLookup();
    });

    expect(lookupMock).toHaveBeenCalledWith("@aixbt_agent");
    expect(useScannerStore.getState().step).toBe(2);
    expect(useScannerStore.getState().agentName).toBe("aixbt");
    expect(useScannerStore.getState().url).toBe("https://aixbt.tech");
  });

  it("runLookup surfaces an error and stays on step 1", async () => {
    lookupMock.mockRejectedValue(new ApiError(404, null, "not found"));
    useScannerStore.getState().setHandle("@nobody");
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runLookup();
    });

    expect(useScannerStore.getState().step).toBe(1);
    expect(useScannerStore.getState().scanError?.message).toBe("not found");
  });

  it("runScan posts the lama payload, advances to step 3, and writes BOTH handoff keys", async () => {
    scanMock.mockResolvedValue(SCAN);
    const s = useScannerStore.getState();
    s.beginConfirm(LOOKUP); // seeds agentName/url, step 2
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runScan();
    });

    // react-query passes a 2nd context arg to the mutationFn — assert the payload only.
    expect(scanMock.mock.calls[0][0]).toEqual({
      url: "https://aixbt.tech",
      agent_name: "aixbt",
      username: "aixbt_agent",
      scraped: true, // source === 'nitter'
      scan_mode: "root",
    });
    expect(useScannerStore.getState().step).toBe(3);
    expect(useScannerStore.getState().scanResult).not.toBeNull();
    // Producer handoff — both keys written.
    expect(localStorage.getItem("acpsec_last_scan")).toContain("aixbt");
    expect(localStorage.getItem("acpsec_last_scan_time")).not.toBeNull();
    // POST /api/score is NOT part of the scan flow (deferred to Open-in-Dashboard).
    expect(createScoreMock).not.toHaveBeenCalled();
  });

  it("runScan runs the on-chain check only for a valid wallet and attaches it", async () => {
    scanMock.mockResolvedValue(SCAN);
    onchainMock.mockResolvedValue(ONCHAIN);
    const s = useScannerStore.getState();
    s.beginConfirm(LOOKUP);
    s.setWallet("0x1111111111111111111111111111111111111111");
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runScan();
    });

    expect(onchainMock.mock.calls[0][0]).toBe(
      "0x1111111111111111111111111111111111111111",
    );
    const data = useScannerStore.getState().scanResult?.data as Record<
      string,
      unknown
    >;
    expect(data.acp_registered).toBe(true);
    expect(useScannerStore.getState().onchainStatus).toEqual(ONCHAIN);
  });

  it("runScan skips the on-chain check for an invalid wallet", async () => {
    scanMock.mockResolvedValue(SCAN);
    const s = useScannerStore.getState();
    s.beginConfirm(LOOKUP);
    s.setWallet("not-an-address");
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runScan();
    });

    expect(onchainMock).not.toHaveBeenCalled();
    expect(useScannerStore.getState().step).toBe(3);
  });

  it("runScan on error keeps step 2 and records the error", async () => {
    scanMock.mockRejectedValue(new ApiError(500, null, "scan boom"));
    const s = useScannerStore.getState();
    s.beginConfirm(LOOKUP);
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.runScan();
    });

    expect(useScannerStore.getState().step).toBe(2);
    expect(useScannerStore.getState().scanError?.message).toBe("scan boom");
    expect(useScannerStore.getState().isScanning).toBe(false);
  });

  it("openInDashboard writes the handoff and POSTs /api/score", async () => {
    createScoreMock.mockResolvedValue({ ok: true, data: SCAN.data });
    // Stub navigation (jsdom can't navigate).
    const orig = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...orig, href: "" },
    });
    useScannerStore.getState().setScanResult(SCAN);
    const { result } = renderHook(() => useScanFlow(), { wrapper: wrapper() });

    act(() => result.current.openInDashboard());

    await waitFor(() => expect(createScoreMock).toHaveBeenCalled());
    expect(createScoreMock.mock.calls[0][0]).toEqual(SCAN.data);
    expect(localStorage.getItem("acpsec_last_scan")).toContain("aixbt");
    expect(window.location.href).toBe("/");
    Object.defineProperty(window, "location", { writable: true, value: orig });
  });
});
