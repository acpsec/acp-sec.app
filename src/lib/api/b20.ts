import { fetchApi } from "./client";
import type { B20ScanRequest, B20ScanResult } from "./types";

/**
 * Base Sepolia (84532) — the only chain the /b20 route targets in V1 (see
 * web3/config.ts). The backend also accepts Base mainnet (8453), but the UI
 * doesn't wire it until B20 activates there.
 */
export const B20_DEFAULT_CHAIN_ID = 84532;

/**
 * POST /api/b20/scan — read-only B20 Trust Score scan.
 *
 * Same-origin (Opsi A) through the generic client, so it inherits API_BASE_URL,
 * credentials, and JSON handling. NOT scanner-token gated (the path isn't a
 * scanner/onchain prefix). Errors surface as the standard `ApiError`, with the
 * backend code on `.body.error` (see B20ErrorCode).
 */
export function scanB20({
  address,
  chain_id = B20_DEFAULT_CHAIN_ID,
}: B20ScanRequest): Promise<B20ScanResult> {
  return fetchApi<B20ScanResult>("/api/b20/scan", {
    method: "POST",
    body: JSON.stringify({ address, chain_id }),
  });
}
