import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { onchainCheck } from "@/lib/api/onchain";
import { useOnchainCheck } from "@/lib/hooks/useOnchain";

vi.mock("@/lib/api/onchain", () => ({ onchainCheck: vi.fn() }));
const onchainCheckMock = vi.mocked(onchainCheck);

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const invalidateSpy = vi
    .spyOn(client, "invalidateQueries")
    .mockResolvedValue(undefined);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
}

beforeEach(() => vi.clearAllMocks());

describe("useOnchainCheck", () => {
  it("mutates with the wallet and does NOT invalidate (read-only)", async () => {
    onchainCheckMock.mockResolvedValue({
      ok: true,
      data: { registered: false } as never,
    });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useOnchainCheck(), { wrapper });

    result.current.mutate("0xabc");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onchainCheckMock).toHaveBeenCalledWith("0xabc");
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
