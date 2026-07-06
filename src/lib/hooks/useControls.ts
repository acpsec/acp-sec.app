import { useQuery } from "@tanstack/react-query";

import { fetchControls } from "@/lib/api/controls";

/** GET /api/controls. Long staleTime — the catalogue rarely changes. */
export function useControls() {
  return useQuery({
    queryKey: ["controls"],
    queryFn: fetchControls,
    staleTime: 300_000,
  });
}
