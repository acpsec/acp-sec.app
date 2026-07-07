import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScoreSummary } from "@/components/dashboard/ScoreSummary";
import type { ScoreData } from "@/lib/api/types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...p }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...p}>
      {children}
    </a>
  ),
}));

const DATA: ScoreData = {
  agent_name: "aixbt",
  band: "SECURE",
  verdict: "Looks solid",
  final_score: 82,
  score_pct: 82,
  critical_fails: 1,
  controls: [],
};

describe("ScoreSummary", () => {
  it("renders the empty state when there is no score", () => {
    render(<ScoreSummary scoreData={null} source={null} cachedAt={null} />);
    expect(screen.getByText("No agent scanned yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to Scanner/ })).toHaveAttribute(
      "href",
      "/scanner",
    );
  });

  it("renders agent, tier (from score), verdict, and the Session source", () => {
    render(<ScoreSummary scoreData={DATA} source="session" cachedAt={null} />);
    expect(screen.getByText("aixbt")).toBeInTheDocument();
    expect(screen.getByText("SECURE")).toBeInTheDocument(); // TierBadge from 82
    expect(screen.getByText("Looks solid")).toBeInTheDocument();
    expect(screen.getByText("Session")).toBeInTheDocument();
  });

  it("shows 'From Report' + the cached banner for a handoff source", () => {
    render(
      <ScoreSummary scoreData={DATA} source="handoff" cachedAt={Date.now()} />,
    );
    expect(screen.getByText("From Report")).toBeInTheDocument();
    expect(screen.getByText(/Last scan:/)).toBeInTheDocument();
  });
});
