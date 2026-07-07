import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatSentryAgent } from "@/lib/api/chat";
import { useChatSentryAgent } from "@/lib/hooks/useChat";

vi.mock("@/lib/api/chat", () => ({ chatSentryAgent: vi.fn() }));
const chatMock = vi.mocked(chatSentryAgent);

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

describe("useChatSentryAgent", () => {
  it("mutates with the messages and returns the reply (no invalidation)", async () => {
    chatMock.mockResolvedValue({ ok: true, reply: "Hello" });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useChatSentryAgent(), { wrapper });

    result.current.mutate([{ role: "user", content: "gm" }]);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(chatMock).toHaveBeenCalledWith([{ role: "user", content: "gm" }]);
    expect(result.current.data).toEqual({ ok: true, reply: "Hello" });
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
