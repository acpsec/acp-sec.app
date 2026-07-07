import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createScore,
  createScoreManual,
  deleteScore,
} from "@/lib/api/score";

// All score mutations invalidate ['score'] so useScore refetches the new state.

/** POST /api/score. */
export function useCreateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createScore,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["score"] });
    },
  });
}

/** POST /api/score/manual. */
export function useCreateScoreManual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createScoreManual,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["score"] });
    },
  });
}

/** DELETE /api/score. */
export function useDeleteScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteScore,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["score"] });
    },
  });
}
