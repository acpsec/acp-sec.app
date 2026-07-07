import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScoreChart } from "@/components/dashboard/ScoreChart";
import type { ScanControl } from "@/lib/api/types";

// chart.js can't render to a real canvas in jsdom — stub the Radar and assert
// the derived data (labels + per-control %), per the task's "don't deep-test
// chart.js, verify data prep" guidance.
vi.mock("react-chartjs-2", () => ({
  Radar: ({ data }: { data: { labels: string[]; datasets: { data: number[] }[] } }) => (
    <div
      data-testid="radar"
      data-labels={JSON.stringify(data.labels)}
      data-values={JSON.stringify(data.datasets[0]?.data)}
    />
  ),
}));

function ctrl(id: string, score: number, max: number): ScanControl {
  return {
    ctrl: id,
    name: id,
    dimension: "AUTH",
    dimension_name: "Auth",
    max,
    score,
    severity: "HIGH",
    status: "warn",
  };
}

describe("ScoreChart", () => {
  it("renders nothing when there are no controls", () => {
    render(<ScoreChart controls={[]} />);
    expect(screen.queryByTestId("radar")).not.toBeInTheDocument();
  });

  it("renders a radar with per-control labels + score percentages", () => {
    render(<ScoreChart controls={[ctrl("AUTH-01", 2, 4), ctrl("CTX-03", 3, 3)]} />);
    const radar = screen.getByTestId("radar");
    expect(JSON.parse(radar.getAttribute("data-labels")!)).toEqual([
      "AUTH-01",
      "CTX-03",
    ]);
    // 2/4 -> 50, 3/3 -> 100
    expect(JSON.parse(radar.getAttribute("data-values")!)).toEqual([50, 100]);
  });

  it("treats max=0 as 0% (no divide-by-zero)", () => {
    render(<ScoreChart controls={[ctrl("X", 0, 0)]} />);
    expect(JSON.parse(screen.getByTestId("radar").getAttribute("data-values")!)).toEqual([0]);
  });
});
