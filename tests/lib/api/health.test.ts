import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { fetchHealth } from "@/lib/api/health";
import type { HealthResponse } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));

const fetchApiMock = vi.mocked(fetchApi);

describe("fetchHealth", () => {
  it("calls fetchApi with GET /api/health and returns its result", async () => {
    const health: HealthResponse = {
      ok: true,
      service: "acp-sec-dashboard",
      acpsec_available: true,
      scanner_protected: false,
    };
    fetchApiMock.mockResolvedValue(health);

    await expect(fetchHealth()).resolves.toEqual(health);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/health");
  });
});
