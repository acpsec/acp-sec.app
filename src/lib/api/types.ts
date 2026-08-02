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
 * A leaderboard agent entry. `score`/`tier` are nullable (an unscored reference
 * entry). `rank`/`movement`/`movement_delta` are added by the endpoint. Many
 * optional scanner-written fields ride the index signature.
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

// ── B20 Trust Score scanner (7.2b) ─────────────────────────────────────────
// Mirrors acp-sec-b20 `ScanResult.to_dict()`, per
// acp-sec/docs/b20-endpoint-schema.md (authoritative — generated from the live
// engine models). Ported verbatim from the acpsec-app scaffold with zero
// field-level divergence; only the scaffold's `ApiError` interface is renamed
// (it collided with our ApiError class) → see B20ErrorBody below.
//
// POST /api/b20/scan is SAME-ORIGIN (Opsi A — no NEXT_PUBLIC_B20_API_URL), PUBLIC
// (not scanner-token gated), and — unlike the {ok,data} endpoints — returns a
// bare {error, detail} body on failure (no envelope).

/** One finding inside a dimension. `severity`: CRITICAL | High | Medium | Low. */
export type B20Finding = { severity: string; detail: string };

/** A scored dimension (Layer 2). */
export type B20Dimension = {
  score: number;
  weight: number;
  findings: B20Finding[];
};

/** What the issuer can do to holders (Layer 2 detail). null = unknown/unrated. */
export type B20IssuerPowers = {
  can_freeze: boolean | null;
  can_seize: boolean | null;
  can_pause: boolean | null;
  can_mint_unbounded: boolean | null;
  supply_cap: string | null;
  admin_addresses: string[];
  admin_is_multisig: boolean | null;
  mint_role_holders: string[];
  pause_role_holders: string[];
};

/** Success body of POST /api/b20/scan — one payload for all three disclosure
 *  layers (holder / trader / researcher). */
export type B20ScanResult = {
  token: string;
  chain_id: number;
  variant: string | null; // "ASSET" | "STABLECOIN"
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  currency_code: string | null;
  trust_score: number; // Layer 1 (confidence-adjusted)
  raw_score: number; // Layer 3 (composite before the unrated multiplier)
  grade: string; // A-F
  rated: boolean;
  multiplier: number; // 1.0 all-rated, else 0.5
  unrated_dimensions: string[];
  is_critical: boolean;
  critical_reasons: string[];
  dimensions: Record<string, B20Dimension>;
  issuer_powers: B20IssuerPowers;
  deployed_via_factory: string | null;
  scanner_version: string;
  scanned_at: string; // ISO-8601 UTC
};

/** Request body. `chain_id` ∈ {8453, 84532}; the client defaults it to Base
 *  Sepolia (84532) — the only chain the /b20 route targets in V1. */
export type B20ScanRequest = { address: string; chain_id?: number };

/** Distinct error codes the endpoint returns; carried on `ApiError.body.error`. */
export type B20ErrorCode =
  | "invalid_address" // 400 — address fails the 0x-40-hex regex
  | "unsupported_chain" // 400 — chain_id not in {8453, 84532}
  | "not_b20" // 400 — target is not a B20 token / not initialised / feature off
  | "rpc_unreachable"; // 503 — RPC init failed or node returned nothing

/** Bare `{error, detail}` failure body (no envelope). Assignable to ApiErrorBody. */
export type B20ErrorBody = { error: B20ErrorCode; detail: string };
