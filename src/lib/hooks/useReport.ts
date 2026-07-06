import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/errors";
import { fetchReport } from "@/lib/api/report";

/**
 * Retry predicate for report queries. A 404 ("report_not_found") is a stable,
 * idempotent result — never retry it. Other (transient) failures retry once.
 * Exported so the decision is unit-testable without React Query.
 */
export function reportRetry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status === 404) return false;
  return failureCount < 1;
}

/**
 * GET /api/report/{agentId}. Disabled until an agentId is provided.
 */
export function useReport(agentId: string | undefined) {
  return useQuery({
    queryKey: ["report", agentId],
    queryFn: () => fetchReport(agentId as string),
    enabled: !!agentId,
    retry: reportRetry,
  });
}
