import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import type { LeaderboardResponse } from "@/lib/api/types";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import LeaderboardPage from "@/app/leaderboard/page";

vi.mock("@/lib/hooks/useLeaderboard", () => ({ useLeaderboard: vi.fn() }));
const useLeaderboardMock = vi.mocked(useLeaderboard);

// Stub the table so page-state tests stay focused (table has its own suite).
vi.mock("@/components/leaderboard/LeaderboardTable", () => ({
  LeaderboardTable: ({ agents }: { agents: unknown[] }) => (
    <div data-testid="table">{agents.length} rows</div>
  ),
}));

type HookState = Partial<ReturnType<typeof useLeaderboard>>;
function mockHook(state: HookState) {
  useLeaderboardMock.mockReturnValue(state as ReturnType<typeof useLeaderboard>);
}

const RESP: LeaderboardResponse = {
  ok: true,
  updated: "2026-06-01",
  checks_per_scan: 38,
  count: 2,
  agents: [
    { id: "a", name: "A", score: 80, previous_score: 80, tier: null, rank: 1, movement: "same", movement_delta: 0 },
    { id: "b", name: "B", score: 50, previous_score: 50, tier: null, rank: 2, movement: "same", movement_delta: 0 },
  ],
};

beforeEach(() => useLeaderboardMock.mockReset());

describe("Leaderboard page", () => {
  it("renders the loading state", () => {
    mockHook({ isLoading: true, isError: false, data: undefined });
    render(<LeaderboardPage />);
    expect(screen.getByText("Loading leaderboard…")).toBeInTheDocument();
  });

  it("renders the table on success (with agent count in stats)", () => {
    mockHook({ isLoading: false, isError: false, data: RESP });
    render(<LeaderboardPage />);
    expect(screen.getByTestId("table")).toHaveTextContent("2 rows");
    expect(screen.getByText("Agent Security")).toBeInTheDocument();
  });

  it("renders a friendly error message", () => {
    mockHook({
      isLoading: false,
      isError: true,
      error: new ApiError(500, { ok: false, error: "boom" }),
      data: undefined,
    });
    render(<LeaderboardPage />);
    expect(screen.getByText(/Could not load leaderboard/)).toBeInTheDocument();
  });

  it("renders the empty state when count is 0", () => {
    mockHook({
      isLoading: false,
      isError: false,
      data: { ...RESP, count: 0, agents: [] },
    });
    render(<LeaderboardPage />);
    expect(
      screen.getByText("No agents on the leaderboard yet."),
    ).toBeInTheDocument();
  });
});
