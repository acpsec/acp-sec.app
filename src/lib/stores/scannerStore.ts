import { create } from "zustand";

import type { ApiError } from "@/lib/api/errors";
import type {
  OnchainCheckResponse,
  ScanMode,
  ScannerScanResponse,
} from "@/lib/api/types";

/**
 * Scanner page state (Task 6.2a foundation).
 *
 * Scope note: scanner.html is the *producer* of the cross-page handoff (it
 * writes `acpsec_last_scan` for the dashboard to consume) — it never reads a
 * handoff itself. So there is deliberately NO handoff-consumer state here.
 *
 * `scanMode` mirrors the lama's URL-normalisation radios: "root" (default,
 * scan the root domain) vs "exact" (scan the exact URL entered). The backend
 * (`/api/scanner/scan`) accepts ONLY these two and coerces anything else to
 * "root" — quick/quick_lite/full belong to the monitor page, not scanner.
 *
 * Result fields (`scanResult`/`onchainStatus`/`isScanning`/`scanError`) are
 * defined here for shape stability but are only populated by scan execution in
 * Task 6.2b. Nothing is persisted — a scan is session-scoped.
 */
export interface ScannerState {
  // ── Inputs ──
  /** Step-1 X username, e.g. "@aixbt_agent". */
  handle: string;
  /** URL-normalisation mode — "root" (recommended) | "exact". */
  scanMode: ScanMode;

  // ── Result state (populated in 6.2b; here for shape stability) ──
  scanResult: ScannerScanResponse | null;
  onchainStatus: OnchainCheckResponse | null;
  isScanning: boolean;
  scanError: ApiError | null;

  // ── Actions ──
  setHandle: (value: string) => void;
  setScanMode: (mode: ScanMode) => void;
  setScanResult: (result: ScannerScanResponse | null) => void;
  setOnchainStatus: (status: OnchainCheckResponse | null) => void;
  setScanning: (isScanning: boolean) => void;
  setScanError: (error: ApiError | null) => void;
  reset: () => void;
}

const INITIAL = {
  handle: "",
  scanMode: "root" as ScanMode,
  scanResult: null,
  onchainStatus: null,
  isScanning: false,
  scanError: null,
} satisfies Partial<ScannerState>;

export const useScannerStore = create<ScannerState>((set) => ({
  ...INITIAL,
  setHandle: (handle) => set({ handle }),
  setScanMode: (scanMode) => set({ scanMode }),
  setScanResult: (scanResult) => set({ scanResult }),
  setOnchainStatus: (onchainStatus) => set({ onchainStatus }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),
  reset: () => set({ ...INITIAL }),
}));
