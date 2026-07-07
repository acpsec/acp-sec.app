import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ControlsGrid } from "@/components/dashboard/ControlsGrid";
import type { ScanControl } from "@/lib/api/types";

function ctrl(id: string): ScanControl {
  return {
    ctrl: id,
    name: `Control ${id}`,
    dimension: "AUTH",
    dimension_name: "Authentication",
    max: 3,
    score: 2,
    severity: "HIGH",
    status: "warn",
  };
}

describe("ControlsGrid", () => {
  it("renders the section title with the control count + expand hint", () => {
    render(<ControlsGrid controls={[ctrl("AUTH-01"), ctrl("AUTH-02")]} />);
    expect(screen.getByText("Security Controls")).toBeInTheDocument();
    expect(screen.getByText(/2.*Click any card to expand/)).toBeInTheDocument();
  });

  it("renders a card per control", () => {
    render(
      <ControlsGrid controls={[ctrl("AUTH-01"), ctrl("CTX-03"), ctrl("GOV-02")]} />,
    );
    expect(screen.getByText("AUTH-01")).toBeInTheDocument();
    expect(screen.getByText("CTX-03")).toBeInTheDocument();
    expect(screen.getByText("GOV-02")).toBeInTheDocument();
    // Each card header is a toggle button.
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("renders nothing meaningful for an empty controls list", () => {
    const { container } = render(<ControlsGrid controls={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain("Security Controls");
  });
});
