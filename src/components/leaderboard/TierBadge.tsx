import { scoreToTier, tierToColorClass } from "@/lib/scoring";

/**
 * Trust-Score tier pill. Computes the tier from `score` via scoring.ts (the
 * single, tested source) — it deliberately IGNORES any backend `tier` field
 * (the scoring-band-mismatch resolution: display is derived, not trusted).
 *
 * `null`/`undefined` score = an unscored/reference agent (e.g. SentryAgent),
 * shown as a neutral "—" rather than the misleading COMPROMISED tier.
 */
export function TierBadge({ score }: { score: number | null | undefined }) {
  if (score == null) {
    return (
      <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-micro font-semibold text-fg-subtle">
        —
      </span>
    );
  }
  const tier = scoreToTier(score);
  return (
    <span
      className={`inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-micro font-semibold ${tierToColorClass(tier)}`}
    >
      {tier}
    </span>
  );
}
