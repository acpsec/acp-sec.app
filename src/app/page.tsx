// Visual-verification placeholder (Task 3.2): exercises the semantic tokens +
// Inter font so a quick glance confirms the theme is wired. NOT real UI —
// replaced by ported pages in Groups 4–6.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center font-sans text-fg">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        acpsec.app — design tokens online
      </h1>
      <p className="max-w-md text-sm leading-6 text-fg-muted">
        Inter font, dark theme, and semantic color tokens verified. Real UI
        arrives in Groups 4–6.
      </p>
      <p className="text-xs text-fg-subtle">tertiary text · text-fg-subtle</p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          primary link
        </a>
        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
          SECURE
        </span>
        <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
          VULNERABLE
        </span>
        <span className="rounded-full bg-danger/15 px-3 py-1 text-xs font-medium text-danger">
          CRITICAL
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-fg-muted">
        surface card · border-border · text-fg-muted
      </div>
    </main>
  );
}
