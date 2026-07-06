import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { fetchReport } from "@/lib/api/report";
import type { ReportResponse } from "@/lib/api/types";
import { reportRetry, useReport } from "@/lib/hooks/useReport";

vi.mock("@/lib/api/report", () => ({ fetchReport: vi.fn() }));
const fetchReportMock = vi.mocked(fetchReport);

// Isolate call history between the two integration tests below.
beforeEach(() => fetchReportMock.mockClear());

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

// Retry decision tested directly (deterministic; avoids RQ's no-retry error
// path surfacing an unhandled rejection under vitest).
describe("reportRetry", () => {
  it("does NOT retry a 404 (report_not_found) — single call, not 2", () => {
    const notFound = new ApiError(404, { ok: false, error: "report_not_found" });
    expect(reportRetry(0, notFound)).toBe(false);
  });

  it("retries other failures once (transient ApiError, network, generic Error)", () => {
    expect(reportRetry(0, new ApiError(500, { ok: false, error: "boom" }))).toBe(true);
    expect(reportRetry(0, new ApiError(0, null, "Network error"))).toBe(true);
    expect(reportRetry(0, new Error("oops"))).toBe(true);
    // …but only once.
    expect(reportRetry(1, new ApiError(500, { ok: false, error: "boom" }))).toBe(false);
  });
});

describe("useReport", () => {
  it("loads then resolves for a provided agentId", async () => {
    const resp: ReportResponse = {
      ok: true,
      data: { agent_name: "aixbt", band: "SECURE", verdict: "", final_score: 80, controls: [] },
    };
    fetchReportMock.mockResolvedValue(resp);
    const { result } = renderHook(() => useReport("aixbt"), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(resp);
    expect(fetchReportMock).toHaveBeenCalledWith("aixbt");
  });

  it("is disabled (does not fetch) when agentId is undefined", () => {
    const { result } = renderHook(() => useReport(undefined), { wrapper: createWrapper() });
    expect(fetchReportMock).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.isLoading).toBe(false);
  });
});
