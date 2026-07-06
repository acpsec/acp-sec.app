import { fetchApi } from "./client";
import type { HealthResponse } from "./types";

/** GET /api/health — backend liveness probe. Pure fetcher, no state. */
export function fetchHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>("/api/health");
}
