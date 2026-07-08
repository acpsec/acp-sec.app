import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import ScannerPage from "@/app/scanner/page";
import { useScannerStore } from "@/lib/stores/scannerStore";

beforeEach(() => useScannerStore.getState().reset());

describe("ScannerPage (6.2a foundation)", () => {
  it("renders the hero + shell", () => {
    render(<ScannerPage />);
    expect(
      screen.getByRole("heading", { name: /Agent Scanner/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("X Username")).toBeInTheDocument();
  });

  it("renders the URL-normalisation control (root default)", () => {
    render(<ScannerPage />);
    expect(screen.getByRole("radio", { name: /Root domain/ })).toBeChecked();
  });

  it("shows the empty-results placeholder before any scan", () => {
    render(<ScannerPage />);
    expect(
      screen.getByText("Enter a handle and scan to see results."),
    ).toBeInTheDocument();
  });

  it("does NOT read a handoff on mount (scanner is producer-only)", () => {
    // Even with a handoff present in localStorage, the scanner must not
    // consume it — that contract belongs to the dashboard.
    localStorage.setItem(
      "acpsec_last_scan",
      JSON.stringify({ agent_name: "X", controls: [] }),
    );
    localStorage.setItem("acpsec_last_scan_time", String(Date.now()));
    render(<ScannerPage />);
    expect(useScannerStore.getState().scanResult).toBeNull();
    expect(
      screen.getByText("Enter a handle and scan to see results."),
    ).toBeInTheDocument();
    localStorage.clear();
  });
});
