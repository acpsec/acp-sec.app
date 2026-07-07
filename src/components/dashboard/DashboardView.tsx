"use client";

import { useEffect, useRef } from "react";

import { readHandoff } from "@/lib/handoff";
import { useControls } from "@/lib/hooks/useControls";
import { useScore } from "@/lib/hooks/useScore";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

import { HeaderActions } from "./HeaderActions";
import { ScoreSummary } from "./ScoreSummary";

export function DashboardView() {
  const score = useScore();
  useControls(); // preload the catalogue for the 5.1b editor (fire-and-forget)

  const scoreData = useDashboardStore((s) => s.scoreData);
  const source = useDashboardStore((s) => s.source);
  const cachedAt = useDashboardStore((s) => s.cachedAt);
  const setScoreData = useDashboardStore((s) => s.setScoreData);
  const setSource = useDashboardStore((s) => s.setSource);

  // Load precedence (confirmed): a fresh handoff (<1h) wins so the leaderboard
  // drill-down displays the clicked agent; otherwise the server session score;
  // otherwise the empty state. `decided` locks the choice once made.
  const decided = useRef(false);
  useEffect(() => {
    if (decided.current) return;

    const handoff = readHandoff();
    if (handoff) {
      decided.current = true;
      setScoreData(handoff.data);
      setSource("handoff", handoff.ts);
      return;
    }
    if (score.data?.ok) {
      decided.current = true;
      setScoreData(score.data.data);
      setSource("session");
    }
  }, [score.data, setScoreData, setSource]);

  const loading = score.isLoading && !scoreData;
  const errored = score.isError && !scoreData;

  return (
    <div className="mx-auto max-w-6xl px-6 py-section">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-heading font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-caption text-fg-muted">
            Agent Commerce Security Audit
          </p>
        </div>
        <HeaderActions />
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-caption text-fg-muted">
            Loading…
          </p>
        ) : errored ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-caption text-danger">
            Could not load score — {score.error?.message}
          </p>
        ) : (
          <ScoreSummary
            scoreData={scoreData}
            source={source}
            cachedAt={cachedAt}
          />
        )}
      </div>
    </div>
  );
}
