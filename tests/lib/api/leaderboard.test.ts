import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import type { LeaderboardResponse } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("fetchLeaderboard", () => {
  it("calls fetchApi('/api/leaderboard') and passes the response through", async () => {
    const resp: LeaderboardResponse = {
      ok: true,
      updated: "2026-06-01",
      checks_per_scan: 38,
      count: 0,
      agents: [],
    };
    fetchApiMock.mockResolvedValue(resp);
    await expect(fetchLeaderboard()).resolves.toEqual(resp);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/leaderboard");
  });

  it("propagates errors", async () => {
    fetchApiMock.mockRejectedValue(new Error("boom"));
    await expect(fetchLeaderboard()).rejects.toThrow("boom");
  });
});
