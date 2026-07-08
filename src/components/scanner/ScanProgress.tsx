/**
 * Blocking scan progress indicator (Task 6.2b).
 *
 * The lama shows phased button labels driven by a timer; there is no live
 * progress feed because /api/scan/stream (SSE) does not exist in the backend
 * (documented deviation). We show a simple spinner + generic message while the
 * single blocking POST /api/scanner/scan is in flight.
 */
export function ScanProgress() {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-12 text-center"
    >
      <span
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
      />
      <span className="text-caption text-fg-muted">
        Scanning… analysing public content &amp; HTTP headers. This can take up
        to a minute.
      </span>
    </div>
  );
}
