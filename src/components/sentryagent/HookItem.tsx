/**
 * A single security-pattern row (icon + name + optional code label + desc +
 * optional credit). Reused across the Hook / Context / Injection cards. Static.
 */
export function HookItem({
  icon,
  name,
  code,
  credit,
  children,
}: {
  icon: string;
  name: string;
  code?: string;
  credit?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-lg border border-border bg-bg px-4 py-3">
      <span className="mt-px shrink-0 text-lg" aria-hidden>
        {icon}
      </span>
      <div>
        <div className="text-caption font-semibold text-fg">{name}</div>
        {code ? (
          <div className="mt-0.5 font-mono text-micro text-purple">{code}</div>
        ) : null}
        <div className="mt-0.5 text-caption text-fg-muted">{children}</div>
        {credit ? (
          <div className="mt-1 text-micro text-fg-subtle">{credit}</div>
        ) : null}
      </div>
    </div>
  );
}
