import Link from "next/link";

import { Code } from "@/components/sentryagent/Code";
import { HookItem } from "@/components/sentryagent/HookItem";
import { SectionCard } from "@/components/sentryagent/SectionCard";

const CONTRACT = "0x7770ED57E3993d4555951a557cd158a6Fb87A470";
const WALLET = "0x197C7433d7b500691AD2eCEf4dffc1B01C123dfA";
const BASESCAN = `https://sepolia.basescan.org/address/${CONTRACT}#code`;
const SOURCIFY = `https://repo.sourcify.dev/contracts/full_match/84532/${CONTRACT}/`;

// ── Small static helpers (verbatim content lives in the page body) ──────────

function Badge({
  variant,
  children,
}: {
  variant: "blue" | "green" | "yellow" | "purple" | "gray";
  children: React.ReactNode;
}) {
  const cls = {
    blue: "bg-primary/15 text-primary border-primary/30",
    green: "bg-success/15 text-success border-success/30",
    yellow: "bg-warning-alt/15 text-warning-alt border-warning-alt/30",
    purple: "bg-purple/15 text-purple border-purple/30",
    gray: "bg-fg-muted/10 text-fg-muted border-fg-muted/20",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-micro font-bold uppercase tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}

function IdRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="w-[38%] py-2 pr-3 align-top font-medium text-fg-muted">
        {label}
      </td>
      <td className="py-2 align-top text-fg">{children}</td>
    </tr>
  );
}

function SecRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="w-[44%] py-2.5 pr-3 align-top font-medium text-fg-muted">
        {label}
      </td>
      <td className="py-2.5 align-top">{children}</td>
    </tr>
  );
}

const LC_PILL =
  "rounded-full border px-3.5 py-1 text-micro font-bold tracking-wide";

