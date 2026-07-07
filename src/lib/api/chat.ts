import { fetchApi } from "./client";
import type { ChatMessage, ChatResponse } from "./types";

/**
 * POST /api/chat/sentryagent — SentryAgent chat proxy. Blocking (non-streaming):
 * the backend returns the full reply as JSON `{ok:true, reply}`. The API key
 * stays server-side; no request-side auth.
 */
export function chatSentryAgent(messages: ChatMessage[]): Promise<ChatResponse> {
  return fetchApi<ChatResponse>("/api/chat/sentryagent", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
}
