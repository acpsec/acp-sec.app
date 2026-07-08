"use client";

import { ChecksList } from "@/components/scanner/ChecksList";
import { DimensionBars } from "@/components/scanner/DimensionBars";
import { DimensionsRadar } from "@/components/scanner/DimensionsRadar";
import { OnchainStatus } from "@/components/scanner/OnchainStatus";
import { ScoreRing } from "@/components/scanner/ScoreRing";
import type { ReportData } from "@/lib/api/types";
import { scoreToTier, tierToColorClass } from "@/lib/scoring";

// 9 HTTP security headers surfaced by the scanner (lama's ALL_SEC_HDRS).
const SEC_HEADERS: [key: string, label: string][] = [
  ["strict-transport-security", "HSTS"],
  ["content-security-policy", "CSP"],
  ["x-frame-options", "X-Frame"],
  ["x-content-type-options", "X-Content-Type"],
  ["referrer-policy", "Referrer-Policy"],
  ["permissions-policy", "Permissions-Policy"],
  ["cross-origin-opener-policy", "COOP"],
  ["cross-origin-embedder-policy", "COEP"],
  ["x-xss-protection", "X-XSS"],
];

function pctOf(d: ReportData): number {
  return d.score_pct || d.final_score || 0;
}

interface ResultsPanelProps {
  result: ReportData;
  onScanAnother: () => void;
  onOpenDashboard: () => void;
  onExport: () => void;
}

export function ResultsPanel({
  result: d,
  onScanAnother,
  onOpenDashboard,
  onExport,
}: ResultsPanelProps) {
  const pct = pctOf(d);
  const bandColor = tierToColorClass(scoreToTier(pct), "text");
  const headers = (d.security_headers ?? {}) as Record<string, unknown>;
  const secHeaderCount =
    typeof d.sec_header_count === "number" ? d.sec_header_count : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Score hero */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={pct} />
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="text-title font-bold">{d.agent_name || "—"}</div>
            {d.x_handle_verified && d.x_username ? (
              <div className="text-caption text-fg-subtle">@{d.x_username}</div>
            ) : null}
            <span
              className={`rounded-md px-3 py-1 text-caption font-bold ${bandColor}`}
            >
              {d.band || "—"}
            </span>
            <OnchainStatus registered={d.acp_registered as boolean | null} />
            {d.verdict ? (
              <p className="max-w-md text-caption italic text-fg-muted">
                {d.verdict}
              </p>
            ) : null}
            {d.scan_url ? (
              <p className="break-all text-micro text-fg-subtle">
                Scanned: {String(d.scan_url)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Final Score" value={Math.round(pct)} />
        <Metric label="Critical Fails" value={d.critical_fails ?? "—"} />
        <Metric label="Security Headers" value={`${secHeaderCount}/9`} />
        <Metric label="Checks Run" value={d.controls.length || "—"} />
      </div>

      {/* Security headers */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 text-body font-bold">HTTP Security Headers</div>
        <div className="flex flex-wrap gap-2">
          {SEC_HEADERS.map(([key, label]) => {
            const present = key in headers;
            return (
              <span
                key={key}
                title={present ? `${key}: present` : `Missing: ${key}`}
                className={
                  present
                    ? "rounded border border-success/30 bg-success/10 px-2 py-0.5 text-micro font-semibold text-success"
                    : "rounded border border-border bg-bg px-2 py-0.5 text-micro font-semibold text-fg-subtle line-through opacity-65"
                }
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Radar */}
      {d.controls.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-3 text-body font-bold">Score Radar</div>
          <DimensionsRadar controls={d.controls} />
        </div>
      ) : null}

      {/* Dimension bars + detailed checks */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-1 text-body font-bold">Detailed Findings</div>
        <p className="mb-4 text-caption text-fg-subtle">
          Scores are <em>inferred</em> from public content &amp; HTTP headers.
        </p>
        <div className="mb-5">
          <DimensionBars controls={d.controls} />
        </div>
        <ChecksList controls={d.controls} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={onScanAnother}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-body font-semibold text-fg-muted transition-colors hover:text-fg"
        >
          🔍 Scan another agent
        </button>
        <button
          type="button"
          onClick={onOpenDashboard}
          className="rounded-lg bg-primary px-4 py-2.5 text-body font-semibold text-fg transition-opacity hover:opacity-90"
        >
          📊 Open in Dashboard →
        </button>
        <button
          type="button"
          onClick={onExport}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-body font-semibold text-fg-muted transition-colors hover:text-fg"
        >
          📥 Export JSON
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div className="text-title font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-micro text-fg-subtle">{label}</div>
    </div>
  );
}
