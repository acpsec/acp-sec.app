import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DimensionBreakdown } from "@/components/b20/DimensionBreakdown";
import type { B20ScanResult } from "@/lib/api/types";
import { b20ScanResultFixture } from "../../fixtures/b20";

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
});
