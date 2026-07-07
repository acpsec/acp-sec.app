import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scannerBulk, scannerLookup, scannerScan } from "@/lib/api/scanner";

/** POST /api/scanner/lookup. Read-only scrape — no invalidation. */
export function useScannerLookup() {
  return useMutation({
    mutationFn: (username: string) => scannerLookup(username),
  });
}

/** POST /api/scanner/scan. Writes the leaderboard → invalidate ['leaderboard']. */
export function useScannerScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: scannerScan,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

/** POST /api/scanner/bulk. Writes the leaderboard → invalidate ['leaderboard']. */
export function useScannerBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: scannerBulk,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
