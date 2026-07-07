import { describe, expect, it, vi } from "vitest";

import { chatSentryAgent } from "@/lib/api/chat";
import { fetchApi } from "@/lib/api/client";
import type { ChatMessage } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("chatSentryAgent", () => {
  it("POSTs {messages} to /api/chat/sentryagent and returns the reply", async () => {
    const messages: ChatMessage[] = [{ role: "user", content: "gm" }];
    fetchApiMock.mockResolvedValue({ ok: true, reply: "Hello" });
    await expect(chatSentryAgent(messages)).resolves.toEqual({
      ok: true,
      reply: "Hello",
    });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/chat/sentryagent", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
  });

  it("propagates errors (e.g. 502 upstream)", async () => {
    fetchApiMock.mockRejectedValue(new Error("upstream"));
    await expect(
      chatSentryAgent([{ role: "user", content: "x" }]),
    ).rejects.toThrow("upstream");
  });
});
