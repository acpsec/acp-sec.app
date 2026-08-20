import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HolderView } from "@/components/b20/HolderView";
import type { B20ScanResult } from "@/lib/api/types";
import {
  b20ScanResultFixture,
  b20WithEvidenceFixture,
} from "../../fixtures/b20";

describe("HolderView", () => {
  it("shows the trust score and grade", () => {
    render(<HolderView result={b20ScanResultFixture} />);
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByLabelText("Grade B")).toBeInTheDocument();
  });

  it("renders one power badge per issuer power, reflecting each value", () => {
    render(<HolderView result={b20ScanResultFixture} />);
    expect(screen.getByLabelText("Cannot freeze")).toBeInTheDocument(); // false
    expect(screen.getByLabelText("Can pause transfers")).toBeInTheDocument(); // true
    expect(screen.getByLabelText("Supply is capped")).toBeInTheDocument(); // false
    expect(screen.getByLabelText("Seize: unknown")).toBeInTheDocument(); // null
  });

  it("hides the critical treatment for a non-critical, rated token", () => {
    render(<HolderView result={b20ScanResultFixture} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/Unrated/)).not.toBeInTheDocument();
  });

  it("shows the CRITICAL badge and reasons when critical", () => {
    const result: B20ScanResult = {
      ...b20ScanResultFixture,
      is_critical: true,
      critical_reasons: ["Issuer can seize funds unconditionally."],
    };
    render(<HolderView result={result} />);
    expect(screen.getByRole("status")).toHaveTextContent("CRITICAL");
    expect(
      screen.getByText("Issuer can seize funds unconditionally."),
    ).toBeInTheDocument();
  });

  it("shows the unrated notice with the multiplier when not fully rated", () => {
    const result: B20ScanResult = {
      ...b20ScanResultFixture,
      rated: false,
      multiplier: 0.5,
    };
    render(<HolderView result={result} />);
    expect(screen.getByText(/Unrated/)).toHaveTextContent("×0.5");
  });

  // ── Feature 3: role holder chips ─────────────────────────────────────────

  it("renders role chips section when evidence.roles is non-empty", () => {
    render(<HolderView result={b20WithEvidenceFixture} />);
    expect(screen.getByTestId("role-chips")).toBeInTheDocument();
  });

  it("renders no role chips section when evidence is absent", () => {
    // b20ScanResultFixture has no evidence field
    render(<HolderView result={b20ScanResultFixture} />);
    expect(screen.queryByTestId("role-chips")).not.toBeInTheDocument();
  });

  // ── Feature 4: state evidence annotation ─────────────────────────────────

  it("shows a block anchor for supply_cap when evidence.state.supply_cap exists", () => {
    render(<HolderView result={b20WithEvidenceFixture} />);
    // The with-evidence fixture has supply_cap state evidence at block 50212270
    const anchors = screen.getAllByText(/block 50212270/i);
    expect(anchors.length).toBeGreaterThan(0);
  });

  it("renders no block anchors when evidence is absent", () => {
    render(<HolderView result={b20ScanResultFixture} />);
    expect(screen.queryByText(/block \d+/i)).not.toBeInTheDocument();
  });
});
