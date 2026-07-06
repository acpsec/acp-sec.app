import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fetchLeaderboard } from "@/lib/api/leaderboard";
import type { LeaderboardResponse } from "@/lib/api/types";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";

vi.mock("@/lib/api/leaderboard", () => ({ fetchLeaderboard: vi.fn() }));
const fetchLeaderboardMock = vi.mocked(fetchLeaderboard);

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("useLeaderboard", () => {
  it("loads then resolves with the ranked agents", async () => {
    const resp: LeaderboardResponse = {
      ok: true,
      updated: "2026-06-01",
      checks_per_scan: 38,
      count: 1,
      agents: [
        {
          id: "aixbt",
          name: "aixbt",
          score: 82,
          previous_score: 80,
          tier: "SECURE",
          rank: 1,
          movement: "up",
          movement_delta: 2,
        },
      ],
    };
    fetchLeaderboardMock.mockResolvedValue(resp);
    const { result } = renderHook(() => useLeaderboard(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.count).toBe(1);
  });
});
