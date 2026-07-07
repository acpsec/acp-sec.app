import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardView } from "@/components/dashboard/DashboardView";
import type { ScoreData } from "@/lib/api/types";
import { readHandoff } from "@/lib/handoff";
import { useScore } from "@/lib/hooks/useScore";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

vi.mock("@/lib/hooks/useScore", () => ({ useScore: vi.fn() }));
vi.mock("@/lib/hooks/useControls", () => ({ useControls: vi.fn(() => ({})) }));
vi.mock("@/lib/handoff", () => ({ readHandoff: vi.fn(() => null) }));
// Dashboard now mounts LoadReportDropzone (useCreateScore → needs a QueryClient)
// and ScoreChart (chart.js → no real canvas in jsdom). Stub both.
vi.mock("@/lib/hooks/useScoreMutation", () => ({
  useCreateScore: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("react-chartjs-2", () => ({ Radar: () => <div data-testid="radar" /> }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...p }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...p}>
      {children}
    </a>
  ),
}));

const useScoreMock = vi.mocked(useScore);
const readHandoffMock = vi.mocked(readHandoff);

function mockScore(state: Partial<ReturnType<typeof useScore>>) {
  useScoreMock.mockReturnValue(state as ReturnType<typeof useScore>);
}

const score = (agent_name: string, pct: number): ScoreData => ({
  agent_name,
  band: "SECURE",
  verdict: "",
  final_score: pct,
  score_pct: pct,
  controls: [],
});

beforeEach(() => {
  useDashboardStore.getState().reset();
  useScoreMock.mockReset();
  readHandoffMock.mockReset();
  readHandoffMock.mockReturnValue(null);
});

describe("DashboardView", () => {
  it("renders the header + empty state when there is no score", () => {
    mockScore({ isLoading: false, isError: false, data: { ok: false, data: null } });
    render(<DashboardView />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "📁 Load Report" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No agent scanned yet")).toBeInTheDocument();
  });

  it("renders the loading state", () => {
    mockScore({ isLoading: true, isError: false, data: undefined });
    render(<DashboardView />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders the error state", () => {
    mockScore({
      isLoading: false,
      isError: true,
      error: new Error("boom"),
      data: undefined,
    });
    render(<DashboardView />);
    expect(screen.getByText(/Could not load score/)).toBeInTheDocument();
  });

  it("session: the server score populates the store", async () => {
    mockScore({
      isLoading: false,
      isError: false,
      data: { ok: true, data: score("aixbt", 82) },
    });
    render(<DashboardView />);
    await waitFor(() => expect(screen.getByText("aixbt")).toBeInTheDocument());
    expect(screen.getByText("Session")).toBeInTheDocument();
    expect(useDashboardStore.getState().source).toBe("session");
  });

  it("renders the ControlsGrid breakdown when the loaded score has controls", async () => {
    const data = score("aixbt", 82);
    data.controls = [
      {
        ctrl: "AUTH-01",
        name: "Agent identity declared",
        dimension: "AUTH",
        dimension_name: "Authentication",
        max: 3,
        score: 2,
        severity: "HIGH",
        status: "warn",
      },
    ];
    mockScore({ isLoading: false, isError: false, data: { ok: true, data } });
    render(<DashboardView />);
    await waitFor(() =>
      expect(screen.getByText("Security Controls")).toBeInTheDocument(),
    );
    expect(screen.getByText("AUTH-01")).toBeInTheDocument();
  });

  it("handoff: a fresh handoff WINS over the server session score", async () => {
    readHandoffMock.mockReturnValue({
      data: score("FromLeaderboard", 55),
      ts: Date.now(),
    });
    mockScore({
      isLoading: false,
      isError: false,
      data: { ok: true, data: score("ServerScore", 82) },
    });
    render(<DashboardView />);
    // "FromLeaderboard" appears in both the cached banner and the agent name.
    await waitFor(() =>
      expect(screen.getAllByText("FromLeaderboard").length).toBeGreaterThan(0),
    );
    expect(screen.getByText("From Report")).toBeInTheDocument();
    expect(screen.queryByText("ServerScore")).not.toBeInTheDocument();
    expect(useDashboardStore.getState().source).toBe("handoff");
  });
});
