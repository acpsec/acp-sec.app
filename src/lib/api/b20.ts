import { fetchApi } from "./client";
import type { B20ScanRequest, B20ScanResult } from "./types";

/**
 * Default network for the B20 scanner: Base Sepolia (84532). The backend accepts
 * both Base Sepolia (84532) and Base mainnet (8453); the UI now exposes both via
 * the ScanForm network selector (B20 is verified activated on mainnet). This
 * constant is only the selector's initial value.
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
