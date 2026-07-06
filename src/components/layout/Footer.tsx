import Link from "next/link";

// Links + attribution copied verbatim from the HTML lama footer (Phase 0 audit,
// dashboard/acp-sec-dashboard.html <footer>).
type FooterLink = { label: string; href: string; external: boolean };

const FOOTER_LINKS: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/acpsecagent/acp-sec", external: true },
  { label: "Privacy", href: "/privacy", external: false },
  { label: "Terms", href: "/terms", external: false },
  { label: "Security", href: "/security", external: false },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-page py-6 text-caption text-fg-muted">
        <span>
          ACP-SEC — Built by{" "}
          <a
            href="https://x.com/acpsecagent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @acpsecagent
          </a>
        </span>
        {FOOTER_LINKS.map((link) => (
          <span key={link.href} className="flex items-center gap-2">
            <span aria-hidden="true">·</span>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg"
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="hover:text-fg">
                {link.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </footer>
  );
}
