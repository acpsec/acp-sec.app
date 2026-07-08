import { create } from "zustand";

import type { ApiError } from "@/lib/api/errors";
import type {
  OnchainCheckResponse,
  ScanMode,
  ScannerLookupResponse,
  ScannerScanResponse,
} from "@/lib/api/types";

/** Wizard position: 1 Lookup · 2 Confirm · 3 Results (mirrors scanner.html). */
export type ScannerStep = 1 | 2 | 3;

/**
 * Scanner page state (Tasks 6.2a foundation + 6.2b execution).
 *
 * Scope note: scanner.html is the *producer* of the cross-page handoff (it
 * writes `acpsec_last_scan` for the dashboard to consume) — it never reads a
 * handoff itself. So there is deliberately NO handoff-consumer state here.
 *
 * `scanMode` mirrors the lama's URL-normalisation radios: "root" (default) vs
 * "exact". The backend accepts ONLY these two — quick/quick_lite/full belong to
 * the monitor page, not scanner. Nothing is persisted — a scan is session-scoped.
 */
export interface ScannerState {
  // ── Step 1: lookup input ──
  /** X username, e.g. "@aixbt_agent". */
  handle: string;

  // ── Step 2: confirm (seeded from lookup, editable) ──
  lookupResult: ScannerLookupResponse | null;
  agentName: string;
  url: string;
  wallet: string;
  scanMode: ScanMode;

  // ── Wizard position ──
  step: ScannerStep;

  // ── Step 3: results ──
  scanResult: ScannerScanResponse | null;
  onchainStatus: OnchainCheckResponse | null;
  isScanning: boolean;
  scanError: ApiError | null;

  // ── Actions ──
  setHandle: (value: string) => void;
  setScanMode: (mode: ScanMode) => void;
  setStep: (step: ScannerStep) => void;
  /** Store a lookup response WITHOUT advancing (rarely needed directly). */
  setLookupResult: (result: ScannerLookupResponse | null) => void;
  /** Lookup succeeded: stash the profile, seed the editable fields, go to step 2. */
  beginConfirm: (result: ScannerLookupResponse) => void;
  setAgentName: (value: string) => void;
  setUrl: (value: string) => void;
  setWallet: (value: string) => void;
  setScanResult: (result: ScannerScanResponse | null) => void;
  setOnchainStatus: (status: OnchainCheckResponse | null) => void;
  setScanning: (isScanning: boolean) => void;
  setScanError: (error: ApiError | null) => void;
  reset: () => void;
}

const INITIAL = {
  handle: "",
  lookupResult: null,
  agentName: "",
  url: "",
  wallet: "",
  scanMode: "root" as ScanMode,
  step: 1 as ScannerStep,
  scanResult: null,
  onchainStatus: null,
  isScanning: false,
  scanError: null,
} satisfies Partial<ScannerState>;

export const useScannerStore = create<ScannerState>((set) => ({
  ...INITIAL,
  setHandle: (handle) => set({ handle }),
  setScanMode: (scanMode) => set({ scanMode }),
  setStep: (step) => set({ step }),
  setLookupResult: (lookupResult) => set({ lookupResult }),
  beginConfirm: (result) => {
    // Mirrors the lama's _populateStep2 prefill: agent name falls back to the
    // handle, URL to the scraped website (both editable before the scan).
    const p = result.data;
    set({
      lookupResult: result,
      agentName: p.display_name || p.username || "",
      url: p.website || "",
      step: 2,
      scanError: null,
    });
  },
  setAgentName: (agentName) => set({ agentName }),
  setUrl: (url) => set({ url }),
  setWallet: (wallet) => set({ wallet }),
  setScanResult: (scanResult) => set({ scanResult }),
  setOnchainStatus: (onchainStatus) => set({ onchainStatus }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),
  reset: () => set({ ...INITIAL }),
}));
