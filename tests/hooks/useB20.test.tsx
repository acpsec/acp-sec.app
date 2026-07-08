import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { scanB20 } from "@/lib/api/b20";
import { ApiError } from "@/lib/api/errors";
import type { B20ScanResult } from "@/lib/api/types";
import { useB20Scan } from "@/lib/hooks/useB20";

vi.mock("@/lib/api/b20", () => ({ scanB20: vi.fn() }));
const scanB20Mock = vi.mocked(scanB20);

const ADDR = "0x1111111111111111111111111111111111111111";
const RESULT = {
  token: ADDR,
  trust_score: 72,
  grade: "B",
} as unknown as B20ScanResult;

function setup() {
  // Mirror the app-wide QueryClient's mutation behavior: retry defaults to
  // false, so a failed scan does NOT retry-storm on rpc_unreachable.
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper };
}

beforeEach(() => vi.clearAllMocks());

describe("useB20Scan", () => {
  it("goes idle → pending → success with the typed result", async () => {
    // Deferred so the pending phase is observable (an immediately-resolved mock
    // flips to success before waitFor can poll it).
    let resolve!: (v: B20ScanResult) => void;
    scanB20Mock.mockReturnValue(
      new Promise<B20ScanResult>((r) => {
        resolve = r;
      }),
    );
    const { wrapper } = setup();
    const { result } = renderHook(() => useB20Scan(), { wrapper });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate({ address: ADDR });
    await waitFor(() => expect(result.current.isPending).toBe(true));

    resolve(RESULT);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // RQ v5 passes a mutation context as a 2nd arg; assert the variables only.
    expect(scanB20Mock.mock.calls[0]![0]).toEqual({ address: ADDR });
    expect(result.current.data).toBe(RESULT);
  });

  it("surfaces the typed error code on failure (ApiError.body.error)", async () => {
    scanB20Mock.mockRejectedValue(
      new ApiError(400, { error: "not_b20", detail: "nope" }, "not_b20"),
    );
    const { wrapper } = setup();
    const { result } = renderHook(() => useB20Scan(), { wrapper });

    result.current.mutate({ address: ADDR });
    await waitFor(() => expect(result.current.isError).toBe(true));

    const err = result.current.error as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.body?.error).toBe("not_b20");
  });

  it("does not retry on rpc_unreachable (calls scanB20 exactly once)", async () => {
    scanB20Mock.mockRejectedValue(
      new ApiError(503, { error: "rpc_unreachable", detail: "down" }, "rpc_unreachable"),
    );
    const { wrapper } = setup();
    const { result } = renderHook(() => useB20Scan(), { wrapper });

    result.current.mutate({ address: ADDR });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(scanB20Mock).toHaveBeenCalledTimes(1);
  });
});
