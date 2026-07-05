/**
 * Score → tier → color mapping for Trust Score display.
 *
 * SINGLE SOURCE OF TRUTH on the frontend, locked to the backend contract:
 *   - `acpsec_api/leaderboard_store.py` `LEADERBOARD_BANDS` / `tier_for_score`
 *   - `dashboard/acp-sec-dashboard.html` `bandForPct` / `BAND_COLORS`
 * Both use the identical six-band **tier** scheme below (there are NO A–F
 * letter grades anywhere in the system — see Task 3.3 audit).
 *
 * NOTE: `acpsec_api/scoring.py` defines a *separate* 5-band **verdict** scheme
 * (SECURE/HARDENED/VULNERABLE/CRITICAL/COMPROMISED at 90/70/50/30/0) used for
 * the `verdict` string on a score object. That is deliberately distinct from
 * this tier scheme and is NOT modeled here — this file is the tier/color path
 * the Scanner + Leaderboard render.
 */

export type Tier =
  | "EXEMPLARY"
  | "SECURE"
  | "HARDENED"
  | "VULNERABLE"
  | "CRITICAL"
  | "COMPROMISED";

// Tier lower-bound thresholds (0–100), highest first. Mirrors LEADERBOARD_BANDS.
export const TIER_MIN_EXEMPLARY = 90;
export const TIER_MIN_SECURE = 70;
export const TIER_MIN_HARDENED = 50;
export const TIER_MIN_VULNERABLE = 30;
export const TIER_MIN_CRITICAL = 10;
// (below TIER_MIN_CRITICAL → COMPROMISED)

/** Tier → semantic color token (Task 3.2 tokens; CRITICAL uses the new `critical`). */
export const TIER_COLOR_TOKEN: Record<Tier, string> = {
  EXEMPLARY: "primary", // #0052FF
  SECURE: "success", // #00C087
  HARDENED: "warning-alt", // #F0C000
  VULNERABLE: "warning", // #F5A623
  CRITICAL: "critical", // #FF6B00
  COMPROMISED: "danger", // #FF4444
};

/**
 * Coerce a possibly-missing score to a usable number.
 * `null`/`undefined`/`NaN` → 0 — mirrors the leaderboard's null→0 handling
 * (`leaderboard_store.py`: `score = scan.get("final_score") or 0`).
 */
function coerceScore(score: number | null | undefined): number {
  return score == null || Number.isNaN(score) ? 0 : score;
}

/**
 * Clamp a score to the 0–100 display range (and coerce null→0). Rounds to an
 * integer. Use for progress rings / percentage bars. Tier functions do NOT
 * clamp/round — they mirror the backend's raw threshold comparison, which for
 * out-of-range values falls through identically (>100 → EXEMPLARY, <0 →
 * COMPROMISED).
 */
export function normalizeScore(score: number | null | undefined): number {
  return Math.round(Math.min(100, Math.max(0, coerceScore(score))));
}

/**
 * Map a 0–100 score to its tier. Exactly mirrors `tier_for_score` / `bandForPct`
 * (`>=` comparisons, no internal rounding). Out-of-range: >100 → EXEMPLARY,
 * <0 → COMPROMISED; null/undefined/NaN → 0 → COMPROMISED.
 */
export function scoreToTier(score: number | null | undefined): Tier {
  const s = coerceScore(score);
  if (s >= TIER_MIN_EXEMPLARY) return "EXEMPLARY";
  if (s >= TIER_MIN_SECURE) return "SECURE";
  if (s >= TIER_MIN_HARDENED) return "HARDENED";
  if (s >= TIER_MIN_VULNERABLE) return "VULNERABLE";
  if (s >= TIER_MIN_CRITICAL) return "CRITICAL";
  return "COMPROMISED";
}

/** Tier → a Tailwind color class, e.g. `tierToColorClass('SECURE')` → `text-success`. */
export function tierToColorClass(
  tier: Tier,
  prefix: "text" | "bg" | "border" = "text",
): string {
  return `${prefix}-${TIER_COLOR_TOKEN[tier]}`;
}

/** Score → a Tailwind color class via its tier, e.g. `scoreToColorClass(85)` → `text-success`. */
export function scoreToColorClass(
  score: number | null | undefined,
  prefix: "text" | "bg" | "border" = "text",
): string {
  return tierToColorClass(scoreToTier(score), prefix);
}
