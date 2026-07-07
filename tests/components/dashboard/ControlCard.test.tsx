import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ControlCard } from "@/components/dashboard/ControlCard";
import type { ScanControl } from "@/lib/api/types";

const CTRL: ScanControl = {
  ctrl: "AUTH-01",
  name: "Agent identity declared",
  dimension: "AUTH",
  dimension_name: "Authentication & Identity",
  max: 3,
  score: 2,
  severity: "HIGH",
  status: "warn",
  finding: "Identity partially declared.",
  evidence: ["agent_name='X'", "no signature"],
  recommendations: ["Add a signature scheme."],
};

describe("ControlCard", () => {
  it("renders the header: id, name, score/max, severity", () => {
    render(<ControlCard control={CTRL} />);
    expect(screen.getByText("AUTH-01")).toBeInTheDocument();
    expect(screen.getByText("Agent identity declared")).toBeInTheDocument();
    expect(screen.getByText("2/3")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
  });

  it("keeps the body (finding, evidence, recommendations) collapsed until clicked", () => {
    render(<ControlCard control={CTRL} />);
    expect(screen.queryByText("Add a signature scheme.")).not.toBeInTheDocument();
    expect(screen.queryByText("Identity partially declared.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByText("Identity partially declared.")).toBeInTheDocument();
    expect(screen.getByText("Add a signature scheme.")).toBeInTheDocument();
    expect(screen.getByText("agent_name='X'")).toBeInTheDocument();
  });

  it("collapses again on a second click (aria-expanded reflects state)", () => {
    render(<ControlCard control={CTRL} />);
    const toggle = screen.getByRole("button");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Add a signature scheme.")).not.toBeInTheDocument();
  });

  it("handles a control with no evidence/recommendations without crashing", () => {
    const bare: ScanControl = {
      ctrl: "GOV-02",
      name: "Bare control",
      dimension: "GOV",
      dimension_name: "Governance",
      max: 5,
      score: 5,
      severity: "LOW",
      status: "pass",
    };
    render(<ControlCard control={bare} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Bare control")).toBeInTheDocument();
  });
});
