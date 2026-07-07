import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { fetchLeaderboard, leaderboardAuth } from "@/lib/api/leaderboard";
import { ApiError } from "@/lib/api/errors";
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

describe("leaderboardAuth", () => {
  it("POSTs {password} to /api/leaderboard/auth", async () => {
    fetchApiMock.mockResolvedValue({ ok: true });
    await expect(leaderboardAuth("s3cret")).resolves.toEqual({ ok: true });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/leaderboard/auth", {
      method: "POST",
      body: JSON.stringify({ password: "s3cret" }),
    });
  });

  it("propagates a 401 ApiError for a wrong password", async () => {
    fetchApiMock.mockRejectedValue(
      new ApiError(401, { ok: false, error: "Incorrect password" }),
    );
    await expect(leaderboardAuth("nope")).rejects.toMatchObject({
      status: 401,
      body: { error: "Incorrect password" },
    });
  });
});
