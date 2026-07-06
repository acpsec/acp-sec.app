import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fetchControls } from "@/lib/api/controls";
import type { ControlsResponse } from "@/lib/api/types";
import { useControls } from "@/lib/hooks/useControls";

vi.mock("@/lib/api/controls", () => ({ fetchControls: vi.fn() }));
const fetchControlsMock = vi.mocked(fetchControls);

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("useControls", () => {
  it("loads then resolves with the controls catalogue", async () => {
    const resp: ControlsResponse = {
      source: "acpsec",
      acpsec_available: true,
      checks: [
        {
          id: "AUTH-01",
          name: "Agent identity declared",
          dimension: "AUTH",
          dimension_name: "Authentication & Identity",
          max_score: 3,
          severity: "HIGH",
          description: "…",
        },
      ],
      asf_controls: [],
    };
    fetchControlsMock.mockResolvedValue(resp);
    const { result } = renderHook(() => useControls(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.checks).toHaveLength(1);
  });
});
