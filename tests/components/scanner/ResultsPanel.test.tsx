import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import type { ReportData } from "@/lib/api/types";

vi.mock("react-chartjs-2", () => ({ Radar: () => <div data-testid="radar" /> }));

const DATA = (over: Partial<ReportData> = {}): ReportData => ({
  agent_name: "aixbt",
  band: "SECURE",
  verdict: "Production ready",
  final_score: 82,
  score_pct: 82,
  critical_fails: 1,
  sec_header_count: 4,
  security_headers: { "content-security-policy": "default-src 'self'" },
  controls: [
    {
      ctrl: "AUTH-01",
      name: "Identity",
      dimension: "AUTH",
      dimension_name: "Authentication",
      max: 2,
      score: 2,
      severity: "HIGH",
      status: "pass",
    },
  ],
  x_username: "aixbt_agent",
  x_handle_verified: true,
  ...over,
});

function renderPanel(over: Partial<ReportData> = {}) {
  const onScanAnother = vi.fn();
  const onOpenDashboard = vi.fn();
  const onExport = vi.fn();
  render(
    <ResultsPanel
      result={DATA(over)}
      onScanAnother={onScanAnother}
      onOpenDashboard={onOpenDashboard}
      onExport={onExport}
    />,
  );
  return { onScanAnother, onOpenDashboard, onExport };
}

describe("ResultsPanel", () => {
  it("renders the score hero, band and verified handle", () => {
    renderPanel();
    // "82" appears in both the ring and the Final Score metric.
    expect(screen.getAllByText("82").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("SECURE")).toBeInTheDocument();
    expect(screen.getByText("@aixbt_agent")).toBeInTheDocument();
    expect(screen.getByText("Production ready")).toBeInTheDocument();
  });

  it("renders the metrics strip", () => {
    renderPanel();
    expect(screen.getByText("Final Score")).toBeInTheDocument();
    expect(screen.getByText("4/9")).toBeInTheDocument(); // security headers
    expect(screen.getByText("Checks Run")).toBeInTheDocument();
  });

  it("shows the ACP Registered badge only when acp_registered is true", () => {
    const { unmount } = render(
      <ResultsPanel
        result={DATA({ acp_registered: true })}
        onScanAnother={vi.fn()}
        onOpenDashboard={vi.fn()}
        onExport={vi.fn()}
      />,
    );
    expect(screen.getByText("ACP Registered")).toBeInTheDocument();
    unmount();

    renderPanel({ acp_registered: false });
    expect(screen.queryByText("ACP Registered")).not.toBeInTheDocument();
  });

  it("hides the verified handle when x_handle_verified is false", () => {
    renderPanel({ x_handle_verified: false });
    expect(screen.queryByText("@aixbt_agent")).not.toBeInTheDocument();
  });

  it("wires the three action buttons", () => {
    const { onScanAnother, onOpenDashboard, onExport } = renderPanel();
    fireEvent.click(
      screen.getByRole("button", { name: "🔍 Scan another agent" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "📊 Open in Dashboard →" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "📥 Export JSON" }));
    expect(onScanAnother).toHaveBeenCalledOnce();
    expect(onOpenDashboard).toHaveBeenCalledOnce();
    expect(onExport).toHaveBeenCalledOnce();
  });
});
