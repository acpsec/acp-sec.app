/**
 * Hand-written types for the acpsec_api backend (no OpenAPI generation).
 * 3.5a defines the foundation + health; 3.5b/3.5c add the rest.
 */

/**
 * The `{ok, data}` envelope used by most endpoints (score, scanner, onchain, …).
 * NOTE: not every endpoint uses it — /api/health returns flat fields (see
 * HealthResponse). Per-endpoint types are the source of truth.
 */
export type ApiResponse<T> =
  | { ok: true; data: T }
  | ({ ok: false; error: string } & Record<string, unknown>);

/**
 * Shape of a backend error body. Error envelopes vary per endpoint (some carry
 * `ok: false`, some are a bare `{error}`, FastAPI validation uses `{detail}`),
 * so every field is optional and extra keys are allowed.
 */
export type ApiErrorBody = {
  ok?: false;
  error?: string;
} & Record<string, unknown>;

/** GET /api/health — flat liveness probe (no data envelope). */
export type HealthResponse = {
  ok: true;
  service: string;
  acpsec_available: boolean;
  scanner_protected: boolean;
};
