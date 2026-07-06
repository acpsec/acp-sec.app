import { fetchApi } from "./client";
import type { LeaderboardResponse } from "./types";

/** GET /api/leaderboard — ranked agents with movement + tier. */
export function fetchLeaderboard(): Promise<LeaderboardResponse> {
  return fetchApi<LeaderboardResponse>("/api/leaderboard");
}
