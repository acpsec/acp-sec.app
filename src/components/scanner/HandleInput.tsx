"use client";

import { useScannerStore } from "@/lib/stores/scannerStore";

interface HandleInputProps {
  /** Wired in Task 6.2b — kicks off POST /api/scanner/lookup. */
  onLookup?: () => void;
  /** True while the lookup request is in flight (6.2b). */
  loading?: boolean;
}

/**
 * Step-1 X-username input + "Look up →" button (Task 6.2a foundation).
 * Controlled by the scanner store; the button handler is supplied in 6.2b.
 * Labels/placeholder/hint are verbatim from dashboard/scanner.html.
 */
export function HandleInput({ onLookup, loading = false }: HandleInputProps) {
  const handle = useScannerStore((s) => s.handle);
  const setHandle = useScannerStore((s) => s.setHandle);

  const disabled = loading || handle.trim() === "";

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="text-body font-bold">🔍 Look up an Agent</div>
      <p className="mt-0.5 mb-4 text-caption text-fg-muted">
        Enter the X (Twitter) username of the AI agent you want to scan.
      </p>

      <label
        htmlFor="scanner-handle"
        className="text-caption font-semibold text-fg-muted"
      >
        X Username
      </label>
      <div className="mt-1.5 flex gap-2.5">
        <input
          id="scanner-handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) onLookup?.();
          }}
          placeholder="@agentname  or  agentname"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-subtle focus:border-primary"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onLookup?.()}
          className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-body font-semibold text-fg whitespace-nowrap transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "⏳ Looking up…" : "Look up →"}
        </button>
      </div>
      <p className="mt-1.5 text-micro text-fg-subtle">
        Example: @bankrbot, @virtuals_io, @aixbt_agent
      </p>
    </div>
  );
}
