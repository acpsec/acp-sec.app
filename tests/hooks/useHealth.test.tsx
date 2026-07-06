import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fetchHealth } from "@/lib/api/health";
import type { HealthResponse } from "@/lib/api/types";
import { useHealth } from "@/lib/hooks/useHealth";

vi.mock("@/lib/api/health", () => ({ fetchHealth: vi.fn() }));
const fetchHealthMock = vi.mocked(fetchHealth);

// Fresh client per test (no cache bleed); retryDelay 0 keeps the hook's retry:1
// instant so the error case resolves fast.
function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

const HEALTH: HealthResponse = {
  ok: true,
  service: "acp-sec-dashboard",
  acpsec_available: true,
  scanner_protected: false,
};

describe("useHealth", () => {
  it("starts loading, then resolves to the health payload", async () => {
    fetchHealthMock.mockResolvedValue(HEALTH);
    const { result } = renderHook(() => useHealth(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(HEALTH);
  });

  it("surfaces an error when the fetch fails", async () => {
    fetchHealthMock.mockRejectedValue(new Error("backend down"));
    const { result } = renderHook(() => useHealth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 2000,
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
