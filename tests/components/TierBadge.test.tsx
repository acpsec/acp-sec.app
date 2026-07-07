import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TierBadge } from "@/components/leaderboard/TierBadge";

describe("TierBadge", () => {
  it.each([
    [92, "EXEMPLARY", "text-primary"],
    [78, "SECURE", "text-success"],
    [55, "HARDENED", "text-warning-alt"],
    [35, "VULNERABLE", "text-warning"],
    [15, "CRITICAL", "text-critical"],
    [5, "COMPROMISED", "text-danger"],
  ])("score %d → %s (%s)", (score, tier, cls) => {
    render(<TierBadge score={score} />);
    const el = screen.getByText(tier);
    expect(el).toBeInTheDocument();
    expect(el.className).toContain(cls);
  });

  it("null score renders '—' (unscored), never COMPROMISED", () => {
    render(<TierBadge score={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText("COMPROMISED")).not.toBeInTheDocument();
  });

  it("derives the tier from score only (no tier field is ever rendered)", () => {
    // TierBadge takes only `score` — a backend tier string can't reach the DOM.
    render(<TierBadge score={92} />);
    expect(screen.getByText("EXEMPLARY")).toBeInTheDocument();
    expect(screen.queryByText("WRONG")).not.toBeInTheDocument();
  });
});
