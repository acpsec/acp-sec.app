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

// ── Shared scan primitives (3.5b) ──────────────────────────────────────────
// Backend score/report objects are loosely-structured dicts. We type the
// stable display fields and allow the long tail of scan metadata via an index
// signature (so nothing is dropped, and Groups 4–6 get types for what matters).

/** A single control result inside a score/report (a `controls[]` entry). */
export type ScanControl = {
  ctrl: string;
  name: string;
  dimension: string;
  dimension_name: string;
  max: number;
  score: number;
  severity: string;
  status: string;
  finding?: string;
  evidence?: string[];
  recommendations?: unknown;
  inferred?: boolean;
  [key: string]: unknown;
};

/** Normalised score / scan wire format — GET /api/score `data`. */
export type ScoreData = {
  agent_name: string;
  agent_version?: string;
  band: string;
  verdict: string;
  final_score: number;
  score_pct?: number;
  critical_fails?: number;
  controls: ScanControl[];
  source?: string;
  timestamp?: string;
  x_username?: string;
  [key: string]: unknown;
};

/** GET /api/score — `data` is null in the empty state. */
export type ScoreResponse =
  | { ok: true; data: ScoreData }
  | { ok: false; data: null };

/** Full scan report — GET /api/report/{id} `data` (superset of ScoreData). */
export type ReportData = ScoreData & {
  security_headers?: Record<string, unknown>;
  sec_header_count?: number;
  scan_mode?: string;
  scan_duration_ms?: number;
  metadata?: Record<string, unknown>;
};

/** GET /api/report/{id} success body. 404/400/500 throw ApiError instead. */
export type ReportResponse = { ok: true; data: ReportData };

// ── Controls catalogue (3.5b) ──────────────────────────────────────────────

/** A check definition from the acpsec catalogue (checks[] entry). */
export type CheckDef = {
  id: string;
  name: string;
  dimension: string;
  dimension_name: string;
  max_score: number;
  severity: string;
  description: string;
};

/** An ASF control definition (asf_controls[] entry). */
export type AsfControl = {
  id: string;
  name: string;
  dimension: string;
  max_score: number;
  severity: string;
};

/** GET /api/controls — flat (no `ok`/`data` envelope). */
export type ControlsResponse = {
  source: string;
  acpsec_available: boolean;
  checks: CheckDef[];
  asf_controls: AsfControl[];
};

// ── Leaderboard (3.5b) ─────────────────────────────────────────────────────

export type Movement = "up" | "down" | "same";

/**
 * A leaderboard agent entry. `score`/`tier` are nullable (e.g. the SentryAgent
 * reference entry). `rank`/`movement`/`movement_delta` are added by the
 * endpoint. Many optional scanner-written fields ride the index signature.
 */
export type Agent = {
  id: string;
  name: string;
  score: number | null;
  previous_score: number | null;
  tier: string | null;
  rank: number;
  movement: Movement;
  movement_delta: number;
  x_handle?: string;
  category?: string;
  badges?: string[];
  contract?: string;
  network?: string;
  profile_url?: string;
  last_scan_date?: string | null;
  [key: string]: unknown;
};

/** GET /api/leaderboard. */
export type LeaderboardResponse = {
  ok: true;
  updated: string;
  checks_per_scan: number;
  count: number;
  agents: Agent[];
};

// ── Score writes (3.5c) ────────────────────────────────────────────────────

/** POST /api/score — raw acpsec or native ASF JSON (the normaliser accepts both). */
export type ScoreCreateRequest = Record<string, unknown>;
export type ScoreCreateResponse = { ok: true; data: ScoreData };

/** POST /api/score/manual — manually entered control scores. */
export type ScoreManualRequest = {
  controls: unknown[];
  agent_name?: string;
  [key: string]: unknown;
};
export type ScoreManualResponse = { ok: true; data: ScoreData };

/** DELETE /api/score. */
export type ScoreDeleteResponse = { ok: true };

// ── Leaderboard auth (3.5c) ────────────────────────────────────────────────

export type LeaderboardAuthRequest = { password: string };
/** 200 body. `token: "open"` when no password is configured. A wrong password
 *  is a 401 → surfaces as ApiError, not this type. Sets the lb_session cookie. */
export type LeaderboardAuthResponse = { ok: true; token?: string };

// ── Scanner (3.5c) ─────────────────────────────────────────────────────────

/** X/Twitter profile scraped via Nitter. */
export type ScannerProfile = {
  username: string;
  display_name: string;
  bio: string;
  website: string;
  avatar_url: string;
  source: string;
  error?: string | null;
  [key: string]: unknown;
};
export type ScannerLookupRequest = { username: string };
export type ScannerLookupResponse = { ok: true; data: ScannerProfile };

export type ScanMode = "root" | "exact";
export type ScannerScanRequest = {
  url: string;
  agent_name?: string;
  username?: string;
  scan_mode?: ScanMode;
  scraped?: boolean;
  x_bio?: string;
};
/** Scan `data` is the full scan wire format (same shape as a report). */
export type ScannerScanResponse = { ok: true; data: ReportData };

export type ScannerBulkRequest = { usernames: string[]; scan_mode?: ScanMode };
/** One entry per requested username; a failed item carries `ok:false + error`. */
export type BulkResult =
  | { username: string; ok: true; data: ReportData }
  | { username: string; ok: false; error: string };
export type ScannerBulkResponse = {
  ok: true;
  count: number;
  results: BulkResult[];
};

// ── Onchain (3.5c) ─────────────────────────────────────────────────────────

export type OnchainCheckRequest = { wallet: string };
/** `registered`: true (log found) | false (none in window) | null (inconclusive). */
export type OnchainResult = {
  contract: string;
  wallet: string;
  registered: boolean | null;
  log_count: number;
  block_from: number | null;
  block_to: number | null;
  rpc_url: string;
  error: string | null;
};
export type OnchainCheckResponse = { ok: true; data: OnchainResult };

// ── Chat (3.5c) — blocking (non-streaming) ─────────────────────────────────

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };
export type ChatRequest = { messages: ChatMessage[] };
export type ChatResponse = { ok: true; reply: string };
