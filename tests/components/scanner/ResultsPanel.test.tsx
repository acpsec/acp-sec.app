import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import type { ReportData, ScanControl } from "@/lib/api/types";

vi.mock("react-chartjs-2", () => ({ Radar: () => <div data-testid="radar" /> }));

// @grok — CRITICAL, score ~25, low_evidence:true (2 out of 38 found direct evidence)
const GROK_CONTROLS: ScanControl[] = Array.from({ length: 38 }, (_, i) => ({
  ctrl: `CTRL-${String(i + 1).padStart(2, "0")}`,
  name: `Control ${i + 1}`,
  dimension: "AUTH",
  dimension_name: "Authentication",
  max: 3,
  score: i < 2 ? 3 : 0,   // 2 pass, 36 fail
  severity: "HIGH",
  status: i < 2 ? "pass" : "fail",
  inferred: true,
}));

// @ethy — CRITICAL, score ~24, low_evidence:true (1 out of 38 found direct evidence)
const ETHY_CONTROLS: ScanControl[] = Array.from({ length: 38 }, (_, i) => ({
  ctrl: `CTRL-${String(i + 1).padStart(2, "0")}`,
  name: `Control ${i + 1}`,
  dimension: "AUTH",
  dimension_name: "Authentication",
  max: 3,
  score: i < 1 ? 3 : 0,
  severity: "HIGH",
  status: i < 1 ? "pass" : "fail",
  inferred: true,
}));

const GROK_DATA: ReportData = {
  agent_name: "grok",
  band: "CRITICAL",
  verdict: "Multiple high-severity issues",
  final_score: 29.1,
  score_pct: 25,
  critical_fails: 4,
  sec_header_count: 0,
  security_headers: {},
  controls: GROK_CONTROLS,
  x_username: "grok",
  x_handle_verified: true,
  evidence_found_count: 2,
  evidence_coverage: 0.053,
  low_evidence: true,
};

const ETHY_DATA: ReportData = {
  agent_name: "ethy",
  band: "CRITICAL",
  verdict: "Multiple high-severity issues",
  final_score: 27.9,
  score_pct: 24,
  critical_fails: 5,
  sec_header_count: 0,
  security_headers: {},
  controls: ETHY_CONTROLS,
  x_username: "ethy",
  x_handle_verified: true,
  evidence_found_count: 1,
  evidence_coverage: 0.026,
  low_evidence: true,
};

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
  evidence_found_count: 1,
  evidence_coverage: 1.0,
  low_evidence: false,
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

function renderWith(data: ReportData) {
  render(
    <ResultsPanel
      result={data}
      onScanAnother={vi.fn()}
      onOpenDashboard={vi.fn()}
      onExport={vi.fn()}
    />,
  );
}

