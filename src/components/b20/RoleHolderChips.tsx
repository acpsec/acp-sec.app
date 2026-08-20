import type { B20Evidence } from "@/lib/api/types";

function basescanUrl(chainId: number): string {
  return chainId === 8453 ? "https://basescan.org" : "https://sepolia.basescan.org";
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 8)}…${addr.slice(-4)}`;
}

/** Role holder chip block — rendered under "What the issuer can do" in HolderView. */
export function RoleHolderChips({
  evidence,
  chainId,
}: {
  evidence: B20Evidence | null | undefined;
  chainId: number;
}) {
  if (!evidence || Object.keys(evidence.roles).length === 0) return null;

  const base = basescanUrl(chainId);

  const rows = Object.values(evidence.roles).flat();
  if (rows.length === 0) return null;

  return (
    <div data-testid="role-chips" className="mt-4 space-y-2">
      <h3 className="text-micro font-semibold uppercase tracking-wider text-fg-subtle">
        Role holders (on-chain)
      </h3>
      <div className="space-y-2">
        {rows.map((holder, i) => (
          <div
            key={`${holder.role ?? "unknown"}-${holder.address}-${i}`}
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span className="rounded border border-border bg-surface-hover px-1.5 py-0.5 text-micro font-semibold text-fg-muted">
              {holder.role ?? "unknown"}
            </span>

            <a
              href={`${base}/address/${holder.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-micro text-primary hover:underline"
              aria-label={truncateAddress(holder.address)}
            >
              {truncateAddress(holder.address)}
            </a>

            {holder.grant?.tx_hash && (
              <a
                href={`${base}/tx/${holder.grant.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-micro text-fg-subtle hover:text-fg-muted hover:underline"
              >
                grant tx
              </a>
            )}

            {holder.has_role?.confirmed === true &&
              holder.has_role.block_number != null && (
                <span className="text-micro text-success">
                  confirmed @ block {holder.has_role.block_number}
                </span>
              )}

            {holder.discrepancy && (
              <span className="text-micro font-semibold text-danger">
                discrepancy
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
