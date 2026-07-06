import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/lib/api/health";

/**
 * React Query hook for GET /api/health. Proof-of-pattern for the layered
 * raw-fetcher + hook architecture (3.5b/3.5c follow this shape).
 */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    staleTime: 30_000, // health rarely changes
    retry: 1, // don't hammer a down backend
  });
}
