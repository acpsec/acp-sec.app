"use client";

import { ConfirmPanel } from "@/components/scanner/ConfirmPanel";
import { HandleInput } from "@/components/scanner/HandleInput";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { useScanFlow } from "@/lib/hooks/useScanFlow";
import { useScannerStore } from "@/lib/stores/scannerStore";

const STEPS = ["Lookup", "Confirm", "Results"] as const;

/** Trigger a client-side JSON download of the scan result (lama downloadResult). */
function downloadResult(data: unknown, agentName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `acpsec-scan-${(agentName || "agent").replace(/\s+/g, "-")}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * The scanner wizard (Task 6.2b): step 1 lookup → step 2 confirm → step 3
 * results. Orchestration lives in useScanFlow; this component is the step
 * machine + layout. Producer-only — never reads a handoff.
 */
export function ScannerView() {
  const step = useScannerStore((s) => s.step);
  const scanError = useScannerStore((s) => s.scanError);
  const scanResult = useScannerStore((s) => s.scanResult);
  const { runLookup, runScan, openInDashboard, scanAnother, lookupPending, isScanning } =
    useScanFlow();

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* Step indicator */}
      <ol className="flex items-center justify-center gap-2 text-caption">
        {STEPS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const activeOrDone = step >= n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-micro font-bold ${
                  activeOrDone
                    ? "bg-primary text-fg"
                    : "bg-bg text-fg-subtle"
                }`}
              >
                {n}
              </span>
              <span
                className={activeOrDone ? "text-fg" : "text-fg-subtle"}
              >
                {label}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="mx-1 text-fg-subtle">·</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <>
          <HandleInput onLookup={runLookup} loading={lookupPending} />
          {scanError ? (
            <div
              role="alert"
              className="rounded-lg border border-danger/30 bg-danger/[0.12] px-3 py-2 text-caption text-danger-alt"
            >
              Lookup failed: {scanError.message}
            </div>
          ) : null}
        </>
      ) : null}

      {step === 2 ? (
        <ConfirmPanel
          onScan={runScan}
          onBack={scanAnother}
          scanning={isScanning}
        />
      ) : null}

      {step === 3 && scanResult ? (
        <ResultsPanel
          result={scanResult.data}
          onScanAnother={scanAnother}
          onOpenDashboard={openInDashboard}
          onExport={() =>
            downloadResult(scanResult.data, scanResult.data.agent_name)
          }
        />
      ) : null}
    </div>
  );
}
