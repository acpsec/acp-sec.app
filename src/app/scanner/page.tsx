"use client";

import { ScannerView } from "@/components/scanner/ScannerView";

/**
 * Agent Scanner page — 3-step wizard (lookup → confirm → results).
 *
 * Deviations (documented): SSE streaming (/api/scan/stream) and analytics
 * (/api/analytics-event) are skipped — neither endpoint exists in the backend;
 * the scan is a single blocking POST. Scanner is the handoff *producer* only,
 * so there is no handoff-read on mount. Bulk scan is deferred (6.2c).
 */
export default function ScannerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-section">
      <header className="text-center">
        <span className="inline-block rounded-full border border-primary/25 bg-primary/[0.12] px-2.5 py-1 text-micro font-bold tracking-wide text-primary">
          v0.3.0
        </span>
        <h1 className="mt-3 text-heading font-extrabold tracking-tight">
          <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
            Agent Scanner
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-caption text-fg-muted">
          Enter an X @username of an AI agent. We&apos;ll look up its profile,
          find its website, and run a heuristic ACP-SEC security analysis.
        </p>
      </header>

      <ScannerView />
    </div>
  );
}
