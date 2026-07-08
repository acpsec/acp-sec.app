"use client";

import { HandleInput } from "@/components/scanner/HandleInput";
import { UrlNormalizationControl } from "@/components/scanner/UrlNormalizationControl";

/**
 * Agent Scanner page — Task 6.2a foundation (shell + inputs only).
 *
 * Deferred: lookup + scan execution + result rendering (6.2b), bulk (6.2c).
 * Not built (deviation, documented): SSE streaming (/api/scan/stream) and
 * analytics (/api/analytics-event) — neither endpoint exists in the backend.
 * Scanner is the handoff *producer*, so there is no handoff-read on mount.
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

      <div className="mt-8 flex flex-col gap-5">
        <HandleInput />

        {/* URL-normalisation mode — relocated into the Confirm step and made
            conditional on a sub-path URL in 6.2b. Shown here for foundation. */}
        <UrlNormalizationControl />

        {/* Empty results placeholder — the scan flow + result panels land in
            6.2b. */}
        <p className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-caption text-fg-muted">
          Enter a handle and scan to see results.
        </p>
      </div>
    </div>
  );
}
