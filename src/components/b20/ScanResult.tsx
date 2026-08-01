import type { B20ScanResult } from "@/lib/api/types";

import { DimensionBreakdown } from "./DimensionBreakdown";
import { HolderView } from "./HolderView";
import { RawJson } from "./RawJson";

/**
 * The composite scan result — one `B20ScanResult` payload rendered across the
 * three disclosure layers (holder / trader / researcher) plus a provenance
 * footer. Purely presentational: the page owns the useB20Scan mutation and
 * passes the data in.
 */
export function ScanResult({ result }: { result: B20ScanResult }) {
  return (
    <div className="space-y-4">
      <HolderView result={result} />
      <DimensionBreakdown result={result} />
      <RawJson result={result} />
      <p
        data-testid="b20-scan-footer"
        className="pt-1 text-center text-micro text-fg-subtle"
      >
        {result.chain_id === 8453 ? "Base Mainnet" : "Base Sepolia"} · scanner{" "}
        {result.scanner_version} · {result.scanned_at}
      </p>
    </div>
  );
}
