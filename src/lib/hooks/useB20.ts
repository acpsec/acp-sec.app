import { useMutation } from "@tanstack/react-query";

import { scanB20 } from "@/lib/api/b20";

/**
 * POST /api/b20/scan — read-only B20 Trust Score scan.
 *
 * A React Query mutation on the app-wide QueryClient (src/app/providers.tsx),
 * mirroring useScannerScan. Unlike the scanner it writes nothing (no leaderboard,
 * no `acpsec_last_scan` handoff → no invalidation). Mutations don't retry by
 * default, so a failed scan (e.g. `rpc_unreachable`) won't retry-storm.
 */
export function useB20Scan() {
  return useMutation({ mutationFn: scanB20 });
}
