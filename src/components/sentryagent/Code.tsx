/** Inline code chip — the lama's `<code>` with a subtle tinted background. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-hover px-1 py-px font-mono text-[0.75rem]">
      {children}
    </code>
  );
}
