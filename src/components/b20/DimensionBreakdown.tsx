"use client";

import { useId, useState } from "react";

import type { B20ScanResult } from "@/lib/api/types";

import { SeverityBadge } from "./badges";

// Display order + labels for the five engine dimensions (b20/dimensions.py).
const ORDER = [
  "issuer_authority",
  "supply_integrity",
  "transfer_policy",
  "variant_config",
  "origin_transparency",
] as const;

const LABELS: Record<string, string> = {
  issuer_authority: "Issuer Authority",
  supply_integrity: "Supply Integrity",
  transfer_policy: "Transfer Policy Risk",
  variant_config: "Variant & Config",
  origin_transparency: "Origin & Transparency",
};

/** Per-dimension bar colour (0–100, b20's own cutoffs — distinct from the tier scheme). */
function barColor(score: number | null): string {
  if (score == null) return "bg-fg-subtle";
  if (score >= 75) return "bg-success";
  if (score >= 60) return "bg-warning-alt";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
}

/** Layer 2 — the trader/DeFi view: per-dimension scores, weights, findings. */
export function DimensionBreakdown({ result }: { result: B20ScanResult }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const unrated = new Set(result.unrated_dimensions);

  return (
    <section className="rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-medium text-fg">Dimension Breakdown</span>
        <span className="text-fg-subtle" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          data-testid="layer-2"
          className="space-y-5 border-t border-border px-6 py-5"
        >
          {ORDER.map((key) => {
            const dim = result.dimensions[key];
            if (!dim) return null; // dimension absent from this scan — skip
            // Prefer per-dimension rated flag (≥ 0.6.0); fall back to list for old responses.
            const isUnrated = dim.rated === false || unrated.has(key);
            return (
              <div key={key}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg">{LABELS[key] ?? key}</span>
                    <span className="text-micro text-fg-subtle">
                      weight {Math.round(dim.weight * 100)}%
                    </span>
                    {isUnrated && (
                      <span className="rounded border border-border bg-surface-hover px-1.5 py-0.5 text-micro text-fg-muted">
                        unrated
                      </span>
                    )}
                  </div>
                  <span className="tabular-nums text-caption text-fg-muted">
                    {isUnrated ? "—" : `${dim.score}/100`}
                  </span>
                </div>

                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={dim.score ?? undefined}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${LABELS[key] ?? key} score`}
                >
                  <div
                    className={`h-full rounded-full ${isUnrated ? "bg-fg-subtle" : barColor(dim.score)}`}
                    style={{ width: `${isUnrated ? 0 : Math.max(0, Math.min(100, dim.score ?? 0))}%` }}
                  />
                </div>

                {isUnrated && result.read_diagnostics?.[key] && (
                  <p className="mt-1 text-micro text-fg-subtle italic">
                    {result.read_diagnostics[key]}
                  </p>
                )}

                {dim.findings.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {dim.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-caption">
                        <SeverityBadge severity={f.severity} />
                        <span className="text-fg-muted">{f.detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
