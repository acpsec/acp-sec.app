import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DimensionsRadar } from "@/components/scanner/DimensionsRadar";
import type { ScanControl } from "@/lib/api/types";

// chart.js needs a real canvas; stub the Radar like the dashboard tests do.
vi.mock("react-chartjs-2", () => ({
  Radar: (props: { data: { labels: string[]; datasets: unknown[] } }) => (
    <div data-testid="radar" data-labels={props.data.labels.join(",")} />
  ),
}));

const CONTROLS: ScanControl[] = [
  {
    ctrl: "AUTH-01",
    name: "a",
    dimension: "AUTH",
    dimension_name: "Authentication",
    max: 4,
    score: 2,
    severity: "HIGH",
    status: "warn",
  },
  {
    ctrl: "INJ-01",
    name: "b",
    dimension: "INJ",
    dimension_name: "Injection",
    max: 2,
    score: 2,
    severity: "CRITICAL",
    status: "pass",
  },
];

describe("DimensionsRadar", () => {
  it("renders a radar labelled by dimension keys", () => {
    render(<DimensionsRadar controls={CONTROLS} />);
    const radar = screen.getByTestId("radar");
    expect(radar).toBeInTheDocument();
    expect(radar.getAttribute("data-labels")).toBe("AUTH,INJ");
  });

  it("renders nothing for empty controls", () => {
    const { container } = render(<DimensionsRadar controls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
