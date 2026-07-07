"use client";

import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";

export default function LeaderboardPage() {
  const { data, isLoading, isError, error } = useLeaderboard();

  return (
    <div className="mx-auto max-w-6xl px-6 py-section">
      <header>
        <h1 className="text-heading font-extrabold tracking-tight">
          Agent Security{" "}
          <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
            Leaderboard
          </span>
        </h1>
        <p className="mt-1 text-caption text-fg-muted">
          Live ranking of AI agents by ACP-SEC score
        </p>
      </header>

      {/* Stats bar */}
      <p className="mt-4 text-caption text-fg-subtle">
        <strong className="text-fg-muted">{data?.count ?? "—"}</strong> agents
        scanned <span className="mx-1">·</span>
        <strong className="text-fg-muted">
          {data?.checks_per_scan ?? 38}
        </strong>{" "}
        checks each <span className="mx-1">·</span> last updated{" "}
        <strong className="text-fg-muted">{data?.updated || "—"}</strong>
      </p>

      <div className="mt-6">
        {isLoading ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-caption text-fg-muted">
            Loading leaderboard…
          </p>
        ) : isError ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-caption text-danger">
            Could not load leaderboard — {error.message}
          </p>
        ) : !data || data.count === 0 ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-caption text-fg-muted">
            No agents on the leaderboard yet.
          </p>
        ) : (
          <LeaderboardTable agents={data.agents} />
        )}
      </div>
    </div>
  );
}
