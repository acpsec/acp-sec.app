import Link from "next/link";

import { TierBadge } from "@/components/leaderboard/TierBadge";
import type { ScoreData } from "@/lib/api/types";
import type { ScoreSource } from "@/lib/stores/dashboardStore";

function timeAgo(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function ScoreSummary({
  scoreData,
  source,
  cachedAt,
}: {
  scoreData: ScoreData | null;
  source: ScoreSource;
  cachedAt: number | null;
}) {
  // Empty / welcome state — verbatim from the HTML lama.
  if (!scoreData) {
    return (
      <div
        role="region"
        aria-label="Welcome"
        className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-12 text-center"
      >
        <div className="text-3xl" aria-hidden="true">
          🔒
        </div>
        <div className="text-title font-semibold text-fg">No agent scanned yet</div>
        <p className="max-w-md text-caption text-fg-muted">
          Use the Scanner to evaluate an AI agent&apos;s security posture across
          the ACP-SEC framework. Results will appear here automatically.
        </p>
        <Link
          href="/scanner"
          className="text-caption font-semibold text-primary hover:underline"
        >
          🔍 Go to Scanner →
        </Link>
        <p className="text-micro text-fg-subtle">
          Already have a report? Click{" "}
          <code className="rounded bg-bg px-1">📁 Load Report</code> above.
        </p>
      </div>
    );
  }

  const pct = scoreData.score_pct ?? scoreData.final_score;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      {source === "handoff" && cachedAt != null && (
        <div className="mb-4 flex items-center gap-2 text-caption text-fg-muted">
          <span aria-hidden="true">🕐</span>
          <span>
            <strong className="text-fg">Last scan:</strong>{" "}
            <strong className="text-fg">{scoreData.agent_name}</strong> ·{" "}
            {timeAgo(cachedAt)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-title font-bold text-fg">
              {scoreData.agent_name}
            </span>
            <span className="rounded-full bg-bg px-2 py-0.5 text-micro font-medium text-fg-subtle">
              {source === "handoff" ? "From Report" : "Session"}
            </span>
          </div>
          {scoreData.verdict ? (
            <p className="mt-1 text-caption text-fg-muted">{scoreData.verdict}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <div className="whitespace-nowrap text-heading font-extrabold text-fg">
            {pct}
            <span className="text-title text-fg-subtle">/100</span>
          </div>
          <TierBadge score={pct} />
        </div>
      </div>

      <div className="mt-4 flex gap-3 text-caption text-fg-muted">
        <span>
          Critical fails:{" "}
          <strong className="text-fg">{scoreData.critical_fails ?? 0}</strong>
        </span>
      </div>
    </div>
  );
}
