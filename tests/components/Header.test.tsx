import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Header } from "@/components/layout/Header";
import { NAV_ITEMS } from "@/components/layout/Nav";

// Header renders <Nav /> (client, uses usePathname) — mock it + next/link.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("<Header />", () => {
  it("renders the ACP-SEC logo linking home", () => {
    render(<Header />);
    const logo = screen.getByRole("link", { name: "ACP-SEC" });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders the full primary nav (all items by label + href)", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const item of NAV_ITEMS) {
      const link = screen.getByRole("link", { name: new RegExp(item.label) });
      expect(nav).toContainElement(link);
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("renders lucide icons as svg (one per nav item)", () => {
    const { container } = render(<Header />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(
      NAV_ITEMS.length,
    );
  });
});
