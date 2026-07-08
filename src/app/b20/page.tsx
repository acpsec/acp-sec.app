/**
 * /b20 — B20 Trust Score scanner (Task 7.2a foundation: shell only).
 *
 * Read-only: this page never connects a wallet. wagmi is wired at the layout
 * (for future wallet-enabled pages), but the scan is a plain read of the b20
 * API. The scan form + results land in 7.2c; the API client in 7.2b.
 */
export default function B20Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-section">
      <header>
        <h1 className="text-heading font-extrabold tracking-tight">
          <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
            B20 Trust Score
          </span>
        </h1>
        <p className="mt-1 text-caption text-fg-muted">
          Is it safe to hold this B20 token — and what can the issuer do to you?
        </p>
      </header>

      {/* ScanForm placeholder — the address/chain form arrives in 7.2c. */}
      <div
        data-testid="b20-scanform-placeholder"
        className="mt-6 rounded-lg border border-border bg-surface px-4 py-6 text-caption text-fg-muted"
      >
        Enter a B20 token address to scan. <span className="text-fg-subtle">(scan form — 7.2c)</span>
      </div>

      {/* ScanResult placeholder — the result panels arrive in 7.2c. */}
      <div
        data-testid="b20-scanresult-placeholder"
        className="mt-4 rounded-lg border border-border bg-surface px-4 py-10 text-center text-caption text-fg-subtle"
      >
        Results will appear here after a scan.
      </div>
    </div>
  );
}
