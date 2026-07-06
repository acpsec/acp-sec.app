import { fetchApi } from "./client";
import type { ScoreResponse } from "./types";

/** GET /api/score — current score, or `{ok:false, data:null}` when empty. */
export function fetchScore(): Promise<ScoreResponse> {
  return fetchApi<ScoreResponse>("/api/score");
}
