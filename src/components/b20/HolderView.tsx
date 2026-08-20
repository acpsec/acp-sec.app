import type { B20ScanResult } from "@/lib/api/types";

import { CriticalBadge, GradeBadge, PowerBadge } from "./badges";
import { RoleHolderChips } from "./RoleHolderChips";

/** Layer 1 — the holder/buyer view, shown by default. */
export function HolderView({ result }: { result: B20ScanResult }) {
  const p = result.issuer_powers;
  return (
    <section
      aria-label="Holder summary"
      data-testid="layer-1"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-baseline gap-2">
          <span className="tabular-nums text-display font-bold leading-none text-fg">
            {result.trust_score}
          </span>
          <span className="text-title text-fg-subtle">/100</span>
        </div>
        <GradeBadge grade={result.grade} />
        {result.is_critical && <CriticalBadge />}
        {!result.rated && (
          <span className="rounded-md border border-border bg-surface-hover px-2.5 py-1 text-caption text-fg-muted">
            Unrated — limited data (×{result.multiplier})
          </span>
        )}
      </div>

      <p className="mt-4 max-w-2xl text-caption leading-6 text-fg-muted">
        This score reflects how safe it is to hold this token based on issuer
        powers, supply config, and transfer policies.
      </p>

      {result.is_critical && result.critical_reasons.length > 0 && (
        <ul className="mt-4 space-y-1 text-caption text-danger">
          {result.critical_reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        <h3 className="text-micro font-semibold uppercase tracking-wider text-fg-subtle">
          What the issuer can do
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <PowerBadge power="freeze" value={p.can_freeze} />
          <PowerBadge power="seize" value={p.can_seize} />
          <PowerBadge power="pause" value={p.can_pause} />
          <PowerBadge power="mint" value={p.can_mint_unbounded} />
        </div>

        <RoleHolderChips evidence={result.evidence ?? null} chainId={result.chain_id} />

        {result.evidence?.state && Object.keys(result.evidence.state).length > 0 && (
          <div className="mt-3 space-y-1">
            {Object.entries(result.evidence.state).map(([k, ev]) =>
              ev.block_number != null ? (
                <details key={k} className="text-micro text-fg-subtle">
                  <summary className="cursor-pointer list-none hover:text-fg-muted">
                    {k} · block {ev.block_number}
                  </summary>
                  <span className="ml-2 font-mono text-fg-muted">{ev.raw_value}</span>
                </details>
              ) : null,
            )}
          </div>
        )}
      </div>
    </section>
  );
}
