import { fetchApi } from "./client";
import type { ControlsResponse } from "./types";

/** GET /api/controls — check/control catalogue for the scoring editor. */
export function fetchControls(): Promise<ControlsResponse> {
  return fetchApi<ControlsResponse>("/api/controls");
}
