import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fetchScore } from "@/lib/api/score";
import type { ScoreResponse } from "@/lib/api/types";
import { useScore } from "@/lib/hooks/useScore";

vi.mock("@/lib/api/score", () => ({ fetchScore: vi.fn() }));
const fetchScoreMock = vi.mocked(fetchScore);

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("useScore", () => {
  it("loads then resolves with the score response", async () => {
    const resp: ScoreResponse = {
      ok: true,
      data: { agent_name: "X", band: "SECURE", verdict: "", final_score: 80, controls: [] },
    };
    fetchScoreMock.mockResolvedValue(resp);
    const { result } = renderHook(() => useScore(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(resp);
  });
});
