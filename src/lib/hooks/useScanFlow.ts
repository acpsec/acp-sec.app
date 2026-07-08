"use client";

import { useCallback } from "react";

import type { ApiError } from "@/lib/api/errors";
import type { ReportData, ScannerScanRequest } from "@/lib/api/types";
import { writeHandoff } from "@/lib/handoff";
import { useOnchainCheck } from "@/lib/hooks/useOnchain";
import { useScannerLookup, useScannerScan } from "@/lib/hooks/useScanner";
import { useCreateScore } from "@/lib/hooks/useScoreMutation";
import { useScannerStore } from "@/lib/stores/scannerStore";

/** Base/EVM address — gates the optional on-chain check (mirrors the lama). */
const WALLET_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * Orchestrates the 3-step scanner wizard (Task 6.2b), mirroring scanner.html's
 * lookupProfile → startScan → sendToDashboard.
 *
 * Faithful-to-lama notes:
 * - Scan is BLOCKING (no SSE — /api/scan/stream doesn't exist in the backend).
 * - On-chain check runs only for a valid wallet, best-effort (never blocks).
 * - Producer handoff: scan success writes localStorage ONLY. `POST /api/score`
 *   fires later, on "Open in Dashboard" (sendToDashboard) — NOT after the scan.
 * - Scanner never READS the handoff (producer-only).
 */
export function useScanFlow() {
  const lookup = useScannerLookup();
  const scan = useScannerScan();
  const onchain = useOnchainCheck();
  const createScore = useCreateScore();

  const isScanning = useScannerStore((s) => s.isScanning);

  const runLookup = useCallback(async () => {
    const s = useScannerStore.getState();
    const handle = s.handle.trim();
    if (!handle) return;
    s.setScanError(null);
    try {
      const res = await lookup.mutateAsync(handle);
      useScannerStore.getState().beginConfirm(res);
    } catch (err) {
      useScannerStore.getState().setScanError(err as ApiError);
    }
  }, [lookup]);

  const runScan = useCallback(async () => {
    const s = useScannerStore.getState();
    const url = s.url.trim();
    const agentName = s.agentName.trim();
    // Both required (lama toasts otherwise) — no-op if missing.
    if (!url || !agentName) return;

    s.setScanError(null);
    s.setScanning(true);
    try {
      const payload: ScannerScanRequest = {
        url,
        agent_name: agentName,
        username: s.lookupResult?.data.username || "",
        scraped: s.lookupResult?.data.source === "nitter",
        scan_mode: s.scanMode,
      };
      const res = await scan.mutateAsync(payload);

      // Optional on-chain ACP check — wallet-conditional, best-effort. Attach
      // to the result data (mirrors the lama) so the handoff carries it too.
      let data: ReportData = res.data;
      const wallet = s.wallet.trim();
      if (wallet && WALLET_RE.test(wallet)) {
        try {
          const oc = await onchain.mutateAsync(wallet);
          if (oc.ok && oc.data) {
            data = {
              ...data,
              wallet_address: wallet,
              acp_registered: oc.data.registered === true,
              acp_check: oc.data,
            };
            useScannerStore.getState().setOnchainStatus(oc);
          }
        } catch {
          /* on-chain is best-effort; never block the scan render */
        }
      }

      const withOnchain = { ...res, data };
      const store = useScannerStore.getState();
      store.setScanResult(withOnchain);
      // Producer handoff — localStorage only. (POST /api/score is deferred to
      // openInDashboard, exactly as the lama does.)
      writeHandoff(data);
      store.setStep(3);
    } catch (err) {
      // Stay on step 2 with an inline error.
      useScannerStore.getState().setScanError(err as ApiError);
    } finally {
      useScannerStore.getState().setScanning(false);
    }
  }, [scan, onchain]);

  /** "📊 Open in Dashboard →" — refresh handoff, POST /api/score, navigate to /. */
  const openInDashboard = useCallback(() => {
    const res = useScannerStore.getState().scanResult;
    if (!res) return;
    writeHandoff(res.data);
    createScore.mutate(res.data); // best-effort server sync
    window.location.href = "/";
  }, [createScore]);

  /** "🔍 Scan another agent" — back to a clean step 1. */
  const scanAnother = useCallback(() => {
    useScannerStore.getState().reset();
  }, []);

  return {
    runLookup,
    runScan,
    openInDashboard,
    scanAnother,
    lookupPending: lookup.isPending,
    isScanning,
  };
}
