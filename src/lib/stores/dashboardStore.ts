import { create } from "zustand";

import type { ScoreData } from "@/lib/api/types";

/** Where the currently-displayed score came from. */
export type ScoreSource = "session" | "handoff" | "upload" | null;

export interface DashboardState {
  /** Current score (from GET /api/score or the localStorage handoff). Not
   *  persisted — the server / handoff is the source of truth. */
  scoreData: ScoreData | null;
  source: ScoreSource;
  /** Handoff timestamp (ms) when source === "handoff", for the cached banner. */
  cachedAt: number | null;

  setScoreData: (data: ScoreData | null) => void;
  setSource: (source: ScoreSource, cachedAt?: number | null) => void;
  reset: () => void;
}

// NOTE: no `mode` field — the acpsec-dimensions vs ASF-controls distinction is a
// data-shape detail (not a user toggle in the HTML lama); the editor handles it
// in Task 5.1b.
export const useDashboardStore = create<DashboardState>((set) => ({
  scoreData: null,
  source: null,
  cachedAt: null,
  setScoreData: (scoreData) => set({ scoreData }),
  setSource: (source, cachedAt = null) => set({ source, cachedAt }),
  reset: () => set({ scoreData: null, source: null, cachedAt: null }),
}));
