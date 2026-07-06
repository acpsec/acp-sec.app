import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NAV_ITEMS, Nav } from "@/components/layout/Nav";

// Control usePathname per test. vi.hoisted so the mock factory can reference it.
const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({ usePathname: mockUsePathname }));

// Render next/link as a plain anchor (no App Router context needed in unit tests).
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

describe("<Nav />", () => {
  it("renders all nav items with their labels + hrefs, in order", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(NAV_ITEMS.length);
    NAV_ITEMS.forEach((item, i) => {
      expect(links[i]).toHaveTextContent(item.label);
      expect(links[i]).toHaveAttribute("href", item.href);
    });
  });

  it("renders an icon (svg) for each item", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<Nav />);
    expect(container.querySelectorAll("svg")).toHaveLength(NAV_ITEMS.length);
  });

  it("marks the item matching the current pathname as active (aria-current)", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Nav />);
    // Dashboard ("/") is active on the home route.
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /Scanner/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("moves the active state when the pathname changes", () => {
    mockUsePathname.mockReturnValue("/scanner");
    render(<Nav />);
    expect(screen.getByRole("link", { name: /Scanner/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    // "/" must NOT be active on a sub-route (exact match only for Dashboard).
    expect(screen.getByRole("link", { name: /Dashboard/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps a nested sub-route active (e.g. /agents/sentryagent under Agents)", () => {
    mockUsePathname.mockReturnValue("/agents/sentryagent");
    render(<Nav />);
    expect(screen.getByRole("link", { name: /Agents/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
