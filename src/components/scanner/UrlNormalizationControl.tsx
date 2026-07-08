"use client";

import { useScannerStore } from "@/lib/stores/scannerStore";

/**
 * URL-normalisation radios (Task 6.2a foundation).
 *
 * Ports the lama's "root vs exact" choice (dashboard/scanner.html), NOT a
 * scan-depth mode — the backend accepts only these two values. In 6.2b this
 * moves into the Confirm step and is shown only when the entered URL has a
 * sub-path (the lama reveals it on `onUrlChange`). Bound to `scanMode`.
 */
export function UrlNormalizationControl() {
  const scanMode = useScannerStore((s) => s.scanMode);
  const setScanMode = useScannerStore((s) => s.setScanMode);

  return (
    <fieldset className="flex gap-4 text-caption">
      <legend className="sr-only">Which URL to scan</legend>
      <label className="flex cursor-pointer items-center gap-1.5">
        <input
          type="radio"
          name="scanMode"
          value="root"
          checked={scanMode === "root"}
          onChange={() => setScanMode("root")}
        />
        <span>
          Root domain{" "}
          <span className="text-fg-subtle">(recommended)</span>
        </span>
      </label>
      <label className="flex cursor-pointer items-center gap-1.5">
        <input
          type="radio"
          name="scanMode"
          value="exact"
          checked={scanMode === "exact"}
          onChange={() => setScanMode("exact")}
        />
        <span>Exact URL you entered</span>
      </label>
    </fieldset>
  );
}
