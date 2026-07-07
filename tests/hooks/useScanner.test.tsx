import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { scannerBulk, scannerLookup, scannerScan } from "@/lib/api/scanner";
import {
  useScannerBulk,
  useScannerLookup,
  useScannerScan,
} from "@/lib/hooks/useScanner";

vi.mock("@/lib/api/scanner", () => ({
  scannerLookup: vi.fn(),
  scannerScan: vi.fn(),
  scannerBulk: vi.fn(),
}));
const scannerLookupMock = vi.mocked(scannerLookup);
const scannerScanMock = vi.mocked(scannerScan);
const scannerBulkMock = vi.mocked(scannerBulk);

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const invalidateSpy = vi
    .spyOn(client, "invalidateQueries")
    .mockResolvedValue(undefined);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
}

beforeEach(() => vi.clearAllMocks());

describe("useScannerLookup", () => {
  it("mutates without invalidating any query (read-only scrape)", async () => {
    scannerLookupMock.mockResolvedValue({ ok: true, data: {} as never });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useScannerLookup(), { wrapper });

    result.current.mutate("@agentx");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(scannerLookupMock).toHaveBeenCalledWith("@agentx");
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe("useScannerScan", () => {
  it("mutates then invalidates ['leaderboard'] (scan writes the board)", async () => {
    scannerScanMock.mockResolvedValue({ ok: true, data: {} as never });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useScannerScan(), { wrapper });

    result.current.mutate({ url: "https://x.example" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["leaderboard"] });
  });
});

describe("useScannerBulk", () => {
  it("mutates then invalidates ['leaderboard']", async () => {
    scannerBulkMock.mockResolvedValue({ ok: true, count: 0, results: [] });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useScannerBulk(), { wrapper });

    result.current.mutate({ usernames: ["a"] });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["leaderboard"] });
  });
});
