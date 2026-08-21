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

const INFERRED_CONTROL: ScanControl = {
  ctrl: "GOV-01",
  name: "Governance policy",
  dimension: "GOV",
  dimension_name: "Governance",
  max: 3,
  score: 0,
  severity: "HIGH",
  status: "warn",
  finding: "Inferred from page content",
  inferred: true,
};

const UNRATED_CONTROL: ScanControl = {
  ctrl: "PUB-01",
  name: "Public disclosure",
  dimension: "PUB",
  dimension_name: "Public",
  max: 2,
  score: 0,
  severity: "MEDIUM",
  status: "unrated",
  finding: "no website provided — technical security signals unavailable",
  inferred: false,
};

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

  // --- Inferred badge tests (RED) -----------------------------------------

  it("shows an 'inferred' badge when a control has inferred:true", () => {
    render(<ChecksList controls={[INFERRED_CONTROL]} />);
    expect(screen.getByText("inferred")).toBeInTheDocument();
  });

  it("inferred badge carries the explanatory tooltip", () => {
    render(<ChecksList controls={[INFERRED_CONTROL]} />);
    const badge = screen.getByText("inferred");
    expect(badge).toHaveAttribute(
      "title",
      "no direct evidence found — estimated from limited signals",
    );
  });

  it("does not show an inferred badge when inferred is false", () => {
    render(<ChecksList controls={CONTROLS} />);
    expect(screen.queryByText("inferred")).not.toBeInTheDocument();
  });

  it("does not show an inferred badge when inferred is absent", () => {
    const ctrl: ScanControl = { ...CONTROLS[0] };
    delete ctrl.inferred;
    render(<ChecksList controls={[ctrl]} />);
    expect(screen.queryByText("inferred")).not.toBeInTheDocument();
  });

  // --- Unrated status style test (RED) ------------------------------------

  it("shows UNRATED status badge for a control with status='unrated'", () => {
    render(<ChecksList controls={[UNRATED_CONTROL]} />);
    expect(screen.getByText("UNRATED")).toBeInTheDocument();
  });
});
