import { useMutation } from "@tanstack/react-query";

import { leaderboardAuth } from "@/lib/api/leaderboard";

/**
 * POST /api/leaderboard/auth. No cache invalidation — success sets the
 * lb_session cookie in the browser (via credentials: "include").
 */
export function useLeaderboardAuth() {
  return useMutation({
    mutationFn: (password: string) => leaderboardAuth(password),
  });
}
