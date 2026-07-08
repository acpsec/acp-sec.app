import { normalizeScore, scoreToTier, tierToColorClass } from "@/lib/scoring";

/** Ring circumference: 2π × 96 (r=96) — verbatim from the lama's RING_CIRC. */
export const RING_CIRC = 603.19;

/** Progress offset for a 0–100 score (full circle at 0, empty at 100). */
export function ringDashoffset(score: number): number {
  const pct = normalizeScore(score);
  return RING_CIRC - (pct / 100) * RING_CIRC;
}

/**
 * Animated SVG score ring (lama's .score-ring-wrap). Colour comes from the
 * canonical tier scheme (scoring.ts) — the scanner's BAND_COLORS already matched
 * it, so there's no divergence to reconcile.
 */
export function ScoreRing({ score }: { score: number }) {
  const pct = normalizeScore(score);
  const colorClass = tierToColorClass(scoreToTier(score), "text");

  return (
    <div className="relative h-[200px] w-[200px]">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle
          cx="110"
          cy="110"
          r="96"
          fill="none"
          stroke="#2A2B2E"
          strokeWidth={12}
        />
        <circle
          data-testid="ring-progress"
          cx="110"
          cy="110"
          r="96"
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={ringDashoffset(score)}
          className={`${colorClass} transition-[stroke-dashoffset] duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-display font-extrabold leading-none">{pct}</span>
        <span className="text-caption text-fg-subtle">/ 100</span>
      </div>
    </div>
  );
}
