import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import type { ReportData, ScanControl } from "@/lib/api/types";

vi.mock("react-chartjs-2", () => ({ Radar: () => <div data-testid="radar" /> }));

// Fully-inferred control factory — mimics real CRITICAL scan output.
function inferredCtrl(ctrl: string, dimension: string, dimension_name: string): ScanControl {
  return {
    ctrl,
    name: ctrl,
    dimension,
    dimension_name,
    max: 3,
    score: 0,
    severity: "HIGH",
    status: "warn",
    inferred: true,
  };
}

function verifiedCtrl(ctrl: string, dimension: string, dimension_name: string): ScanControl {
  return {
    ctrl,
    name: ctrl,
    dimension,
    dimension_name,
    max: 3,
    score: 2,
    severity: "HIGH",
    status: "pass",
    inferred: false,
  };
}

// @grok — CRITICAL, score ~25, all 38 controls inferred:true
const GROK_CONTROLS: ScanControl[] = [
  ...["AUTH-01","AUTH-02","AUTH-03"].map(c => inferredCtrl(c, "AUTH", "Authentication")),
  ...["CTX-01","CTX-02","CTX-03","CTX-04","CTX-05","CTX-06"].map(c => inferredCtrl(c, "CTX", "Context")),
  ...["GOV-01","GOV-02","GOV-03","GOV-04","GOV-05","GOV-06"].map(c => inferredCtrl(c, "GOV", "Governance")),
  ...["INJ-01","INJ-02","INJ-03","INJ-04","INJ-05","INJ-06"].map(c => inferredCtrl(c, "INJ", "Injection")),
  ...["OUT-01","OUT-02","OUT-03","OUT-04"].map(c => inferredCtrl(c, "OUT", "Output")),
  ...["PRIV-01","PRIV-02","PRIV-03","PRIV-04","PRIV-05"].map(c => inferredCtrl(c, "PRIV", "Privacy")),
  ...["PUB-01","PUB-02","PUB-03","PUB-04","PUB-05","PUB-06","PUB-07","PUB-08"].map(c => inferredCtrl(c, "PUB", "Public")),
];

// @ethy — CRITICAL, score ~24, all 38 controls inferred:true (slightly worse)
const ETHY_CONTROLS: ScanControl[] = GROK_CONTROLS.map(c => ({ ...c }));

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
  const onScanAnother = vi.fn();
  const onOpenDashboard = vi.fn();
  const onExport = vi.fn();
  render(
    <ResultsPanel
      result={data}
      onScanAnother={onScanAnother}
      onOpenDashboard={onOpenDashboard}
      onExport={onExport}
    />,
  );
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

  // --- Coverage summary (RED) ---------------------------------------------

  it("shows a coverage summary with verified and inferred counts — @grok fixture", () => {
    renderWith(GROK_DATA);
    // All 38 controls are inferred:true → 0 verified, 38 inferred
    expect(screen.getByTestId("coverage-summary")).toBeInTheDocument();
    expect(screen.getByTestId("coverage-summary")).toHaveTextContent("0");
    expect(screen.getByTestId("coverage-summary")).toHaveTextContent("38");
  });

  it("shows a coverage summary with verified and inferred counts — @ethy fixture", () => {
    renderWith(ETHY_DATA);
    expect(screen.getByTestId("coverage-summary")).toBeInTheDocument();
    expect(screen.getByTestId("coverage-summary")).toHaveTextContent("0");
    expect(screen.getByTestId("coverage-summary")).toHaveTextContent("38");
  });

  it("coverage summary correctly splits verified vs inferred controls", () => {
    // 1 verified (inferred:false), 2 inferred:true
    const controls: ScanControl[] = [
      verifiedCtrl("AUTH-01", "AUTH", "Authentication"),
      inferredCtrl("GOV-01", "GOV", "Governance"),
      inferredCtrl("INJ-01", "INJ", "Injection"),
    ];
    renderWith(DATA({ controls }));
    const summary = screen.getByTestId("coverage-summary");
    expect(summary).toHaveTextContent("1");  // verified
    expect(summary).toHaveTextContent("2");  // inferred
  });

  // --- Inference-dominant banner (RED) ------------------------------------

  it("shows inference-dominant banner when scan is rated:false (no-website)", () => {
    renderWith(DATA({ rated: false, no_website: true, controls: [] }));
    expect(screen.getByTestId("inference-banner")).toBeInTheDocument();
    expect(screen.getByTestId("inference-banner")).toHaveTextContent(
      "This scan is mostly inferred",
    );
  });

  it("shows inference-dominant banner for @grok (all 38 controls inferred)", () => {
    renderWith(GROK_DATA);
    expect(screen.getByTestId("inference-banner")).toBeInTheDocument();
  });

  it("shows inference-dominant banner for @ethy (all 38 controls inferred)", () => {
    renderWith(ETHY_DATA);
    expect(screen.getByTestId("inference-banner")).toBeInTheDocument();
  });

  it("does not show banner when scan is fully verified (no inferred controls)", () => {
    // All controls have inferred:false → banner should not appear
    const controls: ScanControl[] = [
      verifiedCtrl("AUTH-01", "AUTH", "Authentication"),
      verifiedCtrl("GOV-01", "GOV", "Governance"),
    ];
    renderWith(DATA({ controls }));
    expect(screen.queryByTestId("inference-banner")).not.toBeInTheDocument();
  });

  it("does not show banner when fewer than half are inferred", () => {
    // 2 verified, 1 inferred → 33% inferred → no banner
    const controls: ScanControl[] = [
      verifiedCtrl("AUTH-01", "AUTH", "Authentication"),
      verifiedCtrl("GOV-01", "GOV", "Governance"),
      inferredCtrl("INJ-01", "INJ", "Injection"),
    ];
    renderWith(DATA({ controls }));
    expect(screen.queryByTestId("inference-banner")).not.toBeInTheDocument();
  });

  it("banner links to providing a URL for a verified result", () => {
    renderWith(GROK_DATA);
    const banner = screen.getByTestId("inference-banner");
    expect(banner).toHaveTextContent("provide");
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
