import type { ScanControl } from "@/lib/api/types";
import { groupByDimension } from "@/lib/scanner/dimensions";

function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "pass") return "bg-success/15 text-success";
  if (s === "warn") return "bg-warning/15 text-warning";
  return "bg-danger/15 text-danger";
}

function recommendations(c: ScanControl): string[] {
  return Array.isArray(c.recommendations)
    ? (c.recommendations.filter((r) => typeof r === "string") as string[]).slice(
        0,
        3,
      )
    : [];
}

/**
 * Detailed findings — one collapsible <details> per dimension, each listing its
 * check rows (id, status, name, finding, up to 3 recommendations, score).
 * Mirrors the lama's _renderAccordion / _renderCheck.
 */
export function ChecksList({ controls }: { controls: ScanControl[] }) {
  const groups = groupByDimension(controls);
  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {groups.map((g) => (
        <details
          key={g.dim}
          className="overflow-hidden rounded-lg border border-border"
        >
          <summary className="flex cursor-pointer items-center gap-3 bg-bg px-4 py-3 text-caption font-semibold">
            <span className="rounded bg-primary px-1.5 py-0.5 text-micro font-bold text-fg">
              {g.dim}
            </span>
            <span className="flex-1">{g.name}</span>
            <span className="tabular-nums text-fg-muted">
              {g.score.toFixed(1)} / {g.max}
            </span>
          </summary>
          <div>
            {g.controls.map((c) => (
              <div
                key={c.ctrl}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-3 border-t border-border px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="rounded border border-current px-1.5 py-0.5 text-micro font-bold text-fg-muted">
                    {c.ctrl}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-center text-micro font-bold ${statusClass(
                      c.status,
                    )}`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-caption font-semibold">{c.name}</span>
                  {c.finding ? (
                    <span className="text-micro text-fg-subtle">{c.finding}</span>
                  ) : null}
                  {recommendations(c).map((r, i) => (
                    <span key={i} className="text-micro text-fg-muted">
                      → {r}
                    </span>
                  ))}
                </div>
                <span className="whitespace-nowrap text-caption font-semibold tabular-nums">
                  {c.score.toFixed(1)} / {c.max}
                </span>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
