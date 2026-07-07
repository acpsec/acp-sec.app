import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { fetchReport } from "@/lib/api/report";
import type { Agent } from "@/lib/api/types";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...p }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...p}>
      {children}
    </a>
  ),
}));
vi.mock("@/lib/api/report", () => ({ fetchReport: vi.fn() }));
const fetchReportMock = vi.mocked(fetchReport);

function agent(over: Partial<Agent> & { id: string; name: string }): Agent {
  return {
    score: 80,
    previous_score: 80,
    tier: null,
    rank: 1,
    movement: "same",
    movement_delta: 0,
    ...over,
  };
}

const AGENTS: Agent[] = [
  agent({ id: "aixbt", name: "aixbt", score: 82, rank: 1, category: "trading" }),
  agent({ id: "aero", name: "Aerodrome", score: 55, rank: 2, category: "defi" }),
  agent({ id: "ref", name: "RefAgent", score: null, rank: 3 }),
];

beforeEach(() => {
  push.mockClear();
  fetchReportMock.mockReset();
});

describe("LeaderboardTable", () => {
  it("renders a row per agent with name, score, and computed tier", () => {
    render(<LeaderboardTable agents={AGENTS} />);
    expect(screen.getByText("aixbt")).toBeInTheDocument();
    expect(screen.getByText("Aerodrome")).toBeInTheDocument();
    expect(screen.getByText("SECURE")).toBeInTheDocument(); // 82 → SECURE
    expect(screen.getByText("HARDENED")).toBeInTheDocument(); // 55 → HARDENED
    // Null-score reference agent renders cleanly (— tier), no crash.
    expect(screen.getByText("RefAgent")).toBeInTheDocument();
  });

  it("filters by category tab", () => {
    render(<LeaderboardTable agents={AGENTS} />);
    fireEvent.click(screen.getByRole("button", { name: "DeFi" }));
    expect(screen.getByText("Aerodrome")).toBeInTheDocument();
    expect(screen.queryByText("aixbt")).not.toBeInTheDocument();
  });

  it("shows the empty-category message when a filter matches nothing", () => {
    render(<LeaderboardTable agents={[AGENTS[0]!]} />);
    fireEvent.click(screen.getByRole("button", { name: "DeFi" }));
    expect(
      screen.getByText("No agents in this category yet."),
    ).toBeInTheDocument();
  });

  it("drill-down: report found → hands off + navigates to /", async () => {
    fetchReportMock.mockResolvedValue({ ok: true, data: { agent_name: "aixbt" } as never });
    render(<LeaderboardTable agents={[AGENTS[0]!]} />);
    fireEvent.click(screen.getByText("aixbt"));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    expect(fetchReportMock).toHaveBeenCalledWith("aixbt");
  });

  it("drill-down: report missing (404) → shows the Scan-now toast", async () => {
    fetchReportMock.mockRejectedValue(
      new ApiError(404, { ok: false, error: "report_not_found" }),
    );
    render(<LeaderboardTable agents={[AGENTS[0]!]} />);
    fireEvent.click(screen.getByText("aixbt"));
    await waitFor(() =>
      expect(screen.getByText("Full report not available")).toBeInTheDocument(),
    );
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /Scan now/ })).toHaveAttribute(
      "href",
      "/scanner",
    );
  });
});
