import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/layout/Footer";

// Footer uses next/link for internal links — render as a plain anchor.
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

describe("<Footer />", () => {
  it("renders the attribution / copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/ACP-SEC — Built by/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "@acpsecagent" }),
    ).toHaveAttribute("href", "https://x.com/acpsecagent");
  });

  it("renders all 4 footer links with correct hrefs", () => {
    render(<Footer />);
    const expected: Record<string, string> = {
      GitHub: "https://github.com/acpsecagent/acp-sec",
      Privacy: "/privacy",
      Terms: "/terms",
      Security: "/security",
    };
    for (const [label, href] of Object.entries(expected)) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });
});
