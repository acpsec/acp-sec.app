import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { fetchControls } from "@/lib/api/controls";
import type { ControlsResponse } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("fetchControls", () => {
  it("calls fetchApi('/api/controls') and passes the response through", async () => {
    const resp: ControlsResponse = {
      source: "acpsec",
      acpsec_available: true,
      checks: [],
      asf_controls: [],
    };
    fetchApiMock.mockResolvedValue(resp);
    await expect(fetchControls()).resolves.toEqual(resp);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/controls");
  });

  it("propagates errors", async () => {
    fetchApiMock.mockRejectedValue(new Error("boom"));
    await expect(fetchControls()).rejects.toThrow("boom");
  });
});
