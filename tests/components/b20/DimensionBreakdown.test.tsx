import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DimensionBreakdown } from "@/components/b20/DimensionBreakdown";
import type { B20ScanResult } from "@/lib/api/types";
import {
  b20NoEvidenceFixture,
  b20ScanResultFixture,
} from "../../fixtures/b20";

async function expand() {
  const user = userEvent.setup();
  render(<DimensionBreakdown result={b20ScanResultFixture} />);
  await user.click(screen.getByRole("button", { name: /Dimension Breakdown/ }));
}

describe("DimensionBreakdown", () => {
  it("is collapsed by default", () => {
    render(<DimensionBreakdown result={b20ScanResultFixture} />);
    expect(screen.queryByTestId("layer-2")).not.toBeInTheDocument();
  });

  it("renders every dimension with its human label", async () => {
    await expand();
    for (const label of [
      "Issuer Authority",
      "Supply Integrity",
      "Transfer Policy Risk",
      "Variant & Config",
      "Origin & Transparency",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows each dimension's weight (fraction → %) and score", async () => {
    await expand();
    const panel = screen.getByTestId("layer-2").textContent ?? "";
    expect(panel).toContain("weight 30%"); // issuer_authority 0.30
    expect(panel).toContain("weight 10%"); // origin_transparency 0.10
    expect(panel).toContain("60/100"); // issuer_authority score
  });

  it("exposes each score bar as an accessible progressbar", async () => {
    await expand();
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(5);
    expect(bars[0]).toHaveAttribute("aria-valuenow", "60");
  });

  it("renders findings (with severity badge) and shows nothing for empty ones", async () => {
    await expand();
    // 4 findings across the fixture (1 + 0 + 1 + 0 + 2); empty dims add none.
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(
      screen.getByText("Issuer can freeze holder balances."),
    ).toBeInTheDocument();
    expect(screen.getByText("CRITICAL").getAttribute("class")).toContain(
      "text-danger",
    );
  });

  it("tags an unrated dimension", async () => {
    const user = userEvent.setup();
    const result: B20ScanResult = {
      ...b20ScanResultFixture,
      unrated_dimensions: ["origin_transparency"],
    };
    render(<DimensionBreakdown result={result} />);
    await user.click(
      screen.getByRole("button", { name: /Dimension Breakdown/ }),
    );
    expect(screen.getByText("unrated")).toBeInTheDocument();
  });

  // ── Feature 1: unrated score display ─────────────────────────────────────

  it("shows — instead of score/100 for an unrated dimension", async () => {
    const user = userEvent.setup();
    const result: B20ScanResult = {
      ...b20ScanResultFixture,
      unrated_dimensions: ["issuer_authority"],
    };
    render(<DimensionBreakdown result={result} />);
    await user.click(screen.getByRole("button", { name: /Dimension Breakdown/ }));
    // unrated issuer_authority (score 60) must not show its score
    expect(screen.queryByText("60/100")).not.toBeInTheDocument();
    // the dash placeholder appears exactly once
    expect(screen.getAllByText("—")).toHaveLength(1);
    // rated dimensions still show their scores
    expect(screen.getByText("85/100")).toBeInTheDocument();
  });

  it("keeps score/100 visible for all rated dimensions", async () => {
    await expand();
    // Fixture has all dims rated — every score label is present
    const panel = screen.getByTestId("layer-2").textContent ?? "";
    expect(panel).toContain("60/100");
    expect(panel).toContain("85/100");
    expect(panel).not.toContain("—");
  });

  // ── Feature 2: read_diagnostics ──────────────────────────────────────────

  it("renders read_diagnostics text beneath an unrated dimension", async () => {
    const user = userEvent.setup();
    render(<DimensionBreakdown result={b20NoEvidenceFixture} />);
    await user.click(screen.getByRole("button", { name: /Dimension Breakdown/ }));
    // The no-evidence fixture has the same diagnostic for issuer_authority + transfer_policy
    const items = screen.getAllByText(/role holders not determinable from logs/i);
    expect(items.length).toBeGreaterThan(0);
  });

  it("renders no diagnostic text when read_diagnostics is absent", async () => {
    await expand();
    // b20ScanResultFixture has no read_diagnostics field
    expect(screen.queryByText(/not determinable/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/getLogs/i)).not.toBeInTheDocument();
  });
});
