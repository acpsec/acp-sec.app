import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { leaderboardAuth } from "@/lib/api/leaderboard";
import { useLeaderboardAuth } from "@/lib/hooks/useLeaderboardAuth";

vi.mock("@/lib/api/leaderboard", () => ({ leaderboardAuth: vi.fn() }));
const leaderboardAuthMock = vi.mocked(leaderboardAuth);

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

describe("useLeaderboardAuth", () => {
  it("mutates with the password and does NOT invalidate (cookie set by browser)", async () => {
    leaderboardAuthMock.mockResolvedValue({ ok: true });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useLeaderboardAuth(), { wrapper });

    result.current.mutate("s3cret");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(leaderboardAuthMock).toHaveBeenCalledWith("s3cret");
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
