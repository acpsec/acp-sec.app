"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchReport } from "@/lib/api/report";
import type { Agent } from "@/lib/api/types";

import { AgentAvatar } from "./AgentAvatar";
import { TierBadge } from "./TierBadge";

// Cross-page handoff keys — the dashboard (Group 5.1) reads these on load.
const LAST_SCAN_KEY = "acpsec_last_scan";
const LAST_SCAN_TIME_KEY = "acpsec_last_scan_time";

// Module-scope (not render): stash the fetched report for the dashboard handoff.
function stashReport(data: unknown): void {
  try {
    localStorage.setItem(LAST_SCAN_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_SCAN_TIME_KEY, String(Date.now()));
  } catch {
    /* quota / private mode — ignore */
  }
}

type FilterKey = "all" | "defi" | "trading" | "basemcp" | "token";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "defi", label: "DeFi" },
  { key: "trading", label: "Trading" },
  { key: "basemcp", label: "Base MCP" },
  { key: "token", label: "Has Token" },
];

function matchesFilter(a: Agent, filter: FilterKey): boolean {
  switch (filter) {
    case "all":
      return true;
    case "defi":
      return (a.category ?? "").toLowerCase() === "defi";
    case "trading":
      return (a.category ?? "").toLowerCase() === "trading";
    case "basemcp":
      return Boolean(a.base_mcp);
    case "token":
      return Boolean(a.token);
  }
}

// Flag conditions mirror the HTML lama exactly (incl. custodial === false).
function agentFlags(a: Agent): { key: string; label: string; title: string }[] {
  const flags: { key: string; label: string; title: string }[] = [];
  if (a.base_mcp) flags.push({ key: "mcp", label: "⚡ Base MCP", title: "Base MCP partner" });
  if (a.acp_registered)
    flags.push({ key: "acp", label: "✅ ACP Registered", title: "On-chain ACP registration verified" });
  if (a.custodial === false)
    flags.push({ key: "noncust", label: "🔐 Non-Custodial", title: "User retains custody of keys" });
  if (a.fund_transfer)
    flags.push({ key: "fund", label: "💸 Fund Transfer", title: "Agent moves user funds — elevated risk" });
  if (a.evaluator)
    flags.push({ key: "eval", label: "⚖️ Has Evaluator", title: "Third-party verification role declared" });
  if (a.limited_scan)
    flags.push({ key: "limited", label: "Limited", title: "Limited scan — no website provided" });
  return flags;
}

function rankCell(rank: number) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return medal ? <span className="text-base">{medal}</span> : <span>{rank}</span>;
}

function MoveCell({ agent }: { agent: Agent }) {
  if (agent.movement === "up")
    return <span className="text-success" title={`+${agent.movement_delta}`}>▲</span>;
  if (agent.movement === "down")
    return <span className="text-danger" title={String(agent.movement_delta)}>▼</span>;
  return <span className="text-fg-subtle" title="no change">−</span>;
}

export function LeaderboardTable({ agents }: { agents: Agent[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [noReportAgent, setNoReportAgent] = useState<Agent | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Auto-dismiss the "no report" toast after 12s, like the lama.
  useEffect(() => {
    if (!noReportAgent) return;
    const t = setTimeout(() => setNoReportAgent(null), 12_000);
    return () => clearTimeout(t);
  }, [noReportAgent]);

  const rows = agents.filter((a) => matchesFilter(a, filter));

  // Row click: fetch the full report; if present, hand off via localStorage and
  // navigate to the dashboard; otherwise surface the "Scan now" toast.
  async function loadAgent(a: Agent) {
    setPendingId(a.id);
    try {
      const res = await fetchReport(a.id);
      stashReport(res.data);
      router.push("/");
    } catch {
      setNoReportAgent(a);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 text-caption font-medium transition-colors ${
              filter === f.key
                ? "bg-primary text-fg"
                : "bg-surface text-fg-muted hover:bg-surface-hover hover:text-fg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-caption">
          <thead>
            <tr className="border-b border-border text-fg-subtle">
              <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-wide">#</th>
              <th className="px-1 py-2" aria-label="Movement" />
              <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-wide">Agent</th>
              <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-wide">Score</th>
              <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-wide">Tier</th>
              <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-wide max-sm:hidden">
                Critical Fails
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-fg-muted">
                  No agents in this category yet.
                </td>
              </tr>
            ) : (
              rows.map((a) => {
                const flags = agentFlags(a);
                const critFails = Number(a.critical_fails ?? 0);
                return (
                  <tr
                    key={a.id}
                    onClick={() => loadAgent(a)}
                    className={`cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-surface-hover ${
                      pendingId === a.id ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-3 py-3 font-semibold text-fg">{rankCell(a.rank)}</td>
                    <td className="px-1 py-3 text-center">
                      <MoveCell agent={a} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <AgentAvatar handle={a.x_handle} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-fg">{a.name}</span>
                            {a.token ? (
                              <span className="rounded bg-surface px-1.5 py-0.5 text-micro font-medium text-fg-muted">
                                {String(a.token)}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-micro text-fg-subtle max-sm:hidden">
                            @{a.x_handle ?? a.id}
                          </div>
                          {flags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {flags.map((f) => (
                                <span
                                  key={f.key}
                                  title={f.title}
                                  className="rounded bg-surface px-1.5 py-0.5 text-micro text-fg-muted"
                                >
                                  {f.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="whitespace-nowrap font-semibold text-fg">
                        {a.score ?? "—"}
                        <span className="text-fg-subtle">/100</span>
                      </div>
                      {a.score != null && (
                        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-surface">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.max(2, a.score)}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <TierBadge score={a.score} />
                    </td>
                    <td className="px-3 py-3 max-sm:hidden">
                      <span
                        className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-micro font-semibold ${
                          critFails > 0
                            ? "bg-danger/15 text-danger"
                            : "bg-success/15 text-success"
                        }`}
                      >
                        {critFails}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {noReportAgent && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-border bg-surface p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <span className="shrink-0 text-lg">📊</span>
            <div className="flex-1 text-caption">
              <strong className="text-fg">Full report not available</strong>
              <div className="mt-0.5 text-fg-muted">
                Re-scan <strong>{noReportAgent.name}</strong> for the detailed
                38-check breakdown.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNoReportAgent(null)}
              aria-label="Dismiss"
              className="shrink-0 text-fg-subtle hover:text-fg"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Link
              href="/scanner"
              className="rounded-full bg-primary px-4 py-1.5 text-micro font-semibold text-fg"
            >
              🔍 Scan now
            </Link>
            <button
              type="button"
              onClick={() => setNoReportAgent(null)}
              className="rounded-full border border-border px-4 py-1.5 text-micro font-semibold text-fg-muted"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
