import { fetchApi } from "./client";
import type {
  LeaderboardAuthResponse,
  LeaderboardResponse,
} from "./types";

/** GET /api/leaderboard — ranked agents with movement + tier. */
export function fetchLeaderboard(): Promise<LeaderboardResponse> {
  return fetchApi<LeaderboardResponse>("/api/leaderboard");
}

/**
 * POST /api/leaderboard/auth — validate the leaderboard password. On success
 * the backend sets the lb_session cookie (carried by `credentials: "include"`).
 * A wrong password is a 401 → throws ApiError.
 */
export function leaderboardAuth(
  password: string,
): Promise<LeaderboardAuthResponse> {
  return fetchApi<LeaderboardAuthResponse>("/api/leaderboard/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
