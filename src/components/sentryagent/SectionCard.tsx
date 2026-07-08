/**
 * Card chrome shared by all 11 sections of the SentryAgent profile page
 * (header icon + uppercase title + section label, then a body). Static.
 */
export function SectionCard({
  icon,
  iconBgClass,
  title,
  label,
  fullWidth = false,
  children,
}: {
  icon: string;
  iconBgClass: string;
  title: string;
  label: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-surface ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-border bg-bg px-5 py-3.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${iconBgClass}`}
        >
          {icon}
        </div>
        <h2 className="text-caption font-bold uppercase tracking-wide text-fg-muted">
          {title}
        </h2>
        <span className="ml-auto text-micro font-semibold uppercase tracking-wider text-fg-subtle">
          {label}
        </span>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
