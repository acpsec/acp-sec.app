import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import ScannerPage from "@/app/scanner/page";
import { useScannerStore } from "@/lib/stores/scannerStore";

beforeEach(() => {
  useScannerStore.getState().reset();
  localStorage.clear();
});

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ScannerPage />
    </QueryClientProvider>,
  );
}

describe("ScannerPage", () => {
  it("renders the hero + step-1 lookup", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /Agent Scanner/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("X Username")).toBeInTheDocument();
  });

  it("starts on step 1 (no confirm/results yet)", () => {
    renderPage();
    expect(useScannerStore.getState().step).toBe(1);
    expect(
      screen.queryByText("✅ Confirm Agent Details"),
    ).not.toBeInTheDocument();
  });

  // Producer-only regression guard (6.2a): the scanner must NEVER consume a
  // handoff, even when one is present in localStorage — that contract belongs
  // to the dashboard.
  it("does NOT read a handoff on mount (scanner is producer-only)", () => {
    localStorage.setItem(
      "acpsec_last_scan",
      JSON.stringify({ agent_name: "X", controls: [] }),
    );
    localStorage.setItem("acpsec_last_scan_time", String(Date.now()));
    renderPage();
    expect(useScannerStore.getState().scanResult).toBeNull();
    expect(useScannerStore.getState().step).toBe(1);
    expect(screen.getByLabelText("X Username")).toBeInTheDocument();
  });
});
