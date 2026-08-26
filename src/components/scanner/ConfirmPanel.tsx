"use client";

import { ScanProgress } from "@/components/scanner/ScanProgress";
import { UrlNormalizationControl } from "@/components/scanner/UrlNormalizationControl";
import { useScannerStore } from "@/lib/stores/scannerStore";

/** True when the URL carries a sub-path (lama reveals root/exact only then). */
function hasSubpath(raw: string): boolean {
  if (!raw.trim()) return false;
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const p = new URL(url).pathname;
    return p !== "" && p !== "/";
  } catch {
    return false;
  }
}

interface ConfirmPanelProps {
  onScan: () => void;
  onBack: () => void;
  scanning: boolean;
}

/**
 * Step 2 — confirm the scraped profile, edit the agent name / URL / optional
 * wallet, pick root-vs-exact (when the URL has a sub-path), then scan.
 * Microcopy verbatim from scanner.html.
 */
export function ConfirmPanel({ onScan, onBack, scanning }: ConfirmPanelProps) {
  const lookup = useScannerStore((s) => s.lookupResult);
  const agentName = useScannerStore((s) => s.agentName);
  const url = useScannerStore((s) => s.url);
  const wallet = useScannerStore((s) => s.wallet);
  const scanError = useScannerStore((s) => s.scanError);
  const setAgentName = useScannerStore((s) => s.setAgentName);
  const setUrl = useScannerStore((s) => s.setUrl);
  const setWallet = useScannerStore((s) => s.setWallet);

  const profile = lookup?.data;
  const scrapeFailed = profile?.source === "failed" || Boolean(profile?.error);

  // Prefer avatar_display_url (new field) over avatar_url (legacy). Both null
  // and undefined fall through to avatar_url; empty string → null (no image).
  // Never fall through to a default image — absence of data must show absence.
  const avatarSrc = profile
    ? (profile.avatar_display_url ?? (profile.avatar_url || null))
    : null;
  const avatarReason = profile?.avatar_source_reason ?? null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="text-body font-bold">✅ Confirm Agent Details</div>
      <p className="mt-0.5 mb-4 text-caption text-fg-muted">
        Review the scraped profile info and confirm the website URL to scan.
      </p>

      {/* Profile preview */}
      {profile ? (
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={`${profile.username} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                data-testid="avatar-unavailable"
                title={avatarReason ?? "Avatar unavailable"}
                className="flex h-full w-full items-center justify-center"
              >
                <span className="text-body text-fg-subtle" aria-hidden>
                  ?
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold">
              {profile.display_name || profile.username || "—"}
            </div>
            <div className="text-caption text-fg-subtle">
              @{profile.username}
            </div>
            {!avatarSrc && avatarReason ? (
              <div
                data-testid="avatar-reason"
                className="mt-0.5 text-micro text-fg-subtle"
              >
                {avatarReason}
              </div>
            ) : null}
            {profile.bio ? (
              <div className="mt-1 text-caption text-fg-muted">{profile.bio}</div>
            ) : null}
            {profile.website ? (
              <div className="mt-1 break-all text-caption text-primary">
                {profile.website}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {scrapeFailed ? (
        <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-caption text-fg-muted">
          ⚠️ {profile?.error || "Profile scraping failed."} Please fill in the
          details manually.
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {/* Agent name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-agent-name"
            className="text-caption font-semibold text-fg-muted"
          >
            Agent Name
          </label>
          <input
            id="confirm-agent-name"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Display name for the agent"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-subtle focus:border-primary"
          />
        </div>

        {/* URL */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-url"
            className="text-caption font-semibold text-fg-muted"
          >
            Website URL to Scan
          </label>
          <input
            id="confirm-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example-agent.xyz"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-subtle focus:border-primary"
          />
          <p className="text-micro text-fg-subtle">
            Enter the agent&apos;s documentation page, not just the homepage —
            homepages often lack the security signals the scanner looks for.
          </p>
          {hasSubpath(url) ? <UrlNormalizationControl /> : null}
        </div>

        {/* Optional wallet */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-wallet"
            className="text-caption font-semibold text-fg-muted"
          >
            Agent Wallet Address{" "}
            <span className="font-normal text-fg-subtle">
              (optional, Base/EVM)
            </span>
          </label>
          <input
            id="confirm-wallet"
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x… (42 hex chars)"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-caption text-fg outline-none placeholder:text-fg-subtle focus:border-primary"
          />
          <p className="text-micro text-fg-subtle">
            If provided, we&apos;ll query Base mainnet for ACP Core registration
            and surface an ACP REGISTERED ✅ badge on the results.
          </p>
        </div>

        {scanError ? (
          <div
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/[0.12] px-3 py-2 text-caption text-danger-alt"
          >
            Scan failed: {scanError.message}
          </div>
        ) : null}

        {scanning ? <ScanProgress /> : null}

        <div className="flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            onClick={onBack}
            disabled={scanning}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-body font-semibold text-fg-muted transition-colors hover:text-fg disabled:opacity-50"
          >
            ← Change username
          </button>
          <button
            type="button"
            onClick={onScan}
            disabled={scanning || url.trim() === "" || agentName.trim() === ""}
            className="rounded-lg bg-primary px-4 py-2.5 text-body font-semibold text-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? "⏳ Scanning…" : "🔬 Scan Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}
