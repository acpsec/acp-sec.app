"use client";

// Header action row. Labels verbatim from the HTML lama header (📁 Load Report,
// 🔄 Refresh, 📥 Export). Handlers are STUBS for 5.1a — wired in 5.1b/5.1c.
// (The lama's theme toggle is omitted — dark-only.)
const noop = () => {};

export function HeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={noop}
        className="rounded-lg bg-primary px-3 py-2 text-caption font-semibold text-fg transition-opacity hover:opacity-90"
      >
        📁 Load Report
      </button>
      <button
        type="button"
        onClick={noop}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-caption font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
      >
        🔄 Refresh
      </button>
      <button
        type="button"
        onClick={noop}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-caption font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
      >
        📥 Export
      </button>
    </div>
  );
}
