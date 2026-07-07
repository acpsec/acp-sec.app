"use client";

import { useState } from "react";

import type { ScanControl } from "@/lib/api/types";

// Severity → token color (mirrors the lama's .control-sev.{sev} intent).
function severityClass(sev: string): string {
  switch (sev.toUpperCase()) {
    case "CRITICAL":
      return "text-danger";
    case "HIGH":
      return "text-warning";
    case "MEDIUM":
      return "text-fg-muted";
    default:
      return "text-fg-subtle";
  }
}

// Status → token color (pass/warn/fail).
function statusClass(status: string): string {
  switch (status.toLowerCase()) {
    case "pass":
      return "text-success";
    case "warn":
      return "text-warning";
    case "fail":
      return "text-danger";
    default:
      return "text-fg-subtle";
  }
}

function toList(recs: unknown): string[] {
  if (Array.isArray(recs)) return recs.map(String);
  if (recs) return [String(recs)];
  return [];
}

/**
 * View-only control card. Header shows id / name / status / score / severity;
 * clicking expands the body (finding, evidence, recommendations, dimension tag).
 * Mirrors the HTML lama's renderControls/toggleControl (click any card to expand).
 */
export function ControlCard({ control }: { control: ScanControl }) {
  const [open, setOpen] = useState(false);
  const recs = toList(control.recommendations);
  const evidence = control.evidence ?? [];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
      >
        <span className={`font-mono text-micro font-bold ${severityClass(control.severity)}`}>
          {control.ctrl}
        </span>
        <span className="flex-1 truncate text-caption font-medium text-fg">
          {control.name}
        </span>
        <span className={`text-micro font-semibold uppercase ${statusClass(control.status)}`}>
          {control.status}
        </span>
        <span className="whitespace-nowrap text-caption font-semibold text-fg-muted">
          {control.score}/{control.max}
        </span>
        <span className={`text-micro font-semibold ${severityClass(control.severity)}`}>
          {control.severity}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-border px-4 py-3 text-caption text-fg-muted">
          {control.finding ? <p>{control.finding}</p> : null}

          {evidence.length > 0 && (
            <div>
              <div className="mb-1 text-micro font-semibold uppercase tracking-wide text-fg-subtle">
                Evidence
              </div>
              <ul className="list-disc space-y-0.5 pl-5">
                {evidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {recs.length > 0 && (
            <div>
              <div className="mb-1 text-micro font-semibold uppercase tracking-wide text-fg-subtle">
                Recommendations
              </div>
              <ul className="list-disc space-y-0.5 pl-5">
                {recs.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {control.dimension ? (
            <span className="inline-flex rounded bg-bg px-1.5 py-0.5 text-micro text-fg-subtle">
              {control.dimension}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
