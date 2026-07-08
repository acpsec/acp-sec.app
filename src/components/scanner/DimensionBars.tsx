import type { ScanControl } from "@/lib/api/types";
import { barColorClass, groupByDimension } from "@/lib/scanner/dimensions";

const DIM_ICONS: Record<string, string> = {
  AUTH: "🔐",
  CTX: "🗂️",
  INJ: "💉",
  PRIV: "🛡️",
  OUT: "📤",
  GOV: "📋",
};

/** Per-dimension score bars (lama's dimension header bars). */
export function DimensionBars({ controls }: { controls: ScanControl[] }) {
  const groups = groupByDimension(controls);
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {groups.map((g) => (
        <div key={g.dim} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-caption font-semibold">
            {DIM_ICONS[g.dim] ?? ""} {g.dim}
          </span>
          <span className="flex-1 truncate text-caption text-fg-muted">
            {g.name}
          </span>
          <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-bg">
            <div
              data-testid={`dimbar-${g.dim}`}
              className={`h-full rounded-full ${barColorClass(g.pct)}`}
              style={{ width: `${Math.round(g.pct)}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-caption font-semibold tabular-nums">
            {g.score.toFixed(1)} / {g.max}
          </span>
        </div>
      ))}
    </div>
  );
}
