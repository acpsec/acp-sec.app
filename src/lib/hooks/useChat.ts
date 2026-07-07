import { useMutation } from "@tanstack/react-query";

import { chatSentryAgent } from "@/lib/api/chat";
import type { ChatMessage } from "@/lib/api/types";

/** POST /api/chat/sentryagent. Blocking request — no cache invalidation. */
export function useChatSentryAgent() {
  return useMutation({
    mutationFn: (messages: ChatMessage[]) => chatSentryAgent(messages),
  });
}
