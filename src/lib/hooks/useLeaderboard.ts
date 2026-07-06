import { useQuery } from "@tanstack/react-query";

import { fetchLeaderboard } from "@/lib/api/leaderboard";

/** GET /api/leaderboard. Moderate staleTime — updates as scans complete. */
export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 30_000,
  });
}
