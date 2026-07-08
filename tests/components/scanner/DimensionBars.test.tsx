import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DimensionBars } from "@/components/scanner/DimensionBars";
import type { ScanControl } from "@/lib/api/types";

const ctrl = (over: Partial<ScanControl>): ScanControl => ({
  ctrl: "AUTH-01",
  name: "Identity declared",
  dimension: "AUTH",
  dimension_name: "Authentication",
  max: 2,
  score: 2,
  severity: "HIGH",
  status: "pass",
  ...over,
});

const CONTROLS: ScanControl[] = [
  ctrl({ ctrl: "AUTH-01", dimension: "AUTH", score: 3, max: 4 }),
  ctrl({ ctrl: "AUTH-02", dimension: "AUTH", score: 0, max: 0 }),
  ctrl({
    ctrl: "INJ-01",
    dimension: "INJ",
    dimension_name: "Injection",
    score: 0,
    max: 2,
    status: "fail",
  }),
];

describe("DimensionBars", () => {
  it("renders one bar per dimension with aggregate score/max", () => {
    render(<DimensionBars controls={CONTROLS} />);
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Injection")).toBeInTheDocument();
    expect(screen.getByText("3.0 / 4")).toBeInTheDocument(); // AUTH aggregate
    expect(screen.getByText("0.0 / 2")).toBeInTheDocument(); // INJ aggregate
  });

  it("colours a passing dimension green and a zero one red", () => {
    render(<DimensionBars controls={CONTROLS} />);
    expect(screen.getByTestId("dimbar-AUTH").getAttribute("class")).toContain(
      "bg-success",
    );
    expect(screen.getByTestId("dimbar-INJ").getAttribute("class")).toContain(
      "bg-danger",
    );
  });

  it("renders nothing for empty controls", () => {
    const { container } = render(<DimensionBars controls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
