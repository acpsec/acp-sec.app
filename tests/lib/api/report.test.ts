import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { fetchReport } from "@/lib/api/report";
import type { ReportResponse } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("fetchReport", () => {
  it("calls fetchApi with the (url-encoded) report path and passes through", async () => {
    const resp: ReportResponse = {
      ok: true,
      data: { agent_name: "aixbt", band: "SECURE", verdict: "", final_score: 80, controls: [] },
    };
    fetchApiMock.mockResolvedValue(resp);
    await expect(fetchReport("aixbt")).resolves.toEqual(resp);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/report/aixbt");
  });

  it("url-encodes the agent id", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: {} });
    await fetchReport("@x/y");
    expect(fetchApiMock).toHaveBeenCalledWith("/api/report/%40x%2Fy");
  });

  it("propagates a 404 ApiError (report_not_found) for the caller to branch on", async () => {
    fetchApiMock.mockRejectedValue(
      new ApiError(404, {
        ok: false,
        error: "report_not_found",
        message: "Full report not available for this agent.",
        scan_url: "/scanner",
      }),
    );
    await expect(fetchReport("ghost")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      body: { error: "report_not_found" },
    });
  });
});
