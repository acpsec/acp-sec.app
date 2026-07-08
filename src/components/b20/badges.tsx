import type { ReactNode } from "react";

/**
 * b20 A–F grade → semantic tri-class (border/bg/text). This is DELIBERATELY
 * separate from `src/lib/scoring.ts` (the 6-tier scheme, which documents "no A–F
 * letter grades in the system"): b20's grade is its own presentation concern, so
 * the mapping lives here with the badge that renders it. Unknown/null → neutral.
 */
const GRADE_TOKEN: Record<string, string> = {
  A: "border-success/40 bg-success/15 text-success",
  B: "border-warning-alt/40 bg-warning-alt/15 text-warning-alt",
  C: "border-warning/40 bg-warning/15 text-warning",
  D: "border-critical/40 bg-critical/15 text-critical",
  F: "border-danger/40 bg-danger/15 text-danger",
};
const GRADE_NEUTRAL = "border-border bg-surface-hover text-fg-subtle";

export function gradeToColorClass(grade: string | null | undefined): string {
  return (grade && GRADE_TOKEN[grade]) || GRADE_NEUTRAL;
}

export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={`inline-flex h-12 min-w-12 items-center justify-center rounded-lg border px-3 text-title font-bold tabular-nums ${gradeToColorClass(grade)}`}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}

export function CriticalBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-danger/50 bg-danger/15 px-2.5 py-1 text-caption font-semibold text-danger"
      role="status"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-danger" />
      CRITICAL
    </span>
  );
}

type Tone = "risk" | "safe" | "unknown";

const TONE_STYLES: Record<Tone, string> = {
  risk: "border-danger/40 bg-danger/10 text-danger",
  safe: "border-success/40 bg-success/10 text-success",
  unknown: "border-border bg-surface-hover text-fg-muted",
};
const TONE_DOT: Record<Tone, string> = {
  risk: "bg-danger",
  safe: "bg-success",
  unknown: "bg-fg-subtle",
};

function Pill({
  tone,
  children,
  label,
}: {
  tone: Tone;
  children: ReactNode;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-caption font-medium ${TONE_STYLES[tone]}`}
      aria-label={label}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
      {children}
    </span>
  );
}

/**
 * An issuer-power badge. `value`: true = the issuer HAS the power (risk, red);
 * false = they don't (safe, green); null = couldn't determine (unknown, gray).
 * Text states the meaning so it never relies on color alone.
 */
export function PowerBadge({
  power,
  value,
}: {
  power: "freeze" | "seize" | "pause" | "mint";
  value: boolean | null;
}) {
  const labels: Record<typeof power, { yes: string; no: string; unknown: string }> = {
    freeze: { yes: "Can freeze your tokens", no: "Cannot freeze", unknown: "Freeze: unknown" },
    seize: { yes: "Can seize your tokens", no: "Cannot seize", unknown: "Seize: unknown" },
    pause: { yes: "Can pause transfers", no: "Cannot pause", unknown: "Pause: unknown" },
    mint: { yes: "Can mint unlimited supply", no: "Supply is capped", unknown: "Mint cap: unknown" },
  };
  const l = labels[power];
  if (value === true) return <Pill tone="risk" label={l.yes}>{l.yes}</Pill>;
  if (value === false) return <Pill tone="safe" label={l.no}>{l.no}</Pill>;
  return <Pill tone="unknown" label={l.unknown}>{l.unknown}</Pill>;
}

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: "border-danger/40 bg-danger/10 text-danger",
  High: "border-danger/40 bg-danger/10 text-danger",
  Medium: "border-warning/40 bg-warning/10 text-warning",
  Low: "border-border bg-surface-hover text-fg-muted",
};

export function SeverityBadge({ severity }: { severity: string }) {
  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.Low;
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-micro font-semibold ${style}`}>
      {severity}
    </span>
  );
}
