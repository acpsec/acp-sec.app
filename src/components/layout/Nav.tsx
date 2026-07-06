"use client";

import {
  Activity,
  Bot,
  LayoutDashboard,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string; icon: LucideIcon };

// Exact labels, hrefs, and ORDER from the HTML lama primary nav (Phase 0 audit,
// dashboard/acp-sec-dashboard.html <nav class="acpsec-nav">). Do not add/remove.
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Scanner", href: "/scanner", icon: Search },
  { label: "Monitor", href: "/monitor", icon: Activity },
  { label: "Agents", href: "/agents/sentryagent", icon: Bot },
];

// Dashboard ("/") matches only exactly; others also match nested sub-routes.
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-caption font-medium transition-colors ${
                  active
                    ? "bg-surface text-fg"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
