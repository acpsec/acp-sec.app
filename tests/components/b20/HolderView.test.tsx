import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HolderView } from "@/components/b20/HolderView";
import type { B20ScanResult } from "@/lib/api/types";
import { b20ScanResultFixture } from "../../fixtures/b20";

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
});
