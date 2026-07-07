import { fetchApi } from "./client";
import type {
  ScannerBulkRequest,
  ScannerBulkResponse,
  ScannerLookupResponse,
  ScannerScanRequest,
  ScannerScanResponse,
} from "./types";

// Scanner endpoints are scanner-token gated; the generic client attaches
// X-Scanner-Token for /api/scanner/* automatically (see api/client.ts).

/** POST /api/scanner/lookup — scrape X/Twitter profile via Nitter. */
export function scannerLookup(username: string): Promise<ScannerLookupResponse> {
  return fetchApi<ScannerLookupResponse>("/api/scanner/lookup", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

/** POST /api/scanner/scan — heuristic website security scan (writes leaderboard). */
export function scannerScan(
  payload: ScannerScanRequest,
): Promise<ScannerScanResponse> {
  return fetchApi<ScannerScanResponse>("/api/scanner/scan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/scanner/bulk — scan multiple usernames (writes leaderboard). */
export function scannerBulk(
  payload: ScannerBulkRequest,
): Promise<ScannerBulkResponse> {
  return fetchApi<ScannerBulkResponse>("/api/scanner/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
