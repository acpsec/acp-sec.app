"use client";

// Placeholder home (Tasks 3.2–3.5a). Verifies the design tokens/typography and
// now the API client end-to-end via useHealth(). NOT real UI — replaced in
// Groups 4–6.
import { scoreToColorClass, scoreToTier } from "@/lib/scoring";
import { useControls } from "@/lib/hooks/useControls";
import { useHealth } from "@/lib/hooks/useHealth";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useScore } from "@/lib/hooks/useScore";

const SAMPLE_SCORES = [95, 78, 60, 40, 20, 5];

function ApiStatus() {
  const { data, isLoading, isError, error } = useHealth();

  if (isLoading) {
    return <p className="text-caption text-fg-muted">API status: checking…</p>;
  }
  if (isError) {
    return (
      <p className="text-caption text-danger">
        API status: unreachable — {error.message}
      </p>
    );
  }
  return (
    <p className="text-caption text-success">
      API status: {data?.service} · acpsec_available={String(data?.acpsec_available)} ·
      scanner_protected={String(data?.scanner_protected)}
    </p>
  );
}

// Compact read-endpoint verification (3.5b) — replaced by real pages in Groups 4–6.
function ReadEndpoints() {
  const score = useScore();
  const controls = useControls();
  const leaderboard = useLeaderboard();

  return (
    <div className="space-y-1 text-caption text-fg-muted">
      <p>
        score:{" "}
        {score.isLoading
          ? "…"
          : score.isError
            ? "error"
            : score.data?.ok
              ? score.data.data.band
              : "empty"}
      </p>
      <p>
        controls:{" "}
        {controls.isLoading
          ? "…"
          : controls.isError
            ? "error"
            : `${controls.data?.checks.length} checks / ${controls.data?.asf_controls.length} asf`}
      </p>
      <p>
        leaderboard:{" "}
        {leaderboard.isLoading
          ? "…"
          : leaderboard.isError
            ? "error"
            : `${leaderboard.data?.count} agents`}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-page p-page text-center">
      <div className="space-y-2">
        <h1 className="text-display font-bold tracking-tight">Display</h1>
        <h2 className="text-heading font-semibold">Heading</h2>
        <h3 className="text-title font-semibold text-fg-muted">Title</h3>
        <p className="text-body">Body — Inter, dark theme, tokens online.</p>
        <p className="text-caption text-fg-muted">Caption · text-caption</p>
        <p className="text-micro text-fg-subtle">MICRO · text-micro</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-card">
        {SAMPLE_SCORES.map((score) => (
          <span
            key={score}
            className={`rounded-full border border-border bg-surface px-3 py-1 text-micro font-medium ${scoreToColorClass(score)}`}
          >
            {score} · {scoreToTier(score)}
          </span>
        ))}
      </div>

      <ApiStatus />
      <ReadEndpoints />
    </div>
  );
}
