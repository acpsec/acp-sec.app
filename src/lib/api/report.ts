import { fetchApi } from "./client";
import type { ReportResponse } from "./types";

/**
 * GET /api/report/{agentId} — full scan breakdown.
 *
 * A missing report is a 404 with body {ok:false, error:"report_not_found", …};
 * `fetchApi` throws `ApiError` (status 404) — the caller/hook distinguishes
 * "not found" from other failures via `error.status`.
 */
export function fetchReport(agentId: string): Promise<ReportResponse> {
  return fetchApi<ReportResponse>(`/api/report/${encodeURIComponent(agentId)}`);
}
