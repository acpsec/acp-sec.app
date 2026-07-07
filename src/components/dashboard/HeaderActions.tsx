"use client";

// Header action row. Labels verbatim from the HTML lama header (📁 Load Report,
// 🔄 Refresh, 📥 Export). Handlers are owned by DashboardView and passed in.
// (The lama's theme toggle is omitted — dark-only.)
export function HeaderActions({
  onLoadReport,
  onRefresh,
  onExport,
  refreshing = false,
  exportDisabled = false,
}: {
  onLoadReport: () => void;
  onRefresh: () => void;
  onExport: () => void;
  refreshing?: boolean;
  exportDisabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onLoadReport}
        className="rounded-lg bg-primary px-3 py-2 text-caption font-semibold text-fg transition-opacity hover:opacity-90"
      >
        📁 Load Report
      </button>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-caption font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg disabled:opacity-50"
      >
        {refreshing ? "⏳ Loading…" : "🔄 Refresh"}
      </button>
      <button
        type="button"
        onClick={onExport}
        disabled={exportDisabled}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-caption font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
      >
        📥 Export
      </button>
    </div>
  );
}
