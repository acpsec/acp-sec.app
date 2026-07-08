import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScanResult } from "@/components/b20/ScanResult";
import { b20ScanResultFixture } from "../../fixtures/b20";

describe("ScanResult", () => {
  it("composes the three disclosure layers", () => {
    render(<ScanResult result={b20ScanResultFixture} />);
    // Layer 1 renders inline; Layers 2 + 3 render as collapsible toggles.
    expect(screen.getByTestId("layer-1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dimension Breakdown/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View Raw JSON/ }),
    ).toBeInTheDocument();
  });

  it("shows the score from the result", () => {
    render(<ScanResult result={b20ScanResultFixture} />);
    expect(screen.getByText("72")).toBeInTheDocument();
  });

  it("renders a provenance footer with the scanner version and timestamp", () => {
    render(<ScanResult result={b20ScanResultFixture} />);
    const footer = screen.getByTestId("b20-scan-footer");
    expect(footer).toHaveTextContent("0.1.0");
    expect(footer).toHaveTextContent("2026-07-08T00:00:00Z");
  });
});