describe("ResultsPanel", () => {
  it("renders the score hero, band and verified handle", () => {
    renderPanel();
    expect(screen.getAllByText("82").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("SECURE")).toBeInTheDocument();
    expect(screen.getByText("@aixbt_agent")).toBeInTheDocument();
    expect(screen.getByText("Production ready")).toBeInTheDocument();
  });

  it("renders the metrics strip", () => {
    renderPanel();
    expect(screen.getByText("Final Score")).toBeInTheDocument();
    expect(screen.getByText("4/9")).toBeInTheDocument();
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

  // --- Coverage summary (RED) ---------------------------------------------

  it("shows coverage summary reading evidence_found_count from data — @grok", () => {
    renderWith(GROK_DATA);
    // 2 of 38 found direct evidence
    const summary = screen.getByTestId("coverage-summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent("2");
    expect(summary).toHaveTextContent("38");
  });

  it("shows coverage summary reading evidence_found_count from data — @ethy", () => {
    renderWith(ETHY_DATA);
    // 1 of 38 found direct evidence
    const summary = screen.getByTestId("coverage-summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent("1");
    expect(summary).toHaveTextContent("38");
  });

  it("coverage summary shows 'found direct evidence' language", () => {
    renderWith(GROK_DATA);
    const summary = screen.getByTestId("coverage-summary");
    expect(summary).toHaveTextContent(/found direct evidence/i);
  });

  // --- Low-evidence banner (RED) ------------------------------------------

  it("shows low-evidence banner when d.low_evidence is true — @grok", () => {
    renderWith(GROK_DATA);
    const banner = screen.getByTestId("low-evidence-banner");
    expect(banner).toBeInTheDocument();
  });

  it("shows low-evidence banner when d.low_evidence is true — @ethy", () => {
    renderWith(ETHY_DATA);
    expect(screen.getByTestId("low-evidence-banner")).toBeInTheDocument();
  });

  it("banner explains CRITICAL here often means 'not enough to assess'", () => {
    renderWith(GROK_DATA);
    const banner = screen.getByTestId("low-evidence-banner");
    expect(banner).toHaveTextContent(/not enough to assess/i);
  });

  it("banner suggests trying an API or documentation URL", () => {
    renderWith(GROK_DATA);
    const banner = screen.getByTestId("low-evidence-banner");
    expect(banner).toHaveTextContent(/API.*documentation|documentation.*URL/i);
  });

  it("does not show low-evidence banner when d.low_evidence is false", () => {
    renderPanel({ low_evidence: false });
    expect(screen.queryByTestId("low-evidence-banner")).not.toBeInTheDocument();
  });

  it("does not show low-evidence banner when low_evidence is absent", () => {
    renderPanel();  // DATA default has low_evidence: false
    expect(screen.queryByTestId("low-evidence-banner")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Fetch-failed render path
// When the backend cannot fetch the agent's website it returns rated:false /
// fetch_status:"failed" / final_score:null. The UI must NOT show COMPROMISED
// band or a 0 score — it must show a neutral "UNRATED" treatment.
// ---------------------------------------------------------------------------

const UNRATED_CONTROLS = Array.from({ length: 5 }, (_, i) => ({
  ctrl: `CTRL-${String(i + 1).padStart(2, "0")}`,
  name: `Control ${i + 1}`,
  dimension: "AUTH",
  dimension_name: "Authentication",
  max: 3,
  score: 0,
  severity: "HIGH",
  status: "unrated",
}));

const FAILED = (): ReportData => ({
  agent_name: "broken-agent",
  band: "COMPROMISED",
  verdict:
    "Fetch failed — Connection refused: timed out. Technical controls are unrated.",
  final_score: null,
  rated: false,
  fetch_status: "failed",
  critical_fails: 0,
  sec_header_count: 0,
  security_headers: {},
  controls: UNRATED_CONTROLS,
});

function renderFailed(data: ReportData = FAILED()) {
  render(
    <ResultsPanel
      result={data}
      onScanAnother={vi.fn()}
      onOpenDashboard={vi.fn()}
      onExport={vi.fn()}
    />,
  );
}

describe("fetch-failed render path", () => {
  it("renders fetch-failed-notice element instead of score ring", () => {
    renderFailed();
    expect(screen.getByTestId("fetch-failed-notice")).toBeInTheDocument();
  });

  it("does not render score ring — no '/ 100' text", () => {
    renderFailed();
    expect(screen.queryByText("/ 100")).not.toBeInTheDocument();
  });

  it("does not show COMPROMISED band even when backend sends it", () => {
    renderFailed();
    expect(screen.queryByText("COMPROMISED")).not.toBeInTheDocument();
  });

  it("shows UNRATED band badge instead of the real band", () => {
    renderFailed();
    // "UNRATED" appears in the band badge (and in control status chips for each
    // unrated control). getAllByText confirms at least one UNRATED is present.
    expect(screen.getAllByText("UNRATED").length).toBeGreaterThanOrEqual(1);
  });

  it("shows the fetch diagnostic text from verdict", () => {
    renderFailed();
    expect(
      screen.getByText(/Connection refused: timed out/),
    ).toBeInTheDocument();
  });

  it("shows '—' for Final Score in the metrics strip, not 0", () => {
    renderFailed();
    // parentElement is the outer metric tile div (value + label); closest("div")
    // would stop at the inner label div, which only contains "Final Score".
    const tile = screen.getByText("Final Score").parentElement;
    expect(tile).toHaveTextContent("—");
    expect(tile).not.toHaveTextContent("0");
  });

  it("fires on rated:false signal alone — even with a numeric score", () => {
    renderFailed(DATA({ rated: false }));
    expect(screen.getByTestId("fetch-failed-notice")).toBeInTheDocument();
  });

  it("fires on fetch_status:failed signal alone — even with a numeric score", () => {
    renderFailed(DATA({ fetch_status: "failed" }));
    expect(screen.getByTestId("fetch-failed-notice")).toBeInTheDocument();
  });

  it("fires on null final_score signal alone", () => {
    renderFailed({ ...DATA(), final_score: null });
    expect(screen.getByTestId("fetch-failed-notice")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Normal response guard — fetch-failed path must NOT fire on old backend shape
// ---------------------------------------------------------------------------

describe("normal response guard", () => {
  it("renders score ring when final_score is a number", () => {
    renderPanel();
    expect(screen.queryByTestId("fetch-failed-notice")).not.toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
  });

  it("renders real band when response is normal", () => {
    renderPanel();
    expect(screen.getByText("SECURE")).toBeInTheDocument();
    expect(screen.queryByText("UNRATED")).not.toBeInTheDocument();
  });

  it("does not fire when rated is undefined (old backend shape)", () => {
    renderPanel({ rated: undefined });
    expect(screen.queryByTestId("fetch-failed-notice")).not.toBeInTheDocument();
  });

  it("does not fire when rated is true", () => {
    renderPanel({ rated: true });
    expect(screen.queryByTestId("fetch-failed-notice")).not.toBeInTheDocument();
  });
});
