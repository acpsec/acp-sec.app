"use client";

// Placeholder home (Tasks 3.2–3.5a). Verifies the design tokens/typography and
// now the API client end-to-end via useHealth(). NOT real UI — replaced in
// Groups 4–6.
import { scoreToColorClass, scoreToTier } from "@/lib/scoring";
import { useHealth } from "@/lib/hooks/useHealth";

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
    </div>
  );
}
