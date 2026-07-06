import type { ApiErrorBody } from "./types";

/**
 * Thrown by `fetchApi` for any non-2xx response (and network failures, with
 * `status: 0`). Carries the HTTP status and the parsed error body so callers /
 * React Query error boundaries can branch on them.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
    message?: string,
  ) {
    // Message priority: explicit override → backend `error` field → HTTP status.
    super(message ?? body?.error ?? `HTTP ${status}`);
    this.name = "ApiError";
  }
}
