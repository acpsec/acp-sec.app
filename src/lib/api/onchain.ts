import { fetchApi } from "./client";
import type { OnchainCheckResponse } from "./types";

/**
 * POST /api/onchain/check — best-effort Base ACP registration check for a
 * wallet. Read-only; scanner-token gated (X-Scanner-Token added by the client).
 */
export function onchainCheck(wallet: string): Promise<OnchainCheckResponse> {
  return fetchApi<OnchainCheckResponse>("/api/onchain/check", {
    method: "POST",
    body: JSON.stringify({ wallet }),
  });
}
