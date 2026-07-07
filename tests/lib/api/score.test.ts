import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import {
  createScore,
  createScoreManual,
  deleteScore,
  fetchScore,
} from "@/lib/api/score";
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

describe("createScore", () => {
  it("POSTs the payload as JSON to /api/score", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: {} });
    await createScore({ agent_name: "X", controls: [] });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/score", {
      method: "POST",
      body: JSON.stringify({ agent_name: "X", controls: [] }),
    });
  });

  it("propagates errors (e.g. 400 bad payload)", async () => {
    fetchApiMock.mockRejectedValue(new Error("bad"));
    await expect(createScore({})).rejects.toThrow("bad");
  });
});

describe("createScoreManual", () => {
  it("POSTs to /api/score/manual", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: {} });
    await createScoreManual({ controls: [{ ctrl: "AUTH-01" }] });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/score/manual", {
      method: "POST",
      body: JSON.stringify({ controls: [{ ctrl: "AUTH-01" }] }),
    });
  });
});

describe("deleteScore", () => {
  it("DELETEs /api/score", async () => {
    fetchApiMock.mockResolvedValue({ ok: true });
    await expect(deleteScore()).resolves.toEqual({ ok: true });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/score", { method: "DELETE" });
  });
});
