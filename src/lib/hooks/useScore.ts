import { useQuery } from "@tanstack/react-query";

import { fetchScore } from "@/lib/api/score";

/** GET /api/score. Short staleTime — the score changes during dashboard flow. */
export function useScore() {
  return useQuery({
    queryKey: ["score"],
    queryFn: fetchScore,
    staleTime: 10_000,
  });
}