export default function SentryAgentPage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-gradient-to-br from-bg via-[#0d1017] to-bg px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-start gap-8">
          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-success text-3xl shadow-[0_0_32px_rgba(0,82,255,.3)]">
            🛡️
          </div>
          <div className="min-w-[200px] flex-1">
            <h1 className="text-heading font-extrabold tracking-tight">
              <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
                SentryAgent
              </span>
            </h1>
            <p className="mt-1 mb-4 text-body text-fg-muted">
              ERC-8183 reference implementation &amp; ACP-SEC security showcase
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="blue">ERC-8183</Badge>
              <Badge variant="green">Hook Secured</Badge>
              <Badge variant="green">Non-Custodial</Badge>
              <Badge variant="yellow">Contract Verified</Badge>
              <Badge variant="purple">Smart Contract Agent</Badge>
              <Badge variant="gray">Base Sepolia</Badge>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3.5 py-1.5 text-caption font-semibold text-success">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_#00C087]"
              />
              Live on Testnet
            </span>
            <Link
              href="/agents/sentryagent/playground"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-caption font-bold text-fg transition-opacity hover:opacity-85"
            >
              Try It Live →
            </Link>
            <span className="text-micro text-fg-subtle">
              v1.0.0 · Basescan ✓ · Sourcify ✓
            </span>
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* SECTION 1 — Agent Identity */}
          <SectionCard
            icon="🪪"
            iconBgClass="bg-primary/15"
            title="Agent Identity"
            label="AUTH"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <IdRow label="Name">
                  <strong>SentryAgent</strong>
                </IdRow>
                <IdRow label="Version">1.0.0</IdRow>
                <IdRow label="Purpose">
                  ERC-8183 reference implementation &amp; ACP-SEC security
                  showcase
                </IdRow>
                <IdRow label="Model">Smart Contract Agent</IdRow>
                <IdRow label="X / Twitter">
                  <a
                    href="https://twitter.com/acpsecagent"
                    target="_blank"
                    rel="noopener"
                    className="text-primary hover:underline"
                  >
                    @acpsecagent
                  </a>
                </IdRow>
              </tbody>
            </table>
          </SectionCard>

          {/* SECTION 2 — On-chain Identity */}
          <SectionCard
            icon="⛓️"
            iconBgClass="bg-success/15"
            title="On-chain Identity"
            label="On-chain"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <IdRow label="Agent Wallet">
                  <span className="break-all font-mono text-caption text-success">
                    {WALLET}
                  </span>
                </IdRow>
                <IdRow label="Contract">
                  <span className="break-all font-mono text-caption text-success">
                    {CONTRACT}
                  </span>
                </IdRow>
                <IdRow label="Network">
                  Base Sepolia{" "}
                  <span className="text-[0.78rem] text-fg-subtle">
                    (testnet)
                  </span>
                </IdRow>
                <IdRow label="Basescan">
                  <a
                    href={BASESCAN}
                    target="_blank"
                    rel="noopener"
                    className="break-all font-mono text-[0.78rem] text-primary hover:underline"
                  >
                    View verified source ↗
                  </a>
                </IdRow>
                <IdRow label="Sourcify">
                  <a
                    href={SOURCIFY}
                    target="_blank"
                    rel="noopener"
                    className="break-all font-mono text-[0.78rem] text-primary hover:underline"
                  >
                    Full match ↗
                  </a>
                </IdRow>
              </tbody>
            </table>
          </SectionCard>

          {/* SECTION 3 — ERC-8183 Compliance */}
          <SectionCard
            icon="📋"
            iconBgClass="bg-primary/15"
            title="ERC-8183 Compliance"
            label="Lifecycle"
            fullWidth
          >
            <div className="mb-4">
              <div className="mb-2 text-micro font-semibold uppercase tracking-wider text-fg-muted">
                Job Lifecycle
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`${LC_PILL} border-fg-muted/30 bg-fg-muted/10 text-fg-muted`}
                >
                  Open
                </span>
                <span className="text-fg-subtle">→</span>
                <span
                  className={`${LC_PILL} border-primary/30 bg-primary/[0.12] text-primary`}
                >
                  Funded
                </span>
                <span className="text-fg-subtle">→</span>
                <span
                  className={`${LC_PILL} border-warning-alt/30 bg-warning-alt/[0.12] text-warning-alt`}
                >
                  Submitted
                </span>
                <span className="text-fg-subtle">→</span>
                <span className="flex flex-col gap-1.5">
                  <span
                    className={`${LC_PILL} border-success/30 bg-success/[0.12] text-success`}
                  >
                    Completed
                  </span>
                  <span
                    className={`${LC_PILL} border-warning/30 bg-warning/[0.12] text-warning`}
                  >
                    Rejected
                  </span>
                  <span
                    className={`${LC_PILL} border-danger-alt/30 bg-danger-alt/[0.12] text-danger-alt`}
                  >
                    Expired
                  </span>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <ComplianceItem
                label="Budget locked in escrow"
                sub="ETH held by contract until completion or rejection"
              />
              <ComplianceItem
                label="Evaluator role"
                sub="Independent third-party attestor — not the client or provider"
              />
              <ComplianceItem
                label="Fund-transfer type"
                sub="ETH-based escrow with atomic release on approval"
              />
              <ComplianceItem
                label="Multi-chain ready"
                sub="Base Sepolia (testnet) — mainnet expansion planned"
              />
            </div>
          </SectionCard>

          {/* SECTION 4 — Hook Security Patterns */}
          <SectionCard
            icon="🔗"
            iconBgClass="bg-purple/15"
            title="Hook Security Patterns"
            label="HOOK"
            fullWidth
          >
            <p className="mb-4 text-micro text-fg-subtle">
              Patterns inspired by{" "}
              <a
                href="https://twitter.com/ariessa_xyz"
                target="_blank"
                rel="noopener"
                className="text-fg-muted hover:text-fg"
              >
                @ariessa_xyz
              </a>{" "}
              reference implementations.
            </p>
            <div className="flex flex-col gap-2.5">
              <HookItem
                icon="🔒"
                name="Commitment Immutability"
                code="AlreadyReleased guard"
              >
                Once funds are released, the <Code>fundsReleased</Code> flag is
                set and cannot be cleared — prevents double-spend and redirect
                attacks.
              </HookItem>
              <HookItem
                icon="♻️"
                name="Reentrancy Protection"
                code="Checks-Effects-Interactions pattern"
              >
                All state mutations complete before any external{" "}
                <Code>.call{"{value}"}</Code> — eliminates reentrancy attack
                surface across <Code>completeJob</Code>, <Code>rejectJob</Code>,
                and <Code>recoverExpiredJob</Code>.
              </HookItem>
              <HookItem
                icon="⚖️"
                name="Fee-on-Transfer Detection"
                code="Balance verification via msg.value"
              >
                Budget stored as <Code>msg.value</Code> (the ETH actually
                received) rather than a caller-supplied parameter — guards
                against fee-on-transfer discrepancies.
              </HookItem>
              <HookItem
                icon="⏳"
                name="Expiry Recovery"
                code="recoverExpiredJob()"
                credit={
                  <>
                    Pattern from{" "}
                    <a
                      href="https://twitter.com/ariessa_xyz"
                      target="_blank"
                      rel="noopener"
                      className="hover:text-fg"
                    >
                      @ariessa_xyz
                    </a>{" "}
                    FundTransferHook.recoverTokens
                  </>
                }
              >
                Clients can reclaim escrowed funds after <Code>expiredAt</Code>{" "}
                if the job stalls — no funds locked forever.
              </HookItem>
              <HookItem
                icon="🎯"
                name="Signature Replay Protection"
                code="jobId scoping"
              >
                Every action is scoped to a unique <Code>jobId</Code>{" "}
                (auto-incremented, non-reusable) — state changes for one job
                cannot replay against another.
              </HookItem>
            </div>
          </SectionCard>

          {/* SECTION 5 — Context Security */}
          <SectionCard
            icon="🧩"
            iconBgClass="bg-primary/15"
            title="Context Security"
            label="CTX"
          >
            <div className="flex flex-col gap-2.5">
              <HookItem icon="🔑" name="Job-scoped isolation">
                Each job is isolated by a unique auto-incremented{" "}
                <Code>jobId</Code>. No shared mutable state between jobs — one
                job&apos;s data cannot affect another&apos;s execution path.
              </HookItem>
              <HookItem icon="🚧" name="No cross-job data leakage">
                Job structs are stored in a <Code>mapping(uint256 → Job)</Code>.
                Access to any job requires its exact <Code>jobId</Code> — no
                iteration, no enumeration of foreign jobs.
              </HookItem>
              <HookItem icon="✅" name="Input validation on-chain">
                All inputs validated via Solidity custom errors before any state
                change: <Code>ZeroAddress</Code>, <Code>InvalidExpiry</Code>,{" "}
                <Code>InsufficientFunds</Code>, <Code>InvalidJobStatus</Code>.
              </HookItem>
              <HookItem icon="⚛️" name="Atomic state transitions">
                State changes are atomic per transaction — a job either fully
                transitions to the next status or the entire call reverts. No
                partial state is possible.
              </HookItem>
            </div>
          </SectionCard>

          {/* SECTION 6 — Injection Protection */}
          <SectionCard
            icon="🛡️"
            iconBgClass="bg-danger-alt/15"
            title="Injection Protection"
            label="INJ"
          >
            <div className="flex flex-col gap-2.5">
              <HookItem icon="🤖" name="No natural language processing">
                SentryAgent is a pure on-chain contract — it has no LLM, no
                prompt parsing, and no natural language input surface. Prompt
                injection attacks have zero attack surface.
              </HookItem>
              <HookItem icon="🔒" name="Typed input validation">
                All inputs are Solidity-typed (<Code>address</Code>,{" "}
                <Code>uint256</Code>, <Code>bytes32</Code>) with custom error
                reverts. Malformed inputs are rejected at the EVM level before
                execution.
              </HookItem>
              <HookItem icon="♻️" name="Reentrancy blocked via CEI">
                Checks-Effects-Interactions pattern enforced across all
                fund-release functions — no external calls before all state
                mutations complete, preventing cross-function injection via
                callbacks.
              </HookItem>
              <HookItem icon="🚫" name="No delegatecall usage">
                The contract contains no <Code>delegatecall</Code> —
                eliminating the entire class of storage-collision and
                context-hijacking attacks associated with proxy patterns.
              </HookItem>
            </div>
          </SectionCard>

          {/* SECTION 7 — Privacy Policy */}
          <SectionCard
            icon="🔏"
            iconBgClass="bg-purple/15"
            title="Privacy Policy"
            label="PRIV"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <SecRow label="PII collection">
                  <span className="font-semibold text-success">
                    ✓ None — no personally identifiable information collected
                  </span>
                </SecRow>
                <SecRow label="Data storage">
                  <span className="font-semibold text-success">
                    ✓ All agent data is public on-chain (transparent by design)
                  </span>
                </SecRow>
                <SecRow label="Off-chain storage">
                  <span className="font-semibold text-success">
                    ✓ None — no off-chain databases or logs
                  </span>
                </SecRow>
                <SecRow label="Cookies & tracking">
                  <span className="font-semibold text-success">
                    ✓ No cookies, no analytics, no tracking scripts
                  </span>
                </SecRow>
                <SecRow label="Wallet addresses">
                  <span className="text-fg">
                    Pseudonymous — on-chain addresses are public but not linked
                    to real-world identity by this contract
                  </span>
                </SecRow>
                <SecRow label="Data retention">
                  <span className="text-fg">
                    Immutable on-chain — data cannot be deleted (blockchain by
                    design)
                  </span>
                </SecRow>
              </tbody>
            </table>
          </SectionCard>

          {/* SECTION 8 — Output Security */}
          <SectionCard
            icon="📤"
            iconBgClass="bg-success/15"
            title="Output Security"
            label="OUT"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <SecRow label="Output channel">
                  <span className="font-semibold text-success">
                    ✓ All outputs are on-chain transactions — immutable and
                    auditable
                  </span>
                </SecRow>
                <SecRow label="Deliverable integrity">
                  <span className="font-semibold text-success">
                    ✓ Stored as <Code>bytes32</Code> hash — cannot be tampered
                    after submission
                  </span>
                </SecRow>
                <SecRow label="Tamper resistance">
                  <span className="font-semibold text-success">
                    ✓ On-chain state is append-only and consensus-verified
                  </span>
                </SecRow>
                <SecRow label="Approval requirement">
                  <span className="font-semibold text-success">
                    ✓ Evaluator must explicitly call <Code>completeJob</Code> or{" "}
                    <Code>rejectJob</Code>
                  </span>
                </SecRow>
                <SecRow label="Unilateral release">
                  <span className="font-semibold text-danger-alt">
                    ✗ Blocked — no single party can release funds alone
                  </span>
                </SecRow>
                <SecRow label="Secrets in output">
                  <span className="font-semibold text-success">
                    ✓ None — contract emits only job lifecycle events, no
                    secrets
                  </span>
                </SecRow>
              </tbody>
            </table>
          </SectionCard>

          {/* SECTION 9 — Security Disclosure */}
          <SectionCard
            icon="🔐"
            iconBgClass="bg-warning-alt/15"
            title="Security Disclosure"
            label="ACP-SEC"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <SecRow label="System prompt protection">
                  <span className="italic text-fg-subtle">
                    N/A — on-chain agent
                  </span>
                </SecRow>
                <SecRow label="Context window isolation">
                  <span className="font-semibold text-success">
                    ✓ Per-job isolation
                  </span>
                </SecRow>
                <SecRow label="Output validation">
                  <span className="font-semibold text-success">
                    ✓ On-chain verification
                  </span>
                </SecRow>
                <SecRow label="Privacy">
                  <span className="text-fg">
                    No PII collected — all data on-chain and public
                  </span>
                </SecRow>
                <SecRow label="Audit status">
                  <span className="font-semibold text-success">
                    ✓ Source verified on Basescan + Sourcify
                  </span>
                </SecRow>
              </tbody>
            </table>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border-t border-success/15 bg-success/[0.05] px-4 py-3 text-caption text-fg-muted">
              <strong className="text-success">✓ Verified</strong>
              <span>Basescan Sepolia</span>
              <span>·</span>
              <span>Sourcify Full Match</span>
              <span>·</span>
              <span>Open source</span>
            </div>
          </SectionCard>

          {/* SECTION 10 — Governance */}
          <SectionCard
            icon="🏛️"
            iconBgClass="bg-warning/15"
            title="Governance"
            label="GOV"
          >
            <table className="w-full border-collapse text-caption">
              <tbody>
                <SecRow label="Owner">
                  <a
                    href="https://twitter.com/acpsecagent"
                    target="_blank"
                    rel="noopener"
                    className="text-primary hover:underline"
                  >
                    @acpsecagent
                  </a>
                </SecRow>
                <SecRow label="Upgradeable">
                  <span className="font-semibold text-danger-alt">
                    ✗ Immutable contract
                  </span>
                </SecRow>
                <SecRow label="Emergency contact">
                  <a
                    href="mailto:security@acpsec.app"
                    className="text-primary hover:underline"
                  >
                    security@acpsec.app
                  </a>
                </SecRow>
                <SecRow label="Open source">
                  <a
                    href="https://github.com/acpsecagent/acp-sec"
                    target="_blank"
                    rel="noopener"
                    className="text-primary hover:underline"
                  >
                    github.com/acpsecagent/acp-sec ↗
                  </a>
                </SecRow>
              </tbody>
            </table>
          </SectionCard>

          {/* SECTION 11 — Links & Resources */}
          <SectionCard
            icon="🔗"
            iconBgClass="bg-success/15"
            title="Links & Resources"
            label="External"
            fullWidth
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LinkCard
                href="/scanner"
                icon="🔍"
                label="ACP-SEC Scanner"
                sub="Scan any agent for security issues"
              />
              <LinkCard
                href="/leaderboard"
                icon="🏆"
                label="Leaderboard"
                sub="Agent security rankings"
              />
              <LinkCard
                href="https://github.com/acpsecagent/acp-sec"
                external
                icon="⭐"
                label="GitHub"
                sub="github.com/acpsecagent/acp-sec"
              />
              <LinkCard
                href={BASESCAN}
                external
                icon="📄"
                label="Contract Source"
                sub="Verified on Basescan Sepolia"
              />
            </div>
          </SectionCard>
        </div>

        {/* Page footer note (verbatim from the lama <footer>) */}
        <div className="mt-12 border-t border-border pt-6 text-center text-caption text-fg-subtle">
          <p>
            <Link href="/" className="hover:text-fg">
              ACP-SEC
            </Link>{" "}
            · Agent Communication Protocol Security ·{" "}
            <a href="mailto:security@acpsec.app" className="hover:text-fg">
              security@acpsec.app
            </a>
          </p>
          <p className="mt-1.5">
            SentryAgent is a reference implementation. Source code is open and
            verified.
          </p>
        </div>
      </main>
    </>
  );
}

function ComplianceItem({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-bg px-3 py-2.5">
      <span className="mt-px shrink-0 text-success">✓</span>
      <div>
        <div className="text-caption font-medium text-fg">{label}</div>
        <div className="mt-px text-micro text-fg-muted">{sub}</div>
      </div>
    </div>
  );
}

function LinkCard({
  href,
  external = false,
  icon,
  label,
  sub,
}: {
  href: string;
  external?: boolean;
  icon: string;
  label: string;
  sub: string;
}) {
  const cls =
    "flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3 transition-colors hover:border-primary hover:bg-primary/[0.06]";
  const inner = (
    <>
      <span className="shrink-0 text-xl" aria-hidden>
        {icon}
      </span>
      <div>
        <div className="text-caption font-semibold text-fg">{label}</div>
        <div className="mt-px text-micro text-fg-muted">{sub}</div>
      </div>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
