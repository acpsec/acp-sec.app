"use client";

/**
 * /b20 — B20 Trust Score scanner (Task 7.2c: form + results wired).
 *
 * Read-only: this page never connects a wallet. It drives the useB20Scan
 * mutation (POST /api/b20/scan, same origin) and renders the result across the
 * three disclosure layers. wagmi is wired at the layout for future
 * wallet-enabled pages, but the scan itself is a plain API read.
 */
import { ScanForm } from "@/components/b20/ScanForm";
import { ScanResult } from "@/components/b20/ScanResult";
import { useB20Scan } from "@/lib/hooks/useB20";

export default function B20Page() {
  const scan = useB20Scan();

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

      <ScanForm
        onScan={(address, chainId) => scan.mutate({ address, chain_id: chainId })}
        pending={scan.isPending}
        error={scan.error}
      />

      {scan.data && (
        <div className="mt-8">
          <ScanResult result={scan.data} />
        </div>
      )}
    </div>
  );
}
