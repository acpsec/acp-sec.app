import type { ScoreData } from "@/lib/api/types";

/**
 * Cross-page scan handoff: the leaderboard drill-down (Task 5.2) writes a report
 * here, then navigates to the dashboard (Task 5.1), which reads it on mount.
 * Single source for the keys + TTL so the two pages never drift.
 */
export const LAST_SCAN_KEY = "acpsec_last_scan";
export const LAST_SCAN_TIME_KEY = "acpsec_last_scan_time";
// How long a handoff stays "fresh" — older scans fall through to the empty
// state (mirrors the HTML lama's 1-hour TTL).
export const LAST_SCAN_TTL_MS = 60 * 60 * 1000;

/** Persist a report for the dashboard handoff. Best-effort (quota/private mode). */
export function writeHandoff(data: unknown): void {
  try {
    localStorage.setItem(LAST_SCAN_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_SCAN_TIME_KEY, String(Date.now()));
  } catch {
    /* quota / private mode — ignore */
  }
}

/**
 * Read a fresh (< TTL) handoff, or null. Mirrors the lama's guards: valid
 * timestamp, age within the TTL, and score-shaped data (controls | dimensions).
 */
export function readHandoff(): { data: ScoreData; ts: number } | null {
  try {
    const cached = localStorage.getItem(LAST_SCAN_KEY);
    const tsRaw = localStorage.getItem(LAST_SCAN_TIME_KEY);
    if (!cached || !tsRaw) return null;

    const ts = Number(tsRaw);
    const age = Date.now() - ts;
    if (!Number.isFinite(ts) || age < 0 || age >= LAST_SCAN_TTL_MS) return null;

    const data = JSON.parse(cached) as ScoreData & { dimensions?: unknown };
    if (data && (data.controls || data.dimensions)) return { data, ts };
    return null;
  } catch {
    /* corrupt JSON or storage unavailable — ignore */
    return null;
  }
}
