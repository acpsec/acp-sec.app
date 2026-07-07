import { useMutation } from "@tanstack/react-query";

import { onchainCheck } from "@/lib/api/onchain";

/** POST /api/onchain/check. Read-only — no cache invalidation. */
export function useOnchainCheck() {
  return useMutation({
    mutationFn: (wallet: string) => onchainCheck(wallet),
  });
}
