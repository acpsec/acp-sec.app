import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChecksList } from "@/components/scanner/ChecksList";
import type { ScanControl } from "@/lib/api/types";

const CONTROLS: ScanControl[] = [
  {
    ctrl: "AUTH-01",
    name: "Agent identity declared",
    dimension: "AUTH",
    dimension_name: "Authentication",
    max: 2,
    score: 2,
    severity: "HIGH",
    status: "pass",
    finding: "Identity present",
    recommendations: ["Keep it up", "Rotate keys", "Extra", "Dropped"],
  },
  {
    ctrl: "INJ-01",
    name: "Prompt injection defense",
    dimension: "INJ",
    dimension_name: "Injection",
    max: 3,
    score: 0,
    severity: "CRITICAL",
    status: "fail",
    finding: "No defense found",
  },
];

describe("ChecksList", () => {
  it("renders a group per dimension and each check", () => {
    render(<ChecksList controls={CONTROLS} />);
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Agent identity declared")).toBeInTheDocument();
    expect(screen.getByText("Prompt injection defense")).toBeInTheDocument();
  });

  it("shows the check status badge", () => {
    render(<ChecksList controls={CONTROLS} />);
    expect(screen.getByText("PASS")).toBeInTheDocument();
    expect(screen.getByText("FAIL")).toBeInTheDocument();
  });

  it("caps recommendations at 3", () => {
    render(<ChecksList controls={CONTROLS} />);
    expect(screen.getByText("→ Keep it up")).toBeInTheDocument();
    expect(screen.getByText("→ Extra")).toBeInTheDocument();
    expect(screen.queryByText("→ Dropped")).not.toBeInTheDocument();
  });

  it("renders nothing for empty controls", () => {
    const { container } = render(<ChecksList controls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
