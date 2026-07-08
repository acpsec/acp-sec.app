/**
 * On-chain ACP registration badge (lama's #acpRegisteredBadge).
 * Faithful to the lama: shows the positive badge ONLY when `registered === true`.
 * `false` / `null` (not registered / inconclusive) render nothing.
 */
export function OnchainStatus({
  registered,
}: {
  registered: boolean | null | undefined;
}) {
  if (registered !== true) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-success/35 bg-success/[0.12] px-3 py-1 text-caption font-semibold text-success"
      title="On-chain ACP registration verified at 0x238E…32E0"
    >
      <span aria-hidden>✅</span> ACP Registered
    </span>
  );
}
