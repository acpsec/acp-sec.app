import { fetchApi } from "./client";
import type {
  ScoreCreateRequest,
  ScoreCreateResponse,
  ScoreDeleteResponse,
  ScoreManualRequest,
  ScoreManualResponse,
  ScoreResponse,
} from "./types";

/** GET /api/score — current score, or `{ok:false, data:null}` when empty. */
export function fetchScore(): Promise<ScoreResponse> {
  return fetchApi<ScoreResponse>("/api/score");
}

/** POST /api/score — normalise + persist an acpsec/ASF payload. */
export function createScore(
  payload: ScoreCreateRequest,
): Promise<ScoreCreateResponse> {
  return fetchApi<ScoreCreateResponse>("/api/score", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/score/manual — compute + persist from manual control scores. */
export function createScoreManual(
  payload: ScoreManualRequest,
): Promise<ScoreManualResponse> {
  return fetchApi<ScoreManualResponse>("/api/score/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** DELETE /api/score — clear the cached + persisted score. */
export function deleteScore(): Promise<ScoreDeleteResponse> {
  return fetchApi<ScoreDeleteResponse>("/api/score", { method: "DELETE" });
}
