"use client";

import { useId, useState } from "react";

import type { B20ScanResult } from "@/lib/api/types";

/** Layer 3 — the researcher view: the complete raw scan payload. */
export function RawJson({ result }: { result: B20ScanResult }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const json = JSON.stringify(result, null, 2);

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-medium text-fg">View Raw JSON</span>
        <span className="text-fg-subtle" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div id={panelId} data-testid="layer-3" className="border-t border-border p-4">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-border px-3 py-1.5 text-caption text-fg-muted transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-bg p-4 font-mono text-micro leading-relaxed text-fg-muted">
            {json}
          </pre>
        </div>
      )}
    </section>
  );
}
