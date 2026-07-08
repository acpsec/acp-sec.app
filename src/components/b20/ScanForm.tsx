"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api/errors";
import type { B20ErrorCode } from "@/lib/api/types";

/** Client-side gate matching the backend's `^0x[0-9a-fA-F]{40}$` (validation
 *  runs before any RPC read, so a malformed address never hits the network). */
export const B20_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const ERROR_COPY: Record<B20ErrorCode, string> = {
  invalid_address: "That doesn't look like a valid token address.",
  unsupported_chain: "That chain isn't supported for B20 scans yet.",
  not_b20:
    "This address isn't a B20 token — or B20 isn't initialised on it.",
  rpc_unreachable:
    "Couldn't reach the network right now. Please try again shortly.",
};

/** Map a scan failure to human-readable copy. Understands the typed
 *  `ApiError.body.error` codes; degrades gracefully for anything else. */
export function b20ErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const code = error.body?.error;
    if (code && code in ERROR_COPY) return ERROR_COPY[code as B20ErrorCode];
    if (error.status === 0)
      return "Couldn't reach the scanner — check your connection.";
  }
  return "Scan failed. Please try again.";
}

interface ScanFormProps {
  /** Called with a validated address when the user submits. */
  onScan: (address: string) => void;
  /** True while a scan is in flight (disables submit). */
  pending?: boolean;
  /** The scan error, if any (an ApiError from useB20Scan). */
  error?: unknown;
}

/**
 * Address entry for the read-only B20 scanner. V1 targets Base Sepolia only
 * (see web3/config.ts + scanB20's default chain_id), so there is no chain
 * selector and no wallet connect — just a raw address in.
 */
export function ScanForm({ onScan, pending = false, error }: ScanFormProps) {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = address.trim();
    if (!B20_ADDRESS_RE.test(value)) {
      setValidationError("Enter a valid token address (0x + 40 hex characters).");
      return;
    }
    setValidationError(null);
    onScan(value);
  }

  const message =
    validationError ?? (error != null ? b20ErrorMessage(error) : null);

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div>
        <label
          htmlFor="b20-address"
          className="text-caption font-semibold text-fg-muted"
        >
          Token address
        </label>
        <input
          id="b20-address"
          name="address"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="0xB200…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-caption text-fg outline-none placeholder:text-fg-subtle focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="rounded-lg border border-border bg-surface px-3 py-2.5 text-caption text-fg-muted sm:w-56">
          Network: Base Sepolia
        </span>
        <button
          type="submit"
          disabled={pending}
          className="h-12 flex-1 rounded-lg bg-primary px-6 font-semibold text-fg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Scanning…" : "Scan"}
        </button>
      </div>

      {message && (
        <div
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-caption text-danger"
        >
          {message}
        </div>
      )}
    </form>
  );
}
