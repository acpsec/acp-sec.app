import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { fetchScore } from "@/lib/api/score";
import type { ScoreResponse } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("fetchScore", () => {
  it("calls fetchApi('/api/score') and passes the response through", async () => {
    const resp: ScoreResponse = { ok: false, data: null };
    fetchApiMock.mockResolvedValue(resp);
    await expect(fetchScore()).resolves.toEqual(resp);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/score");
  });

  it("propagates errors", async () => {
    fetchApiMock.mockRejectedValue(new Error("boom"));
    await expect(fetchScore()).rejects.toThrow("boom");
  });
});
