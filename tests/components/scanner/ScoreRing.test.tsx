import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  RING_CIRC,
  ScoreRing,
  ringDashoffset,
} from "@/components/scanner/ScoreRing";

describe("ringDashoffset", () => {
  it("is full circumference at 0, half at 50, zero at 100", () => {
    expect(ringDashoffset(0)).toBeCloseTo(RING_CIRC, 2);
    expect(ringDashoffset(50)).toBeCloseTo(RING_CIRC / 2, 2);
    expect(ringDashoffset(100)).toBeCloseTo(0, 2);
  });

  it("clamps out-of-range scores", () => {
    expect(ringDashoffset(-10)).toBeCloseTo(RING_CIRC, 2);
    expect(ringDashoffset(150)).toBeCloseTo(0, 2);
  });
});

describe("ScoreRing", () => {
  it("renders the rounded score", () => {
    render(<ScoreRing score={82} />);
    expect(screen.getByText("82")).toBeInTheDocument();
  });

  it("colours the progress arc via the canonical tier (82 → SECURE/success)", () => {
    render(<ScoreRing score={82} />);
    expect(screen.getByTestId("ring-progress").getAttribute("class")).toContain(
      "text-success",
    );
  });

  it("uses the danger tier colour for a low score (5 → COMPROMISED)", () => {
    render(<ScoreRing score={5} />);
    expect(screen.getByTestId("ring-progress").getAttribute("class")).toContain(
      "text-danger",
    );
  });
});
